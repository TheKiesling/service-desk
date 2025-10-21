import { Ticket, Comment } from '../models/index.js';
import { Op } from 'sequelize';
import { createGitLabIssue, addGitLabComment, updateGitLabIssue } from '../services/gitlabService.js';

export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, service } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (service) where.service = service;

    const tickets = await Ticket.findAll({
      where,
      include: [{
        model: Comment,
        as: 'comments',
        attributes: ['id', 'author', 'content', 'isInternal', 'createdAt'],
      }],
      order: [['createdAt', 'DESC']],
    });

    const formattedTickets = tickets.map(ticket => ({
      _id: ticket.id,
      ...ticket.toJSON(),
      affectedUser: {
        name: ticket.affectedUserName,
        email: ticket.affectedUserEmail,
        role: ticket.affectedUserRole,
      },
    }));

    res.json(formattedTickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ message: 'Error al obtener tickets', error: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [{
        model: Comment,
        as: 'comments',
        attributes: ['id', 'author', 'content', 'isInternal', 'createdAt'],
        order: [['createdAt', 'ASC']],
      }],
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    const formattedTicket = {
      _id: ticket.id,
      ...ticket.toJSON(),
      affectedUser: {
        name: ticket.affectedUserName,
        email: ticket.affectedUserEmail,
        role: ticket.affectedUserRole,
      },
    };
    
    res.json(formattedTicket);
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({ message: 'Error al obtener ticket', error: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const ticketData = {
      title: req.body.title,
      description: req.body.description,
      service: req.body.service,
      category: req.body.category,
      priority: req.body.priority,
      status: req.body.status || 'Abierto',
      affectedUserName: req.body.affectedUser.name,
      affectedUserEmail: req.body.affectedUser.email,
      affectedUserRole: req.body.affectedUser.role,
      assignedTo: req.body.assignedTo,
      escalationLevel: req.body.escalationLevel || 'L1',
    };

    const newTicket = await Ticket.create(ticketData);
    
    const gitlabData = {
      title: ticketData.title,
      description: ticketData.description,
      service: ticketData.service,
    };
    
    const gitlabResult = await createGitLabIssue(gitlabData);
    
    if (gitlabResult.success) {
      await Ticket.update(
        { 
          gitlabIssueId: gitlabResult.gitlabIssueId,
          gitlabIssueUrl: gitlabResult.gitlabIssueUrl 
        },
        { where: { id: newTicket.id } }
      );
      console.log(`✅ Issue creado en GitLab: #${gitlabResult.gitlabIssueId}`);
    } else {
      console.warn('⚠️ No se pudo crear issue en GitLab:', gitlabResult.error);
    }
    
    const ticket = await Ticket.findByPk(newTicket.id, {
      include: [{
        model: Comment,
        as: 'comments',
      }],
    });

    const formattedTicket = {
      _id: ticket.id,
      ...ticket.toJSON(),
      affectedUser: {
        name: ticket.affectedUserName,
        email: ticket.affectedUserEmail,
        role: ticket.affectedUserRole,
      },
      gitlab: gitlabResult.success ? {
        issueId: gitlabResult.gitlabIssueId,
        issueUrl: gitlabResult.gitlabIssueUrl,
      } : null,
    };

    res.status(201).json(formattedTicket);
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(400).json({ message: 'Error al crear ticket', error: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (updates.status === 'Resuelto' || updates.status === 'Cerrado') {
      updates.resolvedAt = new Date();
    }

    if (updates.affectedUser) {
      updates.affectedUserName = updates.affectedUser.name;
      updates.affectedUserEmail = updates.affectedUser.email;
      updates.affectedUserRole = updates.affectedUser.role;
      delete updates.affectedUser;
    }

    const [updatedCount] = await Ticket.update(updates, {
      where: { id: req.params.id },
    });
    
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    const ticket = await Ticket.findByPk(req.params.id, {
      include: [{
        model: Comment,
        as: 'comments',
      }],
    });

    const formattedTicket = {
      _id: ticket.id,
      ...ticket.toJSON(),
      affectedUser: {
        name: ticket.affectedUserName,
        email: ticket.affectedUserEmail,
        role: ticket.affectedUserRole,
      },
    };
    
    res.json(formattedTicket);
  } catch (error) {
    console.error('Error al actualizar ticket:', error);
    res.status(400).json({ message: 'Error al actualizar ticket', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { author, content, isInternal } = req.body;
    
    const ticket = await Ticket.findByPk(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }
    
    await Comment.create({
      ticketId: req.params.id,
      author,
      content,
      isInternal: isInternal || false,
    });

    if (ticket.gitlabIssueId) {
      const gitlabResult = await addGitLabComment(ticket.gitlabIssueId, {
        author,
        content,
        isInternal: isInternal || false,
      });
      
      if (gitlabResult.success) {
        console.log(`✅ Comentario agregado en GitLab issue #${ticket.gitlabIssueId}`);
      } else {
        console.warn('⚠️ No se pudo agregar comentario en GitLab:', gitlabResult.error);
      }
    }

    const updatedTicket = await Ticket.findByPk(req.params.id, {
      include: [{
        model: Comment,
        as: 'comments',
        order: [['createdAt', 'ASC']],
      }],
    });

    const formattedTicket = {
      _id: updatedTicket.id,
      ...updatedTicket.toJSON(),
      affectedUser: {
        name: updatedTicket.affectedUserName,
        email: updatedTicket.affectedUserEmail,
        role: updatedTicket.affectedUserRole,
      },
    };
    
    res.json(formattedTicket);
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(400).json({ message: 'Error al agregar comentario', error: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const deletedCount = await Ticket.destroy({
      where: { id: req.params.id },
    });
    
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }
    
    res.json({ message: 'Ticket eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({ message: 'Error al eliminar ticket', error: error.message });
  }
};
