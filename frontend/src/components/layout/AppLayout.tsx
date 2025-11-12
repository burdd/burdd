import { Outlet } from 'react-router-dom';
import SidebarNav from '@components/navigation/SidebarNav';
import ProjectSwitcher from '@components/navigation/ProjectSwitcher';
import { useApi } from '@contexts/ApiContext';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  const { mode, setMode } = useApi();

  const toggleMode = () => setMode(mode === 'mock' ? 'live' : 'mock');

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
            <button className={styles.modeButton} type="button" onClick={toggleMode}>
              {mode === 'mock' ? 'Mock API' : 'Live API'}
            </button>
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
