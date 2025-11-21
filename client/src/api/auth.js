import { API_BASE_URL, fetchJson } from './config';

export async function getCurrentUser() {
    try {
        const data = await fetchJson(`${API_BASE_URL}/me`);
        if (data && data.user) {
            return {
                id: data.user.id,
                githubId: data.user.github_id,
                handle: data.user.handle,
                fullName: data.user.full_name,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                email: data.user.email,
                avatarUrl: data.user.avatar_url,
                createdAt: data.user.created_at,
                memberships: data.memberships || []
            };
        }
        return null;
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
