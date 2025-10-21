import { useMemo } from 'react';
import { useTickets } from '../context/TicketContext';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Activity,
  Tag,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import './Statistics.css';

const Statistics = () => {
  const { tickets, loading } = useTickets();

  const stats = useMemo(() => {
    if (!tickets || tickets.length === 0) return null;

    const openTickets = tickets.filter(t => t.state === 'opened');
    const closedTickets = tickets.filter(t => t.state === 'closed');

    const categoryCounts = {};
    tickets.forEach(ticket => {
      if (ticket.labels) {
        ticket.labels.forEach(label => {
          if (!label.match(/^P[1-4]$/)) {
            categoryCounts[label] = (categoryCounts[label] || 0) + 1;
          }
        });
      }
    });

    const authorCounts = {};
    tickets.forEach(ticket => {
      const authorName = ticket.author?.name || 'Desconocido';
      authorCounts[authorName] = (authorCounts[authorName] || 0) + 1;
    });

    const monthCounts = {};
    tickets.forEach(ticket => {
      const date = new Date(ticket.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    const recentTickets = [...tickets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    return {
      total: tickets.length,
      open: openTickets.length,
      closed: closedTickets.length,
      categories: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]),
      authors: Object.entries(authorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
      timeline: Object.entries(monthCounts).sort(),
      recent: recentTickets,
      closureRate: tickets.length > 0 ? ((closedTickets.length / tickets.length) * 100).toFixed(1) : 0,
    };
  }, [tickets]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="empty-state">
        <AlertCircle size={48} />
        <h2>No hay datos disponibles</h2>
        <p>Crea algunos tickets para ver las estadísticas</p>
      </div>
    );
  }

  const maxCategory = Math.max(...stats.categories.map(c => c[1]), 1);

  return (
    <div className="statistics">
      <div className="statistics-header">
        <div className="header-icon">
          <BarChart3 size={32} />
        </div>
        <h1>Estadísticas del Service Desk</h1>
        <p>Análisis en tiempo real de los tickets de GitLab</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total de Tickets</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.closed}</div>
            <div className="stat-label">Tickets Cerrados</div>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.open}</div>
            <div className="stat-label">Tickets Abiertos</div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.closureRate}%</div>
            <div className="stat-label">Tasa de Cierre</div>
          </div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-card">
          <div className="chart-header">
            <Tag size={20} />
            <h3>Tickets por Categoría</h3>
          </div>
          <div className="chart-content">
            {stats.categories.length > 0 ? (
              <div className="bar-chart">
                {stats.categories.map(([category, count]) => (
                  <div key={category} className="bar-item">
                    <div className="bar-label">{category}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ width: `${(count / maxCategory) * 100}%` }}
                      >
                        <span className="bar-value">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="chart-empty">No hay categorías disponibles</p>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <Users size={20} />
            <h3>Top Creadores de Tickets</h3>
          </div>
          <div className="chart-content">
            {stats.authors.length > 0 ? (
              <div className="list-chart">
                {stats.authors.map(([author, count], index) => (
                  <div key={author} className="list-item">
                    <div className="list-rank">#{index + 1}</div>
                    <div className="list-name">{author}</div>
                    <div className="list-badge">{count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="chart-empty">No hay datos de autores</p>
            )}
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="section-header">
          <Calendar size={20} />
          <h3>Tickets Recientes</h3>
        </div>
        <div className="recent-tickets">
          {stats.recent.map(ticket => (
            <div key={ticket.id} className="recent-ticket">
              <div className="recent-ticket-info">
                <h4>{ticket.title}</h4>
                <p>{ticket.author?.name || 'Desconocido'} • {new Date(ticket.created_at).toLocaleDateString('es-ES')}</p>
              </div>
              <span className={`badge badge-${ticket.state === 'opened' ? 'open' : 'closed'}`}>
                {ticket.state === 'opened' ? 'Abierto' : 'Cerrado'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-footer">
        <p>Datos obtenidos directamente de GitLab</p>
        <p className="stats-update">Última actualización: {new Date().toLocaleString('es-ES')}</p>
      </div>
    </div>
  );
};

export default Statistics;

