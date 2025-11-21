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

  const statusBuckets = useMemo(() => issues.reduce((acc, issue) => {
        acc[issue.status] += 1;
        return acc;
    }, {
        queue: 0,
        progress: 0,
        review: 0,
        done: 0,
    }), [issues]);

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
      </header>

      <div className={styles.grid}>
        {Object.entries(statusBuckets).map(([status, count]) => (
          <div key={status} className={styles.card}>
            <p className={styles.cardLabel}>{statusLabels[status]}</p>
            <p className={styles.cardValue}>{count}</p>
          </div>
        ))}
      </div>

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
    </section>
  );
};

export default ProjectDetailsPage;
