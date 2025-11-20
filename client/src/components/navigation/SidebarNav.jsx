import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import styles from './SidebarNav.module.css';

const navLinks = [
    { label: 'Projects', to: '/projects' },
    { label: 'Ticket triage', to: '/tickets/triage' },
];

const SidebarNav = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Burdd</div>
      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ')
            }
          >
            <span className={styles.bullet} aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <p className={styles.meta}>WEB103 · Sprint board</p>
    </aside>
  );
};
export default SidebarNav;
