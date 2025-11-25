import { useEffect, useMemo, useState } from 'react';
import EmptyState from '@/common/EmptyState/EmptyState';
import ProjectListItem from '../components/ProjectListItem';
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
        console.error('Failed to load projects:', err);
        setError('Failed to load projects.');
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
      
      setProjects([...projects, {
        id: response.project.id,
        name: response.project.name,
        key: response.project.key,
        members: [],
        stats: { totalIssues: 0, activeIssues: 0, openTickets: 0 }
      }]);
      
      setNewProjectName('');
      setNewProjectKey('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create project:', err);
      setCreateError('Failed to create project.');
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

  return (
    <section className={styles.page}>
      <header className={styles.header}> 
        <div>
          <p className={styles.eyebrow}>Projects</p>
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
        filteredProjects.length === 0 ? (
          <EmptyState title="No projects" description="Try a different search term." />
        ) : (
          <div className={styles.projectList}>
            {filteredProjects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        )
      )}

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create New Project</h3>
            <form onSubmit={handleCreateProject} className={styles.form}>
              {createError && <div className={styles.errorBox}>{createError}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="projectName" className={styles.label}>
                  Project Name*
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
                  Project Key*
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
