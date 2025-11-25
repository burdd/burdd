import { API_BASE_URL, fetchJson } from './config';
async function getUserById(userId) {
    const response = await fetchJson(`${API_BASE_URL}/users/${userId}`);
    return {
        id: response.user.id,
        name: response.user.full_name || response.user.handle,
        handle: response.user.handle,
        avatarUrl: response.user.avatar_url || undefined,
    };
}
async function transformTicket(t) {
    const [user, issuesResponse, commentsResponse] = await Promise.all([
        getUserById(t.user_id),
        fetchJson(`${API_BASE_URL}/tickets/${t.id}/issues`).catch(() => ({ issues: [] })),
        fetchJson(`${API_BASE_URL}/tickets/${t.id}/comments`).catch(() => ({ comments: [] }))
    ]);
    
    const relatedIssues = issuesResponse.issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        status: issue.status,
        description: issue.description,
        sprintId: issue.sprint_id,
        projectId: issue.project_id,
        assigneeId: issue.assignee_id,
        createdAt: issue.created_at
    }));
    
    const commentsWithUsers = await Promise.all(
        commentsResponse.comments.map(async (comment) => {
            const commentUser = await getUserById(comment.user_id);
            return {
                id: comment.id,
                body: comment.body,
                userId: comment.user_id,
                createdAt: comment.created_at,
                user: {
                    handle: commentUser.handle,
                    avatarUrl: commentUser.avatarUrl
                }
            };
        })
    );
    
    return {
        id: t.id,
        projectId: t.project_id,
        title: t.title,
        status: t.status,
        category: t.category || 'complaint',
        user: {
            handle: user.handle,
            avatarUrl: user.avatarUrl
        },
        createdAt: t.created_at,
        body: t.body,
        relatedIssues,
        comments: commentsWithUsers,
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
    const data = await fetchJson(`${API_BASE_URL}/tickets/${ticketId}`);
    return data.ticket ? await transformTicket(data.ticket) : undefined;
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
export async function updateTicketStatusBasedOnIssues(ticketId) {
    const ticket = await getTicketById(ticketId);
    
    if (!ticket || !ticket.relatedIssues) {
        return;
    }
    
    if (ticket.relatedIssues.length === 0) {
        if (ticket.status !== 'new' && ticket.status !== 'rejected') {
            await updateTicket(ticketId, { status: 'new' });
        }
        return;
    }
    
    const allDone = ticket.relatedIssues.every(issue => issue.status === 'done');
    
    let newStatus;
    if (allDone) {
        newStatus = 'closed';
    } else {
        newStatus = 'triaged';
    }
    
    if (ticket.status !== newStatus && ticket.status !== 'rejected') {
        await updateTicket(ticketId, { status: newStatus });
    }
}
