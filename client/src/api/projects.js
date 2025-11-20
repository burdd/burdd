import { API_BASE_URL, fetchJson } from './config';
export async function getProjects() {
    const { projects } = await fetchJson(`${API_BASE_URL}/projects`);
    const projectsWithMembers = await Promise.all(projects.map(async (p) => {
        try {
            const membersData = await fetchJson(`${API_BASE_URL}/projects/${p.project_id}/members`);
            const members = membersData.members.map((m) => ({
                id: m.user_id,
                name: m.full_name || m.handle,
                role: m.role,
                avatarUrl: m.avatar_url || undefined,
            }));
            return {
                id: p.project_id,
                name: p.project_name,
                key: p.project_key,
                stats: {
                    totalIssues: 0,
                    activeIssues: 0,
                    openTickets: 0,
                },
                members,
            };
        }
        catch (error) {
            console.error(`Failed to fetch members for project ${p.project_id}:`, error);
            return {
                id: p.project_id,
                name: p.project_name,
                key: p.project_key,
                stats: {
                    totalIssues: 0,
                    activeIssues: 0,
                    openTickets: 0,
                },
                members: [],
            };
        }
    }));
    return projectsWithMembers;
}
export async function getProjectById(projectId) {
    try {
        const [projectData, membersData] = await Promise.all([
            fetchJson(`${API_BASE_URL}/projects/${projectId}`),
            fetchJson(`${API_BASE_URL}/projects/${projectId}/members`),
        ]);
        const members = membersData.members.map((m) => ({
            id: m.user_id,
            name: m.full_name || m.handle,
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
    catch (error) {
        console.error('Failed to fetch project:', error);
        return undefined;
    }
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
