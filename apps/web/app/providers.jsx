"use client";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI, loadTokensFromStorage, setTokens } from './lib/api';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Only load in development mode
const NotificationDebugger = process.env.NODE_ENV === 'development' 
  ? dynamic(() => import('./components/NotificationDebugger'), { ssr: false })
  : () => null;

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokensFromStorage();
    AuthAPI.me().then(setUser).catch(()=>setUser(null)).finally(()=>setLoading(false));
    
    // Set up interval to refresh tokens periodically
    const refreshInterval = setInterval(() => {
      // Only try to refresh if we have a user
      if (user?.id) {
        AuthAPI.me()
          .then(updatedUser => {
            // Only update if something changed
            if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
              setUser(updatedUser);
            }
          })
          .catch(error => {
            console.error('Failed to refresh user session:', error);
            // If 401 Unauthorized, clear user
            if (error.message === 'Not authenticated') {
              setUser(null);
            }
          });
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(email, password) {
      await AuthAPI.login({ email, password });
      const me = await AuthAPI.me();
      setUser(me);
      return me;
    },
    async logout() {
      await AuthAPI.logout();
      setUser(null);
    },
    async register(payload) {
      const res = await AuthAPI.register(payload);
      return res;
    },
    async tfaSetup() { return AuthAPI.tfaSetup(); },
    async tfaVerify(code) {
      const res = await AuthAPI.tfaVerify(code);
      try { if (res.accessToken) { setTokens({ access: res.accessToken }); } } catch {}
      try { const me = await AuthAPI.me(); setUser(me); } catch {}
      return res;
    },
    async tfaDisable() {
      const res = await AuthAPI.tfaDisable();
      try { if (res.accessToken) { setTokens({ access: res.accessToken }); } } catch {}
      try { const me = await AuthAPI.me(); setUser(me); } catch {}
      return res;
    },
    async tfaRecoveryCodes() { return AuthAPI.tfaRecoveryCodes(); }
  }), [user, loading]);

  return (
    <AuthCtx.Provider value={value}>
      <Toaster position="top-right" toastOptions={{
        duration: 5000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '16px'
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }} />
      {children}
      {process.env.NODE_ENV === 'development' && <NotificationDebugger />}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
