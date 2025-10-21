import { createContext, useContext, useState, useEffect } from 'react';
import { gitlabService } from '../services/gitlabService';

const TicketContext = createContext();

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets debe usarse dentro de un TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gitlabService.getAllIssues();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      const newIssue = await gitlabService.createIssue(ticketData);
      setTickets((prev) => [newIssue, ...prev]);
      return newIssue;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTicket = async (iid, updates) => {
    try {
      const updatedIssue = await gitlabService.updateIssue(iid, updates);
      setTickets((prev) =>
        prev.map((ticket) => (ticket.iid === iid ? updatedIssue : ticket))
      );
      return updatedIssue;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addComment = async (iid, commentBody) => {
    try {
      await gitlabService.addIssueNote(iid, commentBody);
      const updatedIssue = await gitlabService.getIssueByIid(iid);
      setTickets((prev) =>
        prev.map((ticket) => (ticket.iid === iid ? updatedIssue : ticket))
      );
      return updatedIssue;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        loading,
        error,
        fetchTickets,
        createTicket,
        updateTicket,
        addComment,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

