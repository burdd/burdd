import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '@components/common/DataTable/DataTable';
import EmptyState from '@components/common/EmptyState/EmptyState';
import { getProjects } from '@/api';
import styles from './ProjectsListPage.module.css';

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    getProjects()
      .then((data) => {
        if (ignore) return;
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.key.toLowerCase().includes(query),
    );
  }, [projects, search]);

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Project',
        render: (project) => (
          <div className={styles.projectCell}>
            <p className={styles.projectName}>{project.name}</p>
          </div>
        ),
      },
      {
        key: 'members',
        header: 'Members',
        render: (project) => (
          <p className={styles.muted}>
            {project.members?.map((member) => member.name).filter(Boolean).join(', ') || 'None'}
          </p>
        ),
      },
      {
        key: 'stats',
        header: 'Health',
        render: (project) => (
          <div className={styles.statRow}>
            <span>{project.stats?.totalIssues ?? 0} total</span>
            <span>{project.stats?.activeIssues ?? 0} active</span>
            <span>{project.stats?.openTickets ?? 0} open tickets</span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: ' ',
        render: (project) => (
          <Link className={styles.link} to={`/projects/${project.id}`}>
            View
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <section className={styles.page}>
      <header className={styles.header}> 
        <div>
          <p className={styles.eyebrow}>Projects</p>
          <h2>Choose a workspace</h2>
        </div>
        <input
          className={styles.search}
          type="search"
          placeholder="Search name or key"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </header>

      {loading && <p className={styles.muted}>Loading projects…</p>}
      {error && <EmptyState title="Unable to load" description={error} />}
      {!loading && !error && (
        <DataTable
          data={filteredProjects}
          columns={columns}
          rowKey={(project) => project.id}
          emptyState={<EmptyState title="No projects" description="Try a different search term." />}
        />
      )}
    </section>
  );
};

export default ProjectsListPage;
