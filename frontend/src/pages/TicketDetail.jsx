import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  AlertCircle, 
  Tag,
  MessageSquare 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTicket } from '../hooks/useTicket';
import CommentList from '../components/CommentList/CommentList';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticket, comments, loading, addComment } = useTicket(id);
  
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="empty-state">
        <AlertCircle size={48} />
        <p>Ticket no encontrado</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(newComment);
      setNewComment('');
    } catch (error) {
      alert('Error al agregar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityLabel = (labels) => {
    if (!labels) return null;
    const priorityLabel = labels.find(label => label.match(/^P[1-4]$/));
    return priorityLabel;
  };

  const getPriorityClass = (label) => {
    const classes = {
      P1: 'badge-p1',
      P2: 'badge-p2',
      P3: 'badge-p3',
      P4: 'badge-p4',
    };
    return classes[label] || 'badge-p3';
  };

  const getStatusClass = (state) => {
    const classes = {
      'opened': 'badge-open',
      'closed': 'badge-closed',
    };
    return classes[state] || 'badge-open';
  };

  const getStatusLabel = (state) => {
    return state === 'opened' ? 'Abierto' : 'Cerrado';
  };

  return (
    <div className="ticket-detail">
      <div className="ticket-detail-header">
        <button className="btn btn-secondary" onClick={() => navigate('/tablero')}>
          <ArrowLeft size={18} />
          Volver al Tablero
        </button>
      </div>

      <div className="ticket-detail-content">
        <div className="ticket-main">
          <div className="ticket-info-card">
            <div className="ticket-title-section">
              <h1>{ticket.title}</h1>
              <div className="ticket-badges">
                {getPriorityLabel(ticket.labels) && (
                  <span className={`badge ${getPriorityClass(getPriorityLabel(ticket.labels))}`}>
                    {getPriorityLabel(ticket.labels)}
                  </span>
                )}
                <span className={`badge ${getStatusClass(ticket.state)}`}>
                  {getStatusLabel(ticket.state)}
                </span>
              </div>
            </div>

            <div className="ticket-meta">
              <div className="meta-item">
                <Clock size={16} />
                <span>
                  Creado {formatDistanceToNow(new Date(ticket.created_at), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </span>
              </div>
              {ticket.labels && ticket.labels.length > 0 && (
                <div className="meta-item">
                  <Tag size={16} />
                  <span>{ticket.labels.filter(l => !l.match(/^P[1-4]$/)).join(', ')}</span>
                </div>
              )}
            </div>

            <div className="ticket-description">
              <h3>Descripción</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
            </div>
          </div>

          <div className="ticket-comments-card">
            <div className="comments-header">
              <h3>
                <MessageSquare size={20} />
                Comentarios y Seguimiento
              </h3>
            </div>
            
            <CommentList comments={comments} />

            <form onSubmit={handleAddComment} className="comment-form">
              <h4>Agregar Comentario</h4>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              <div className="comment-form-footer">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Agregar Comentario'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="ticket-sidebar">
          <div className="sidebar-card">
            <h3>Detalles del Ticket</h3>
            
            <div className="detail-item">
              <span className="detail-label">Estado:</span>
              <span className="detail-value">
                {getStatusLabel(ticket.state)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Autor:</span>
              <span className="detail-value">
                {ticket.author?.name || 'Desconocido'}
              </span>
            </div>

            {ticket.assignee && (
              <div className="detail-item">
                <span className="detail-label">Asignado a:</span>
                <span className="detail-value">{ticket.assignee.name}</span>
              </div>
            )}

            <div className="detail-item">
              <span className="detail-label">Última actualización:</span>
              <span className="detail-value">
                {formatDistanceToNow(new Date(ticket.updated_at), { 
                  addSuffix: true, 
                  locale: es 
                })}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Issue IID:</span>
              <span className="detail-value">#{ticket.iid}</span>
            </div>
          </div>

          {ticket.labels && ticket.labels.length > 0 && (
            <div className="sidebar-card">
              <h3>Etiquetas</h3>
              <div className="user-info">
                {ticket.labels.map((label, index) => (
                  <div key={index} className="detail-item">
                    <Tag size={16} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

