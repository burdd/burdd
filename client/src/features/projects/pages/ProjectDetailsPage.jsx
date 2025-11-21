import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '@components/common/EmptyState/EmptyState';
import Tag from '@components/common/Tag/Tag';
import { getProjectById, getSprintsByProject, getIssuesByProject } from '@/api';
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
  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <Link to={`/projects/${projectId}/feedback`} className={styles.viewTicketsLink}>
          View Tickets
        </Link>
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
          <p className={styles.muted}>Most recent first</p>
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
          <p className={styles.muted}>{backlogIssues.length} issues not in any sprint</p>
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
    </section>
  );
};

export default ProjectDetailsPage;
