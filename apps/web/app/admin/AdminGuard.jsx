"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers';

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    const roles = user?.roles || [];
    if (!user) router.replace('/login');
    else if (!roles.includes('admin') && !roles.includes('manager')) router.replace('/account');
    else if (!user.tfa) router.replace('/account/security');
  }, [user, loading, router]);
  if (loading) return <div className="section"><p className="muted">Loading…</p></div>;
  return <>{children}</>;
}

