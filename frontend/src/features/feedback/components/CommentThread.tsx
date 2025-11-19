import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useApi } from '../../../contexts/ApiContext';
import { requestJson } from '../../../lib/fetcher';
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
  ticketId: string;
  comments: PublicComment[];
  onAddComment: (comment: PublicComment) => void;
}

const CommentThread = ({ ticketId, comments, onAddComment }: CommentThreadProps) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { baseUrl } = useApi();
  const location = useLocation();

  // Generate the redirect URL for the login button
  const currentPath = location.pathname + location.search;
  const loginUrl = `/login?redirectTo=${encodeURIComponent(currentPath)}`;

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      // In a real app, we would POST to the API like this:
      // const response = await requestJson<PublicComment>(`${baseUrl}/tickets/${ticketId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ body: newComment })
      // });
      
      // Since we are mocking, we construct the comment object manually
      const mockComment: PublicComment = {
        id: `c-${Date.now()}`,
        user: {
          handle: user.name, // Use logged in user's name
          avatar_url: user.avatarUrl || ''
        },
        body: newComment
      };

      // Update local state immediately
      onAddComment(mockComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.thread}>
      <h2 className={styles.title}>
        Comments ({comments.length})
      </h2>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className={styles.form}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.textarea}
            rows={3}
            placeholder="Add your comment..."
            disabled={submitting}
          ></textarea>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className={styles.loginPrompt}>
            <p className={styles.loginText}>Have something to add?</p>
            <Link to={loginUrl} className={styles.loginButton}>
                Sign in to comment
            </Link>
        </div>
      )}
      
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