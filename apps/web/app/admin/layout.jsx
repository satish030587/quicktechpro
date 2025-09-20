"use client";

import AdminGuard from './AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import NotificationListener from '../components/NotificationListener';
import { useAuth } from '../providers';

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/admin/tickets', label: 'Tickets', icon: 'ticket' },
  { path: '/admin/tickets/board', label: 'Ticket Board', icon: 'view-boards' },
  { path: '/admin/customers', label: 'Customers', icon: 'users' },
  { path: '/admin/finance', label: 'Finance', icon: 'currency-dollar' },
  { path: '/admin/content', label: 'Content', icon: 'document' },
  { path: '/admin/quotations', label: 'Quotations', icon: 'document-text' },
  { path: '/admin/users', label: 'Users', icon: 'user-group' },
  { path: '/admin/reports', label: 'Reports', icon: 'chart-bar' },
  { path: '/admin/appointments', label: 'Appointments', icon: 'calendar' },
  { path: '/admin/settings', label: 'Settings', icon: 'cog' },
  { path: '/admin/knowledge-base', label: 'KB Admin', icon: 'book-open' },
  { path: '/admin/notifications', label: 'Notifications', icon: 'bell' },
  { path: '/admin/logs', label: 'Logs', icon: 'document-report' },
  { path: '/admin/security', label: 'Backup & Security', icon: 'shield-check' },
  { path: '/admin/integrations', label: 'Integrations', icon: 'puzzle' },
];

const ICON_CLASS = 'h-5 w-5';

function renderIcon(icon) {
  switch (icon) {
    case 'home':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11 2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'users':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'ticket':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      );
    case 'view-boards':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'document-text':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'currency-dollar':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'document':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'book-open':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case 'document-report':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'puzzle':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      );
    case 'user-group':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'chart-bar':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'cog':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'shield-check':
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    default:
      return (
        <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      );
  }
}

function useSidebarController() {
  const [isPinned, setIsPinned] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const togglePinned = useCallback(() => setIsPinned((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  return { isPinned, togglePinned, isMobileOpen, closeMobile, toggleMobile };
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isPinned, togglePinned, isMobileOpen, closeMobile, toggleMobile } = useSidebarController();
  const closeButtonRef = useRef(null);
  const userId = user?.id ?? user?.sub ?? null;
  const userEmail = user?.email ?? 'admin';
const isActive = useCallback(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
    [pathname]
  );

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!isMobileOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (isDesktop) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  useEffect(() => {
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMobile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen, closeMobile]);

  useEffect(() => {
    if (isMobileOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMobileOpen]);

  const sidebarClasses = [
  'fixed inset-y-0 left-0 z-40 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out md:relative md:z-auto md:h-auto md:w-64 md:rounded-xl md:border md:border-gray-200 md:shadow-sm',
  isMobileOpen ? 'translate-x-0' : '-translate-x-full',
  'md:translate-x-0',
  isPinned ? 'md:block' : 'md:hidden'
].join(' ');

  return (
  <AdminGuard>
    <NotificationListener userId={userId} role={user?.roles?.[0]}>
      <div className="min-h-screen bg-gray-50">
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            role="presentation"
            aria-hidden="true"
            onClick={closeMobile}
          />
        )}

        <div className="w-full px-4 md:px-8 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
            <aside
              id="admin-sidebar"
              className={sidebarClasses}
              aria-hidden={!isPinned && !isMobileOpen}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 md:block md:border-none">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Admin Portal</h2>
                  <p className="text-xs text-gray-500">Signed in as {userEmail}</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMobile}
                  className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close navigation"
                  aria-controls="admin-sidebar"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-1 px-3 py-4" aria-label="Admin navigation">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        closeMobile();
                      }}
                    >
                      <span className={active ? 'text-blue-600' : 'text-gray-500'}>{renderIcon(item.icon)}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="flex-1 space-y-6">
              <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-base font-medium text-gray-900">{userEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePinned}
                    className="hidden md:inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
                    aria-label={isPinned ? 'Hide navigation' : 'Show navigation'}
                    aria-pressed={!isPinned}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {isPinned ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 12l3 3m0 0l3-3m-3 3V9" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12l-3-3m0 0l-3 3m3-3v6" />
                        </>
                      )}
                    </svg>
                    <span className="hidden lg:inline">{isPinned ? 'Hide navigation' : 'Show navigation'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleMobile}
                    className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 md:hidden"
                    aria-label="Toggle navigation"
                    aria-expanded={isMobileOpen}
                    aria-controls="admin-sidebar"
                  >
                    {isMobileOpen ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </header>

              <main className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </NotificationListener>
  </AdminGuard>
);

}









