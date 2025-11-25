import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { loginWithGitHub } from '@/api';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirectTo') ?? '/projects';
    if (redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect;
    }
    return '/projects';
  }, [location.search]);

  const error = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('error');
  }, [location.search]);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, user, redirectTo, navigate]);

  const handleGitHubSignIn = () => {
    loginWithGitHub();
  };

  if (loading) {
    return (
      <div className={styles.shell}>
        <div className={styles.form}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.form}>
        <p className={styles.eyebrow}>Burdd</p>
        <h1>Log in</h1>
        <p>Sign in below to access projects...</p>
        {error === 'auth_failed' && (
          <p className={styles.error}>Authentication failed. Please try again.</p>
        )}
        <button type="button" onClick={handleGitHubSignIn}>
          Continue with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
