import { MessageCircle } from 'lucide-react';
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
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className="comment"
        >
          <div className="comment-header">
            <div className="comment-author">
              <strong>Anónimo</strong>
            </div>
            <span className="comment-time">
              {formatDistanceToNow(new Date(comment.created_at), { 
                addSuffix: true, 
                locale: es 
              })}
            </span>
          </div>
          <p className="comment-content" style={{ whiteSpace: 'pre-wrap' }}>
            {comment.body}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

