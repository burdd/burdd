import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>404</p>
        <h1>Route not found</h1>
        <p>The page you are looking for has moved or never existed.</p>
        <Link to="/projects" className={styles.link}>
          Back to projects
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
