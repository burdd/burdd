import { API_BASE_URL, fetchJson } from './config';

export async function searchUsers(query, limit = 10) {
    const params = new URLSearchParams({ q: query, limit });
    const data = await fetchJson(`${API_BASE_URL}/users/search?${params}`);
    return data.users || [];
}
