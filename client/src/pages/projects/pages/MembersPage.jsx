import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EmptyState from '@/common/EmptyState/EmptyState';
import Select from '@/common/Select/Select';
import { getProjectById, searchUsers, addMemberToProject, removeMemberFromProject, changeMemberRole } from '@/api';
import { useAuth } from '@contexts/AuthContext';
import styles from './MembersPage.module.css';

const MembersPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('dev');
  const [addingMember, setAddingMember] = useState(false);
  const [actionError, setActionError] = useState('');
  const [updatingMemberId, setUpdatingMemberId] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      setError(null);
    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Failed to load project members.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user && project && user.memberships?.find(m => m.project_id === projectId)?.role === 'admin';

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
      await loadProject();
      
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

  const handleRoleChange = async (memberId, newRole) => {
    setUpdatingMemberId(memberId);
    try {
      await changeMemberRole(projectId, memberId, newRole);
      await loadProject();
    } catch (err) {
      console.error('Failed to change role:', err);
      alert('Failed to change member role');
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this project?`)) {
      return;
    }

    setRemovingMemberId(memberId);
    try {
      await removeMemberFromProject(projectId, memberId);
      await loadProject();
    } catch (err) {
      console.error('Failed to remove member:', err);
      alert('Failed to remove member');
    } finally {
      setRemovingMemberId(null);
    }
  };

  if (!projectId) {
    return <EmptyState title="No project specified" description="Pick a project from the list." />;
  }

  if (loading) {
    return <p className={styles.muted}>Loading members…</p>;
  }

  if (error) {
    return <EmptyState title="Unable to load members" description={error} />;
  }

  if (!project) {
    return <EmptyState title="Project missing" description="Try returning to the project list." />;
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h2>Team Members</h2>
        {isAdmin && (
          <button onClick={() => setShowAddMemberModal(true)} className={styles.addButton}>
            Add Member
          </button>
        )}
      </header>

      <div className={styles.membersList}>
        {project.members.length === 0 ? (
          <EmptyState title="No members" description="Add team members to collaborate on this project." />
        ) : (
          <div className={styles.membersTable}>
            <div className={styles.tableHeader}>
              <span className={styles.headerCell}>Member</span>
              <span className={styles.headerCell}>Handle</span>
              <span className={styles.headerCell}>Role</span>
              {isAdmin && <span className={styles.headerCell}>Actions</span>}
            </div>
            {project.members.map((member) => (
              <div key={member.id} className={styles.memberRow}>
                <div className={styles.memberInfo}>
                  {member.avatarUrl && (
                    <img src={member.avatarUrl} alt={member.name} className={styles.avatar} />
                  )}
                  <span className={styles.memberName}>{member.name}</span>
                </div>
                <div className={styles.handleCell}>
                  <span className={styles.handleText}>{member.handle}</span>
                </div>
                <div className={styles.roleCell}>
                  {isAdmin ? (
                    <Select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      disabled={updatingMemberId === member.id}
                    >
                      <option value="dev">Developer</option>
                      <option value="admin">Admin</option>
                    </Select>
                  ) : (
                    <span className={styles.roleText}>{member.role === 'admin' ? 'Admin' : 'Developer'}</span>
                  )}
                </div>
                {isAdmin && (
                  <div className={styles.actionsCell}>
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      disabled={removingMemberId === member.id || member.id === user.id}
                      className={styles.removeButton}
                      title={member.id === user.id ? "You cannot remove yourself" : "Remove member"}
                    >
                      {removingMemberId === member.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
                    {searchResults.map((searchUser) => (
                      <div
                        key={searchUser.id}
                        className={`${styles.searchResultItem} ${selectedUserId === searchUser.id ? styles.selected : ''}`}
                        onClick={() => {
                          setSelectedUserId(searchUser.id);
                          setUserSearchTerm(searchUser.full_name);
                          setSearchResults([]);
                        }}
                      >
                        {searchUser.avatar_url && (
                          <img src={searchUser.avatar_url} alt={searchUser.full_name} className={styles.userAvatar} />
                        )}
                        <div>
                          <p className={styles.userName}>{searchUser.full_name}</p>
                          <p className={styles.userHandle}>@{searchUser.handle}</p>
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

export default MembersPage;
