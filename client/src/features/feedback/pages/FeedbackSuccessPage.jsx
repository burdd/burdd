import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './FeedbackSuccessPage.module.css';
const IconCheck = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }));
const IconClipboard = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: [_jsx("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }), _jsx("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1", ry: "1" })] }));
const FeedbackSuccessPage = () => {
    const { projectId, ticketId } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const trackingLink = `burdd.com/projects/${projectId}/feedback/${ticketId}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }, (err) => console.error('Failed to copy text: ', err));
    };
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.panel, children: [_jsx("div", { className: styles.iconWrapper, children: _jsx(IconCheck, { className: styles.icon }) }), _jsx("h1", { className: styles.title, children: "Success!" }), _jsx("p", { className: styles.subtitle, children: "Your feedback has been submitted." }), _jsxs("div", { className: styles.linkBox, children: [_jsx("p", { className: styles.linkIntro, children: "Here's your unique tracking link to check on its status:" }), _jsxs("div", { className: styles.linkActions, children: [_jsx("input", { type: "text", readOnly: true, value: trackingLink, className: styles.linkInput }), _jsx("button", { onClick: copyToClipboard, className: `${styles.copyButton} ${copied ? styles.copiedButton : ''}`, children: copied ? _jsxs(_Fragment, { children: [_jsx(IconCheck, { className: "w-5 h-5" }), " Copied!"] }) : _jsxs(_Fragment, { children: [_jsx(IconClipboard, { className: "w-5 h-5" }), " Copy Link"] }) })] })] }), _jsx("button", { onClick: () => navigate(`/projects/${projectId}/feedback`), className: styles.backButton, children: "Back to Dashboard" })] }) }));
};
export default FeedbackSuccessPage;
