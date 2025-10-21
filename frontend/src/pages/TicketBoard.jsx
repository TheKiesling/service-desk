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
        <p>Gestione y priorice todos los tickets del service desk</p>
      </div>

      <div className="ticket-board-filters">
        <div className="filter-icon">
          <Filter size={20} />
          <span>Filtros</span>
        </div>

        <select
          name="priority"
          className="form-select filter-select"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="">Todas las Prioridades</option>
          <option value="P1">P1 - Crítico</option>
          <option value="P2">P2 - Alto</option>
          <option value="P3">P3 - Medio</option>
          <option value="P4">P4 - Bajo</option>
        </select>

        <select
          name="label"
          className="form-select filter-select"
          value={filters.label}
          onChange={handleFilterChange}
        >
          <option value="">Todas las Categorías</option>
          <option value="Autenticación">Autenticación</option>
          <option value="Catálogo">Catálogo</option>
          <option value="Creación de pedidos">Creación de pedidos</option>
          <option value="Inventario">Inventario</option>
          <option value="Tracking">Tracking</option>
          <option value="UX/UI">UX/UI</option>
          <option value="Visualización de pedidos">Visualización de pedidos</option>
        </select>
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

