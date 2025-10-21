import { Link } from 'react-router-dom';
import { Clock, User, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
  const getPriorityLabel = (labels) => {
    if (!labels) return null;
    return labels.find(label => label.match(/^P[1-4]$/));
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

  const priorityLabel = getPriorityLabel(ticket.labels);
  const mainLabels = ticket.labels?.filter(l => !l.match(/^P[1-4]$/)) || [];

  return (
    <Link to={`/ticket/${ticket.iid}`} className="ticket-card">
      <div className="ticket-card-header">
        <div className="ticket-card-badges">
          {priorityLabel && (
            <span className={`badge ${getPriorityClass(priorityLabel)}`}>
              {priorityLabel}
            </span>
          )}
          <span className={`badge ${getStatusClass(ticket.state)}`}>
            {getStatusLabel(ticket.state)}
          </span>
        </div>
        <span className="ticket-card-time">
          <Clock size={14} />
          {formatDistanceToNow(new Date(ticket.created_at), { 
            addSuffix: true, 
            locale: es 
          })}
        </span>
      </div>
      
      <h3 className="ticket-card-title">{ticket.title}</h3>
      
      <p className="ticket-card-description">
        {ticket.description?.length > 120 
          ? `${ticket.description.substring(0, 120)}...` 
          : ticket.description}
      </p>
      
      <div className="ticket-card-footer">
        {mainLabels.length > 0 && (
          <div className="ticket-card-info">
            <Tag size={14} />
            <span>{mainLabels.slice(0, 2).join(', ')}</span>
          </div>
        )}
        <div className="ticket-card-info">
          <User size={14} />
          <span>{ticket.author?.name || 'Desconocido'}</span>
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;

