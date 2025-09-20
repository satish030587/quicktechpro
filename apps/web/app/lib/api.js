export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

let accessToken = null;
let refreshToken = null;

export function setTokens({ access, refresh }) {
  accessToken = access ?? accessToken;
  refreshToken = refresh ?? refreshToken;
  if (typeof window !== 'undefined') {
    if (access !== undefined) window.localStorage.setItem('qtp_access_token', access || '');
    if (refresh !== undefined) window.localStorage.setItem('qtp_refresh_token', refresh || '');
  }
}

export function getAccessToken() {
  return accessToken;
}

export function loadTokensFromStorage() {
  if (typeof window === 'undefined') return;
  accessToken = window.localStorage.getItem('qtp_access_token') || null;
  refreshToken = window.localStorage.getItem('qtp_refresh_token') || null;
}

export async function apiFetch(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined
  };
  if (auth && accessToken) opts.headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(`${API_URL}${path}`, opts);
  if (res.status === 401 && auth && refreshToken) {
    // try refresh once
    try {
      const rf = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      
      if (rf.ok) {
        const j = await rf.json();
        setTokens({ access: j.accessToken });
        
        // retry original with new token
        opts.headers['Authorization'] = `Bearer ${j.accessToken}`;
        return fetch(`${API_URL}${path}`, opts);
      } else {
        // If refresh failed, clear tokens
        setTokens({ access: '', refresh: '' });
        throw new Error('Session expired');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      setTokens({ access: '', refresh: '' });
      throw error;
    }
  }
  return res;
}

export const AuthAPI = {
  async register({ email, password, name, acceptPrivacy, phone, marketingEmailOptIn, marketingSmsOptIn }) {
    const res = await apiFetch('/auth/register', { method: 'POST', auth: false, body: { email, password, name, acceptPrivacy, phone, marketingEmailOptIn, marketingSmsOptIn } });
    if (!res.ok) throw new Error((await res.json()).message || 'Register failed');
    return res.json();
  },
  async login({ email, password }) {
    const res = await apiFetch('/auth/login', { method: 'POST', auth: false, body: { email, password } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setTokens({ access: data.accessToken, refresh: data.refreshToken });
    return data;
  },
  async logout() {
    try { await apiFetch('/auth/logout', { method: 'POST', auth: false, body: { refreshToken } }); } catch {}
    setTokens({ access: '', refresh: '' });
  },
  async me() {
    const res = await apiFetch('/users/me');
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },
  async tfaSetup() {
    const res = await apiFetch('/auth/2fa/setup', { method: 'POST' });
    if (!res.ok) throw new Error('2FA setup failed');
    return res.json();
  },
  async tfaVerify(token) {
    const res = await apiFetch('/auth/2fa/verify', { method: 'POST', body: { token } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || '2FA verify failed');
    return data;
  },
  async tfaDisable() {
    const res = await apiFetch('/auth/2fa/disable', { method: 'POST' });
    if (!res.ok) throw new Error('2FA disable failed');
    return res.json();
  },
  async tfaRecoveryCodes() {
    const res = await apiFetch('/auth/2fa/recovery-codes', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to get recovery codes');
    return res.json();
  }
};
