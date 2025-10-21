import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import './CreateTicket.css';

const GITLAB_LABELS = [
  'Autenticación',
  'Catálogo',
  'Creación de pedidos',
  'Inventario',
  'Tracking',
  'UX/UI',
  'Visualización de pedidos',
];

const CreateTicket = () => {
  const navigate = useNavigate();
  const { createTicket } = useTickets();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service: '',
    category: 'Incidente',
    priority: 'P3',
    affectedUser: {
      name: '',
      email: '',
      role: 'Cliente',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('affectedUser.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        affectedUser: {
          ...prev.affectedUser,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const ticket = await createTicket(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/ticket/${ticket._id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al crear el ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket">
      <div className="create-ticket-header">
        <h1>Crear Nuevo Ticket</h1>
        <p>Complete el formulario para reportar un problema o solicitar un servicio</p>
      </div>

      <div className="create-ticket-content">
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ¡Ticket creado exitosamente! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-section">
            <h2>Información del Ticket</h2>
            
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Título del Ticket *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Error al actualizar inventario"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describa el problema o solicitud con el mayor detalle posible..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="service">
                  Categoría (GitLab Label) *
                </label>
                <select
                  id="service"
                  name="service"
                  className="form-select"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {GITLAB_LABELS.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Categoría *
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Incidente">Incidente</option>
                  <option value="Solicitud de Servicio">Solicitud de Servicio</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Cambio">Cambio</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="priority">
                  Prioridad *
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="P1">P1 - Crítico</option>
                  <option value="P2">P2 - Alto</option>
                  <option value="P3">P3 - Medio</option>
                  <option value="P4">P4 - Bajo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Información del Usuario Afectado</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="affectedUser.name">
                  Nombre Completo *
                </label>
                <input
                  id="affectedUser.name"
                  name="affectedUser.name"
                  type="text"
                  className="form-input"
                  value={formData.affectedUser.name}
                  onChange={handleChange}
                  required
                  placeholder="Nombre del usuario afectado"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="affectedUser.email">
                  Correo Electrónico *
                </label>
                <input
                  id="affectedUser.email"
                  name="affectedUser.email"
                  type="email"
                  className="form-input"
                  value={formData.affectedUser.email}
                  onChange={handleChange}
                  required
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="affectedUser.role">
                  Rol *
                </label>
                <select
                  id="affectedUser.role"
                  name="affectedUser.role"
                  className="form-select"
                  value={formData.affectedUser.role}
                  onChange={handleChange}
                  required
                >
                  <option value="Cliente">Cliente</option>
                  <option value="Personal Administrativo">Personal Administrativo</option>
                  <option value="Personal de Producción">Personal de Producción</option>
                  <option value="Personal de Ventas">Personal de Ventas</option>
                  <option value="Gerencia">Gerencia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
                  Creando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Crear Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;

