import { Link } from 'react-router-dom';
import { Clock, User, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
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
    <Link to={`/ticket/${ticket._id}`} className="ticket-card">
      <div className="ticket-card-header">
        <div className="ticket-card-badges">
          <span className={`badge ${getPriorityClass(ticket.priority)}`}>
            {ticket.priority}
          </span>
          <span className={`badge ${getStatusClass(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>
        <span className="ticket-card-time">
          <Clock size={14} />
          {formatDistanceToNow(new Date(ticket.createdAt), { 
            addSuffix: true, 
            locale: es 
          })}
        </span>
      </div>
      
      <h3 className="ticket-card-title">{ticket.title}</h3>
      
      <p className="ticket-card-description">
        {ticket.description.length > 120 
          ? `${ticket.description.substring(0, 120)}...` 
          : ticket.description}
      </p>
      
      <div className="ticket-card-footer">
        <div className="ticket-card-info">
          <AlertCircle size={14} />
          <span>{ticket.service}</span>
        </div>
        <div className="ticket-card-info">
          <User size={14} />
          <span>{ticket.affectedUser.name}</span>
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;

