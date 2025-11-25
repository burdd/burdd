import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import EmptyState from '@components/common/EmptyState/EmptyState';
import Tag from '@components/common/Tag/Tag';
import Select from '@components/common/Select/Select';
import FeedbackListItem from '@features/feedback/components/FeedbackListItem';
import { getIssueById, getProjectById, getSprintById, getTicketsByIssue, updateIssue, getSprintsByProject, updateLinkedTicketsStatus } from '@/api';
import { useAuth } from '@contexts/AuthContext';
import styles from './IssueDetailsPage.module.css';

const CATEGORY_DISPLAY_MAP = {
  'feature_request': 'Feature Request',
  'complaint': 'Issue'
};

const STATUS_DISPLAY_MAP = {
  'new': 'NEW',
  'triaged': 'TRIAGED',
  'closed': 'CLOSED',
  'rejected': 'REJECTED'
};

const statusToneMap = {
    queue: 'warning',
    progress: 'info',
    review: 'info',
    done: 'success',
};

const statusLabels = {
  'queue': 'IN QUEUE',
  'progress': 'IN PROGRESS',
  'review': 'REVIEW',
  'done': 'DONE'
};

const IssueDetailsPage = () => {
  const { issueId } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);
  const [sprint, setSprint] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (!issueId) return;
    let ignore = false;

    const fetchIssue = async () => {
      setLoading(true);
      try {
        const issueData = await getIssueById(issueId);
        if (ignore) return;

        if (!issueData) {
          setIssue(null);
          setProject(null);
          setSprint(null);
          setTickets([]);
          setError('Issue not found.');
          return;
        }

        setIssue(issueData);

        const [projectData, sprintData, ticketData, sprintsData] = await Promise.all([
          getProjectById(issueData.projectId),
          issueData.sprintId ? getSprintById(issueData.sprintId) : Promise.resolve(undefined),
          getTicketsByIssue(issueId),
          getSprintsByProject(issueData.projectId),
        ]);

        if (ignore) return;

        setProject(projectData ?? null);
        setSprint(sprintData ?? null);
        setTickets(ticketData);
        setSprints(sprintsData);
        setError(null);
      } catch (err) {
        if (ignore) return;
        console.error('Failed to load issue:', err);
        setError('Failed to load issue. Please try again.');
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchIssue();

    return () => {
      ignore = true;
    };
  }, [issueId]);

  const isMember = useMemo(() => {
    if (!user || !project) return false;
    return user.memberships?.some(m => m.project_id === project.id);
  }, [user, project]);

  const handleStatusChange = async (newStatus) => {
    if (!issue || updating) return;
    
    setUpdating(true);
    setUpdateError('');
    
    try {
      await updateIssue(issue.id, { status: newStatus });
      setIssue({ ...issue, status: newStatus });
      
      await updateLinkedTicketsStatus(issue.id);
    } catch (err) {
      console.error('Failed to update status:', err);
      setUpdateError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSprintChange = async (newSprintId) => {
    if (!issue || updating) return;
    
    setUpdating(true);
    setUpdateError('');
    
    try {
      const sprintId = newSprintId === 'backlog' ? null : newSprintId;
      await updateIssue(issue.id, { sprint_id: sprintId });
      setIssue({ ...issue, sprintId });
      
      if (sprintId) {
        const newSprint = await getSprintById(sprintId);
        setSprint(newSprint);
      } else {
        setSprint(null);
      }
    } catch (err) {
      console.error('Failed to update sprint:', err);
      setUpdateError('Failed to update sprint.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    if (!issue || updating) return;
    
    setUpdating(true);
    setUpdateError('');
    
    try {
      const assigneeId = newAssigneeId === 'unassigned' ? null : newAssigneeId;
      await updateIssue(issue.id, { assignee_id: assigneeId });
      setIssue({ ...issue, assigneeId });
    } catch (err) {
      console.error('Failed to update assignee:', err);
      setUpdateError('Failed to update assignee.');
    } finally {
      setUpdating(false);
    }
  };

  if (!issueId) {
    return <EmptyState title="Select an issue" description="Pick an issue from the sprint board." />;
  }

  if (loading) {
    return <p className={styles.muted}>Loading issue…</p>;
  }

  if (error) {
    return <EmptyState title="Unable to load issue" description={error} />;
  }

  if (!issue) {
    return <EmptyState title="Issue missing" description="It may have been archived." />;
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{project?.key}</p>
          <h2>{issue.title}</h2>
          <Tag tone="neutral">{statusLabels[issue.status] || issue.status.toUpperCase()}</Tag>
        </div>
      </header>

      {updateError && (
        <div className={styles.errorBox}>{updateError}</div>
      )}

      <section className={styles.section}>
        <p className={styles.description}>{issue.description || <span className={styles.muted}>No description provided</span>}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.detailsGrid}>
          {isMember ? (
            <>
              <Select
                label="Status"
                value={issue.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
              >
                <option value="queue">In queue</option>
                <option value="progress">In progress</option>
                <option value="review">Code review</option>
                <option value="done">Done</option>
              </Select>

              <Select
                label="Sprint"
                value={issue.sprintId || 'backlog'}
                onChange={(e) => handleSprintChange(e.target.value)}
                disabled={updating}
              >
                <option value="backlog">Backlog</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Assignee"
                value={issue.assigneeId || 'unassigned'}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                disabled={updating}
              >
                <option value="unassigned">Unassigned</option>
                {project?.members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <>
              <div className={styles.detailItem}>
                <span className={styles.label}>Status:</span>
                <span className={styles.value}>{statusLabels[issue.status] || issue.status.toUpperCase()}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Sprint:</span>
                <span className={styles.value}>{sprint?.name ?? 'Backlog'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Assignee:</span>
                <span className={styles.value}>
                  {project?.members?.find(m => m.id === issue.assigneeId)?.name ?? 'Unassigned'}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      <section className={styles.linkedTicketsSection}>
        <div className={styles.sectionHeader}>
          <h3>Linked tickets</h3>
          <span className={styles.muted}>{tickets.length}</span>
        </div>
        {tickets.length === 0 ? (
          <EmptyState title="No tickets linked" description="Convert a ticket from triage to see it here." />
        ) : (
          <ul className={styles.ticketList}>
            {tickets.map((ticket) => (
              <FeedbackListItem 
                key={ticket.id} 
                item={ticket} 
                projectId={ticket.projectId}
                onUpvote={() => {}}
                statusDisplayMap={STATUS_DISPLAY_MAP}
                categoryDisplayMap={CATEGORY_DISPLAY_MAP}
              />
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default IssueDetailsPage;
