import { Outlet, useNavigate } from 'react-router-dom';
import SidebarNav from '@components/navigation/SidebarNav';
import ProjectSwitcher from '@components/navigation/ProjectSwitcher';
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
      <SidebarNav />
      <div className={styles.mainRegion}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Sprint control</p>
            <h1 className={styles.title}>Burdd</h1>
          </div>
          <div className={styles.headerActions}>
            <ProjectSwitcher />
            {user && (
              <div className={styles.userControls}>
                {user.avatarUrl && <img className={styles.userAvatar} src={user.avatarUrl} alt={user.name} />}
                <div>
                  <p className={styles.userName}>{user.name}</p>
                  <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                    Log out
                  </button>
                </div>
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
