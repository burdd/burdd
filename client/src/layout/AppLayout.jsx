import { Outlet, useNavigate } from 'react-router-dom';
import ProjectSwitcher from './ProjectSwitcher';
import { useAuth } from '@contexts/AuthContext';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.shell}>
      <div className={styles.mainRegion}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Burdd</p>
          </div>
          <div className={styles.headerActions}>
            <ProjectSwitcher />
            {user && (
              <div className={styles.userControls}>
                <div>
                  <p className={styles.userName}>{user.name}</p>
                  <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                    Log out
                  </button>
                </div>
                {user.avatarUrl && <img className={styles.userAvatar} src={user.avatarUrl} alt={user.name} />}
              </div>
            )}
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
