import { useState, useEffect } from 'react';
import styles from './UpvoteButton.module.css';

const IconChevronUp = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"></polyline></svg>
);

const UpvoteButton = ({
  initialUpvoteCount,
  initialHasVoted,
  onUpvote,
  id,
  size = 'md'
}) => {
  const [upvoted, setUpvoted] = useState(initialHasVoted);
  const [count, setCount] = useState(initialUpvoteCount);

  useEffect(() => {
    setUpvoted(initialHasVoted);
    setCount(initialUpvoteCount);
  }, [initialHasVoted, initialUpvoteCount]);

  const handleClick = (e) => {
    e.stopPropagation();
    const newUpvoted = !upvoted;
    const newCount = newUpvoted ? count + 1 : count - 1
    
    setUpvoted(newUpvoted);
    setCount(newCount);
    onUpvote(id, newCount, newUpvoted);
  };

  const sizeClass = size === 'lg' ? styles.sizeLg : styles.sizeMd
  const activeClass = upvoted ? styles.active : styles.inactive

  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${sizeClass} ${activeClass}`}
    >
      <IconChevronUp className={styles.icon} />
      <span className={styles.count}>{count}</span>
    </button>
  );
};

export default UpvoteButton;
