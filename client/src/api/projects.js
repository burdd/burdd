import { API_BASE_URL, fetchJson } from './config';
export async function getProjects() {
    const { projects } = await fetchJson(`${API_BASE_URL}/projects`);
    const projectsWithMembers = await Promise.all(projects.map(async (p) => {
        const [membersData, issuesData, ticketsData] = await Promise.all([
            fetchJson(`${API_BASE_URL}/projects/${p.project_id}/members`),
            fetchJson(`${API_BASE_URL}/projects/${p.project_id}/issues`),
            fetchJson(`${API_BASE_URL}/projects/${p.project_id}/tickets`),
        ]);
        const members = membersData.members.map((m) => ({
            id: m.user_id,
            name: m.full_name || m.handle,
            role: m.role,
            avatarUrl: m.avatar_url || undefined,
        }));
        const issues = issuesData.issues || [];
        const tickets = ticketsData.tickets || [];
        const activeIssues = issues.filter(i => i.status !== 'done').length;
        return {
            id: p.project_id,
            name: p.project_name,
            key: p.project_key,
            stats: {
                totalIssues: issues.length,
                activeIssues: activeIssues,
                openTickets: tickets.length,
            },
            members,
        };
    }));
    return projectsWithMembers;
}
export async function getProjectById(projectId) {
    const [projectData, membersData] = await Promise.all([
        fetchJson(`${API_BASE_URL}/projects/${projectId}`),
        fetchJson(`${API_BASE_URL}/projects/${projectId}/members`),
    ]);
    const members = membersData.members.map((m) => ({
        id: m.user_id,
        name: m.full_name || m.handle,
        handle: m.handle,
        role: m.role,
        avatarUrl: m.avatar_url || undefined,
    }));
    return {
        id: projectData.project.id,
        name: projectData.project.name,
        key: projectData.project.key,
        stats: {
            totalIssues: 0,
            activeIssues: 0,
            openTickets: 0,
        },
        members,
    };
}
export async function createProject(data) {
    return fetchJson(`${API_BASE_URL}/projects`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
export async function updateProject(projectId, data) {
    return fetchJson(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}
export async function deleteProject(projectId) {
    return fetchJson(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
    });
}

export async function addMemberToProject(projectId, userId, role = 'dev') {
    const response = await fetchJson(`${API_BASE_URL}/projects/${projectId}/members`, {
        method: 'POST',
        body: JSON.stringify({ userId, role }),
    });
    return response;
}

export async function removeMemberFromProject(projectId, userId) {
    return fetchJson(`${API_BASE_URL}/projects/${projectId}/members/${userId}`, {
        method: 'DELETE',
    });
}

export async function changeMemberRole(projectId, userId, role) {
    const response = await fetchJson(`${API_BASE_URL}/projects/${projectId}/members/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
    });
    return response;
}
