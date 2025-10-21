import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import TicketCard from '../components/TicketCard/TicketCard';
import './Dashboard.css';

const Dashboard = () => {
  const { tickets, loading } = useTickets();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const recentTickets = tickets.slice(0, 5);
  const openTickets = tickets.filter(t => ['Abierto', 'En Progreso', 'En Espera'].includes(t.status)).length;
  const resolvedTickets = tickets.filter(t => ['Resuelto', 'Cerrado'].includes(t.status)).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen del Service Desk para el sistema de gestión de uniformes</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total de Tickets</p>
            <h2 className="stat-value">{tickets.length}</h2>
          </div>
        </div>

        <div className="stat-card stat-open">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Tickets Abiertos</p>
            <h2 className="stat-value">{openTickets}</h2>
          </div>
        </div>

        <div className="stat-card stat-resolved">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Tickets Resueltos</p>
            <h2 className="stat-value">{resolvedTickets}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Tickets Recientes</h2>
          <Link to="/tablero" className="btn btn-primary">
            Ver Todos
          </Link>
        </div>
        
        {recentTickets.length > 0 ? (
          <div className="tickets-grid">
            {recentTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>No hay tickets registrados</p>
            <Link to="/crear-ticket" className="btn btn-primary">
              Crear Primer Ticket
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

