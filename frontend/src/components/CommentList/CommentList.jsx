import { MessageCircle, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './CommentList.css';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="no-comments">
        <MessageCircle size={48} />
        <p>No hay comentarios aún</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment, index) => (
        <div 
          key={index} 
          className={`comment ${comment.isInternal ? 'comment-internal' : ''}`}
        >
          <div className="comment-header">
            <div className="comment-author">
              <strong>{comment.author}</strong>
              {comment.isInternal && (
                <span className="internal-badge">
                  <Lock size={12} />
                  Interno
                </span>
              )}
            </div>
            <span className="comment-time">
              {formatDistanceToNow(new Date(comment.createdAt), { 
                addSuffix: true, 
                locale: es 
              })}
            </span>
          </div>
          <p className="comment-content">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

