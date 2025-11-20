import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/time';
import UpvoteButton from './UpvoteButton';
import Tag from '../../../components/common/Tag/Tag';
import styles from './FeedbackListItem.module.css';

const IconMessageSquare = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const statusToneMap= {
  'new': 'warning',
  'triaged': 'info',
  'closed': 'success',
  'rejected': 'danger'
};

const FeedbackListItem = ({ 
  item, 
  projectSlug, 
  onUpvote,
  statusDisplayMap = {}, 
  categoryDisplayMap = {} 
}) => {
  
  const statusLabel = statusDisplayMap[item.status] || item.status;
  const categoryLabel = categoryDisplayMap[item.category] || item.category;

  return (
    <li className={styles.item}>
      <Link to={`/${projectSlug}/feedback/${item.id}`} className={styles.link}>
        <div className={styles.main}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.meta}>
            <Tag tone={statusToneMap[item.status] || 'neutral'}>
              {statusLabel}
            </Tag>
            <Tag tone="neutral">
              {categoryLabel}
            </Tag>
            <span className={styles.metaText}>
              {formatTimeAgo(item.createdAt)} by {item.user.handle}
            </span>
          </div>
        </div>
      </Link>
      
      <div className={styles.actions}>
        <div className={styles.comments}>
          <IconMessageSquare className="w-4 h-4" />
          <span className={styles.commentsCount}>{item.comments.length}</span>
        </div>
        <UpvoteButton 
          initialUpvoteCount={item.upvoteCount}
          initialHasVoted={item.hasVoted}
          onUpvote={onUpvote} 
          id={item.id} 
        />
      </div>
    </li>
  );
};

export default FeedbackListItem;