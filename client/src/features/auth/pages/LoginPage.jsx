import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useAuth();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirectTo') ?? '/projects';
    if (redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect;
    }
    return '/projects';
  }, [location.search]);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, user, redirectTo, navigate]);

  const handleGitHubSignIn = useCallback(async () => {
    try {
      setSubmitting(true);
      setError(null);
      await login();
    } catch (err) {
      setError(err instanceof Error ? err.message: 'Unable to sign in. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [login]);

  return (
    <div className={styles.shell}>
      <div className={styles.form}>
        <p className={styles.eyebrow}>Burdd developers</p>
        <h1>Log in to triage</h1>
        <p>Sign in with GitHub to access developer tools for your assigned projects.</p>
        {error && <p className={styles.error}>{error}</p>}
        <button type="button" onClick={handleGitHubSignIn} disabled={loading || submitting}>
          {loading || submitting ? 'Signing in…' : 'Continue with GitHub'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
