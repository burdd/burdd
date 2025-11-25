import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EmptyState from '@/common/EmptyState/EmptyState';
import { getSprintById, getIssuesBySprint, getProjects, updateIssue, updateLinkedTicketsStatus } from '@/api';
import styles from './SprintBoardPage.module.css';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const SprintBoardPage = () => {
  const { sprintId } = useParams();
  const [sprint, setSprint] = useState(null);
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sprintId) return;
    let ignore = false;
    setLoading(true);

    Promise.all([
      getSprintById(sprintId),
      getIssuesBySprint(sprintId),
      getProjects(),
    ])
      .then(([sprintData, issuesData, projectsData]) => {
        if (ignore) return;
        if (!sprintData) {
          setError('Sprint was not found.');
          return;
        }
        setSprint(sprintData);
        setIssues(issuesData);
        setProjects(projectsData);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        console.error('Failed to load sprint:', err);
        setError('Failed to load sprint. Please try again.');
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [sprintId]);

  const memberLookup = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      project.members.forEach((member) => map.set(member.id, member.name));
    });
    return map;
  }, [projects]);

  const handleStatusChange = async (issueId, newStatus, event) => {
    event.stopPropagation();
    try {
      await updateIssue(issueId, { status: newStatus });
      await updateLinkedTicketsStatus(issueId);
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));
    } catch (err) {
      console.error('Failed to update issue status:', err);
    }
  };

  if (!sprintId) {
    return <EmptyState title="No sprint selected" description="Pick a sprint from the project view." />;
  }

  if (loading) {
    return <p className={styles.muted}>Loading sprint…</p>;
  }

  if (error) {
    return <EmptyState title="Unable to load sprint" description={error} />;
  }

  if (!sprint) {
    return <EmptyState title="Missing sprint" description="Try again later." />;
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Sprint</p>
          <h2>{sprint.name}</h2>
        </div>
        <p className={styles.dateRange}>
          {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
        </p>
      </header>

      <div className={styles.issueList}>
        {issues.length === 0 ? (
          <EmptyState title="No issues in this sprint" description="Add issues to this sprint from the project backlog." />
        ) : (
          <>
            <div className={styles.headerRow}>
              <span className={styles.headerTitle}>Issue</span>
              <span className={styles.headerAssignee}>Assigned To</span>
              <div className={styles.headerCheckboxes}>
                <span>IQ</span>
                <span>IP</span>
                <span>CR</span>
                <span>D</span>
              </div>
            </div>
            {issues.map((issue) => (
              <div key={issue.id} className={styles.issueRow}>
                <Link to={`/issues/${issue.id}`} className={styles.issueTitle}>
                  {issue.title}
                </Link>
                <span className={styles.assignee}>
                  {memberLookup.get(issue.assigneeId ?? '') ?? ''}
                </span>
                <div className={styles.statusCheckboxes}>
                  <input
                    type="checkbox"
                    checked={issue.status === 'queue'}
                    onChange={(e) => handleStatusChange(issue.id, 'queue', e)}
                    className={styles.checkbox}
                  />
                  <input
                    type="checkbox"
                    checked={issue.status === 'progress'}
                    onChange={(e) => handleStatusChange(issue.id, 'progress', e)}
                    className={styles.checkbox}
                  />
                  <input
                    type="checkbox"
                    checked={issue.status === 'review'}
                    onChange={(e) => handleStatusChange(issue.id, 'review', e)}
                    className={styles.checkbox}
                  />
                  <input
                    type="checkbox"
                    checked={issue.status === 'done'}
                    onChange={(e) => handleStatusChange(issue.id, 'done', e)}
                    className={styles.checkbox}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default SprintBoardPage;
