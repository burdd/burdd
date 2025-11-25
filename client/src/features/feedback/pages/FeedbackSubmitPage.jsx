import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTicket } from '@/api';
import styles from './FeedbackSubmitPage.module.css';
const IconArrowLeft = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }), _jsx("polyline", { points: "12 19 5 12 12 5" })] }));
const CATEGORY_DISPLAY_MAP = { 'feature_request': 'Feature Request', 'complaint': 'Issue' };
const FormInput = ({ id, label, ...props }) => (_jsxs("div", { children: [_jsx("label", { htmlFor: id, className: styles.label, children: label }), _jsx("input", { id: id, className: styles.input, ...props })] }));
const FormTextarea = ({ id, label, ...props }) => (_jsxs("div", { children: [_jsx("label", { htmlFor: id, className: styles.label, children: label }), _jsx("textarea", { id: id, className: styles.textarea, ...props })] }));
const FeedbackSubmitPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("feature_request");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [steps, setSteps] = useState("");
    const [expected, setExpected] = useState("");
    const [actual, setActual] = useState("");
    const [environment, setEnvironment] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            setError("Title and description are required.");
            return;
        }
        if (category === 'complaint' && (!steps.trim() || !expected.trim() || !actual.trim())) {
            setError("For issues, please fill in steps, expected, and actual results.");
            return;
        }
        
        setSubmitting(true);
        setError("");
        
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
        
        createTicket(projectId, ticketData)
            .then(() => {
                navigate(`/projects/${projectId}/feedback`);
            })
            .catch((err) => {
                console.error('Failed to submit ticket:', err);
                setError('Failed to submit ticket. Please try again.');
                setSubmitting(false);
            });
    };
    const attachmentPlaceholder = category === 'complaint' ? "Upload screenshot of the issue" : "Upload a concept or mockup (optional)";

    return (
    <div className={styles.container}>
      <button onClick={() => navigate(`/projects/${projectId}/feedback`)} className={styles.backLink}><IconArrowLeft className="w-4 h-4" /> Back to Dashboard</button>
      <div className={styles.panel}>
        <h1 className={styles.title}>Submit new idea</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBox}>{error}</div>}
          <div>
            <label htmlFor="category" className={styles.label}>What kind of feedback is this?</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
              <option value="feature_request">{CATEGORY_DISPLAY_MAP['feature_request']}</option>
              <option value="complaint">{CATEGORY_DISPLAY_MAP['complaint']}</option>
            </select>
          </div>
          <FormInput id="title" label="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={category === 'complaint' ? 'e.g., "Video player freezes on Android"' : 'e.g., "Add bookmarks to main nav bar"'} />
          <FormTextarea id="body" label={category === 'complaint' ? 'Please describe the issue' : 'Please describe your idea'} value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder={category === 'complaint' ? 'What are you experiencing?' : 'How would this help you?'} />
          {category === 'complaint' && (
            <div className={styles.complaintBox}>
              <h3 className={styles.complaintTitle}>Issue Details</h3>
              <FormInput id="environment" label="Environment (Optional)" type="text" value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="e.g., Chrome, iOS 17, Android 13" />
              <FormTextarea id="steps" label="Steps to Reproduce" value={steps} onChange={(e) => setSteps(e.target.value)} rows={3} placeholder="1. Go to...\n2. Click on...\n3. See error..." />
              <FormInput id="expected" label="Expected Result" type="text" value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="What did you expect to happen?" />
              <FormInput id="actual" label="Actual Result" type="text" value={actual} onChange={(e) => setActual(e.target.value)} placeholder="What actually happened?" />
            </div>
          )}
          <div>
            <label className={styles.label}>Attachments (Screenshots, etc.)</label>
            <div className={styles.attachmentBox}>
              <div className="space-y-1 text-center">
                <div className={styles.attachmentTextWrap}>
                  <label htmlFor="file-upload" className={styles.attachmentLink}><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" /></label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className={styles.attachmentHint}>{attachmentPlaceholder}</p>
              </div>
            </div>
          </div>
          <div className={styles.submitRow}><button type="submit" className={styles.submitButton} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button></div>
        </form>
      </div>
    </div>
  );
};
export default FeedbackSubmitPage;
