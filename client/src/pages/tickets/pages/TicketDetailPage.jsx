import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTicketById, createTicketComment, getIssuesByProject, createIssue, linkIssueToTicket, updateTicket, updateTicketStatusBasedOnIssues } from '@/api';
import { useAuth } from '@contexts/AuthContext';
import { formatTimeAgo } from '../utils/time';
import UpvoteButton from '../components/UpvoteButton';
import CommentThread from '../components/CommentThread';
import Tag from '@/common/Tag/Tag';
import Select from '@/common/Select/Select';
import IssueListItem from '../../issues/components/IssueListItem';
import styles from './TicketDetailPage.module.css';
const IconArrowLeft = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }), _jsx("polyline", { points: "12 19 5 12 12 5" })] }));
const IconCalendar = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }), _jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), _jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), _jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })] }));
const CATEGORY_DISPLAY_MAP = { 'feature_request': 'Feature Request', 'complaint': 'Issue' };
const STATUS_DISPLAY_MAP = { 'new': 'NEW', 'triaged': 'TRIAGED', 'closed': 'CLOSED', 'rejected': 'REJECTED' };
const TicketDetailPage = () => {
    const { ticketId, projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLinkIssue, setShowLinkIssue] = useState(false);
    const [showCreateIssue, setShowCreateIssue] = useState(false);
    const [projectIssues, setProjectIssues] = useState([]);
    const [selectedIssueId, setSelectedIssueId] = useState('');
    const [linkingIssue, setLinkingIssue] = useState(false);
    const [creatingIssue, setCreatingIssue] = useState(false);
    const [newIssueTitle, setNewIssueTitle] = useState('');
    const [newIssueDescription, setNewIssueDescription] = useState('');
    
    const isProjectMember = user?.memberships?.some(m => m.project_id === projectId) || false;
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
            console.error('Failed to load ticket:', err);
            setError('Failed to load ticket. Please try again.');
        })
            .finally(() => {
            if (ignore)
                return;
            setLoading(false);
        });
        return () => { ignore = true; };
    }, [ticketId]);
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
    
    const handleCreateIssue = useCallback(() => {
        if (!projectId || !newIssueTitle.trim()) {
            alert('Please enter an issue title');
            return;
        }
        
        const issueData = {
            title: newIssueTitle,
            description: newIssueDescription,
        };
        
        setCreatingIssue(true);
        createIssue(projectId, issueData)
            .then((response) => {
                if (response?.issue?.id) {
                    return linkIssueToTicket(ticketId, response.issue.id)
                        .then(() => {
                            return updateTicketStatusBasedOnIssues(ticketId);
                        })
                        .then(() => {
                            navigate(`/issues/${response.issue.id}`);
                        });
                } else {
                    throw new Error('Invalid response from createIssue');
                }
            })
            .catch((err) => {
                console.error('Failed to create issue:', err);
                alert('Failed to create issue. Please try again.');
            })
            .finally(() => {
                setCreatingIssue(false);
            });
    }, [projectId, newIssueTitle, newIssueDescription, ticketId, navigate]);
    
    const handleShowLinkIssue = useCallback(() => {
        if (!projectId) return;
        
        setShowLinkIssue(true);
        getIssuesByProject(projectId)
            .then((issues) => {
                const linkedIssueIds = new Set(item?.relatedIssues?.map(i => i.id) || []);
                const availableIssues = issues.filter(issue => !linkedIssueIds.has(issue.id));
                setProjectIssues(availableIssues);
            })
            .catch((err) => {
                console.error('Failed to load issues:', err);
            });
    }, [projectId, item?.relatedIssues]);
    
    const handleLinkToExistingIssue = useCallback(() => {
        if (!selectedIssueId || !ticketId) return;
        
        setLinkingIssue(true);
        linkIssueToTicket(ticketId, selectedIssueId)
            .then(() => {
                return updateTicketStatusBasedOnIssues(ticketId);
            })
            .then(() => {
                return getTicketById(ticketId);
            })
            .then((data) => {
                if (data) setItem(data);
                setShowLinkIssue(false);
                setSelectedIssueId('');
            })
            .catch((err) => {
                console.error('Failed to link issue:', err);
                alert('Failed to link issue. Please try again.');
            })
            .finally(() => {
                setLinkingIssue(false);
            });
    }, [selectedIssueId, ticketId]);
    
    const handleRejectTicket = useCallback(() => {
        if (!ticketId || !item) return;
        
        if (item.status === 'rejected') {
            updateTicket(ticketId, { status: 'new' })
                .then(() => {
                    return updateTicketStatusBasedOnIssues(ticketId);
                })
                .then(() => {
                    return getTicketById(ticketId);
                })
                .then((data) => {
                    if (data) setItem(data);
                })
                .catch((err) => {
                    console.error('Failed to update ticket status:', err);
                    alert('Failed to update ticket status. Please try again.');
                });
        } else {
            updateTicket(ticketId, { status: 'rejected' })
                .then(() => {
                    return getTicketById(ticketId);
                })
                .then((data) => {
                    if (data) setItem(data);
                })
                .catch((err) => {
                    console.error('Failed to update ticket status:', err);
                    alert('Failed to update ticket status. Please try again.');
                });
        }
    }, [ticketId, item]);
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
              <Tag tone="neutral">{STATUS_DISPLAY_MAP[item.status] || item.status}</Tag>
              <Tag tone="neutral">{CATEGORY_DISPLAY_MAP[item.category] || item.category}</Tag>
              <span className={styles.metaItem}><IconCalendar className="w-4 h-4" /> Submitted {formatTimeAgo(item.createdAt)} by {item.user.handle}</span>
            </div>
          </div>
          <div className={styles.actions}>
            <UpvoteButton key={item.id} initialUpvoteCount={item.upvoteCount || 0} initialHasVoted={item.hasVoted || false} onUpvote={handleUpvote} id={item.id} size="lg" />
          </div>
        </div>
        <p className={styles.body}>{item.body}</p>
        
        {isProjectMember && (
          <div className={styles.linkedIssuesSection}>
            <h3>Linked Issues</h3>
            {item.relatedIssues && item.relatedIssues.length > 0 && (
              <div className={styles.linkedIssuesList}>
                {item.relatedIssues.map((issue) => (
                  <IssueListItem 
                    key={issue.id} 
                    issue={issue}
                    showDescription={true}
                  />
                ))}
              </div>
            )}
            
            <div className={styles.memberActions}>
              <button onClick={() => setShowCreateIssue(true)} className={styles.actionBtn}>Create Issue for Ticket</button>
              <button onClick={handleShowLinkIssue} className={styles.actionBtn}>Link to Existing Issue</button>
              <button onClick={handleRejectTicket} className={styles.actionBtn}>
                {item.status === 'rejected' ? 'Undo Reject' : 'Reject Ticket'}
              </button>
            </div>
            
            {showCreateIssue && (
              <div className={styles.linkIssuePanel}>
                <h4>Create New Issue</h4>
                <div className={styles.formGroup}>
                  <label htmlFor="issueTitle" className={styles.formLabel}>Title*</label>
                  <input
                    id="issueTitle"
                    type="text"
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.target.value)}
                    className={styles.formInput}
                    placeholder="Enter issue title"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="issueDescription" className={styles.formLabel}>Description</label>
                  <textarea
                    id="issueDescription"
                    value={newIssueDescription}
                    onChange={(e) => setNewIssueDescription(e.target.value)}
                    className={styles.formTextarea}
                    placeholder="Enter issue description (optional)"
                    rows={4}
                  />
                </div>
                <div className={styles.linkActions}>
                  <button 
                    onClick={handleCreateIssue} 
                    disabled={!newIssueTitle.trim() || creatingIssue}
                    className={styles.primaryBtn}
                  >
                    {creatingIssue ? 'Creating...' : 'Create Issue'}
                  </button>
                  <button onClick={() => {
                    setShowCreateIssue(false);
                    setNewIssueTitle('');
                    setNewIssueDescription('');
                  }} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            )}
            
            {showLinkIssue && (
              <div className={styles.linkIssuePanel}>
                <h4>Link to Existing Issue</h4>
                <Select
                  value={selectedIssueId}
                  onChange={(e) => setSelectedIssueId(e.target.value)}
                >
                  <option value="">Select an issue...</option>
                  {projectIssues.map((issue) => (
                    <option key={issue.id} value={issue.id}>{issue.title}</option>
                  ))}
                </Select>
                <div className={styles.linkActions}>
                  <button 
                    onClick={handleLinkToExistingIssue} 
                    disabled={!selectedIssueId || linkingIssue}
                    className={styles.primaryBtn}
                  >
                    {linkingIssue ? 'Linking...' : 'Link Issue'}
                  </button>
                  <button onClick={() => setShowLinkIssue(false)} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
        
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
export default TicketDetailPage;
