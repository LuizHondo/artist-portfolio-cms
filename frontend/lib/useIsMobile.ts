'use client';

import { useEffect, useState } from 'react';

// Matches the real viewport (not artboard width) so the mobile-only
// linktree hero layout only kicks in on an actual small screen.
export function useIsMobile(query = '(max-width: 760px)') {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return isMobile;
}
