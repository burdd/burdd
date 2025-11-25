import styles from './Select.module.css';

const Select = ({ label, value, onChange, disabled, children, ...props }) => {
  if (label) {
    return (
      <div className={styles.wrapper}>
        <label className={styles.label}>
          {label}
        </label>
        <select 
          value={value} 
          onChange={onChange} 
          disabled={disabled}
          className={styles.select}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }

  return (
    <select 
      value={value} 
      onChange={onChange} 
      disabled={disabled}
      className={styles.select}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;