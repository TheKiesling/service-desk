import { Service } from '../models/index.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { active: true },
      order: [['name', 'ASC']],
    });

    const formattedServices = services.map(service => ({
      _id: service.id,
      ...service.toJSON(),
      sla: {
        responseTime: service.slaResponseTime,
        resolutionTime: service.slaResolutionTime,
      },
    }));

    res.json(formattedServices);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error al obtener servicios', error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      criticality: req.body.criticality,
      slaResponseTime: req.body.sla.responseTime,
      slaResolutionTime: req.body.sla.resolutionTime,
      active: req.body.active !== undefined ? req.body.active : true,
    };

    const newService = await Service.create(serviceData);

    const formattedService = {
      _id: newService.id,
      ...newService.toJSON(),
      sla: {
        responseTime: newService.slaResponseTime,
        resolutionTime: newService.slaResolutionTime,
      },
    };

    res.status(201).json(formattedService);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(400).json({ message: 'Error al crear servicio', error: error.message });
  }
};

export const initializeServices = async (req, res) => {
  try {
    const existingServices = await Service.count();
    
    if (existingServices > 0) {
      return res.json({ message: 'Servicios ya inicializados' });
    }

    const services = [
      {
        name: 'Autenticación',
        description: 'Sistema de autenticación y accesos',
        criticality: 'Crítica',
        slaResponseTime: 2,
        slaResolutionTime: 4,
      },
      {
        name: 'Catálogo',
        description: 'Catálogo de productos',
        criticality: 'Media',
        slaResponseTime: 8,
        slaResolutionTime: 24,
      },
      {
        name: 'Creación de pedidos',
        description: 'Sistema de creación de pedidos',
        criticality: 'Crítica',
        slaResponseTime: 2,
        slaResolutionTime: 4,
      },
      {
        name: 'Inventario',
        description: 'Gestión de inventario',
        criticality: 'Crítica',
        slaResponseTime: 2,
        slaResolutionTime: 4,
      },
      {
        name: 'Tracking',
        description: 'Tracking de producción y pedidos',
        criticality: 'Alta',
        slaResponseTime: 4,
        slaResolutionTime: 8,
      },
      {
        name: 'UX/UI',
        description: 'Interfaz y experiencia de usuario',
        criticality: 'Media',
        slaResponseTime: 8,
        slaResolutionTime: 24,
      },
      {
        name: 'Visualización de pedidos',
        description: 'Vista y seguimiento de pedidos',
        criticality: 'Alta',
        slaResponseTime: 4,
        slaResolutionTime: 8,
      },
    ];

    await Service.bulkCreate(services);
    res.json({ message: 'Servicios inicializados correctamente' });
  } catch (error) {
    console.error('Error al inicializar servicios:', error);
    res.status(500).json({ message: 'Error al inicializar servicios', error: error.message });
  }
};
