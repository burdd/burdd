import { Link } from 'react-router-dom';
import styles from './SprintListItem.module.css';

const formatDate = (isoString) => new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const SprintListItem = ({ sprint }) => {
  return (
    <Link className={styles.sprintCard} to={`/sprints/${sprint.id}`}>
      <div>
        <p className={styles.sprintName}>{sprint.name}</p>
      </div>
      <p className={styles.dateRange}>
        {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
      </p>
    </Link>
  );
};

export default SprintListItem;
