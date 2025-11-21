import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EmptyState from '@components/common/EmptyState/EmptyState';
import Tag from '@components/common/Tag/Tag';
import { getSprintById, getIssuesBySprint, getProjects } from '@/api';
import styles from './SprintBoardPage.module.css';

const columns= ['queue', 'progress', 'review', 'done'];
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
        setError(err.message);
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

      <div className={styles.board}>
        {columns.map((status) => {
          const columnIssues = issues.filter((issue) => issue.status === status);
          return (
            <div key={status} className={styles.column}>
              <div className={styles.columnHeader}>
                <p>{status}</p>
                <Tag tone={status === 'done' ? 'success' : 'info'}>{columnIssues.length}</Tag>
              </div>
              <div className={styles.columnBody}>
                {columnIssues.length === 0 ? (
                  <p className={styles.empty}>Nothing here yet.</p>
                ) : (
                  columnIssues.map((issue) => (
                    <Link key={issue.id} to={`/issues/${issue.id}`} className={styles.card}>
                      <p className={styles.cardTitle}>{issue.title}</p>
                      <p className={styles.cardMeta}>{memberLookup.get(issue.assigneeId ?? '') ?? 'Unassigned'}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SprintBoardPage;
