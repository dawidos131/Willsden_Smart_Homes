'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type NavItem = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

type SiteHeaderProps = {
  currentPathname?: string;
};

const PHONE_HREF = 'tel:07407023280';
const PHONE_LABEL = '07407 023 280';
const WHATSAPP_HREF = 'https://wa.me/447407023280';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      { label: 'All Services', href: '/services' },
      { label: 'Small Electrical Jobs', href: '/services/small-jobs' },
      { label: 'Smart-Home Installs', href: '/services/smart-home' },
      { label: 'Maintenance and Fault Finding', href: '/services/maintenance' }
    ]
  },
  { label: 'Smart Home', href: '/smart-home' },
  { label: 'Automation', href: '/automation' },
  { label: 'Areas', href: '/areas' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Reviews', href: '/reviews' }
];

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function normalizePath(path: string): string {
  if (!path) return '/';
  const trimmed = path.split('?')[0].split('#')[0] || '/';
  if (trimmed.length > 1 && trimmed.endsWith('/')) {
    return trimmed.slice(0, -1);
  }
  return trimmed;
}

function isActivePath(pathname: string, href?: string): boolean {
  if (!href) return false;
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(target + '/');
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.2 19.2 0 0 1-5.9-5.9A19.8 19.8 0 0 1 2.2 4.2 2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8.2 10a16 16 0 0 0 5.8 5.8l1.3-1.3a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2.1Z" />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M20 11.8A8 8 0 0 1 8.4 19L4 20l1.1-4.2A8 8 0 1 1 20 11.8Z" />
      <path d="M9.5 9.2c.2-.5.4-.5.6-.5h.5c.2 0 .4.1.5.4l.4 1c.1.2.1.4 0 .5l-.4.5c-.1.1-.1.3 0 .4.3.6.8 1.1 1.4 1.4.1.1.3 0 .4 0l.5-.4c.1-.1.3-.1.5 0l1 .4c.3.1.4.3.4.5v.5c0 .2 0 .4-.5.6-.4.2-1.2.2-2.5-.4a7.1 7.1 0 0 1-3.1-3.1c-.6-1.3-.6-2.1-.4-2.4Z" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export default function SiteHeader({ currentPathname = '' }: SiteHeaderProps) {
  const [pathname, setPathname] = useState<string>(currentPathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);
  const firstServiceLinkRef = useRef<HTMLAnchorElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const wasMobileOpenRef = useRef(false);

  const servicesItem = useMemo(() => NAV_ITEMS.find((item) => item.label === 'Services'), []);
  const servicesLinks = servicesItem?.children ?? [];

  useEffect(() => {
    // Keep active nav in sync in client-only environments.
    if (currentPathname) {
      setPathname(currentPathname);
      return;
    }

    const updatePathname = () => setPathname(window.location.pathname || '/');
    updatePathname();
    window.addEventListener('popstate', updatePathname);
    return () => window.removeEventListener('popstate', updatePathname);
  }, [currentPathname]);

  useEffect(() => {
    // Toggle sticky header visual state once user scrolls.
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Global Escape handling for dropdown and mobile drawer.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (servicesOpen) setServicesOpen(false);
        if (mobileOpen) setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [servicesOpen, mobileOpen]);

  useEffect(() => {
    // Close floating panels when user clicks outside.
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (servicesOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setServicesOpen(false);
      }

      if (mobileOpen && mobileDrawerRef.current && !mobileDrawerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [servicesOpen, mobileOpen]);

  useEffect(() => {
    // Move focus into the services menu when it opens.
    if (servicesOpen && firstServiceLinkRef.current) {
      firstServiceLinkRef.current.focus();
    }
  }, [servicesOpen]);

  useEffect(() => {
    if (mobileOpen) {
      lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
      if (firstMobileLinkRef.current) {
        firstMobileLinkRef.current.focus();
      }
      document.body.style.overflow = 'hidden';
    } else if (wasMobileOpenRef.current) {
      document.body.style.overflow = '';
      if (lastFocusedElementRef.current && typeof lastFocusedElementRef.current.focus === 'function') {
        lastFocusedElementRef.current.focus();
      } else if (mobileMenuButtonRef.current) {
        mobileMenuButtonRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
    }

    wasMobileOpenRef.current = mobileOpen;

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    // Ensure drawer is closed when entering desktop breakpoint.
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const servicesIsActive = servicesLinks.some((item) => isActivePath(pathname, item.href));

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="hidden h-9 border-b border-slate-200 bg-white/90 lg:block">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6 text-sm text-slate-700">
          <p className="font-medium">
            Serving NW London <span className="mx-2 text-slate-400" aria-hidden="true">&middot;</span> City &amp; Guilds Qualified
          </p>
          <div className="flex items-center gap-4">
            <span className="font-medium">Mon-Sat 08:00-18:00</span>
            <a
              href="/reviews"
              className="font-semibold text-slate-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Reviews
            </a>
          </div>
        </div>
      </div>

      <div
        className={cx(
          'border-b transition-all duration-200',
          isScrolled
            ? 'h-[60px] border-slate-200/80 bg-white/90 shadow-[0_6px_20px_rgba(15,23,42,0.08)] backdrop-blur-md'
            : 'h-[72px] border-slate-200/60 bg-white/85'
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            aria-label="Willesden Smart Homes home"
          >
            <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-700 text-sm font-bold tracking-wide text-white shadow-sm">
              WSH
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold text-slate-900">Willesden Smart Homes</span>
              <span className="block truncate text-xs text-slate-500">Smart Home &amp; Electrical Specialists</span>
            </span>
          </a>

          <nav className="hidden flex-1 justify-center lg:flex" aria-label="Primary navigation">
            <ul className="flex items-center gap-7 whitespace-nowrap">
              {NAV_ITEMS.map((item) => {
                if (item.children?.length) {
                  return (
                    <li key={item.label} className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setServicesOpen((prev) => !prev)}
                        aria-expanded={servicesOpen}
                        aria-controls="services-menu"
                        aria-haspopup="menu"
                        className={cx(
                          'group relative inline-flex items-center gap-1.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
                          servicesIsActive && 'text-slate-900'
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDownIcon className={cx('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} />
                        <span
                          className={cx(
                            'absolute -bottom-[9px] left-0 right-0 h-0.5 rounded-full bg-sky-600 transition-opacity',
                            servicesIsActive || servicesOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      <div
                        id="services-menu"
                        role="menu"
                        aria-label="Services submenu"
                        className={cx(
                          'absolute left-1/2 top-full z-20 mt-3 w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all',
                          servicesOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                        )}
                      >
                        {item.children.map((child, index) => (
                          <a
                            key={child.href}
                            href={child.href}
                            ref={index === 0 ? firstServiceLinkRef : undefined}
                            role="menuitem"
                            onClick={() => setServicesOpen(false)}
                            className={cx(
                              'block rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                              isActivePath(pathname, child.href) && 'bg-slate-50 font-medium text-slate-900'
                            )}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </li>
                  );
                }

                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={cx(
                        'group relative inline-block py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
                        active && 'text-slate-900'
                      )}
                    >
                      {item.label}
                      <span
                        className={cx(
                          'absolute -bottom-[9px] left-0 right-0 h-0.5 rounded-full bg-sky-600 transition-opacity',
                          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                        )}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={PHONE_HREF}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>{PHONE_LABEL}</span>
            </a>

            <a
              href="/contact"
              className="inline-flex h-11 items-center rounded-full bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Get a Quote
            </a>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={PHONE_HREF}
              aria-label="Call 07407 023 280"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>

            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cx(
          'fixed inset-0 z-50 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <button
          type="button"
          aria-label="Close menu backdrop"
          onClick={() => setMobileOpen(false)}
          className={cx(
            'absolute inset-0 bg-slate-900/40 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
        />

        <aside
          id="mobile-menu"
          ref={mobileDrawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={cx(
            'absolute right-0 top-0 h-full w-[320px] max-w-[92vw] border-l border-slate-200 bg-white p-4 shadow-2xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Menu</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Close mobile menu"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <nav aria-label="Mobile primary navigation">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                if (item.children?.length) {
                  return (
                    <li key={item.label} className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                      <div className="mt-2 space-y-1">
                        {item.children.map((child, index) => (
                          <a
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={cx(
                              'block rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                              isActivePath(pathname, child.href) && 'bg-slate-50 font-medium text-slate-900'
                            )}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      ref={item.label === 'Home' ? firstMobileLinkRef : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cx(
                        'block rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                        isActivePath(pathname, item.href) && 'bg-slate-50 font-medium text-slate-900'
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
            <a
              href={PHONE_HREF}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>{PHONE_LABEL}</span>
            </a>

            <a
              href="/contact"
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-sky-700 px-5 text-sm font-semibold text-white hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Get a Quote
            </a>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </aside>
      </div>
    </header>
  );
}
