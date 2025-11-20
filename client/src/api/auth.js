import { API_BASE_URL, fetchJson } from './config';
export async function getCurrentUser() {
    try {
        return await fetchJson(`${API_BASE_URL}/me`);
    }
    catch (error) {
        console.error('Failed to fetch current user:', error);
        return null;
    }
}
export async function logout() {
    return fetchJson(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
    });
}
export function loginWithGitHub() {
    window.location.href = `${API_BASE_URL}/auth/github`;
}
