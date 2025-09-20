"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../providers";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "Company" },
  { href: "/blog", label: "Resources" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const solidHeader = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const roles = user?.roles || [];
  const isAdminRole = roles.includes("admin") || roles.includes("manager");
  const portalLink = isAdminRole
    ? { href: "/admin", label: "Admin Console" }
    : { href: "/portal", label: "Client Portal" };

  const primaryCtaClass = solidHeader
    ? "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm bg-blue-600 transition-colors hover:bg-blue-700"
    : "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-gray-900 bg-white shadow-sm transition-colors hover:bg-gray-100";

  const secondaryCtaClass = solidHeader
    ? "inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold border-gray-200 text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
    : "inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold border-white text-white transition-colors hover:bg-white/10";

  const navLinkClass = (href) => {
    const active = pathname === href;
    if (solidHeader) {
      return active ? "text-blue-600" : "text-gray-600 hover:text-blue-600";
    }
    return active ? "text-white" : "text-white/80 hover:text-white";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        solidHeader ? "border-b border-gray-200 bg-white/95 backdrop-blur shadow-sm" : "border-transparent bg-transparent"
      }`}
    >
      <div className={`layout-container flex items-center justify-between ${solidHeader ? "py-3 text-gray-900" : "py-3 text-white"}`}>
        <div className={`flex items-center gap-2 font-semibold tracking-tight ${solidHeader ? "text-gray-900" : "text-white"}`}>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border-0 ${
              solidHeader ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
            }`}
            aria-hidden
          >
            <span className="text-sm font-bold">QT</span>
          </span>
          <Link href="/" className="text-lg font-semibold">
            QuickTechPro
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-1 text-base font-semibold transition-colors ${navLinkClass(link.href)}`}
              >
                {link.label}
                {!solidHeader && active ? (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href={portalLink.href} className={primaryCtaClass}>
                {portalLink.label}
              </Link>
              <button
                onClick={logout}
                className={`text-sm font-semibold transition-colors ${solidHeader ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"}`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={secondaryCtaClass}>
                Client Login
              </Link>
              <Link href="/book-service" className={primaryCtaClass}>
                Request Service
              </Link>
            </>
          )}
        </div>

        <button
          className={`md:hidden rounded-none p-0 transition-colors ${solidHeader ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white"}`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-gray-900/60 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-4 top-24 z-50 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-gray-200 md:hidden">
            <div className="px-6 pt-6 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
                Menu
              </p>
            </div>
            <nav className="flex flex-col divide-y divide-gray-100" aria-label="Mobile">
              {links.map((link) => {
                const active = pathname === link.href;
                const linkClass = active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-900 hover:bg-gray-100";
                const iconClass = active ? "text-blue-400" : "text-gray-300";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-6 py-3 text-base font-semibold transition-colors ${linkClass}`}
                  >
                    <span>{link.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`h-5 w-5 ${iconClass}`}
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L9.586 10 7.293 7.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-gray-100 bg-gray-50/90 px-6 py-6">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href={portalLink.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    {portalLink.label}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full rounded-full border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-100"
                  >
                    Client Login
                  </Link>
                  <Link
                    href="/book-service"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    Request Service
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
