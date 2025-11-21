import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketById, createTicketComment } from '@/api';
import { useAuth } from '@contexts/AuthContext';
import { formatTimeAgo } from '../utils/time';
import UpvoteButton from '../components/UpvoteButton';
import CommentThread from '../components/CommentThread';
import Tag from '../../../components/common/Tag/Tag';
import styles from './FeedbackDetailPage.module.css';
const IconArrowLeft = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }), _jsx("polyline", { points: "12 19 5 12 12 5" })] }));
const IconShare = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }), _jsx("polyline", { points: "16 6 12 2 8 6" }), _jsx("line", { x1: "12", y1: "2", x2: "12", y2: "15" })] }));
const IconCheck = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }));
const IconCalendar = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }), _jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), _jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), _jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })] }));
const CATEGORY_DISPLAY_MAP = { 'feature_request': 'Feature Request', 'complaint': 'Issue' };
const STATUS_DISPLAY_MAP = { 'new': 'Under Review', 'triaged': 'In Progress', 'closed': 'Shipped', 'rejected': 'Rejected' };
const statusToneMap = { 'new': 'warning', 'triaged': 'info', 'closed': 'success', 'rejected': 'danger' };
const FeedbackDetailPage = () => {
    const { ticketId, projectId } = useParams();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!ticketId)
            return;
        let ignore = false;
        setLoading(true);
        getTicketById(ticketId)
            .then((data) => {
            if (ignore)
                return;
            if (data)
                setItem(data);
            else
                setError('Ticket not found.');
        })
            .catch((err) => {
            if (ignore)
                return;
            setError(err.message);
        })
            .finally(() => {
            if (ignore)
                return;
            setLoading(false);
        });
        return () => { ignore = true; };
    }, [ticketId]);
    const trackingLink = `burdd.com/projects/${projectId}/feedback/${item?.id}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }, (err) => console.error('Failed to copy text: ', err));
    };
    const handleUpvote = useCallback((id, newCount, newHasVoted) => {
        setItem(currentItem => currentItem ? { ...currentItem, upvoteCount: newCount, hasVoted: newHasVoted } : null);
    }, []);
    const handleAddComment = useCallback((commentBody) => {
        if (!ticketId || !user) return;
        
        createTicketComment(ticketId, commentBody)
            .then((response) => {
                const newComment = {
                    id: response.comment.id,
                    user: { 
                        handle: user.handle, 
                        avatarUrl: user.avatarUrl 
                    },
                    body: commentBody,
                    createdAt: response.comment.created_at
                };
                setItem(currentItem => currentItem ? { ...currentItem, comments: [...currentItem.comments, newComment] } : null);
            })
            .catch((err) => {
                console.error('Failed to add comment:', err);
            });
    }, [ticketId, user]);
    if (loading)
        return _jsx("p", { className: styles.metaText, children: "Loading ticket..." });
    if (error)
        return _jsxs("p", { className: styles.metaText, children: ["Error: ", error] });
    if (!item)
        return _jsx("p", { className: styles.metaText, children: "Ticket not found." });
    return (
    <div className={styles.container}>
      <Link to={`/projects/${projectId}/feedback`} className={styles.backLink}><IconArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{item.title}</h1>
            <div className={styles.metaGrid}>
              <Tag tone={statusToneMap[item.status] || 'neutral'}>{STATUS_DISPLAY_MAP[item.status] || item.status}</Tag>
              <Tag tone="neutral">{CATEGORY_DISPLAY_MAP[item.category] || item.category}</Tag>
              <span className={styles.metaItem}><IconCalendar className="w-4 h-4" /> Submitted {formatTimeAgo(item.createdAt)} by {item.user.handle}</span>
            </div>
          </div>
          <div className={styles.actions}>
            <button onClick={copyToClipboard} className={`${styles.actionButton} ${copied ? styles.copiedButton : ''}`}>
              {copied ? <IconCheck className="w-5 h-5" /> : <IconShare className="w-5 h-5" />}
            </button>
            <UpvoteButton initialUpvoteCount={item.upvoteCount} initialHasVoted={item.hasVoted} onUpvote={handleUpvote} id={item.id} size="lg" />
          </div>
        </div>
        <p className={styles.body}>{item.body}</p>
        {item.category === 'complaint' && (
          <div className={styles.complaintDetails}>
            {item.environment && <div><strong>Environment:</strong> <span>{item.environment}</span></div>}
            {item.steps && <div><strong>Steps to Reproduce:</strong> <pre>{item.steps}</pre></div>}
            {item.expected && <div><strong>Expected Result:</strong> <span>{item.expected}</span></div>}
            {item.actual && <div><strong>Actual Result:</strong> <span>{item.actual}</span></div>}
          </div>
        )}
        <CommentThread comments={item.comments} onAddComment={handleAddComment} />
      </div>
    </div>
  );
};
export default FeedbackDetailPage;
