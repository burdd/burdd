import { useState } from 'react';
import type { PublicComment } from '../types';
import styles from './CommentThread.module.css';

interface CommentProps {
  comment: PublicComment;
}

const Comment = ({ comment }: CommentProps) => (
  <div className={styles.comment}>
    <img
      src={comment.user.avatar_url}
      alt={comment.user.handle}
      className={styles.avatar}
      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/A1A1AA/FFFFFF?text=?'; }}
    />
    <div>
      <h4 className={styles.commentAuthor}>{comment.user.handle}</h4>
      <p className={styles.commentBody}>{comment.body}</p>
    </div>
  </div>
);

interface CommentThreadProps {
  comments: PublicComment[];
  onAddComment: (body: string) => void;
}

const CommentThread = ({ comments, onAddComment }: CommentThreadProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className={styles.thread}>
      <h2 className={styles.title}>
        Comments ({comments.length})
      </h2>
      
      <form onSubmit={handleSubmitComment} className={styles.form}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className={styles.textarea}
          rows={3}
          placeholder="Add your comment..."
        ></textarea>
        <button
          type="submit"
          className={styles.submitButton}
        >
          Post Comment
        </button>
      </form>
      
      <div className={styles.list}>
        {comments.length > 0 ? (
          comments.map(comment => <Comment key={comment.id} comment={comment} />)
        ) : (
          <p className={styles.emptyText}>Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentThread;
