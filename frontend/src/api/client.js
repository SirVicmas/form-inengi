const API_BASE = '/api';

export async function fetchEvents() {
  const response = await fetch(`${API_BASE}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
}

export async function fetchEventBySlug(slug) {
  const response = await fetch(`${API_BASE}/events/${slug}`);
  if (!response.ok) {
    throw new Error('Event not found');
  }
  return response.json();
}

export async function registerForEvent(slug, data) {
  const response = await fetch(`${API_BASE}/events/${slug}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Registration failed');
  }
  return result; // returns { ticket, qrCode }
}
