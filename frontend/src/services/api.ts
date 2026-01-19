export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('@JuniorLima:token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Optional: Handle token expiration
    localStorage.removeItem('@JuniorLima:token');
    window.location.href = '/login';
  }

  return response;
}
