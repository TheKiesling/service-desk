import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [[
        'Autenticación',
        'Catálogo',
        'Creación de pedidos',
        'Inventario',
        'Tracking',
        'UX/UI',
        'Visualización de pedidos',
      ]],
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Incidente', 'Solicitud de Servicio', 'Consulta', 'Cambio']],
    },
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'P3',
    validate: {
      isIn: [['P1', 'P2', 'P3', 'P4']],
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Abierto',
    validate: {
      isIn: [['Abierto', 'En Progreso', 'En Espera', 'Resuelto', 'Cerrado']],
    },
  },
  affectedUserName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  affectedUserEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  affectedUserRole: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [[
        'Cliente',
        'Personal Administrativo',
        'Personal de Producción',
        'Personal de Ventas',
        'Gerencia',
      ]],
    },
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  escalationLevel: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'L1',
    validate: {
      isIn: [['L1', 'L2', 'L3', 'L4']],
    },
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gitlabIssueId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gitlabIssueUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'tickets',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['service'] },
    { fields: ['createdAt'] },
    { fields: ['gitlabIssueId'] },
  ],
});

export default Ticket;
