import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketsByProject, createTicket } from '@/api';
import Select from '@components/common/Select/Select';
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
    'new': 'NEW',
    'triaged': 'TRIAGED',
    'closed': 'CLOSED',
    'rejected': 'REJECTED'
};
const FeedbackDashboardPage = () => {
    const { projectId } = useParams();
    const [feedbackItems, setFeedbackItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ category: 'All', status: 'All' });
    const [sortBy, setSortBy] = useState('Top');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('feature_request');
    const [steps, setSteps] = useState('');
    const [expected, setExpected] = useState('');
    const [actual, setActual] = useState('');
    const [environment, setEnvironment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    useEffect(() => {
        if (!projectId) return;
        let ignore = false;
        setLoading(true);
        getTicketsByProject(projectId)
            .then((data) => {
            if (ignore)
                return;
            setFeedbackItems(data);
            setError(null);
        })
            .catch((err) => {
            if (ignore)
                return;
            console.error('Failed to load feedback:', err);
            setError('Failed to load feedback. Please try again.');
        })
            .finally(() => {
            if (ignore)
                return;
            setLoading(false);
        });
        return () => {
            ignore = true;
        };
    }, [projectId]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            setSubmitError('Title and description are required.');
            return;
        }
        if (category === 'complaint' && (!steps.trim() || !expected.trim() || !actual.trim())) {
            setSubmitError('For issues, please fill in steps, expected, and actual results.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        const ticketData = {
            title,
            body,
            category,
            ...(category === 'complaint' && {
                steps,
                expected,
                actual,
                environment: environment || null
            })
        };
        try {
            const response = await createTicket(projectId, ticketData);
            setFeedbackItems([response.ticket, ...feedbackItems]);
            setShowModal(false);
            setTitle('');
            setBody('');
            setCategory('feature_request');
            setSteps('');
            setExpected('');
            setActual('');
            setEnvironment('');
        } catch (err) {
            console.error('Failed to submit ticket:', err);
            setSubmitError('Failed to submit ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };
    const handleUpvote = (id, newCount, newHasVoted) => {
        setFeedbackItems(currentItems => currentItems.map(item => item.id === id ? { ...item, upvoteCount: newCount, hasVoted: newHasVoted } : item));
    };
    const filteredAndSortedItems = useMemo(() => {
        let items = [...feedbackItems];
        if (searchTerm) {
            items = items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.body.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filters.category !== 'All') {
            items = items.filter(item => item.category === filters.category);
        }
        if (filters.status !== 'All') {
            items = items.filter(item => item.status === filters.status);
        }
        if (sortBy === 'Top') {
            items.sort((a, b) => b.upvoteCount - a.upvoteCount);
        }
        else if (sortBy === 'Newest') {
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        else if (sortBy === 'Hot') {
            items.sort((a, b) => b.upvoteCount - a.upvoteCount);
        }
        return items;
    }, [feedbackItems, filters, sortBy, searchTerm]);
    return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Tickets</h2>
        <div className={styles.headerActions}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            placeholder="Search tickets..."
          />
          <button onClick={() => setShowModal(true)} className={styles.submitButton}>
            Submit Feedback
          </button>
        </div>
      </div>
      
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
      
      <div>
        {loading && <p className={styles.metaText}>Loading feedback...</p>}
        {error && <p className={styles.metaText}>Error: {error}</p>}
        {!loading && !error && filteredAndSortedItems.length > 0 ? (
          <ul className={styles.list}>
            {filteredAndSortedItems.map(item => (
              <FeedbackListItem
                key={item.id}
                item={item}
                projectId={projectId}
                onUpvote={handleUpvote}
                statusDisplayMap={STATUS_DISPLAY_MAP}
                categoryDisplayMap={CATEGORY_DISPLAY_MAP}
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

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Submit new feedback</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              {submitError && <div className={styles.errorBox}>{submitError}</div>}
              
              <Select
                label="What kind of feedback is this?"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
              >
                <option value="feature_request">{CATEGORY_DISPLAY_MAP['feature_request']}</option>
                <option value="complaint">{CATEGORY_DISPLAY_MAP['complaint']}</option>
              </Select>
              
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Title*
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  placeholder={category === 'complaint' ? 'e.g., "Video player freezes on Android"' : 'e.g., "Add bookmarks to main nav bar"'}
                  disabled={submitting}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="body" className={styles.label}>
                  {category === 'complaint' ? 'Please describe the issue' : 'Please describe your idea'}*
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={styles.textarea}
                  rows={4}
                  placeholder={category === 'complaint' ? 'What are you experiencing?' : 'How would this help you?'}
                  disabled={submitting}
                />
              </div>
              
              {category === 'complaint' && (
                <div className={styles.complaintBox}>
                  <h4 className={styles.complaintTitle}>Issue Details</h4>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="environment" className={styles.label}>
                      Environment (Optional)
                    </label>
                    <input
                      id="environment"
                      type="text"
                      value={environment}
                      onChange={(e) => setEnvironment(e.target.value)}
                      className={styles.input}
                      placeholder="e.g., Chrome, iOS 17, Android 13"
                      disabled={submitting}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="steps" className={styles.label}>
                      Steps to Reproduce*
                    </label>
                    <textarea
                      id="steps"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      placeholder="1. Go to...\n2. Click on...\n3. See error..."
                      disabled={submitting}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="expected" className={styles.label}>
                      Expected Result*
                    </label>
                    <input
                      id="expected"
                      type="text"
                      value={expected}
                      onChange={(e) => setExpected(e.target.value)}
                      className={styles.input}
                      placeholder="What did you expect to happen?"
                      disabled={submitting}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="actual" className={styles.label}>
                      Actual Result*
                    </label>
                    <input
                      id="actual"
                      type="text"
                      value={actual}
                      onChange={(e) => setActual(e.target.value)}
                      className={styles.input}
                      placeholder="What actually happened?"
                      disabled={submitting}
                    />
                  </div>
                </div>
              )}
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSubmitError('');
                  }}
                  className={styles.cancelButton}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={submitting || !title.trim() || !body.trim()}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default FeedbackDashboardPage;
