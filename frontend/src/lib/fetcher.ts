export async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getList<T>(url: string, init?: RequestInit): Promise<T[]> {
  return requestJson<T[]>(url, init);
}

export async function getById<T extends { id: string }>(url: string, id: string, init?: RequestInit): Promise<T | undefined> {
  // Mock data is served as static JSON collections, so we fetch the list and filter locally.
  // Once real endpoints exist (e.g. /projects/:id) this can be replaced with a direct request.
  const list = await getList<T>(url, init);
  return list.find((item) => item.id === id);
}
