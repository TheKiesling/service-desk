import Ticket from './Ticket.js';
import Comment from './Comment.js';
import Service from './Service.js';

Ticket.hasMany(Comment, {
  foreignKey: 'ticketId',
  as: 'comments',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Ticket, {
  foreignKey: 'ticketId',
  as: 'ticket',
});

export { Ticket, Comment, Service };

