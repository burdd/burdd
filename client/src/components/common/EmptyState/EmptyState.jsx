import styles from './EmptyState.module.css';

const EmptyState = ({ title, description, action }) => {
  return (
    <div className={styles.empty}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
