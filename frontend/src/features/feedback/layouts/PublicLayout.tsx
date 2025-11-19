import { useState, useMemo } from 'react';
import { Outlet, useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../../../contexts/ApiContext';
import { useAuth } from '../../../contexts/AuthContext'; 
import styles from './PublicLayout.module.css';

const IconSearch = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const IconPlus = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

interface HeaderProps {
  project: { name: string; slug: string };
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  user: any;
  onLogout: () => void;
  currentPath: string;
}

const Header = ({ project, searchTerm, onSearchChange, user, onLogout, currentPath }: HeaderProps) => {
  // Construct login URL with redirect back to current page
  const loginUrl = `/login?redirectTo=${encodeURIComponent(currentPath)}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandBurdd}>BURDD</span>
          <span className={styles.brandSlash}>/</span>
          <span className={styles.brandProject}>{project.name} Feedback</span>
        </div>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <IconSearch className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            className={styles.searchInput}
            placeholder="Search by title or description..."
          />
        </div>
        
        <div className={styles.actions}>
          <Link
              to={`/${project.slug}/feedback/submit`}
              className={styles.submitButton}
          >
              <IconPlus className="w-5 h-5" />
              Submit
          </Link>

          {user ? (
            <div className={styles.userWidget}>
                <img src={user.avatarUrl} alt={user.name} className={styles.userAvatar} />
                <div className={styles.userDetails}>
                   <span className={styles.userName}>{user.name}</span>
                   <button onClick={onLogout} className={styles.logoutBtn}>Log out</button>
                </div>
            </div>
          ) : (
              <Link to={loginUrl} className={styles.headerLoginButton}>
                  Sign In
              </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

const PublicLayout = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const { baseUrl } = useApi();
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const project = useMemo(() => ({
    name: projectSlug ? projectSlug.charAt(0).toUpperCase() + projectSlug.slice(1) : 'Project',
    slug: projectSlug || 'default',
  }), [projectSlug]);

  const contextValue = useMemo(() => ({
    project,
    searchTerm,
    baseUrl,
  }), [project, searchTerm, baseUrl]);

  return (
    <div className={styles.shell}>
      <Header
        project={project}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        user={user}
        onLogout={handleLogout}
        currentPath={location.pathname + location.search}
      />
      <main className={styles.main}>
        <Outlet context={contextValue} />
      </main>
      <footer className={styles.footer}>
        Powered by BURDD
      </footer>
    </div>
  );
};

export default PublicLayout;