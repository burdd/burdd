import { useEffect, useMemo, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '@contexts/ApiContext';
import { getList } from '@lib/fetcher';
import styles from './ProjectSwitcher.module.css';

const ProjectSwitcher = () => {
  const { baseUrl } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getList(`${baseUrl}/projects.json`)
      .then((data) => {
        if (ignore) return;
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
      });

    return () => {
      ignore = true;
    };
  }, [baseUrl]);

  const activeProjectId = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments[0] === 'projects' && segments[1]) {
      return segments[1];
    }
    return '';
  }, [location.pathname]);

  const handleChange = (event) => {
    const { value } = event.target;
    if (value) {
      navigate(`/projects/${value}`);
    }
  };

  return (
    <label className={styles.switcher}>
      <span className={styles.label}>Project</span>
      <select
        className={styles.select}
        value={activeProjectId}
        onChange={handleChange}
        disabled={!!error || projects.length === 0}
      >
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      {error && <span className={styles.error}>Offline</span>}
    </label>
  );
};

export default ProjectSwitcher;
