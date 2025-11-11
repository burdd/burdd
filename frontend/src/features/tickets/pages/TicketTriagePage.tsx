import { useEffect, useMemo, useState } from 'react';
import Tag from '@components/common/Tag/Tag';
import { useApi } from '@contexts/ApiContext';
import { getList } from '@lib/fetcher';
import type { Ticket, TicketStatus } from '@/types/api';
import styles from './TicketTriagePage.module.css';

const filterOptions: Array<TicketStatus | 'all'> = ['all', 'new', 'triaged', 'closed'];

const TicketTriagePage = () => {
  const { baseUrl } = useApi();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    getList<Ticket>(`${baseUrl}/tickets.json`)
      .then((data) => {
        if (ignore) return;
        setTickets(data);
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

  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [filter, tickets]);

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

      {loading && <p className={styles.muted}>Loading tickets…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <ul className={styles.list}>
          {filteredTickets.map((ticket) => (
            <li key={ticket.id} className={styles.card}>
              <div>
                <p className={styles.title}>{ticket.title}</p>
                <p className={styles.meta}>
                  {ticket.reporter} · {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
                <p className={styles.summary}>{ticket.summary}</p>
              </div>
              <Tag tone={ticket.status === 'closed' ? 'success' : ticket.status === 'triaged' ? 'info' : 'warning'}>
                {ticket.status}
              </Tag>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TicketTriagePage;
