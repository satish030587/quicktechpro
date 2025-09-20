"use client";
import Link from 'next/link';
import { useAuth } from '../providers';

export default function AccountClient() {
  const { user } = useAuth();
  return (
    <section className="section">
      <h1>My Account</h1>
      {user ? (
        <div className="card">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Roles:</strong> {(user.roles || []).join(', ')}</p>
          <p><strong>2FA Enabled:</strong> {user.tfa ? 'Yes' : 'No'}</p>
          <p><Link className="cta secondary" href="/account/security">Security Settings</Link></p>
        </div>
      ) : (
        <p className="muted">You are not logged in. <a href="/login">Login</a></p>
      )}
    </section>
  );
}

