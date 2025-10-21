import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  criticality: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Crítica', 'Alta', 'Media', 'Baja']],
    },
  },
  slaResponseTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  slaResolutionTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'services',
  timestamps: true,
});

export default Service;
