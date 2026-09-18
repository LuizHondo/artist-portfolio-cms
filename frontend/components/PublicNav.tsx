'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { COLORS } from '@/lib/theme';
import { LogoMark } from '@/components/LogoMark';

// Shared Home / Artworks / About nav, matching home-v1.jsx's NavV1 link set
// and active-state logic. Home floats transparent over the hero (`hero`);
// every other page uses the artwork pages' static bordered bar (`bar`).
const links = [
  { label: 'Home', href: '/home' },
  { label: 'Artworks', href: '/artworks' },
  { label: 'About', href: '/about' },
] as const;

type Active = (typeof links)[number]['label'];

const logoWrap = {
  fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  fontSize: 13,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  fontWeight: 700,
  cursor: 'pointer',
  overflow: 'hidden',
};
const logoScript = {
  fontFamily: '"Permanent Marker", cursive',
  fontSize: 64,
  letterSpacing: 0,
  textTransform: 'none' as const,
  marginRight: 12,
};
const navLinksRow = {
  position: 'relative' as const,
  display: 'flex',
  gap: 26,
  fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  fontSize: 12,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  fontWeight: 600,
};

const variants = {
  // home-v1.jsx: absolute over the hero, cream text
  hero: {
    nav: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 56px',
      color: COLORS.cream,
    },
    link: { cursor: 'pointer', opacity: 0.85, textDecoration: 'none', color: 'inherit' },
    linkActive: {
      color: COLORS.white,
      opacity: 1,
    },
    pill: 'rgba(255,255,255,0.7)',
  },
  // project-v2.jsx: static bordered bar, ink text
  bar: {
    nav: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid rgba(26,23,20,0.25)',
      color: COLORS.ink,
    },
    link: { cursor: 'pointer', textDecoration: 'none', color: 'inherit' },
    linkActive: { color: COLORS.accent },
    pill: COLORS.accent,
  },
};

// Underline pill that glides under whichever link is active/hovered, GSAP-eased.
function useGlidingUnderline(color: string) {
  const rowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const moveTo = (el: HTMLElement | null) => {
    const row = rowRef.current;
    const pill = pillRef.current;
    if (!row || !pill || !el) return;
    const rowRect = row.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    gsap.to(pill, {
      x: elRect.left - rowRect.left,
      width: elRect.width,
      opacity: 1,
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const hide = () => {
    const active = rowRef.current?.querySelector('[data-nav-active="true"]') as HTMLElement | null;
    if (active) moveTo(active);
    else gsap.to(pillRef.current, { opacity: 0, duration: 0.2 });
  };

  useLayoutEffect(() => {
    hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rowRef, pillRef, moveTo, hide, color };
}

export function PublicNav({ active, variant, locked = false }: { active?: Active; variant: keyof typeof variants; locked?: boolean }) {
  const v = variants[variant];
  const { rowRef, pillRef, moveTo, hide } = useGlidingUnderline(v.pill);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    gsap.to(menu, {
      height: menuOpen ? 'auto' : 0,
      opacity: menuOpen ? 1 : 0,
      duration: 0.3,
      ease: 'power2.inOut',
    });
  }, [menuOpen]);

  return (
    <nav style={{ ...v.nav, opacity: locked ? 0 : 1, pointerEvents: locked ? 'none' : 'auto', transition: 'opacity .8s' }} aria-hidden={locked}>
      <Link
        href="/home"
        className="logo-link"
        style={{ ...logoWrap, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}
        tabIndex={locked ? -1 : undefined}
      >
        <LogoMark size={100} />
        <span className="logo-wordmark">
          <span style={logoScript}>Raul Barbosa</span>
        </span>
      </Link>

      <div ref={rowRef} className="nav-links-row" style={navLinksRow} onMouseLeave={hide}>
        <div
          ref={pillRef}
          style={{
            position: 'absolute',
            bottom: -3,
            left: 0,
            height: 1,
            background: v.pill,
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            tabIndex={locked ? -1 : undefined}
            data-nav-active={l.label === active}
            style={{ ...v.link, ...(l.label === active ? v.linkActive : {}) }}
            onMouseEnter={(e) => moveTo(e.currentTarget)}
            onFocus={(e) => moveTo(e.currentTarget)}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        className="nav-burger"
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 8 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {menuOpen ? <path d="M5 5 L19 19 M19 5 L5 19" /> : <path d="M4 7 H20 M4 12 H20 M4 17 H20" />}
        </svg>
      </button>

      <div
        ref={menuRef}
        className="nav-mobile-menu"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          height: 0,
          opacity: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: variant === 'hero' ? COLORS.inkDark : COLORS.background,
          color: variant === 'hero' ? COLORS.cream : COLORS.ink,
        }}
      >
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '16px 24px',
              textDecoration: 'none',
              color: l.label === active ? v.pill : 'inherit',
              fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
