import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './FeedbackSuccessPage.module.css';

const IconCheck = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const IconClipboard = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);

const FeedbackSuccessPage = () => {
  const { projectSlug, ticketId } = useParams<{ projectSlug: string, ticketId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const trackingLink = `burdd.com/${projectSlug}/feedback/${ticketId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, (err) => console.error('Failed to copy text: ', err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.iconWrapper}><IconCheck className={styles.icon} /></div>
        <h1 className={styles.title}>Success!</h1>
        <p className={styles.subtitle}>Your feedback has been submitted.</p>
        <div className={styles.linkBox}>
          <p className={styles.linkIntro}>Here's your unique tracking link to check on its status:</p>
          <div className={styles.linkActions}>
            <input type="text" readOnly value={trackingLink} className={styles.linkInput} />
            <button onClick={copyToClipboard} className={`${styles.copyButton} ${copied ? styles.copiedButton : ''}`}>
              {copied ? <><IconCheck className="w-5 h-5" /> Copied!</> : <><IconClipboard className="w-5 h-5" /> Copy Link</>}
            </button>
          </div>
        </div>
        <button onClick={() => navigate(`/${projectSlug}/feedback`)} className={styles.backButton}>Back to Dashboard</button>
      </div>
    </div>
  );
};
export default FeedbackSuccessPage;
