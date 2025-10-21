import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import TicketCard from '../components/TicketCard/TicketCard';
import './TicketBoard.css';

const TicketBoard = () => {
  const { tickets, loading, fetchTickets } = useTickets();
  const [filters, setFilters] = useState({
    priority: '',
    label: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesPriority = !filters.priority || 
      ticket.labels?.some(label => label === filters.priority);
    const matchesLabel = !filters.label || 
      ticket.labels?.some(label => label === filters.label);
    
    return matchesPriority && matchesLabel;
  });

  const groupedTickets = {
    'Abiertos': filteredTickets.filter((t) => t.state === 'opened'),
    'Cerrados': filteredTickets.filter((t) => t.state === 'closed'),
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="ticket-board">
      <div className="ticket-board-header">
        <h1>Tablero de Tickets</h1>
      </div>

      <div className="board-columns">
        {Object.entries(groupedTickets).map(([status, statusTickets]) => (
          <div key={status} className="board-column">
            <div className="board-column-header">
              <h3>{status}</h3>
              <span className="ticket-count">{statusTickets.length}</span>
            </div>
            <div className="board-column-content">
              {statusTickets.length > 0 ? (
                statusTickets.map((ticket) => (
                  <TicketCard key={ticket.iid} ticket={ticket} />
                ))
              ) : (
                <div className="empty-column">
                  <p>No hay tickets</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketBoard;

