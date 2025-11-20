import { API_BASE_URL, fetchJson } from './config';
function transformSprint(s) {
    return {
        id: s.id,
        projectId: s.project_id,
        name: s.name,
        startDate: s.start,
        endDate: s.end,
    };
}
export async function getSprintsByProject(projectId) {
    const data = await fetchJson(`${API_BASE_URL}/projects/${projectId}/sprints`);
    return data.sprints?.map(transformSprint) || [];
}
export async function getSprintById(sprintId) {
    try {
        const data = await fetchJson(`${API_BASE_URL}/sprints/${sprintId}`);
        return data.sprint ? transformSprint(data.sprint) : undefined;
    }
    catch (error) {
        console.error('Failed to fetch sprint:', error);
        return undefined;
    }
}
export async function createSprint(projectId, data) {
    const response = await fetchJson(`${API_BASE_URL}/projects/${projectId}/sprints`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return { sprint: transformSprint(response.sprint) };
}
export async function updateSprint(sprintId, data) {
    const response = await fetchJson(`${API_BASE_URL}/sprints/${sprintId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return { sprint: transformSprint(response.sprint) };
}
export async function deleteSprint(sprintId) {
    return fetchJson(`${API_BASE_URL}/sprints/${sprintId}`, {
        method: 'DELETE',
    });
}
