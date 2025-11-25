import { useState } from 'react';
import styles from './CommentThread.module.css';

const Comment = ({ comment }) => (
  <div className={styles.comment}>
    <div>
      <h4 className={styles.commentAuthor}>{comment.user.handle}</h4>
      <p className={styles.commentBody}>{comment.body}</p>
    </div>
  </div>
);

const CommentThread = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className={styles.thread}>
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
