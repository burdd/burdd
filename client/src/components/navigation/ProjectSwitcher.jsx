import { useEffect, useMemo, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from '@components/common/Select/Select';
import { getProjects } from '@/api';
import styles from './ProjectSwitcher.module.css';

const ProjectSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getProjects()
      .then((data) => {
        if (ignore) return;
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        console.error('Failed to load projects:', err);
        setError('Failed to load projects.');
      });

    return () => {
      ignore = true;
    };
  }, []);

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
    <div className={styles.switcher}>
      <span className={styles.label}>Project</span>
      <Select
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
      </Select>
      {error && <span className={styles.error}>Offline</span>}
    </div>
  );
};

export default ProjectSwitcher;
