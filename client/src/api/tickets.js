import { API_BASE_URL, fetchJson } from './config';
async function getUserById(userId, projectId) {
    try {
        const response = await fetchJson(`${API_BASE_URL}/projects/${projectId}/members/${userId}`);
        return {
            id: response.member.user_id,
            name: response.member.full_name || response.member.handle,
            handle: response.member.handle,
            avatar_url: response.member.avatar_url || undefined,
        };
    }
    catch {
        return {
            id: userId,
            name: 'Unknown User',
            handle: 'unknown',
            avatar_url: undefined,
        };
    }
}
async function transformTicket(t) {
    const [user, issuesResponse] = await Promise.all([
        getUserById(t.user_id, t.project_id),
        fetchJson(`${API_BASE_URL}/tickets/${t.id}/issues`).catch(() => ({ issues: [] }))
    ]);
    return {
        id: t.id,
        projectId: t.project_id,
        title: t.title,
        status: t.status,
        category: t.category || 'complaint',
        user: {
            handle: user.handle,
            avatar_url: user.avatar_url
        },
        createdAt: t.created_at,
        body: t.body,
        relatedIssueIds: issuesResponse.issues.map(issue => issue.id),
        ...(t.upvote_count !== undefined && { upvoteCount: parseInt(t.upvote_count, 10) }),
        ...(t.has_voted !== undefined && { hasVoted: t.has_voted }),
    };
}
export async function getTicketsByProject(projectId) {
    const data = await fetchJson(`${API_BASE_URL}/projects/${projectId}/tickets`);
    if (!data.tickets)
        return [];
    return Promise.all(data.tickets.map(transformTicket));
}
export async function getTicketsByIssue(issueId) {
    const data = await fetchJson(`${API_BASE_URL}/issues/${issueId}/tickets`);
    if (!data.tickets)
        return [];
    return Promise.all(data.tickets.map(transformTicket));
}
export async function getTicketById(ticketId) {
    try {
        const data = await fetchJson(`${API_BASE_URL}/tickets/${ticketId}`);
        return data.ticket ? await transformTicket(data.ticket) : undefined;
    }
    catch (error) {
        console.error('Failed to fetch ticket:', error);
        return undefined;
    }
}
export async function createTicket(projectId, data) {
    const response = await fetchJson(`${API_BASE_URL}/projects/${projectId}/tickets`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return { ticket: await transformTicket(response.ticket) };
}
export async function updateTicket(ticketId, data) {
    const response = await fetchJson(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return { ticket: await transformTicket(response.ticket) };
}
export async function addUpvote(ticketId) {
    return fetchJson(`${API_BASE_URL}/tickets/${ticketId}/upvotes`, {
        method: 'POST',
    });
}
export async function removeUpvote(ticketId) {
    return fetchJson(`${API_BASE_URL}/tickets/${ticketId}/upvotes`, {
        method: 'DELETE',
    });
}
export async function getTicketComments(ticketId) {
    const data = await fetchJson(`${API_BASE_URL}/tickets/${ticketId}/comments`);
    return data.comments || [];
}
export async function createTicketComment(ticketId, body) {
    return fetchJson(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body }),
    });
}
export async function getTicketAttachments(ticketId) {
    const data = await fetchJson(`${API_BASE_URL}/tickets/${ticketId}/attachments`);
    return data.attachments || [];
}
