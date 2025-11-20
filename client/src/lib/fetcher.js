export async function requestJson(input, init) {
    const response = await fetch(input, init);
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
    }
    return (await response.json());
}
export async function getList(url, init) {
    return requestJson(url, init);
}
export async function getById(url, id, init) {
    // Mock data is served as static JSON collections, so we fetch the list and filter locally.
    // Once real endpoints exist (e.g. /projects/:id) this can be replaced with a direct request.
    const list = await getList(url, init);
    return list.find((item) => item.id === id);
}
