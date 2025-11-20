const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
export { API_BASE_URL };
export async function fetchJson(url, init) {
    const response = await fetch(url, {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) {
        return undefined;
    }
    return (await response.json());
}
