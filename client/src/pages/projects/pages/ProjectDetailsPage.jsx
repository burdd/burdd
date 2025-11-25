import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import EmptyState from '@/common/EmptyState/EmptyState';
import Tag from '@/common/Tag/Tag';
import Select from '@/common/Select/Select';
import IssueListItem from '@/pages/issues/components/IssueListItem';
import SprintListItem from '@/pages/sprints/components/SprintListItem';
import { getProjectById, getSprintsByProject, getIssuesByProject, updateProject, createSprint, createIssue, searchUsers, addMemberToProject, deleteProject } from '@/api';
import { useAuth } from '@contexts/AuthContext';
import styles from './ProjectDetailsPage.module.css';

const statusLabels = {
    queue: 'In queue',
    progress: 'In progress',
    review: 'Code review',
    done: 'Done',
};

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
  const [creatingSprint, setCreatingSprint] = useState(false);
  const [creatingIssue, setCreatingIssue] = useState(false);
  const [actionError, setActionError] = useState('');
  const [sprintSearchTerm, setSprintSearchTerm] = useState('');
  const [issueSearchTerm, setIssueSearchTerm] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('dev');
  const [addingMember, setAddingMember] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        console.error('Failed to load project:', err);
        setError('Failed to load project. Please try again.');
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

  const filteredSprints = useMemo(() => {
    if (!sprintSearchTerm) return sprints;
    return sprints.filter(sprint => 
      sprint.name.toLowerCase().includes(sprintSearchTerm.toLowerCase())
    );
  }, [sprints, sprintSearchTerm]);

  const filteredBacklogIssues = useMemo(() => {
    if (!issueSearchTerm) return backlogIssues;
    return backlogIssues.filter(issue => 
      issue.title.toLowerCase().includes(issueSearchTerm.toLowerCase()) ||
      (issue.description && issue.description.toLowerCase().includes(issueSearchTerm.toLowerCase()))
    );
  }, [backlogIssues, issueSearchTerm]);

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
      console.error('Failed to update project:', err);
      setActionError('Failed to update project.');
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = () => {
    setEditName(project.name);
    setEditKey(project.key);
    setActionError('');
    setShowEditModal(true);
  };

  const handleDeleteProject = async () => {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setActionError('');

    try {
      await deleteProject(projectId);
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      setActionError('Failed to delete project.');
      setDeleting(false);
    }
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
      console.error('Failed to create sprint:', err);
      setActionError('Failed to create sprint.');
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
      console.error('Failed to create issue:', err);
      setActionError('Failed to create issue.');
    } finally {
      setCreatingIssue(false);
    }
  };

  const handleUserSearch = async (term) => {
    setUserSearchTerm(term);
    if (term.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const users = await searchUsers(term);
      const existingMemberIds = new Set(project.members.map(m => m.id));
      const filteredUsers = users.filter(u => !existingMemberIds.has(u.id));
      setSearchResults(filteredUsers);
    } catch (err) {
      console.error('Failed to search users:', err);
      setSearchResults([]);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setActionError('Please select a user');
      return;
    }
    
    setAddingMember(true);
    setActionError('');
    
    try {
      await addMemberToProject(projectId, selectedUserId, selectedRole);
      
      const updatedProject = await getProjectById(projectId);
      setProject(updatedProject);
      
      setShowAddMemberModal(false);
      setUserSearchTerm('');
      setSearchResults([]);
      setSelectedUserId(null);
      setSelectedRole('dev');
    } catch (err) {
      console.error('Failed to add member:', err);
      setActionError('Failed to add member.');
    } finally {
      setAddingMember(false);
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
            <button onClick={openEditModal} className={styles.editButton}>
              Edit Project
            </button>
          )}
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Team</h3>
          <div className={styles.sectionActions}>
            <p className={styles.muted}>{project.members.length} members</p>
            <Link to={`/projects/${projectId}/members`} className={styles.viewTicketsLink}>
              Manage Team
            </Link>
          </div>
        </div>
        <div className={styles.memberGrid}>
          {project.members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberInfo}>
                <p className={styles.memberName}>{member.name}</p>
                <p className={styles.memberHandle}>{member.handle}</p>
              </div>
              <Tag tone="neutral">{member.role}</Tag>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Sprints</h3>
          <div className={styles.sectionActions}>
            <input
              type="text"
              placeholder="Search sprints..."
              className={styles.searchInput}
              value={sprintSearchTerm}
              onChange={(e) => setSprintSearchTerm(e.target.value)}
            />
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
        {filteredSprints.length === 0 ? (
          <EmptyState title="No sprints found" description={sprintSearchTerm ? "Try a different search term." : "Create a sprint to start planning."} />
        ) : (
          <div className={styles.sprintList}>
            {filteredSprints
              .slice()
              .reverse()
              .map((sprint) => (
                <SprintListItem key={sprint.id} sprint={sprint} />
              ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Backlog</h3>
          <div className={styles.sectionActions}>
            <input
              type="text"
              placeholder="Search issues..."
              className={styles.searchInput}
              value={issueSearchTerm}
              onChange={(e) => setIssueSearchTerm(e.target.value)}
            />
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
        {filteredBacklogIssues.length === 0 ? (
          <EmptyState title="No issues found" description={issueSearchTerm ? "Try a different search term." : "All issues are assigned to sprints."} />
        ) : (
          <div className={styles.issueList}>
            {filteredBacklogIssues.map((issue) => (
              <IssueListItem
                key={issue.id}
                issue={issue}
                showDescription={true}
              />
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
                  Project Name*
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
                  Project Key*
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
                  onClick={handleDeleteProject}
                  className={styles.removeButton}
                  disabled={updating || deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <div className={styles.rightActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setActionError('');
                    }}
                    className={styles.cancelButton}
                    disabled={updating || deleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={updating || deleting || !editName.trim() || !editKey.trim()}
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </form>
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
                  Sprint Name*
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
                  Start Date*
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
                  End Date*
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
                  Issue Title*
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

      {showAddMemberModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddMemberModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Add Team Member</h3>
            <form onSubmit={handleAddMember} className={styles.form}>
              {actionError && <div className={styles.errorBox}>{actionError}</div>}
              
              <Select
                label="Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={addingMember}
              >
                <option value="dev">Developer</option>
                <option value="admin">Admin</option>
              </Select>
              
              <div className={styles.formGroup}>
                <label htmlFor="userSearch" className={styles.label}>
                  Search User*
                </label>
                <input
                  id="userSearch"
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  className={styles.input}
                  placeholder="Type name or handle..."
                  disabled={addingMember}
                  autoComplete="off"
                />
                {searchResults.length > 0 && (
                  <div className={styles.searchResults}>
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className={`${styles.searchResultItem} ${selectedUserId === user.id ? styles.selected : ''}`}
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setUserSearchTerm(user.full_name);
                          setSearchResults([]);
                        }}
                      >
                        {user.avatar_url && (
                          <img src={user.avatar_url} alt={user.full_name} className={styles.userAvatar} />
                        )}
                        <div>
                          <p className={styles.userName}>{user.full_name}</p>
                          <p className={styles.userHandle}>@{user.handle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setUserSearchTerm('');
                    setSearchResults([]);
                    setSelectedUserId(null);
                    setSelectedRole('dev');
                    setActionError('');
                  }}
                  className={styles.cancelButton}
                  disabled={addingMember}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={addingMember || !selectedUserId}
                >
                  {addingMember ? 'Adding...' : 'Add Member'}
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
