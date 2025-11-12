import React, { useState, useMemo, useCallback } from 'react';

// --- ICONS ---
// Simple inline SVG components for icons.

const IconMessageSquare = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconChevronUp = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const IconPlus = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconArrowLeft = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const IconClipboard = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const IconCheck = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconShare = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);


// --- MOCK DATA ---
// Added 'createdAt' and 'sprint' (with 'endDate')
const mockFeedbackData = [
  {
    id: '1',
    title: 'Bring back chronological timeline by default',
    body: "I don't want the 'For You' algorithmic feed. Please make the 'Following' (chronological) timeline the default tab, or at least remember my choice.",
    category: 'suggestion',
    status: 'new',
    upvoteCount: 128,
    hasVoted: false,
    importanceCounts: { 'NOT IMPORTANT': 1, 'NICE-TO-HAVE': 5, 'IMPORTANT': 78, 'CRITICAL': 44 },
    myImportanceVote: 'IMPORTANT',
    createdAt: "2025-11-08T14:30:00Z", // 3 days ago
    sprint: null,
    comments: [
      { id: 'c1', user: { handle: 'User123', avatar_url: 'https://placehold.co/40x40/6366F1/FFFFFF?text=U' }, body: 'This!! 100% this.' },
      { id: 'c2', user: { handle: 'TimelineFan', avatar_url: 'https://placehold.co/40x40/EC4899/FFFFFF?text=T' }, body: 'The app always opening on "For You" is the most annoying thing.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Chronological+Feed'
  },
  {
    id: '2',
    title: 'Edit Button for Tweets',
    body: "We've been asking for this for years. We need a simple edit button to fix typos after posting, maybe with a 5-minute window. This should be for everyone, not just subscribers.",
    category: 'feature_request',
    status: 'closed',
    upvoteCount: 256,
    hasVoted: true,
    importanceCounts: { 'NOT IMPORTANT': 0, 'NICE-TO-HAVE': 12, 'IMPORTANT': 98, 'CRITICAL': 146 },
    myImportanceVote: 'CRITICAL',
    createdAt: "2025-09-15T10:00:00Z",
    sprint: { id: 'sprint-10', endDate: "2025-09-30T17:00:00Z" },
    comments: [
      { id: 'c3', user: { handle: 'Admin', avatar_url: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=A' }, body: 'This is now available for Twitter Blue subscribers!' },
      { id: 'c4', user: { handle: 'TypoQueen', avatar_url: 'https://placehold.co/40x40/10B981/FFFFFF?text=T' }, body: 'Finally! But it should be free.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Edit+Button'
  },
  {
    id: '3',
    title: 'Video player is buggy on Android',
    body: 'The video player often freezes, fails to load, or the audio goes out of sync. This happens constantly on my Samsung Galaxy S23. It makes watching videos impossible.',
    category: 'complaint',
    status: 'triaged',
    upvoteCount: 76,
    hasVoted: false,
    importanceCounts: { 'NOT IMPORTANT': 0, 'NICE-TO-HAVE': 2, 'IMPORTANT': 45, 'CRITICAL': 29 },
    myImportanceVote: null,
    createdAt: "2025-11-01T09:12:00Z", // 10 days ago
    sprint: { id: 'sprint-12', endDate: "2025-11-20T17:00:00Z" },
    comments: [
      { id: 'c5', user: { handle: 'AndroidUser', avatar_url: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=A' }, body: 'Same here, Pixel 7. Videos are almost unwatchable.' },
      { id: 'c6', user: { handle: 'DevTeam', avatar_url: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=D' }, body: 'Thanks for the report, we are actively investigating this.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Video+Bug'
  },
  {
    id: '4',
    title: 'Better spam and bot detection in replies',
    body: "My replies are flooded with crypto scams and spam bots. The current 'hide reply' and 'block' tools aren't enough. We need more aggressive, proactive filtering.",
    category: 'feature_request',
    status: 'triaged',
    upvoteCount: 215,
    hasVoted: false,
    importanceCounts: { 'NOT IMPORTANT': 0, 'NICE-TO-HAVE': 1, 'IMPORTANT': 55, 'CRITICAL': 159 },
    myImportanceVote: 'CRITICAL',
    createdAt: "2025-10-20T11:00:00Z",
    sprint: { id: 'sprint-12', endDate: "2025-11-20T17:00:00Z" },
    comments: [
      { id: 'c7', user: { handle: 'CryptoHater', avatar_url: 'https://placehold.co/40x40/EF4444/FFFFFF?text=C' }, body: 'This is the biggest problem on the platform right now.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Spam+Bots'
  },
  {
    id: '5',
    title: "Add 'Bookmarks' to the main navigation bar",
    body: "Bookmarks are so useful but they're hidden in the profile menu. Please add a 'Bookmarks' icon to the main bottom navigation bar for quick access.",
    category: 'suggestion',
    status: 'new',
    upvoteCount: 98,
    hasVoted: false,
    importanceCounts: { 'NOT IMPORTANT': 2, 'NICE-TO-HAVE': 70, 'IMPORTANT': 26, 'CRITICAL': 0 },
    myImportanceVote: 'NICE-TO-HAVE',
    createdAt: "2025-11-10T18:00:00Z", // 1 day ago
    sprint: null,
    comments: [
      { id: 'c8', user: { handle: 'PowerUser', avatar_url: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=P' }, body: 'I bookmark things all the time and forget they exist because they are so hard to find.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Bookmarks'
  },
  {
    id: '6',
    title: 'Increase character limit for all users',
    body: 'The 280-character limit feels outdated. It would be great to have at least 500 characters for everyone, not just Blue subscribers, to allow for more nuanced conversations.',
    category: 'suggestion',
    status: 'rejected',
    upvoteCount: 42,
    hasVoted: false,
    importanceCounts: { 'NOT IMPORTANT': 20, 'NICE-TO-HAVE': 15, 'IMPORTANT': 5, 'CRITICAL': 2 },
    myImportanceVote: null,
    createdAt: "2025-10-05T00:00:00Z",
    sprint: null,
    comments: [
        { id: 'c9', user: { handle: 'Admin', avatar_url: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=A' }, body: "We appreciate the feedback, but we've decided to keep the 280-character limit for now to maintain brevity." },
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Character+Limit'
  },
  {
    id: '7',
    title: 'Need an edit button',
    body: 'How do we still not have an edit button?',
    category: 'feature_request',
    status: 'duplicate',
    upvoteCount: 15,
    hasVoted: false,
    importanceCounts: { 'NOT IMPORTANT': 0, 'NICE-TO-HAVE': 1, 'IMPORTANT': 5, 'CRITICAL': 9 },
    myImportanceVote: null,
    createdAt: "2025-09-16T00:00:00Z",
    sprint: null,
    comments: [
        { id: 'c10', user: { handle: 'Admin', avatar_url: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=A' }, body: "This is a duplicate of an existing request. Please see [ticket #2] for updates." },
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Duplicate'
  },
];

// --- CONSTANTS ---
const CATEGORIES = ['All', 'feature_request', 'suggestion', 'complaint'];
const STATUSES = ['All', 'new', 'triaged', 'closed', 'rejected', 'duplicate'];
const SORT_OPTIONS = ['Top', 'Newest', 'Hot'];
const IMPORTANCE_LEVELS = ['NOT IMPORTANT', 'NICE-TO-HAVE', 'IMPORTANT', 'CRITICAL'];

// Mock current time for "time ago" consistency
const MOCK_CURRENT_TIME = new Date("2025-11-11T23:39:00Z");


// --- MAPS ---
const CATEGORY_DISPLAY_MAP = {
  'feature_request': 'Feature Request',
  'suggestion': 'Suggestion',
  'complaint': 'Issue'
};

const STATUS_DISPLAY_MAP = {
  'new': 'Under Review',
  'triaged': 'In Progress',
  'closed': 'Shipped',
  'rejected': 'Rejected',
  'duplicate': 'Duplicate'
};

// --- HELPER FUNCTIONS ---

/**
 * Formats an ISO date string into a "time ago" format.
 * @param {string} dateString - The ISO 8601 date string.
 * @returns {string} A relative time string (e.g., "3 days ago").
 */
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((MOCK_CURRENT_TIME - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

/**
 * Formats an ISO date string into a readable date.
 * @param {string} dateString - The ISO 8601 date string.
 * @returns {string} A formatted date (e.g., "November 20, 2025").
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


// --- REUSABLE COMPONENTS ---

/**
 * UpvoteButton Component
 */
const UpvoteButton = ({ initialUpvoteCount, initialHasVoted, onUpvote, id, size = 'md' }) => {
  const [upvoted, setUpvoted] = useState(initialHasVoted);
  const [count, setCount] = useState(initialUpvoteCount);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent card click
    const newUpvoted = !upvoted;
    const newCount = newUpvoted ? count + 1 : count - 1;
    
    setUpvoted(newUpvoted);
    setCount(newCount);
    onUpvote(id, newCount, newUpvoted);
  };

  const baseStyles = "flex items-center gap-1.5 transition-colors rounded-lg border";
  const sizeStyles = {
    md: "px-3 py-1.5",
    lg: "flex-col px-4 py-2"
  };
  
  const activeStyles = "bg-blue-500 border-blue-400 text-white";
  const inactiveStyles = "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600";

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles[size]} ${upvoted ? activeStyles : inactiveStyles}`}
    >
      <IconChevronUp className={`w-4 h-4 ${upvoted ? 'text-white' : 'text-gray-400'}`} />
      <span className="font-semibold text-sm">{count}</span>
    </button>
  );
};

/**
 * StatusBadge Component
 */
const StatusBadge = ({ status }) => {
  const styles = {
    'new': 'bg-yellow-900/50 text-yellow-300',
    'triaged': 'bg-blue-900/50 text-blue-300',
    'closed': 'bg-green-900/50 text-green-300',
    'rejected': 'bg-red-900/50 text-red-300',
    'duplicate': 'bg-gray-700 text-gray-400'
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-700 text-gray-300'}`}
    >
      {STATUS_DISPLAY_MAP[status] || status}
    </span>
  );
};

/**
 * CategoryTag Component
 */
const CategoryTag = ({ category }) => {
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
      {CATEGORY_DISPLAY_MAP[category] || category}
    </span>
  );
};

/**
 * Comment Component
 */
const Comment = ({ comment }) => (
  <div className="flex gap-3 py-4 border-b border-gray-700">
    <img
      src={comment.user.avatar_url}
      alt={comment.user.handle}
      className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"
      onError={(e) => { e.target.src = 'https://placehold.co/40x40/71717A/FFFFFF?text=?'; }}
    />
    <div>
      <h4 className="font-semibold text-gray-100">{comment.user.handle}</h4>
      <p className="text-gray-300 mt-1">{comment.body}</p>
    </div>
  </div>
);

/**
 * FilterPills Component
 */
const FilterPills = ({ options, selected, onSelect, title, displayMap = {} }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-400 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            selected === option
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
          }`}
        >
          {displayMap[option] || option}
        </button>
      ))}
    </div>
  </div>
);

/**
 * ImportanceSelector Component
 */
const ImportanceSelector = ({ selected, onSelect }) => {
  const getStyle = (level) => {
    const isActive = selected === level;
    if (isActive) {
      return 'bg-blue-500 text-white border-blue-400';
    }
    return 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {IMPORTANCE_LEVELS.map((level) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${getStyle(level)}`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};


// --- PAGE COMPONENTS ---

/**
 * FeedbackDashboard Component
 */
const FeedbackDashboard = ({
  feedbackItems,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  onCardClick,
  onUpvote
}) => {
  // Apply filters and sorting
  const filteredAndSortedItems = useMemo(() => {
    let items = [...feedbackItems];

    if (filters.category !== 'All') {
      items = items.filter(item => item.category === filters.category);
    }
    if (filters.status !== 'All') {
      items = items.filter(item => item.status === filters.status);
    }
    if (sortBy === 'Top') {
      items.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (sortBy === 'Newest') {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by new createdAt
    } else if (sortBy === 'Hot') {
      items.sort((a, b) => b.upvoteCount - a.upvoteCount);
    }
    
    return items;
  }, [feedbackItems, filters, sortBy]);
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* --- Filter/Sort Controls --- */}
      <div className="p-6 bg-gray-800 rounded-2xl shadow-sm border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FilterPills
          title="Category"
          options={CATEGORIES}
          selected={filters.category}
          onSelect={(cat) => setFilters(f => ({ ...f, category: cat }))}
          displayMap={{ ...CATEGORY_DISPLAY_MAP, 'All': 'All' }}
        />
        <FilterPills
          title="Status"
          options={STATUSES}
          selected={filters.status}
          onSelect={(stat) => setFilters(f => ({ ...f, status: stat }))}
          displayMap={{ ...STATUS_DISPLAY_MAP, 'All': 'All' }}
        />
        <div className="md:col-span-2">
          <FilterPills
            title="Sort By"
            options={SORT_OPTIONS}
            selected={sortBy}
            onSelect={setSortBy}
          />
        </div>
      </div>
      
      {/* --- Feedback List --- */}
      {filteredAndSortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItems.map(item => (
            <FeedbackCard
              key={item.id}
              item={item}
              onClick={() => onCardClick(item.id)}
              onUpvote={onUpvote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-800 rounded-2xl shadow-sm border border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100">No feedback found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your filters or submit a new idea!</p>
        </div>
      )}
    </div>
  );
};

/**
 * FeedbackCard Component
 */
const FeedbackCard = ({ item, onClick, onUpvote }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden cursor-pointer transition-all hover:bg-gray-700"
    >
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        className="w-full h-48 object-cover bg-gray-700"
        onError={(e) => { e.target.src = 'https://placehold.co/600x400/E2E8F0/4A5568?text=Image+Error'; }}
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-100 truncate mb-2">{item.title}</h3>
        
        <div className="flex items-center justify-between">
          <UpvoteButton 
            initialUpvoteCount={item.upvoteCount}
            initialHasVoted={item.hasVoted}
            onUpvote={onUpvote} 
            id={item.id} 
          />
          
          <div className="flex items-center gap-2 text-gray-400">
            <IconMessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{item.comments.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
          <CategoryTag category={item.category} />
          <StatusBadge status={item.status} />
        </div>
      </div>
    </div>
  );
};

/**
 * FeedbackDetailPage Component
 */
const FeedbackDetailPage = ({ item, onUpvote, onAddComment, onImportanceVote, onBack, project }) => {
  const [newComment, setNewComment] = useState("");
  const [copied, setCopied] = useState(false);

  const trackingLink = `burdd.com/${project.slug}/feedback/${item.id}`;

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = trackingLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };
  
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(item.id, newComment);
      setNewComment("");
    }
  };
  
  if (!item) return <div className="text-center py-10">Item not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 mb-6"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-64 object-cover bg-gray-700"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/E2E8F0/4A5568?text=Image+Error'; }}
        />
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{item.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <CategoryTag category={item.category} />
                <StatusBadge status={item.status} />
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <IconCalendar className="w-4 h-4" />
                  Submitted {formatTimeAgo(item.createdAt)}
                </span>
                {/* --- Estimated Release Date --- */}
                {item.status === 'triaged' && item.sprint && (
                   <span className="flex items-center gap-1.5 text-sm text-blue-400 font-medium">
                    <IconCalendar className="w-4 h-4" />
                    Estimated Release: {formatDate(item.sprint.endDate)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex-shrink-0 p-2.5 font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                }`}
              >
                {copied ? <IconCheck className="w-5 h-5" /> : <IconShare className="w-5 h-5" />}
              </button>
              <UpvoteButton 
                initialUpvoteCount={item.upvoteCount}
                initialHasVoted={item.hasVoted} 
                onUpvote={onUpvote} 
                id={item.id} 
                size="lg" 
              />
            </div>
          </div>
          
          <p className="text-lg text-gray-300 mt-6 whitespace-pre-wrap">{item.body}</p>
          
          {/* Comments Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Comments ({item.comments.length})
            </h2>
            
            {/* New Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-700 text-gray-100 placeholder-gray-500"
                rows="3"
                placeholder="Add your comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-3 px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Post Comment
              </button>
            </form>
            
            {/* Comments List */}
            <div className="space-y-4">
              {item.comments.length > 0 ? (
                item.comments.map(comment => <Comment key={comment.id} comment={comment} />)
              ) : (
                <p className="text-gray-400">Be the first to comment!</p>
              )}
            </div>
          </div>
          
          {/* Importance Poll Section */}
          <div className="mt-10 pt-6 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              How important is this to you?
            </h2>
            <ImportanceSelector
              selected={item.myImportanceVote}
              onSelect={(newLevel) => onImportanceVote(item.id, newLevel)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SubmissionFormPage Component
 */
const SubmissionFormPage = ({ onSubmit, onBack }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("feature_request");
  const [body, setBody] = useState("");
  const [importance, setImportance] = useState("NICE-TO-HAVE"); // Default importance
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and description are required.");
      return;
    }
    setError("");
    const newTicket = {
      title,
      category,
      body,
      importance,
    };
    onSubmit(newTicket);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
       <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 mb-6"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
      
      <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Submit new idea</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-700 text-gray-100 placeholder-gray-500"
              placeholder="A brief summary of your idea"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-700 text-gray-100"
            >
              <option value="feature_request">{CATEGORY_DISPLAY_MAP['feature_request']}</option>
              <option value="suggestion">{CATEGORY_DISPLAY_MAP['suggestion']}</option>
              <option value="complaint">{CATEGORY_DISPLAY_MAP['complaint']}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-1">
              Description (Body)
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-700 text-gray-100 placeholder-gray-500"
              rows="6"
              placeholder="How would this help you? What's the problem?"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              How important is this to you?
            </label>
            <ImportanceSelector
              selected={importance}
              onSelect={setImportance}
            />
          </div>
          
          {/* Mock Attachment Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Attachments (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * SubmissionSuccessPage Component
 */
const SubmissionSuccessPage = ({ submittedTicket, onBack, project }) => {
  const [copied, setCopied] = useState(false);
  
  const trackingLink = `burdd.com/${project.slug}/feedback/${submittedTicket.id}`;

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = trackingLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-700 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/50">
          <IconCheck className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-100 mt-6 mb-2">Success!</h1>
        <p className="text-lg text-gray-400 mb-6">Your feedback has been submitted.</p>
        
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-3">Here's your unique tracking link to check on its status:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              readOnly
              value={trackingLink}
              className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
            />
            <button
              onClick={copyToClipboard}
              className={`flex-shrink-0 px-4 py-2.5 font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-100 hover:bg-gray-500'
              }`}
            >
              {copied ? (
                <>
                  <IconCheck className="w-5 h-5" /> Copied!
                </>
              ) : (
                <>
                  <IconClipboard className="w-5 h-5" /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};


/**
 * Header Component
 */
const Header = ({ onShowSubmitForm, project }) => (
  <header className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-10">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex-shrink-0 flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-100">BURDD</span>
          <span className="text-xl font-medium text-gray-400">/</span>
          <span className="text-xl font-semibold text-blue-400">{project.name} Feedback</span>
        </div>
        <button
          onClick={onShowSubmitForm}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <IconPlus className="w-5 h-5" />
          Submit New Idea
        </button>
      </div>
    </nav>
  </header>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  // In a real app, this project info would come from the URL router
  const [project, setProject] = useState({
    projectId: 'a7c4a1f8-a28a-4b0d-9b0a-0b2a3d3c4e5f', // Aligned with backend
    name: 'Twitter',
    slug: 'twitter',
    themeColor: 'blue'
  });

  const [page, setPage] = useState('dashboard'); // 'dashboard', 'detail', 'submit', 'success'
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState(mockFeedbackData);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const [sortBy, setSortBy] = useState('Top');
  
  // --- Navigation Handlers ---
  const showDashboard = () => setPage('dashboard');
  
  const showDetail = (id) => {
    setSelectedFeedbackId(id);
    setPage('detail');
  };
  
  const showSubmitForm = () => setPage('submit');
  
  const showSuccess = (ticket) => {
    setSubmittedTicket(ticket);
    setPage('success');
  };

  // --- Data Handlers (Callbacks) ---
  
  const handleUpvote = useCallback((id, newCount, newHasVoted) => {
    setFeedbackItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, upvoteCount: newCount, hasVoted: newHasVoted } : item
      )
    );
  }, []);
  
  const handleAddComment = useCallback((id, commentBody) => {
    const newComment = {
      id: `c${new Date().getTime()}`,
      user: { handle: 'GuestUser', avatar_url: 'https://placehold.co/40x40/71717A/FFFFFF?text=G' }, // Mock guest user
      body: commentBody,
    };
    setFeedbackItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );
  }, []);

  const handleImportanceVote = useCallback((id, newLevel) => {
    setFeedbackItems(currentItems =>
      currentItems.map(item => {
        if (item.id !== id) return item;
        const newCounts = { ...item.importanceCounts };
        const oldLevel = item.myImportanceVote;
        
        if (oldLevel && newCounts[oldLevel] > 0) {
          newCounts[oldLevel]--;
        }
        newCounts[newLevel] = (newCounts[newLevel] || 0) + 1;

        return {
          ...item,
          myImportanceVote: newLevel,
          importanceCounts: newCounts,
        };
      })
    );
  }, []);
  
  const handleSubmitFeedback = useCallback((newTicketData) => {
    const initialCounts = { 'NOT IMPORTANT': 0, 'NICE-TO-HAVE': 0, 'IMPORTANT': 0, 'CRITICAL': 0 };
    initialCounts[newTicketData.importance] = 1;

    const newTicket = {
      ...newTicketData,
      id: crypto.randomUUID(),
      status: 'new',
      upvoteCount: 0,
      hasVoted: false,
      comments: [],
      createdAt: new Date().toISOString(), // Set creation date
      sprint: null, // New tickets don't have a sprint
      importanceCounts: initialCounts,
      myImportanceVote: newTicketData.importance,
      imageUrl: `https://placehold.co/600x400/${project.themeColor === 'blue' ? '1DA1F2' : 'E2E8F0'}/FFFFFF?text=${encodeURIComponent(newTicketData.title)}`
    };
    
    delete newTicket.importance;

    setFeedbackItems(currentItems => [newTicket, ...currentItems]);
    showSuccess(newTicket);
  }, [project]);

  // --- Render Logic ---
  
  const renderPage = () => {
    switch (page) {
      case 'detail':
        const selectedItem = feedbackItems.find(item => item.id === selectedFeedbackId);
        return (
          <FeedbackDetailPage
            item={selectedItem}
            onUpvote={handleUpvote}
            onAddComment={handleAddComment}
            onImportanceVote={handleImportanceVote}
            onBack={showDashboard}
            project={project}
          />
        );
      case 'submit':
        return (
          <SubmissionFormPage
            onSubmit={handleSubmitFeedback}
            onBack={showDashboard}
          />
        );
      case 'success':
        return (
          <SubmissionSuccessPage
            submittedTicket={submittedTicket}
            onBack={showDashboard}
            project={project}
          />
        );
      case 'dashboard':
      default:
        return (
          <FeedbackDashboard
            feedbackItems={feedbackItems}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onCardClick={showDetail}
            onUpvote={handleUpvote}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-inter dark">
      <Header onShowSubmitForm={showSubmitForm} project={project} />
      <main>
        {renderPage()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        Powered by BURDD
      </footer>
    </div>
  );
}