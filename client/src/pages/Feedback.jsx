import React, { useState, useMemo, useCallback } from 'react';

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

const IconSearch = ({ className }) => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);


const mockFeedbackData = [
  {
    id: '1',
    user: { handle: 'TimelineFan', avatar_url: 'https://placehold.co/40x40/EC4899/FFFFFF?text=T' },
    title: 'Bring back chronological timeline by default',
    body: "I don't want the 'For You' algorithmic feed. Please make the 'Following' (chronological) timeline the default tab, or at least remember my choice.",
    category: 'feature_request', 
    status: 'new',
    upvoteCount: 128,
    hasVoted: false,
    createdAt: "2025-11-08T14:30:00Z", 
    comments: [
      { id: 'c1', user: { handle: 'User123', avatar_url: 'https://placehold.co/40x40/6366F1/FFFFFF?text=U' }, body: 'This!! 100% this.' },
    ],
    expected: null,
    actual: null,
    steps: null,
    environment: null,
  },
  {
    id: '2',
    user: { handle: 'TypoQueen', avatar_url: 'https://placehold.co/40x40/10B981/FFFFFF?text=T' },
    title: 'Edit Button for Tweets',
    body: "We've been asking for this for years. We need a simple edit button to fix typos after posting, maybe with a 5-minute window.",
    category: 'feature_request',
    status: 'closed',
    upvoteCount: 256,
    hasVoted: true,
    createdAt: "2025-09-15T10:00:00Z",
    comments: [
      { id: 'c3', user: { handle: 'Admin', avatar_url: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=A' }, body: 'This is now available for Twitter Blue subscribers!' },
    ],
    expected: null,
    actual: null,
    steps: null,
    environment: null,
  },
  {
    id: '3',
    user: { handle: 'AndroidUser', avatar_url: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=A' },
    title: 'Video player is buggy on Android',
    body: 'The video player often freezes, fails to load, or the audio goes out of sync.',
    category: 'complaint',
    status: 'triaged',
    upvoteCount: 76,
    hasVoted: false,
    createdAt: "2025-11-01T09:12:00Z", 
    comments: [
      { id: 'c6', user: { handle: 'DevTeam', avatar_url: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=D' }, body: 'Thanks for the report, we are actively investigating this.' }
    ],
    expected: "Video plays smoothly.",
    actual: "Video freezes and audio desyncs.",
    steps: "1. Open the app on Android 13.\n2. Scroll to a video.\n3. Tap play.",
    environment: "Samsung Galaxy S23, Android 13, Twitter App v10.2.1",
  },
  {
    id: '4',
    user: { handle: 'CryptoHater', avatar_url: 'https://placehold.co/40x40/EF4444/FFFFFF?text=C' },
    title: 'Better spam and bot detection in replies',
    body: "My replies are flooded with crypto scams and spam bots. The current 'hide reply' and 'block' tools aren't enough. We need more aggressive, proactive filtering.",
    category: 'feature_request',
    status: 'triaged',
    upvoteCount: 215,
    hasVoted: false,
    createdAt: "2025-10-20T11:00:00Z",
    comments: [],
    expected: null,
    actual: null,
    steps: null,
    environment: null,
  },
  {
    id: '6',
    user: { handle: 'WordyUser', avatar_url: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=W' },
    title: 'Increase character limit for all users',
    body: 'The 280-character limit feels outdated. It would be great to have at least 500 characters for everyone.',
    category: 'feature_request',
    status: 'rejected',
    upvoteCount: 42,
    hasVoted: false,
    createdAt: "2025-10-05T00:00:00Z",
    comments: [
        { id: 'c9', user: { handle: 'Admin', avatar_url: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=A' }, body: "We appreciate the feedback, but we've decided to keep the 280-character limit for now to maintain brevity." },
    ],
    expected: null,
    actual: null,
    steps: null,
    environment: null,
  },
];


const CATEGORIES = ['All', 'feature_request', 'complaint'];
const STATUSES = ['All', 'new', 'triaged', 'closed', 'rejected'];
const SORT_OPTIONS = ['Top', 'Newest', 'Hot'];

const MOCK_CURRENT_TIME = new Date("2025-11-11T23:39:00Z");


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


const UpvoteButton = ({ initialUpvoteCount, initialHasVoted, onUpvote, id, size = 'md' }) => {
  const [upvoted, setUpvoted] = useState(initialHasVoted);
  const [count, setCount] = useState(initialUpvoteCount);

  const handleClick = (e) => {
    e.stopPropagation();
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
  const inactiveStyles = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

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


const StatusBadge = ({ status }) => {
  const styles = {
    'new': 'bg-yellow-100 text-yellow-800',
    'triaged': 'bg-blue-100 text-blue-800',
    'closed': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {STATUS_DISPLAY_MAP[status] || status}
    </span>
  );
};

const CategoryTag = ({ category }) => {
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
      {CATEGORY_DISPLAY_MAP[category] || category}
    </span>
  );
};


const Comment = ({ comment }) => (
  <div className="flex gap-3 py-4 border-b border-gray-200">
    <img
      src={comment.user.avatar_url}
      alt={comment.user.handle}
      className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"
      onError={(e) => { e.target.src = 'https://placehold.co/40x40/A1A1AA/FFFFFF?text=?'; }}
    />
    <div>
      <h4 className="font-semibold text-gray-900">{comment.user.handle}</h4>
      <p className="text-gray-700 mt-1">{comment.body}</p>
    </div>
  </div>
);


const FilterPills = ({ options, selected, onSelect, title, displayMap = {} }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-500 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            selected === option
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {displayMap[option] || option}
        </button>
      ))}
    </div>
  </div>
);



const FeedbackDashboard = ({
  feedbackItems,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  onCardClick,
  onUpvote,
  searchTerm
}) => {
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
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Hot') {
      items.sort((a, b) => b.upvoteCount - a.upvoteCount);
    }
    
    return items;
  }, [feedbackItems, filters, sortBy, searchTerm]);
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredAndSortedItems.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredAndSortedItems.map(item => (
              <FeedbackListItem
                key={item.id}
                item={item}
                onClick={() => onCardClick(item.id)}
                onUpvote={onUpvote}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900">No feedback found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term!</p>
          </div>
        )}
      </div>
    </div>
  );
};


const FeedbackListItem = ({ item, onClick, onUpvote }) => {
  return (
    <li
      onClick={onClick}
      className="flex items-center px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
          <CategoryTag category={item.category} />
          <StatusBadge status={item.status} />
          <span className="text-sm text-gray-500">
            {formatTimeAgo(item.createdAt)} by {item.user.handle}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-gray-500">
          <IconMessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">{item.comments.length}</span>
        </div>
        <UpvoteButton 
          initialUpvoteCount={item.upvoteCount}
          initialHasVoted={item.hasVoted}
          onUpvote={onUpvote} 
          id={item.id} 
        />
      </div>
    </li>
  );
};


const FeedbackDetailPage = ({ item, onUpvote, onAddComment, onBack, project }) => {
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
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-600 mb-6"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <CategoryTag category={item.category} />
                <StatusBadge status={item.status} />
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <IconCalendar className="w-4 h-4" />
                  Submitted {formatTimeAgo(item.createdAt)} by {item.user.handle}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex-shrink-0 p-2.5 font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
          
          <p className="text-lg text-gray-700 mt-6 whitespace-pre-wrap">{item.body}</p>

          {item.category === 'complaint' && (
            <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {item.environment && <div><strong className="text-gray-600">Environment:</strong> <span className="text-gray-700">{item.environment}</span></div>}
              {item.steps && <div><strong className="text-gray-600">Steps to Reproduce:</strong> <pre className="text-gray-700 whitespace-pre-wrap font-sans">{item.steps}</pre></div>}
              {item.expected && <div><strong className="text-gray-600">Expected Result:</strong> <span className="text-gray-700">{item.expected}</span></div>}
              {item.actual && <div><strong className="text-gray-600">Actual Result:</strong> <span className="text-gray-700">{item.actual}</span></div>}
            </div>
          )}
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comments ({item.comments.length})
            </h2>
            
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                rows="3"
                placeholder="Add your comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-3 px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Post Comment
              </button>
            </form>
            
            <div className="space-y-4">
              {item.comments.length > 0 ? (
                item.comments.map(comment => <Comment key={comment.id} comment={comment} />)
              ) : (
                <p className="text-gray-500">Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const SubmissionFormPage = ({ onSubmit, onBack }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("feature_request");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  
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
    
    setError("");
    const newTicket = {
      title,
      category,
      body,
      steps: category === 'complaint' ? steps : null,
      expected: category === 'complaint' ? expected : null,
      actual: category === 'complaint' ? actual : null,
      environment: category === 'complaint' ? environment : null,
    };
    onSubmit(newTicket);
  };

  const attachmentPlaceholder = category === 'complaint' 
    ? "Upload screenshot of the issue" 
    : "Upload a concept or mockup (optional)";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
       <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-600 mb-6"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Submit new idea</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              What kind of feedback is this?
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="feature_request">{CATEGORY_DISPLAY_MAP['feature_request']}</option>
              <option value="complaint">{CATEGORY_DISPLAY_MAP['complaint']}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
              placeholder={category === 'complaint' ? 'e.g., "Video player freezes on Android"' : 'e.g., "Add bookmarks to main nav bar"'}
            />
          </div>
          
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              {category === 'complaint' ? 'Please describe the issue' : 'Please describe your idea'}
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
              rows="4"
              placeholder={category === 'complaint' ? 'What are you experiencing?' : 'How would this help you?'}
            ></textarea>
          </div>
          
          {category === 'complaint' && (
            <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Issue Details</h3>
              <div>
                <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">
                  Environment (Optional)
                </label>
                <input
                  type="text"
                  id="environment"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Chrome, iOS 17, Android 13"
                />
              </div>
              <div>
                <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
                  Steps to Reproduce
                </label>
                <textarea
                  id="steps"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                  rows="3"
                  placeholder="1. Go to...\n2. Click on...\n3. See error..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="expected" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Result
                </label>
                <input
                  type="text"
                  id="expected"
                  value={expected}
                  onChange={(e) => setExpected(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="What did you expect to happen?"
                />
              </div>
              <div>
                <label htmlFor="actual" className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Result
                </label>
                <input
                  type="text"
                  id="actual"
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="What actually happened?"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments (Screenshots, etc.)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-500 hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">{attachmentPlaceholder}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


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
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <IconCheck className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Success!</h1>
        <p className="text-lg text-gray-600 mb-6">Your feedback has been submitted.</p>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Here's your unique tracking link to check on its status:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              readOnly
              value={trackingLink}
              className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
            <button
              onClick={copyToClipboard}
              className={`flex-shrink-0 px-4 py-2.5 font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
          className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};


const Header = ({ onShowSubmitForm, project, searchTerm, onSearchChange }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16 gap-4">
        <div className="flex-shrink-0 flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-900">BURDD</span>
          <span className="text-xl font-medium text-gray-400">/</span>
          <span className="text-xl font-semibold text-blue-500">{project.name} Feedback</span>
        </div>
        
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
              placeholder="Search by title or description..."
            />
          </div>
        </div>
        
        <button
          onClick={onShowSubmitForm}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <IconPlus className="w-5 h-5" />
          Submit
        </button>
      </div>
    </nav>
  </header>
);


export default function App() {
  const [project, setProject] = useState({
    projectId: 'a7c4a1f8-a28a-4b0d-9b0a-0b2a3d3c4e5f',
    name: 'Twitter',
    slug: 'twitter',
    themeColor: 'blue'
  });

  const [page, setPage] = useState('dashboard');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState(mockFeedbackData);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const [sortBy, setSortBy] = useState('Top');
  
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
      user: { handle: 'GuestUser', avatar_url: 'https://placehold.co/40x40/A1A1AA/FFFFFF?text=G' },
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
  
  const handleSubmitFeedback = useCallback((newTicketData) => {
    const newTicket = {
      ...newTicketData,
      id: crypto.randomUUID(),
      user: { handle: 'GuestUser', avatar_url: 'https://placehold.co/40x40/A1A1AA/FFFFFF?text=G' },
      status: 'new',
      upvoteCount: 0,
      hasVoted: false,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    
    setFeedbackItems(currentItems => [newTicket, ...currentItems]);
    showSuccess(newTicket);
  }, [project]);

  
  const renderPage = () => {
    switch (page) {
      case 'detail':
        const selectedItem = feedbackItems.find(item => item.id === selectedFeedbackId);
        return (
          <FeedbackDetailPage
            item={selectedItem}
            onUpvote={handleUpvote}
            onAddComment={handleAddComment}
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
            searchTerm={searchTerm}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-inter">
      <Header 
        onShowSubmitForm={showSubmitForm} 
        project={project} 
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />
      <main>
        {renderPage()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        Powered by BURDD
      </footer>
    </div>
  );
}