import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable, { type Column } from '@components/common/DataTable/DataTable';
import EmptyState from '@components/common/EmptyState/EmptyState';
import Tag from '@components/common/Tag/Tag';
import { useApi } from '@contexts/ApiContext';
import { getList } from '@lib/fetcher';
import type { Project } from '@/types/api';
import styles from './ProjectsListPage.module.css';

const ProjectsListPage = () => {
  const { baseUrl } = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    getList<Project>(`${baseUrl}/projects.json`)
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
  }, [baseUrl]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.key.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query),
    );
  }, [projects, search]);

  const columns: Column<Project>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Project',
        render: (project) => (
          <div className={styles.projectCell}>
            <div>
              <p className={styles.projectName}>{project.name}</p>
              <p className={styles.projectDescription}>{project.description}</p>
            </div>
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
        key: 'sprint',
        header: 'Active sprint',
        render: (project) => (
          <Tag tone={project.activeSprintId ? 'info' : 'warning'}>
            {project.activeSprintName ?? 'Not assigned'}
          </Tag>
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
          placeholder="Search name, key, description"
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
