import { useState, useEffect } from 'react';
import { gitlabService } from '../services/gitlabService';

export const useTicket = (issueIid) => {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    if (!issueIid) return;
    
    setLoading(true);
    setError(null);
    try {
      const [issueData, notesData] = await Promise.all([
        gitlabService.getIssueByIid(issueIid),
        gitlabService.getIssueNotes(issueIid)
      ]);
      setTicket(issueData);
      setComments(notesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (updates) => {
    try {
      const updatedIssue = await gitlabService.updateIssue(issueIid, updates);
      setTicket(updatedIssue);
      return updatedIssue;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addComment = async (commentBody) => {
    try {
      const newNote = await gitlabService.addIssueNote(issueIid, commentBody);
      setComments((prev) => [...prev, newNote]);
      return newNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [issueIid]);

  return {
    ticket,
    comments,
    loading,
    error,
    refetch: fetchTicket,
    updateTicket,
    addComment,
  };
};

