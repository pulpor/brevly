export const client = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const baseUrl = 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<T>;
};