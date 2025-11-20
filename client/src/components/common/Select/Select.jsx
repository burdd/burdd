import styles from './Select.module.css';

const Select = ({ label, value, onChange, children }) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
      </label>
      <select value={value} onChange={onChange} className={styles.select}>
        {children}
      </select>
    </div>
  );
};

export default Select;