import { Link } from 'react-router-dom';
import styles from './ProjectListItem.module.css';

const ProjectListItem = ({ project }) => {
  return (
    <Link className={styles.projectCard} to={`/projects/${project.id}`}>
      <div className={styles.projectInfo}>
        <div>
          <p className={styles.projectKey}>{project.key}</p>
          <p className={styles.projectName}>{project.name}</p>
        </div>
        <div className={styles.projectMeta}>
          <span className={styles.metaItem}>{project.members?.length ?? 0} members</span>
          <span className={styles.metaItem}>{project.stats?.totalIssues ?? 0} issues</span>
          <span className={styles.metaItem}>{project.stats?.openTickets ?? 0} tickets</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectListItem;
