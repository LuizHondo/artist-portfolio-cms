'use client';

import type { CSSProperties, ReactNode } from 'react';

export function Paper({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: '#f2efe9',
        color: '#1a1714',
        fontFamily: '"Newsreader", Georgia, serif',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Render **bold** and *italic* spans inline. No markdown lib — tiny regex.
export function MarkText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let rest = text;
  let key = 0;
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/;
  while (rest.length) {
    const m = rest.match(re);
    if (!m) {
      parts.push(<span key={key++}>{rest}</span>);
      break;
    }
    if (m.index! > 0) parts.push(<span key={key++}>{rest.slice(0, m.index)}</span>);
    if (m[2] != null) parts.push(<strong key={key++}>{m[2]}</strong>);
    else parts.push(<em key={key++}>{m[3]}</em>);
    rest = rest.slice(m.index! + m[0].length);
  }
  return <>{parts}</>;
}

export function Mascot({ size = 10, color = '#1a1714' }: { size?: number; color?: string }) {
  return (
    <span
      style={{ display: 'inline-block', width: size, height: size, background: color, transform: 'rotate(45deg)' }}
    />
  );
}

export type IconName =
  | 'x'
  | 'bluesky'
  | 'cara'
  | 'vgen'
  | 'instagram'
  | 'artstation'
  | 'linkedin'
  | 'behance'
  | 'youtube'
  | 'mail'
  | 'arrow'
  | 'arrow-left';

export function Icon({ name, size = 18, color = 'currentColor' }: { name: IconName; size?: number; color?: string }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'x':
      return (
        <svg {...props}>
          <path d="M5 4 L19 20 M19 4 L5 20" />
        </svg>
      );
    case 'bluesky':
      return (
        <svg {...props}>
          <path d="M12 11 C10 8 7 5 4 5 C3 8 4 11 8 13 C5 13 4 15 5 18 C8 18 11 16 12 14 C13 16 16 18 19 18 C20 15 19 13 16 13 C20 11 21 8 20 5 C17 5 14 8 12 11 Z" />
        </svg>
      );
    case 'cara':
      return (
        <svg {...props}>
          <path d="M5 8 H11 Q15 8 15 12 Q15 16 11 16 H5 Z M15 8 H19 M15 12 H20" />
        </svg>
      );
    case 'vgen':
      return (
        <svg {...props}>
          <path d="M4 6 L9 18 L14 6 M14 6 L20 18" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill={color} />
        </svg>
      );
    case 'artstation':
      return (
        <svg {...props}>
          <path d="M3 17 L13 4 L19 14 H8" />
          <path d="M14 17 L17 21" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 10 V17 M7 7 V7.01 M11 17 V12 Q11 10 13 10 Q15 10 15 12 V17" />
        </svg>
      );
    case 'behance':
      return (
        <svg {...props}>
          <path d="M3 6 H8 Q10 6 10 8 Q10 10 8 10 H3 Z M3 10 H9 Q11 10 11 13 Q11 15 9 15 H3 Z" />
          <path d="M14 12 Q14 9 17 9 Q20 9 20 12 H14 Q14 15 17 15" />
          <path d="M15 6 H19" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...props}>
          <rect x="2.5" y="6" width="19" height="12" rx="3" />
          <path d="M10 9.5 L15 12 L10 14.5 Z" fill={color} />
        </svg>
      );
    case 'mail':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7 L12 13 L21 7" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...props}>
          <path d="M5 12 H19 M13 6 L19 12 L13 18" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...props}>
          <path d="M19 12 H5 M11 6 L5 12 L11 18" />
        </svg>
      );
    default:
      return null;
  }
}

export function PlaceholderImg({
  src,
  alt,
  ratio = '4/3',
  style,
  caption,
}: {
  src?: string;
  alt?: string;
  ratio?: string;
  style?: CSSProperties;
  caption?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: ratio,
        background: '#e6e2d9',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.035) 0 2px, transparent 2px 11px)',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered URLs, see design.md
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 10,
            fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
