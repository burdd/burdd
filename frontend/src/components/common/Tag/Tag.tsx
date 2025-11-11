import styles from './Tag.module.css';

type TagTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

interface TagProps {
  tone?: TagTone;
  children: React.ReactNode;
}

const Tag = ({ tone = 'neutral', children }: TagProps) => {
  const className = [styles.tag, styles[tone]].filter(Boolean).join(' ');
  return <span className={className}>{children}</span>;
};

export default Tag;
