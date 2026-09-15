'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/lib/design/shared';
import { enabledSocials } from '@/lib/social-links';
import { useIsMobile } from '@/lib/useIsMobile';
import { PublicNav } from '@/components/PublicNav';
import { homeV1Styles as s } from './homeStyles';

export function Hero({ slides }: { slides: string[] }) {
  const isMobile = useIsMobile();
  const [slideIdx, setSlideIdx] = useState(0);
  const [locked, setLocked] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (locked) {
      root.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    }

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [locked]);

  // 60s of no interaction after unlocking returns the page to its lockscreen.
  useEffect(() => {
    if (locked) return;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setLocked(true), 60000);
    };
    const events: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart'];
    resetIdleTimer();
    events.forEach((e) => window.addEventListener(e, resetIdleTimer, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
    };
  }, [locked]);

  const contentOpacity = 1;
  const heroStyle = {
    ...s.hero,
    position: locked ? 'fixed' as const : 'relative' as const,
    ...(locked
      ? { inset: 0, width: '100vw', maxWidth: 'none', height: '100dvh', zIndex: 20 }
      : { height: isMobile ? '100vh' : s.hero.height }),
  };

  if (!locked) return null;

  return (
    <section style={heroStyle}>
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            ...s.heroSlide,
            opacity: i === slideIdx ? 1 : 0,
            animation: i === slideIdx ? 'heroPan 14s ease-in-out infinite alternate' : 'none',
          }}
        />
      ))}
      <div style={{ ...s.heroScrim, opacity: locked ? 0.25 : 1, transition: 'opacity .8s' }} />

      <PublicNav active="Home" variant="hero" locked={locked} />

      <div style={{ ...s.heroDots, opacity: contentOpacity, pointerEvents: locked ? 'none' : 'auto', transition: 'opacity .8s' }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setSlideIdx(i)}
            style={{ ...s.heroDot, ...(i === slideIdx ? s.heroDotActive : {}) }}
          />
        ))}
      </div>

      {!isMobile && (
        <div style={{ ...s.heroBottomLeft, opacity: contentOpacity, transition: 'opacity .8s', width: 726 }}>
          <div style={{ ...s.hbColumn, height: 'auto', width: '100%', justifyContent: 'flex-start' }}>
            <div style={{ width: 420 }}>
              <h1 style={{ ...s.hbName, fontSize: 95, fontWeight: 900, whiteSpace: 'nowrap', textShadow: '0 3px 18px rgba(0,0,0,0.5)' }}>Raul Barbosa</h1>
              <div style={{ ...s.hbTag, fontSize: 16, letterSpacing: '0.08em' }}>Illustrator and Animator</div>
            </div>
            <div style={{ ...s.hbLinksRow, width: '100%', marginTop: 36 }}>
              {enabledSocials.slice(0, 4).map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...s.hbrSocialBtn, textDecoration: 'none' }}
                  title={social.url}
                >
                  <Icon name={social.key} size={14} color="#f6f4ef" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        // Single flex column anchored to the bottom, so the name block and the
        // link list stack in normal flow instead of two independently
        // absolute-positioned blocks with guessed offsets (which overlapped
        // once all 5 socials were enabled).
        <div style={{ ...s.mobileStack, opacity: 1, transition: 'opacity .8s' }}>
          <div>
            <h1 style={{ ...s.hbName, fontSize: 44, fontWeight: 800, whiteSpace: 'nowrap', textShadow: '0 3px 18px rgba(0,0,0,0.5)' }}>Raul Barbosa</h1>
            <div style={{ ...s.hbTag, fontSize: 13, letterSpacing: '0.08em' }}>Illustrator and Animator</div>
          </div>
          <a href="#gallery" style={{ ...s.mobileEnter, minHeight: 64, opacity: locked ? 1 : 0, pointerEvents: locked ? 'auto' : 'none', transition: 'opacity .8s' }} onClick={() => setLocked(false)}>
            Enter Portfolio Site
          </a>
          {enabledSocials.map((social) => (
            <a key={social.key} href={social.url} target="_blank" rel="noreferrer" style={{ ...s.mobileLink, opacity: contentOpacity, transition: 'opacity .8s' }} title={social.url}>
              <span style={s.mobileLinkLeft}>
                <Icon name={social.key} size={24} color="#f6f4ef" />
                <span style={{ textTransform: 'capitalize' }}>{social.key}</span>
              </span>
              <Icon name="arrow" size={18} color="#f6f4ef" />
            </a>
          ))}
          <Link href="/links" style={{ ...s.mobileAll, opacity: contentOpacity, pointerEvents: locked ? 'none' : 'auto', transition: 'opacity .8s' }}>
            all my links →
          </Link>
        </div>
      ) : (
        <div style={{ ...s.heroBottomRight, opacity: 1, transition: 'opacity .8s', width: 364, height: 114 }}>
          <div style={s.hbrKicker} />
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
            <a href="#gallery" style={{ ...s.hbrEnterBtn, width: 360, height: 64, justifyContent: 'center', fontSize: 13, boxShadow: '0 8px 28px rgba(0,0,0,0.28)', opacity: locked ? 1 : 0, pointerEvents: locked ? 'auto' : 'none', transition: 'opacity .8s' }} onClick={() => setLocked(false)}>
              Enter Portfolio Site
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

