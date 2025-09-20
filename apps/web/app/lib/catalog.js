export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchCatalog() {
  const res = await fetch(`${API_URL}/catalog/services`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load catalog');
  return res.json();
}

