import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmptyState from '@components/common/EmptyState/EmptyState';
import Tag from '@components/common/Tag/Tag';
import { getIssueById, getProjectById, getSprintById, getTicketsByIssue } from '@/api';
import styles from './IssueDetailsPage.module.css';

const statusToneMap = {
    queue: 'warning',
    progress: 'info',
    review: 'info',
    done: 'success',
};

const IssueDetailsPage = () => {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);
  const [sprint, setSprint] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const [projectData, sprintData, ticketData] = await Promise.all([
          getProjectById(issueData.projectId),
          issueData.sprintId ? getSprintById(issueData.sprintId) : Promise.resolve(undefined),
          getTicketsByIssue(issueId),
        ]);

        if (ignore) return;

        setProject(projectData ?? null);
        setSprint(sprintData ?? null);
        setTickets(ticketData);
        setError(null);
      } catch (err) {
        if (ignore) return;
        setError(err instanceof Error ? err.message : 'Unknown Error');
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
        </div>
        <div className={styles.tags}>
          <Tag tone={statusToneMap[issue.status]}>{issue.status}</Tag>
        </div>
      </header>

      <article className={styles.panel}>
        <h3>Description</h3>
        <p>{issue.description}</p>
      </article>

      <div className={styles.metaGrid}>
        <div className={styles.panel}>
          <h3>Project</h3>
          <p className={styles.muted}>{project?.name ?? 'Unassigned project'}</p>
        </div>
        <div className={styles.panel}>
          <h3>Sprint</h3>
          <p className={styles.muted}>{sprint?.name ?? 'Backlog'}</p>
        </div>
      </div>

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <h3>Linked tickets</h3>
          <span className={styles.muted}>{tickets.length}</span>
        </div>
        {tickets.length === 0 ? (
          <EmptyState title="No tickets linked" description="Convert a ticket from triage to see it here." />
        ) : (
          <ul className={styles.ticketList}>
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <p className={styles.ticketTitle}>{ticket.title}</p>
                <p className={styles.muted}>{ticket.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default IssueDetailsPage;
