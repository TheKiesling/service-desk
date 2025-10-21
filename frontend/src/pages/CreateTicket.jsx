import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, Sparkles } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import './CreateTicket.css';

const CATEGORIAS = [
  'Autenticación',
  'Catálogo',
  'Creación de pedidos',
  'Inventario',
  'UX/UI',
  'Visualización de pedidos',
  'Actualización de estado de pedidos',
  'Notificación de estado a clientes',
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
    category: '',
    affectedUser: {
      name: '',
      email: '',
      role: '',
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
      const issueData = {
        title: formData.title,
        description: formData.description,
        labels: [formData.category],
        category: formData.category,
        affectedUser: formData.affectedUser,
      };

      const issue = await createTicket(issueData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/ticket/${issue.iid}`);
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
        <div className="header-icon">
          <Sparkles size={32} />
        </div>
        <h1>Crear Nuevo Ticket</h1>
        <p>Describe tu problema o solicitud y nos encargaremos del resto</p>
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
            <Sparkles size={20} />
            ¡Ticket creado exitosamente! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Título *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="¿Cuál es el problema?"
            />
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
              <option value="">Selecciona el área relacionada</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
              rows={6}
              placeholder="Describe el problema con el mayor detalle posible..."
            />
          </div>

          <div className="form-divider">
            <span>Información de contacto</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="affectedUser.name">
              Tu Nombre *
            </label>
            <input
              id="affectedUser.name"
              name="affectedUser.name"
              type="text"
              className="form-input"
              value={formData.affectedUser.name}
              onChange={handleChange}
              required
              placeholder="Nombre completo"
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
              placeholder="tu@email.com"
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
              <option value="">Selecciona tu rol</option>
              <option value="Cliente">Cliente</option>
              <option value="Personal Administrativo">Personal Administrativo</option>
              <option value="Personal de Producción">Personal de Producción</option>
              <option value="Personal de Ventas">Personal de Ventas</option>
              <option value="Gerencia">Gerencia</option>
            </select>
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

