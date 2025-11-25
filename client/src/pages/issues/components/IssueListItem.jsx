import { Link } from 'react-router-dom';
import Tag from '@/common/Tag/Tag';
import styles from './IssueListItem.module.css';

const statusLabels = {
  'queue': 'IN QUEUE',
  'progress': 'IN PROGRESS',
  'review': 'REVIEW',
  'done': 'DONE'
};

const IssueListItem = ({ issue, showDescription = false }) => {
  const getTone = (status) => {
    return 'neutral';
  };

  return (
    <Link to={`/issues/${issue.id}`} className={styles.issueCard}>
      <p className={styles.issueTitle}>{issue.title}</p>
      {showDescription && issue.description && (
        <p className={styles.issueDescription}>{issue.description}</p>
      )}
      <Tag tone={getTone(issue.status)}>
        {statusLabels[issue.status] || issue.status.toUpperCase()}
      </Tag>
    </Link>
  );
};

export default IssueListItem;
