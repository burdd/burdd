import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import EmptyState from '@components/common/EmptyState/EmptyState';
import Tag from '@components/common/Tag/Tag';
import { getProjectById, getSprintsByProject, getIssuesByProject, updateProject, deleteProject, createSprint, createIssue } from '@/api';
import { useAuth } from '@contexts/AuthContext';
import styles from './ProjectDetailsPage.module.css';

const statusLabels = {
    queue: 'In queue',
    progress: 'In progress',
    review: 'Code review',
    done: 'Done',
};
const formatDate = (isoString) => new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
  const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editKey, setEditKey] = useState('');
  const [sprintName, setSprintName] = useState('');
  const [sprintStart, setSprintStart] = useState('');
  const [sprintEnd, setSprintEnd] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creatingSprint, setCreatingSprint] = useState(false);
  const [creatingIssue, setCreatingIssue] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!projectId) return;
    let ignore = false;
    setLoading(true);

    Promise.all([
      getProjectById(projectId),
      getSprintsByProject(projectId),
      getIssuesByProject(projectId),
    ])
      .then(([projectData, sprintsData, issuesData]) => {
        if (ignore) return;
        if (!projectData) {
          setError('This project does not exist.');
          setProject(null);
          return;
        }
        setProject(projectData);
        setSprints(sprintsData);
        setIssues(issuesData);
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
  }, [projectId]);

  const backlogIssues = useMemo(() => {
    return issues.filter(issue => !issue.sprintId);
  }, [issues]);

  const isAdmin = useMemo(() => {
    if (!user || !project) return false;
    const membership = user.memberships?.find(m => m.project_id === projectId);
    return membership?.role === 'admin';
  }, [user, project, projectId]);

  const isMember = useMemo(() => {
    if (!user || !project) return false;
    return user.memberships?.some(m => m.project_id === projectId);
  }, [user, project, projectId]);

  const handleEditProject = async (e) => {
    e.preventDefault();
    
    if (!editName.trim() || !editKey.trim()) {
      setActionError('Both name and key are required');
      return;
    }
    
    setUpdating(true);
    setActionError('');
    
    try {
      await updateProject(projectId, { 
        name: editName, 
        key: editKey.toUpperCase() 
      });
      
      setProject({ ...project, name: editName, key: editKey.toUpperCase() });
      setShowEditModal(false);
    } catch (err) {
      setActionError(err.message || 'Failed to update project');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    setDeleting(true);
    setActionError('');
    
    try {
      await deleteProject(projectId);
      navigate('/projects');
    } catch (err) {
      setActionError(err.message || 'Failed to delete project');
      setDeleting(false);
    }
  };

  const openEditModal = () => {
    setEditName(project.name);
    setEditKey(project.key);
    setActionError('');
    setShowEditModal(true);
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    
    if (!sprintName.trim() || !sprintStart || !sprintEnd) {
      setActionError('All fields are required');
      return;
    }
    
    if (new Date(sprintStart) >= new Date(sprintEnd)) {
      setActionError('End date must be after start date');
      return;
    }
    
    setCreatingSprint(true);
    setActionError('');
    
    try {
      const response = await createSprint(projectId, { 
        name: sprintName, 
        start: sprintStart,
        end: sprintEnd
      });
      
      setSprints([response.sprint, ...sprints]);
      setSprintName('');
      setSprintStart('');
      setSprintEnd('');
      setShowCreateSprintModal(false);
    } catch (err) {
      setActionError(err.message || 'Failed to create sprint');
    } finally {
      setCreatingSprint(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    
    if (!issueTitle.trim()) {
      setActionError('Issue title is required');
      return;
    }
    
    setCreatingIssue(true);
    setActionError('');
    
    try {
      const response = await createIssue(projectId, { 
        title: issueTitle,
        description: issueDescription || undefined,
        status: 'queue'
      });
      
      setIssues([response.issue, ...issues]);
      setIssueTitle('');
      setIssueDescription('');
      setShowCreateIssueModal(false);
    } catch (err) {
      setActionError(err.message || 'Failed to create issue');
    } finally {
      setCreatingIssue(false);
    }
  };

  if (!projectId) {
    return <EmptyState title="No project specified" description="Pick a project from the list." />;
  }

  if (loading) {
    return <p className={styles.muted}>Loading project…</p>;
  }

  if (error) {
    return <EmptyState title="Unable to load project" description={error} />;
  }

  if (!project) {
    return <EmptyState title="Project missing" description="Try returning to the project list." />;
  }

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{project.key}</p>
          <h2>{project.name}</h2>
        </div>
        <div className={styles.heroActions}>
          <Link to={`/projects/${projectId}/feedback`} className={styles.viewTicketsLink}>
            View Tickets
          </Link>
          {isAdmin && (
            <>
              <button onClick={openEditModal} className={styles.editButton}>
                Edit Project
              </button>
              <button onClick={() => setShowDeleteModal(true)} className={styles.deleteButton}>
                Delete
              </button>
            </>
          )}
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Team</h3>
          <p className={styles.muted}>{project.members.length} members</p>
        </div>
        <div className={styles.memberGrid}>
          {project.members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <p className={styles.memberName}>{member.name}</p>
              <Tag tone={member.role === 'admin' ? 'info' : 'neutral'}>{member.role}</Tag>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Sprints</h3>
          <div className={styles.sectionActions}>
            <p className={styles.muted}>Most recent first</p>
            {isAdmin && (
              <button 
                onClick={() => setShowCreateSprintModal(true)} 
                className={styles.createSprintButton}
              >
                Create Sprint
              </button>
            )}
          </div>
        </div>
        {sprints.length === 0 ? (
          <EmptyState title="No sprints yet" description="Create a sprint to start planning." />
        ) : (
          <div className={styles.sprintList}>
            {sprints
              .slice()
              .reverse()
              .map((sprint) => (
                <Link key={sprint.id} className={styles.sprintCard} to={`/sprints/${sprint.id}`}>
                  <div>
                    <p className={styles.sprintName}>{sprint.name}</p>
                  </div>
                  <p className={styles.dateRange}>
                    {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                  </p>
                </Link>
              ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Backlog</h3>
          <div className={styles.sectionActions}>
            <p className={styles.muted}>{backlogIssues.length} issues not in any sprint</p>
            {isMember && (
              <button 
                onClick={() => setShowCreateIssueModal(true)} 
                className={styles.createSprintButton}
              >
                Create Issue
              </button>
            )}
          </div>
        </div>
        {backlogIssues.length === 0 ? (
          <EmptyState title="No backlog issues" description="All issues are assigned to sprints." />
        ) : (
          <div className={styles.issueList}>
            {backlogIssues.map((issue) => (
              <Link key={issue.id} className={styles.issueCard} to={`/issues/${issue.id}`}>
                <div className={styles.issueHeader}>
                  <p className={styles.issueTitle}>{issue.title}</p>
                  <Tag tone={
                    issue.status === 'done' ? 'success' : 
                    issue.status === 'progress' ? 'info' : 
                    issue.status === 'review' ? 'warning' : 
                    'neutral'
                  }>
                    {statusLabels[issue.status]}
                  </Tag>
                </div>
                {issue.description && (
                  <p className={styles.issueDescription}>{issue.description}</p>
                )}
                <div className={styles.issueMeta}>
                  <span>{formatDate(issue.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {showEditModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit Project</h3>
            <form onSubmit={handleEditProject} className={styles.form}>
              {actionError && <div className={styles.errorBox}>{actionError}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="editProjectName" className={styles.label}>
                  Project Name *
                </label>
                <input
                  id="editProjectName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.input}
                  disabled={updating}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editProjectKey" className={styles.label}>
                  Project Key *
                </label>
                <input
                  id="editProjectKey"
                  type="text"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value.toUpperCase())}
                  className={styles.input}
                  maxLength={10}
                  disabled={updating}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setActionError('');
                  }}
                  className={styles.cancelButton}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={updating || !editName.trim() || !editKey.trim()}
                >
                  {updating ? 'Updating...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Project</h3>
            <p className={styles.deleteWarning}>
              Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone and will delete all sprints, issues, and tickets associated with this project.
            </p>
            {actionError && <div className={styles.errorBox}>{actionError}</div>}
            
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setActionError('');
                }}
                className={styles.cancelButton}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                className={styles.dangerButton}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateSprintModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateSprintModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create New Sprint</h3>
            <form onSubmit={handleCreateSprint} className={styles.form}>
              {actionError && <div className={styles.errorBox}>{actionError}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="sprintName" className={styles.label}>
                  Sprint Name *
                </label>
                <input
                  id="sprintName"
                  type="text"
                  value={sprintName}
                  onChange={(e) => setSprintName(e.target.value)}
                  className={styles.input}
                  placeholder="e.g., Sprint 1, Alpha Release"
                  disabled={creatingSprint}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="sprintStart" className={styles.label}>
                  Start Date *
                </label>
                <input
                  id="sprintStart"
                  type="date"
                  value={sprintStart}
                  onChange={(e) => setSprintStart(e.target.value)}
                  className={styles.input}
                  disabled={creatingSprint}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="sprintEnd" className={styles.label}>
                  End Date *
                </label>
                <input
                  id="sprintEnd"
                  type="date"
                  value={sprintEnd}
                  onChange={(e) => setSprintEnd(e.target.value)}
                  className={styles.input}
                  disabled={creatingSprint}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateSprintModal(false);
                    setSprintName('');
                    setSprintStart('');
                    setSprintEnd('');
                    setActionError('');
                  }}
                  className={styles.cancelButton}
                  disabled={creatingSprint}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={creatingSprint || !sprintName.trim() || !sprintStart || !sprintEnd}
                >
                  {creatingSprint ? 'Creating...' : 'Create Sprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateIssueModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateIssueModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create New Issue</h3>
            <form onSubmit={handleCreateIssue} className={styles.form}>
              {actionError && <div className={styles.errorBox}>{actionError}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="issueTitle" className={styles.label}>
                  Issue Title *
                </label>
                <input
                  id="issueTitle"
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className={styles.input}
                  placeholder="e.g., Fix login bug, Add user profile page"
                  disabled={creatingIssue}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="issueDescription" className={styles.label}>
                  Description (optional)
                </label>
                <textarea
                  id="issueDescription"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className={styles.textarea}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  disabled={creatingIssue}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateIssueModal(false);
                    setIssueTitle('');
                    setIssueDescription('');
                    setActionError('');
                  }}
                  className={styles.cancelButton}
                  disabled={creatingIssue}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={creatingIssue || !issueTitle.trim()}
                >
                  {creatingIssue ? 'Creating...' : 'Create Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetailsPage;
