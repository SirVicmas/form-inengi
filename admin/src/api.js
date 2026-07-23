const request = async (path, { token, ...options } = {}) => {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Something went wrong');
  return body;
};

export const login = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const getEvents = (token) => request('/events/admin/all', { token });
export const getTickets = (token, eventId) => request(`/tickets${eventId ? `?eventId=${eventId}` : ''}`, { token });
export const createEvent = (token, data) => request('/events', { token, method: 'POST', body: JSON.stringify(data) });
export const updateEvent = (token, id, data) => request(`/events/${id}`, { token, method: 'PATCH', body: JSON.stringify(data) });
export const checkIn = (token, code) => request(`/tickets/${encodeURIComponent(code.trim())}/checkin`, { token, method: 'POST' });
