const MOCK_CURRENT_TIME = new Date("2025-11-11T23:39:00Z");
export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((MOCK_CURRENT_TIME.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1)
        return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1)
        return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1)
        return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1)
        return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1)
        return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};
