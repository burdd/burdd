import React, { useState, useMemo, useCallback } from 'react';

// --- ICONS ---
// Using lucide-react for icons. In a real app, you'd install this.
// For this snippet, we'll use simple inline SVGs or text placeholders.
// Let's create simple SVG components for icons to keep it self-contained.

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


// --- MOCK DATA ---
const mockFeedbackData = [
  {
    id: '1',
    title: 'Bring back chronological timeline by default',
    description: "I don't want the 'For You' algorithmic feed. Please make the 'Following' (chronological) timeline the default tab, or at least remember my choice.",
    category: 'Suggestion',
    status: 'Under Review',
    upvotes: 128,
    comments: [
      { id: 'c1', user: 'User123', text: 'This!! 100% this.' },
      { id: 'c2', user: 'TimelineFan', text: 'The app always opening on "For You" is the most annoying thing.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Chronological+Feed'
  },
  {
    id: '2',
    title: 'Edit Button for Tweets',
    description: "We've been asking for this for years. We need a simple edit button to fix typos after posting, maybe with a 5-minute window. This should be for everyone, not just subscribers.",
    category: 'Feature',
    status: 'Shipped',
    upvotes: 256,
    comments: [
      { id: 'c3', user: 'Admin', text: 'This is now available for Twitter Blue subscribers!' },
      { id: 'c4', user: 'TypoQueen', text: 'Finally! But it should be free.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Edit+Button'
  },
  {
    id: '3',
    title: 'Video player is buggy on Android',
    description: 'The video player often freezes, fails to load, or the audio goes out of sync. This happens constantly on my Samsung Galaxy S23. It makes watching videos impossible.',
    category: 'Issue',
    status: 'In Progress',
    upvotes: 76,
    comments: [
      { id: 'c5', user: 'AndroidUser', text: 'Same here, Pixel 7. Videos are almost unwatchable.' },
      { id: 'c6', user: 'DevTeam', text: 'Thanks for the report, we are actively investigating this.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Video+Bug'
  },
  {
    id: '4',
    title: 'Better spam and bot detection in replies',
    description: "My replies are flooded with crypto scams and spam bots. The current 'hide reply' and 'block' tools aren't enough. We need more aggressive, proactive filtering.",
    category: 'Feature',
    status: 'In Progress',
    upvotes: 215,
    comments: [
      { id: 'c7', user: 'CryptoHater', text: 'This is the biggest problem on the platform right now.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Spam+Bots'
  },
  {
    id: '5',
    title: "Add 'Bookmarks' to the main navigation bar",
    description: "Bookmarks are so useful but they're hidden in the profile menu. Please add a 'Bookmarks' icon to the main bottom navigation bar for quick access.",
    category: 'Suggestion',
    status: 'Under Review',
    upvotes: 98,
    comments: [
      { id: 'c8', user: 'PowerUser', text: 'I bookmark things all the time and forget they exist because they are so hard to find.' }
    ],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Bookmarks'
  },
  {
    id: '6',
    title: 'Increase character limit for all users',
    description: 'The 280-character limit feels outdated. It would be great to have at least 500 characters for everyone, not just Blue subscribers, to allow for more nuanced conversations.',
    category: 'Suggestion',
    status: 'Under Review',
    upvotes: 42,
    comments: [],
    imageUrl: 'https://placehold.co/600x400/1DA1F2/FFFFFF?text=Character+Limit'
  },
];

const CATEGORIES = ['All', 'Feature', 'Issue', 'Suggestion'];
const STATUSES = ['All', 'Under Review', 'In Progress', 'Shipped'];
const SORT_OPTIONS = ['Top', 'Newest', 'Hot']; // "Hot" is just "Top" for this mock

// --- REUSABLE COMPONENTS ---

/**
 * UpvoteButton Component
 * A stateful button that shows an upvote count and toggles its active state.
 */
const UpvoteButton = ({ initialUpvotes, onUpvote, id, size = 'md' }) => {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(initialUpvotes);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent card click
    const newUpvoted = !upvoted;
    const newCount = newUpvoted ? count + 1 : count - 1;
    
    setUpvoted(newUpvoted);
    setCount(newCount);
    onUpvote(id, newCount); // Notify parent of the new total count
  };

  const baseStyles = "flex items-center gap-1.5 transition-colors rounded-lg border";
  const sizeStyles = {
    md: "px-3 py-1.5",
    lg: "flex-col px-4 py-2"
  };
  
  // Dark mode styles
  const activeStyles = "bg-indigo-500 border-indigo-400 text-white";
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
 * A visual tag for displaying the status of a feedback item.
 */
const StatusBadge = ({ status }) => {
  const styles = {
    'Under Review': 'bg-yellow-900/50 text-yellow-300',
    'In Progress': 'bg-blue-900/50 text-blue-300',
    'Shipped': 'bg-green-900/50 text-green-300',
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-700 text-gray-300'}`}
    >
      {status}
    </span>
  );
};

/**
 * CategoryTag Component
 * A visual tag for displaying the category of a feedback item.
 */
const CategoryTag = ({ category }) => {
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
      {category}
    </span>
  );
};

/**
 * Comment Component
 * Displays a single comment.
 */
const Comment = ({ comment }) => (
  <div className="flex gap-3 py-4 border-b border-gray-700">
    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold flex-shrink-0">
      {comment.user.charAt(0)}
    </div>
    <div>
      <h4 className="font-semibold text-gray-100">{comment.user}</h4>
      <p className="text-gray-300 mt-1">{comment.text}</p>
    </div>
  </div>
);

/**
 * FilterPills Component
 * A generic component to render a list of selectable pills.
 */
const FilterPills = ({ options, selected, onSelect, title }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-400 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            selected === option
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);


// --- PAGE COMPONENTS ---

/**
 * FeedbackDashboard Component
 * The main homepage, showing filters and the list of feedback items.
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

    // Filter by Category
    if (filters.category !== 'All') {
      items = items.filter(item => item.category === filters.category);
    }

    // Filter by Status
    if (filters.status !== 'All') {
      items = items.filter(item => item.status === filters.status);
    }

    // Sort
    if (sortBy === 'Top') {
      items.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'Newest') {
      items.sort((a, b) => new Date(b.id) - new Date(a.id)); // Using ID as proxy for date
    } else if (sortBy === 'Hot') {
      // Simple "Hot" logic: just sort by top
      items.sort((a, b) => b.upvotes - a.upvotes);
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
        />
        <FilterPills
          title="Status"
          options={STATUSES}
          selected={filters.status}
          onSelect={(stat) => setFilters(f => ({ ...f, status: stat }))}
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
 * A card that displays a summary of a feedback item.
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
          <UpvoteButton initialUpvotes={item.upvotes} onUpvote={onUpvote} id={item.id} />
          
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
 * Shows the full details for a single feedback item, including comments.
 */
const FeedbackDetailPage = ({ item, onUpvote, onAddComment, onBack }) => {
  const [newComment, setNewComment] = useState("");

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
        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 mb-6"
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
              <div className="flex items-center gap-2 mt-3">
                <CategoryTag category={item.category} />
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div className="flex-shrink-0">
              <UpvoteButton 
                initialUpvotes={item.upvotes} 
                onUpvote={onUpvote} 
                id={item.id} 
                size="lg" 
              />
            </div>
          </div>
          
          <p className="text-lg text-gray-300 mt-6 whitespace-pre-wrap">{item.description}</p>
          
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
                className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-700 text-gray-100 placeholder-gray-500"
                rows="3"
                placeholder="Add your comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-3 px-5 py-2.5 bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        </div>
      </div>
    </div>
  );
};

/**
 * SubmissionFormPage Component
 * A page with a form to submit new feedback.
 */
const SubmissionFormPage = ({ onSubmit, onBack }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Feature");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setError("");
    const newTicket = {
      title,
      category,
      description,
    };
    onSubmit(newTicket);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
       <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 mb-6"
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
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-700 text-gray-100 placeholder-gray-500"
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
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-700 text-gray-100"
            >
              <option>Feature</option>
              <option>Issue</option>
              <option>Suggestion</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-700 text-gray-100 placeholder-gray-500"
              rows="6"
              placeholder="How would this help you? What's the problem?"
            ></textarea>
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
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
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
              className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
 * A confirmation screen shown after submitting.
 */
const SubmissionSuccessPage = ({ submittedTicket, onBack }) => {
  const [copied, setCopied] = useState(false);
  
  // This is a mock URL. In a real app, this would be part of the URL.
  const trackingLink = `https://your-app.com/feedback/${submittedTicket.id}`;

  const copyToClipboard = () => {
    // This is a fallback for `navigator.clipboard` which might not work in sandboxed iframes.
    const textArea = document.createElement("textarea");
    textArea.value = trackingLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
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
          className="mt-8 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};


/**
 * Header Component
 * The main site header with navigation.
 */
const Header = ({ onShowSubmitForm }) => (
  <header className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-10">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex-shrink-0 flex items-center">
          <span className="text-2xl font-bold text-indigo-400">Feedback</span>
          <span className="text-2xl font-bold text-gray-100">Portal</span>
        </div>
        <button
          onClick={onShowSubmitForm}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  
  // Update upvote count in the main state
  const handleUpvote = useCallback((id, newCount) => {
    setFeedbackItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, upvotes: newCount } : item
      )
    );
  }, []);
  
  // Add a new comment
  const handleAddComment = useCallback((id, commentText) => {
    const newComment = {
      id: `c${new Date().getTime()}`,
      user: 'GuestUser', // Mock user
      text: commentText,
    };
    setFeedbackItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );
  }, []);
  
  // Submit a new feedback item
  const handleSubmitFeedback = useCallback((newTicketData) => {
    const newTicket = {
      ...newTicketData,
      id: crypto.randomUUID(), // Use crypto.randomUUID for a unique ID
      status: 'Under Review',
      upvotes: 0,
      comments: [],
      imageUrl: `https://placehold.co/600x400/E2E8F0/4A5568?text=${encodeURIComponent(newTicketData.title)}`
    };
    
    setFeedbackItems(currentItems => [newTicket, ...currentItems]);
    showSuccess(newTicket);
  }, []);

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
            onBack={showDashboard}
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
    // Add the 'dark' class here to enable dark mode for all Tailwind classes
    <div className="min-h-screen bg-gray-900 text-gray-300 font-inter dark">
      <Header onShowSubmitForm={showSubmitForm} />
      <main>
        {renderPage()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        Powered by Your Feedback
      </footer>
    </div>
  );
}