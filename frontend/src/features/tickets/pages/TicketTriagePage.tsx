import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Tag from '../../../components/common/Tag/Tag';
import { useApi } from '../../../contexts/ApiContext';
import { getList } from '../../../lib/fetcher';
import type { Ticket, TicketStatus, Project } from '../../../types/api';
import styles from './TicketTriagePage.module.css';

const filterOptions: Array<TicketStatus | 'all'> = ['all', 'new', 'triaged', 'closed'];

const TicketTriagePage = () => {
  const { baseUrl } = useApi();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    Promise.all([
      getList<Ticket>(`${baseUrl}/tickets.json`),
      getList<Project>(`${baseUrl}/projects.json`),
    ])
      .then(([ticketsData, projectsData]) => {
        if (ignore) return;
        setTickets(ticketsData);
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
  }, [baseUrl]);

  const projectLookup = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((p) => map.set(p.id, p.key.toLowerCase()));
    return map;
  }, [projects]);

  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [filter, tickets]);

  const visibleTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return filteredTickets;
    return filteredTickets.filter((ticket) => {
      const haystack = `${ticket.title} ${ticket.body} ${ticket.reporter}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [filteredTickets, searchQuery]);

  const statusCounts = useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<TicketStatus, number>,
    );
  }, [tickets]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Ticket triage</p>
          <h2>Keep the queue moving</h2>
        </div>
        <div className={styles.filters}>
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={[styles.filterButton, filter === option ? styles.active : ''].join(' ')}
              onClick={() => setFilter(option)}
            >
              {option}
              {option !== 'all' && <Tag tone="info">{statusCounts[option] ?? 0}</Tag>}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.controlsRow}>
        <div className={styles.search}>
          <input
            type="search"
            aria-label="Search tickets"
            placeholder="Search tickets…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        <p className={styles.resultCount}>
          {visibleTickets.length} {visibleTickets.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {loading && <p className={styles.muted}>Loading tickets…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          {visibleTickets.length === 0 ? (
            <p className={styles.empty}>
              No tickets match “{searchQuery}”. Try a different keyword or reset your filters.
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Reporter</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleTickets.map((ticket) => {
                  const projectSlug = projectLookup.get(ticket.projectId) || 'bur';
                  const publicTicketId = "1";
                  
                  return (
                    <tr key={ticket.id}>
                      <td>
                        <p className={styles.title}>{ticket.title}</p>
                        <p className={styles.summary}>{ticket.body}</p>
                      </td>
                      <td className={styles.meta}>
                        {ticket.reporter}
                        <br />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className={styles.meta}>{ticket.category.replace('_', ' ')}</td>
                      <td>
                        <Tag tone={ticket.status === 'closed' ? 'success' : ticket.status === 'triaged' ? 'info' : 'warning'}>
                          {ticket.status}
                        </Tag>
                      </td>
                      <td>
                        {/* Link to the public detail page. 
                           NOTE: We are using the ticket.id from the triage list.
                           Make sure `public-tickets.json` has an entry with this ID! 
                        */}
                        <Link
                          to={`/${projectSlug}/feedback/${ticket.id}`} 
                          target="_blank"
                          className={styles.actionLink}
                        >
                          View Public
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
};

export default TicketTriagePage;