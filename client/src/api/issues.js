import { API_BASE_URL, fetchJson } from './config';
function transformIssue(i) {
    return {
        id: i.id,
        projectId: i.project_id,
        sprintId: i.sprint_id,
        title: i.title,
        status: i.status,
        assigneeId: i.assignee_id,
        description: i.description,
        createdAt: i.created_at
    };
}
export async function getIssuesByProject(projectId) {
    const data = await fetchJson(`${API_BASE_URL}/projects/${projectId}/issues`);
    return data.issues?.map(transformIssue) || [];
}
export async function getIssuesBySprint(sprintId) {
    const data = await fetchJson(`${API_BASE_URL}/sprints/${sprintId}/issues`);
    return data.issues?.map(transformIssue) || [];
}
export async function getIssuesByTicket(ticketId) {
    const data = await fetchJson(`${API_BASE_URL}/tickets/${ticketId}/issues`);
    return data.issues?.map(transformIssue) || [];
}
export async function getIssueById(issueId) {
    const data = await fetchJson(`${API_BASE_URL}/issues/${issueId}`);
    return data.issue ? transformIssue(data.issue) : undefined;
}
export async function createIssue(projectId, data) {
    const response = await fetchJson(`${API_BASE_URL}/projects/${projectId}/issues`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return { issue: transformIssue(response.issue) };
}
export async function updateIssue(issueId, data) {
    const response = await fetchJson(`${API_BASE_URL}/issues/${issueId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return { issue: transformIssue(response.issue) };
}
export async function deleteIssue(issueId) {
    return fetchJson(`${API_BASE_URL}/issues/${issueId}`, {
        method: 'DELETE',
    });
}
export async function linkIssueToTicket(ticketId, issueId) {
    return fetchJson(`${API_BASE_URL}/tickets/${ticketId}/issues`, {
        method: 'POST',
        body: JSON.stringify({ issueId }),
    });
}
export async function updateLinkedTicketsStatus(issueId) {
    const { getTicketsByIssue, updateTicketStatusBasedOnIssues } = await import('./tickets');
    
    const tickets = await getTicketsByIssue(issueId);
    
    for (const ticket of tickets) {
        await updateTicketStatusBasedOnIssues(ticket.id);
    }
}
