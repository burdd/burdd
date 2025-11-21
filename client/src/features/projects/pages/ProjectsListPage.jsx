import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '@components/common/DataTable/DataTable';
import EmptyState from '@components/common/EmptyState/EmptyState';
import { getProjects, createProject } from '@/api';
import styles from './ProjectsListPage.module.css';

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectKey, setNewProjectKey] = useState('');
  const [createError, setCreateError] = useState('');

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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProjectName.trim() || !newProjectKey.trim()) {
      setCreateError('Both name and key are required');
      return;
    }
    
    setCreating(true);
    setCreateError('');
    
    try {
      const response = await createProject({ 
        name: newProjectName, 
        key: newProjectKey.toUpperCase() 
      });
      
      // Add the new project to the list
      setProjects([...projects, {
        id: response.project.id,
        name: response.project.name,
        key: response.project.key,
        members: [],
        stats: { totalIssues: 0, activeIssues: 0, openTickets: 0 }
      }]);
      
      // Reset and close modal
      setNewProjectName('');
      setNewProjectKey('');
      setShowCreateModal(false);
    } catch (err) {
      setCreateError(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

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
        <div className={styles.headerActions}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search name or key"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            Create Project
          </button>
        </div>
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

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create New Project</h3>
            <form onSubmit={handleCreateProject} className={styles.form}>
              {createError && <div className={styles.errorBox}>{createError}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="projectName" className={styles.label}>
                  Project Name *
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className={styles.input}
                  placeholder="e.g., My Awesome Project"
                  disabled={creating}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="projectKey" className={styles.label}>
                  Project Key *
                </label>
                <input
                  id="projectKey"
                  type="text"
                  value={newProjectKey}
                  onChange={(e) => setNewProjectKey(e.target.value.toUpperCase())}
                  className={styles.input}
                  placeholder="e.g., MAP"
                  maxLength={10}
                  disabled={creating}
                />
                <p className={styles.helpText}>Short identifier (will be uppercased)</p>
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProjectName('');
                    setNewProjectKey('');
                    setCreateError('');
                  }}
                  className={styles.cancelButton}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={creating || !newProjectName.trim() || !newProjectKey.trim()}
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsListPage;
