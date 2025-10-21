import { useState, useEffect } from 'react';
import { ticketService } from '../services/api';

export const useTicket = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    if (!ticketId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getById(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (updates) => {
    try {
      const updatedTicket = await ticketService.update(ticketId, updates);
      setTicket(updatedTicket);
      return updatedTicket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addComment = async (comment) => {
    try {
      const updatedTicket = await ticketService.addComment(ticketId, comment);
      setTicket(updatedTicket);
      return updatedTicket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  return {
    ticket,
    loading,
    error,
    refetch: fetchTicket,
    updateTicket,
    addComment,
  };
};

