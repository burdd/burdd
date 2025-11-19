import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getList } from '../../../lib/fetcher';
import type { PublicTicket, ProjectContext } from '../types';
import FilterControls from '../components/FilterControls';
import FeedbackListItem from '../components/FeedbackListItem';
import styles from './FeedbackDashboardPage.module.css';

const CATEGORIES = ['All', 'feature_request', 'complaint'];
const STATUSES = ['All', 'new', 'triaged', 'closed', 'rejected'];
const SORT_OPTIONS = ['Top', 'Newest', 'Hot'];

const CATEGORY_DISPLAY_MAP = {
  'feature_request': 'Feature Request',
  'complaint': 'Issue'
};

const STATUS_DISPLAY_MAP = {
  'new': 'Under Review',
  'triaged': 'In Progress',
  'closed': 'Shipped',
  'rejected': 'Rejected'
};

const FeedbackDashboardPage = () => {
  const { project, searchTerm, baseUrl } = useOutletContext<ProjectContext>();
  const [feedbackItems, setFeedbackItems] = useState<PublicTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const [sortBy, setSortBy] = useState('Top');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getList<PublicTicket>(`${baseUrl}/public-tickets.json`)
      .then((data) => {
        if (ignore) return;
        setFeedbackItems(data);
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

  const handleUpvote = (id: string, newCount: number, newHasVoted: boolean) => {
    setFeedbackItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, upvoteCount: newCount, hasVoted: newHasVoted } : item
      )
    );
  };
  
  const filteredAndSortedItems = useMemo(() => {
    let items = [...feedbackItems];
    if (searchTerm) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.category !== 'All') {
      items = items.filter(item => item.category === filters.category);
    }
    if (filters.status !== 'All') {
      items = items.filter(item => item.status === filters.status);
    }
    if (sortBy === 'Top') {
      items.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (sortBy === 'Newest') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'Hot') {
      items.sort((a, b) => b.upvoteCount - a.upvoteCount);
    }
    return items;
  }, [feedbackItems, filters, sortBy, searchTerm]);

  return (
    <div className={styles.container}>
      <FilterControls
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoryMap={CATEGORY_DISPLAY_MAP}
        statusMap={STATUS_DISPLAY_MAP}
        categoryOptions={CATEGORIES}
        statusOptions={STATUSES}
        sortOptions={SORT_OPTIONS}
      />
      
      <div className={styles.listContainer}>
        {loading && <p className={styles.metaText}>Loading feedback...</p>}
        {error && <p className={styles.metaText}>Error: {error}</p>}
        {!loading && !error && filteredAndSortedItems.length > 0 ? (
          <ul className={styles.list}>
            {filteredAndSortedItems.map(item => (
              <FeedbackListItem
                key={item.id}
                item={item}
                projectSlug={project.slug}
                onUpvote={handleUpvote}
              />
            ))}
          </ul>
        ) : (
          !loading && <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>No feedback found</h3>
            <p className={styles.emptyText}>Try adjusting your filters or search term!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDashboardPage;