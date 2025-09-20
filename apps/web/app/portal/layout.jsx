"use client";
import { useEffect, useState } from 'react';
import PortalGuard from './portalGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers';
import useUnreadIndicators from '../hooks/useUnreadIndicators';
import UnreadBadge from '../components/UnreadBadge';

export default function PortalLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCounts, unreadItems, markAsRead } = useUnreadIndicators();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const isActive = (path) => {
    if (path === pathname) return true;
    if (path === '/portal' && pathname !== '/portal') return false;
    if (pathname.startsWith(`${path}/`)) {
      if (path === '/portal/tickets' && pathname === '/portal/tickets/new') {
        return false;
      }
      return true;
    }
    return false;
  };

  const navItems = [
    { path: '/portal', label: 'Dashboard', icon: 'home', exact: true },
    { path: '/portal/tickets', label: 'My Tickets', icon: 'ticket' },
    { path: '/portal/tickets/new', label: 'New Ticket', icon: 'add', exact: true },
    { path: '/portal/quotes', label: 'Quotes', icon: 'document' },
    { path: '/portal/invoices', label: 'Invoices', icon: 'invoice' },
    { path: '/portal/payments', label: 'Payments', icon: 'payment' },
    { path: '/portal/appointments', label: 'Appointments', icon: 'calendar' },
    { path: '/portal/profile', label: 'Profile', icon: 'user' }
  ];

  const getIcon = (icon) => {
    const iconClass = 'w-5 h-5';

    switch (icon) {
      case 'home':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        );
      case 'ticket':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
          </svg>
        );
      case 'add':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        );
      case 'document':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        );
      case 'invoice':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
        );
      case 'payment':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        );
      case 'calendar':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        );
      case 'user':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        );
    }
  };

  const renderNavigation = (onNavigate) => (
    <nav className="p-3 space-y-1" aria-label="Customer">
      {navItems.map((item) => {
        const active = isActive(item.path);
        let unreadCount = 0;
        if (item.path === '/portal/tickets') {
          unreadCount = unreadCounts.tickets;
        } else if (item.path === '/portal/appointments') {
          unreadCount = unreadCounts.appointments;
        }

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              if (item.path === '/portal/tickets') {
                Object.keys(unreadItems.tickets).forEach((id) => markAsRead('tickets', id));
              } else if (item.path === '/portal/appointments') {
                Object.keys(unreadItems.appointments).forEach((id) => markAsRead('appointments', id));
              }
              if (typeof onNavigate === 'function') {
                onNavigate();
              }
            }}
          >
            <div className="flex items-center gap-3">
              <span className={active ? 'text-blue-600' : 'text-gray-500'}>{getIcon(item.icon)}</span>
              {item.label}
            </div>
            {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
          </Link>
        );
      })}
    </nav>
  );

  const desktopSidebarWidth = isDesktopSidebarCollapsed ? '0px' : '16rem';

  return (
    <PortalGuard>
      <div className="min-h-screen bg-gray-50">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`md:hidden fixed inset-y-0 left-0 z-50 w-full max-w-xs transform bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Customer Portal</h2>
            {user?.name ? <p className="text-xs text-gray-500 mt-1">Welcome back, {user.name.split(' ')[0]}</p> : null}
          </div>
          {renderNavigation(() => setIsMobileSidebarOpen(false))}
        </aside>

        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
          className="md:hidden fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Toggle customer navigation"
        >
          {isMobileSidebarOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h12M4 18h16"></path>
            </svg>
          )}
        </button>

        <div className="w-full px-4 md:px-8 py-6">
          <div className={`flex flex-col md:flex-row md:items-start ${isDesktopSidebarCollapsed ? 'md:gap-4' : 'md:gap-6'}`}>
            <div
              className="hidden md:flex md:flex-shrink-0 md:items-start md:transition-[width] md:duration-300 md:ease-in-out overflow-hidden"
              style={{ width: desktopSidebarWidth }}
            >
              <aside
                className={`w-64 md:w-64 md:sticky md:top-6 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 ease-in-out ${
                  isDesktopSidebarCollapsed ? 'translate-x-[-1rem] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 pointer-events-auto'
                }`}
              >
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Customer Portal</h2>
                  {user?.name ? <p className="text-xs text-gray-500 mt-1">Welcome back, {user.name.split(' ')[0]}</p> : null}
                </div>
                {renderNavigation()}
              </aside>
            </div>

            <main className="flex-1">
              <div className="mb-4 hidden md:flex items-center text-sm text-gray-500">
                <button
                  type="button"
                  onClick={() => setIsDesktopSidebarCollapsed((prev) => !prev)}
                  className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={isDesktopSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {isDesktopSidebarCollapsed ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 12l3 3m0 0l3-3m-3 3V9"></path>
                      </>
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12l-3-3m0 0l-3 3m3-3v6"></path>
                      </>
                    )}
                  </svg>
                  <span className="hidden lg:inline">{isDesktopSidebarCollapsed ? 'Show navigation' : 'Hide navigation'}</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </PortalGuard>
  );
}
