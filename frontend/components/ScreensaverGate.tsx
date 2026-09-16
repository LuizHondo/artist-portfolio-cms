'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/design/shared';
import { enabledSocials } from '@/lib/social-links';
import { useIsMobile } from '@/lib/useIsMobile';
import { PublicNav } from '@/components/PublicNav';
import MorphSlider from '@/components/home/MorphSlider';
import { homeV1Styles as s } from '@/components/home/homeStyles';
import { COLORS } from '@/lib/theme';

export function ScreensaverGate({ slides, children }: { slides: string[]; children: React.ReactNode }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  // Starts false on both server and client (avoids a hydration mismatch from
  // reading `window` in the initializer), then flips synchronously pre-paint
  // if we're on the home route, matching "locked on / only" without a flash.
  const [locked, setLocked] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const morphItems = useMemo(() => slides.map((image) => ({ image })), [slides]);

  // A click that refocuses the window also fires as a real click on whatever's
  // under the cursor — if that's the Enter button, it unlocks unintentionally.
  // Swallow the one click immediately following a focus regain.
  const suppressNextClick = useRef(false);
  useEffect(() => {
    const onFocus = () => {
      suppressNextClick.current = true;
      setTimeout(() => { suppressNextClick.current = false; }, 300);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useLayoutEffect(() => {
    if (window.location.pathname === '/') setLocked(true);
  }, []);

  // Fade the lockscreen in on first load.
  useEffect(() => {
    if (!locked) return;
    setFadeIn(false);
    const id = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(id);
  }, [locked]);

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

  const enter = () => {
    if (suppressNextClick.current) {
      suppressNextClick.current = false;
      return;
    }
    setLocked(false);
    router.push('/artworks');
  };

  const contentOpacity = 1;
  const heroStyle = {
    ...s.hero,
    position: 'fixed' as const,
    inset: 0,
    width: '100vw',
    maxWidth: 'none',
    height: '100dvh',
    zIndex: 20,
    opacity: fadeIn ? 1 : 0,
    transition: 'opacity .6s ease',
  };

  return (
    <>
      {locked && (
        <section style={heroStyle}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <MorphSlider
              items={morphItems}
              transition="melt"
              intensity={0.55}
              aberration={0.35}
              drift={0.4}
              autoplay
              autoplayDelay={3}
              showCaptions={true}
              showControls={false}
              showIndicators={false}
              radius={0}
            />
          </div>
          <div style={{ ...s.heroScrim, opacity: 0.25, transition: 'opacity .8s' }} />

          <PublicNav variant="hero" locked={locked} />

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
                      <Icon name={social.key} size={14} color={COLORS.cream} />
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
              <a href="/artworks" style={{ ...s.mobileEnter, minHeight: 64, opacity: 1, pointerEvents: 'auto', transition: 'opacity .8s' }} onClick={(e) => { e.preventDefault(); enter(); }}>
                Enter Portfolio Site
              </a>
              {enabledSocials.map((social) => (
                <a key={social.key} href={social.url} target="_blank" rel="noreferrer" style={{ ...s.mobileLink, opacity: contentOpacity, transition: 'opacity .8s' }} title={social.url}>
                  <span style={s.mobileLinkLeft}>
                    <Icon name={social.key} size={24} color={COLORS.cream} />
                    <span style={{ textTransform: 'capitalize' }}>{social.key}</span>
                  </span>
                  <Icon name="arrow" size={18} color={COLORS.cream} />
                </a>
              ))}
              <Link href="/links" style={{ ...s.mobileAll, opacity: contentOpacity, pointerEvents: 'auto', transition: 'opacity .8s' }}>
                all my links →
              </Link>
            </div>
          ) : (
            <div style={{ ...s.heroBottomRight, opacity: 1, transition: 'opacity .8s', width: 364, height: 114 }}>
              <div style={s.hbrKicker} />
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                <a href="/artworks" style={{ ...s.hbrEnterBtn, width: 360, height: 64, justifyContent: 'center', fontSize: 13, boxShadow: '0 8px 28px rgba(0,0,0,0.28)', opacity: 1, pointerEvents: 'auto', transition: 'opacity .8s' }} onClick={(e) => { e.preventDefault(); enter(); }}>
                  Enter Portfolio Site
                </a>
              </div>
            </div>
          )}
        </section>
      )}
      {children}
    </>
  );
}
