import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Clock, 
  User, 
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
  const { ticket, loading, updateTicket, addComment } = useTicket(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isInternal, setIsInternal] = useState(false);
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

  const handleEdit = () => {
    setEditData({
      status: ticket.status,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo || '',
      escalationLevel: ticket.escalationLevel,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    setSubmitting(true);
    try {
      await updateTicket(editData);
      setIsEditing(false);
      setEditData({});
    } catch (error) {
      alert('Error al actualizar el ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) return;

    setSubmitting(true);
    try {
      await addComment({
        author: commentAuthor,
        content: newComment,
        isInternal,
      });
      setNewComment('');
      setCommentAuthor('');
      setIsInternal(false);
    } catch (error) {
      alert('Error al agregar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityClass = (priority) => {
    const classes = {
      P1: 'badge-p1',
      P2: 'badge-p2',
      P3: 'badge-p3',
      P4: 'badge-p4',
    };
    return classes[priority] || 'badge-p3';
  };

  const getStatusClass = (status) => {
    const normalizedStatus = status.toLowerCase().replace(/\s/g, '-');
    const classes = {
      'abierto': 'badge-open',
      'en-progreso': 'badge-in-progress',
      'en-espera': 'badge-waiting',
      'resuelto': 'badge-resolved',
      'cerrado': 'badge-closed',
    };
    return classes[normalizedStatus] || 'badge-open';
  };

  return (
    <div className="ticket-detail">
      <div className="ticket-detail-header">
        <button className="btn btn-secondary" onClick={() => navigate('/tablero')}>
          <ArrowLeft size={18} />
          Volver al Tablero
        </button>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={handleEdit}>
            <Edit size={18} />
            Editar Ticket
          </button>
        ) : (
          <div className="edit-actions">
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              <X size={18} />
              Cancelar
            </button>
            <button 
              className="btn btn-success" 
              onClick={handleSaveEdit}
              disabled={submitting}
            >
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      <div className="ticket-detail-content">
        <div className="ticket-main">
          <div className="ticket-info-card">
            <div className="ticket-title-section">
              <h1>{ticket.title}</h1>
              <div className="ticket-badges">
                <span className={`badge ${getPriorityClass(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className={`badge ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="ticket-meta">
              <div className="meta-item">
                <Clock size={16} />
                <span>
                  Creado {formatDistanceToNow(new Date(ticket.createdAt), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </span>
              </div>
              <div className="meta-item">
                <AlertCircle size={16} />
                <span>{ticket.service}</span>
              </div>
              <div className="meta-item">
                <Tag size={16} />
                <span>{ticket.category}</span>
              </div>
            </div>

            <div className="ticket-description">
              <h3>Descripción</h3>
              <p>{ticket.description}</p>
            </div>
          </div>

          <div className="ticket-comments-card">
            <div className="comments-header">
              <h3>
                <MessageSquare size={20} />
                Comentarios y Seguimiento
              </h3>
            </div>
            
            <CommentList comments={ticket.comments} />

            <form onSubmit={handleAddComment} className="comment-form">
              <h4>Agregar Comentario</h4>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tu nombre"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  required
                />
              </div>
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
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                  />
                  <span>Comentario interno (solo equipo de soporte)</span>
                </label>
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
            
            {isEditing ? (
              <>
                <div className="detail-item">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="En Espera">En Espera</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>

                <div className="detail-item">
                  <label className="form-label">Prioridad</label>
                  <select
                    className="form-select"
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                  >
                    <option value="P1">P1 - Crítico</option>
                    <option value="P2">P2 - Alto</option>
                    <option value="P3">P3 - Medio</option>
                    <option value="P4">P4 - Bajo</option>
                  </select>
                </div>

                <div className="detail-item">
                  <label className="form-label">Asignado a</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.assignedTo}
                    onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div className="detail-item">
                  <label className="form-label">Nivel de Escalación</label>
                  <select
                    className="form-select"
                    value={editData.escalationLevel}
                    onChange={(e) => setEditData({ ...editData, escalationLevel: e.target.value })}
                  >
                    <option value="L1">L1 - Service Desk</option>
                    <option value="L2">L2 - Equipo Técnico</option>
                    <option value="L3">L3 - Soporte Especializado</option>
                    <option value="L4">L4 - Gerencia</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="detail-item">
                  <span className="detail-label">Asignado a:</span>
                  <span className="detail-value">
                    {ticket.assignedTo || 'Sin asignar'}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Nivel de Escalación:</span>
                  <span className="detail-value">{ticket.escalationLevel}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Última actualización:</span>
                  <span className="detail-value">
                    {formatDistanceToNow(new Date(ticket.updatedAt), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="sidebar-card">
            <h3>Usuario Afectado</h3>
            <div className="user-info">
              <div className="detail-item">
                <User size={16} />
                <span>{ticket.affectedUser.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{ticket.affectedUser.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rol:</span>
                <span className="detail-value">{ticket.affectedUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

