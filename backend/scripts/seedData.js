import dotenv from 'dotenv';
import sequelize from '../config/database.js';
import { Ticket, Comment, Service } from '../models/index.js';

dotenv.config();

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

const sampleTickets = [
  {
    title: 'Error al actualizar inventario de telas',
    description: 'El sistema no permite actualizar las cantidades de telas en el inventario. Al intentar guardar los cambios, aparece un error 500.',
    service: 'Inventario',
    category: 'Incidente',
    priority: 'P1',
    status: 'Abierto',
    affectedUserName: 'María González',
    affectedUserEmail: 'maria.gonzalez@uniformes.com',
    affectedUserRole: 'Personal Administrativo',
    assignedTo: 'Soporte Técnico L2',
    escalationLevel: 'L2',
  },
  {
    title: 'Cliente no puede ver el tracking de su pedido',
    description: 'El cliente reporta que al ingresar a su portal no puede ver el estado actual de su pedido #12345.',
    service: 'Tracking',
    category: 'Incidente',
    priority: 'P2',
    status: 'En Progreso',
    affectedUserName: 'Juan Pérez',
    affectedUserEmail: 'juan.perez@cliente.com',
    affectedUserRole: 'Cliente',
    assignedTo: 'Carlos Méndez',
    escalationLevel: 'L1',
  },
  {
    title: 'Solicitud de nuevo tipo de producto en catálogo',
    description: 'El cliente solicita agregar camisas tipo polo al catálogo de productos disponibles.',
    service: 'Catálogo',
    category: 'Solicitud de Servicio',
    priority: 'P3',
    status: 'En Espera',
    affectedUserName: 'Ana Martínez',
    affectedUserEmail: 'ana.martinez@ventas.com',
    affectedUserRole: 'Personal de Ventas',
    assignedTo: 'Equipo de Producto',
    escalationLevel: 'L2',
  },
  {
    title: 'Mejora en la interfaz de visualización',
    description: 'Los usuarios reportan que la interfaz es confusa en algunos módulos.',
    service: 'UX/UI',
    category: 'Incidente',
    priority: 'P2',
    status: 'Resuelto',
    affectedUserName: 'Luis Ramírez',
    affectedUserEmail: 'luis.ramirez@soporte.com',
    affectedUserRole: 'Personal Administrativo',
    assignedTo: 'Equipo de Desarrollo',
    escalationLevel: 'L2',
    resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    title: 'Consulta sobre proceso de pedidos corporativos',
    description: '¿Cómo funciona el proceso de pedidos para empresas con más de 500 uniformes?',
    service: 'Creación de pedidos',
    category: 'Consulta',
    priority: 'P4',
    status: 'Cerrado',
    affectedUserName: 'Roberto Castillo',
    affectedUserEmail: 'roberto.castillo@empresa.com',
    affectedUserRole: 'Cliente',
    assignedTo: 'Soporte L1',
    escalationLevel: 'L1',
    resolvedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    title: 'Error de autenticación en sistema interno',
    description: 'Los trabajadores de producción no pueden iniciar sesión en el sistema desde esta mañana.',
    service: 'Autenticación',
    category: 'Incidente',
    priority: 'P1',
    status: 'En Progreso',
    affectedUserName: 'Sandra López',
    affectedUserEmail: 'sandra.lopez@produccion.com',
    affectedUserRole: 'Personal de Producción',
    assignedTo: 'Equipo de Infraestructura',
    escalationLevel: 'L3',
  },
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL');

    await sequelize.sync({ force: true });
    console.log('🔄 Tablas recreadas');

    await Service.bulkCreate(services);
    console.log(`✅ ${services.length} servicios creados`);

    const createdTickets = [];
    for (const ticketData of sampleTickets) {
      const ticket = await Ticket.create(ticketData);
      createdTickets.push(ticket);
    }
    console.log(`✅ ${createdTickets.length} tickets de ejemplo creados`);

    await Comment.create({
      ticketId: createdTickets[1].id,
      author: 'Carlos Méndez',
      content: 'Investigando el problema. Parece ser un error en la sincronización de datos.',
      isInternal: true,
    });

    await Comment.create({
      ticketId: createdTickets[3].id,
      author: 'Equipo de Desarrollo',
      content: 'Se optimizaron las consultas a la base de datos y se implementó caché.',
      isInternal: false,
    });

    await Comment.create({
      ticketId: createdTickets[4].id,
      author: 'Soporte L1',
      content: 'Se envió documentación sobre el proceso de pedidos corporativos al cliente.',
      isInternal: false,
    });

    await Comment.create({
      ticketId: createdTickets[5].id,
      author: 'Equipo de Infraestructura',
      content: 'Identificado problema en el servidor de autenticación. Aplicando solución.',
      isInternal: true,
    });

    console.log('✅ Comentarios agregados a los tickets');

    console.log('\n🎉 Base de datos inicializada correctamente');
    console.log('📊 Resumen:');
    console.log(`   - Servicios: ${services.length}`);
    console.log(`   - Tickets: ${createdTickets.length}`);
    console.log(`   - Comentarios: 4`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
