import type { ChangeEvent, ReactNode } from 'react';
import styles from './Select.module.css';

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

const Select = ({ label, value, onChange, children }: SelectProps) => {
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