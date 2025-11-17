import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'error'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const projectKey = formData.get('projectKey')?.toString()?.trim() ?? '';

    if (!projectKey) {
      setStatus('error');
      return;
    }

    setStatus('idle');
    navigate('/projects');
  };

  return (
    <div className={styles.shell}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.eyebrow}>Burdd developers</p>
        <h1>Log in to triage</h1>
        <label>
          <span>Email</span>
          <input type="email" name="email" placeholder="kai@burdd.dev" required />
        </label>
        <label>
          <span>Project key</span>
          <input name="projectKey" placeholder="BUR" required />
        </label>
        {status === 'error' && <p className={styles.error}>Add your project key to proceed.</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default LoginPage;
