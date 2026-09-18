'use client';

import type { CSSProperties, ReactNode } from 'react';
import { SiArtstation, SiBehance, SiBluesky, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons';
import { COLORS } from '@/lib/theme';

export function Paper({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: COLORS.background,
        color: COLORS.ink,
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

export function Mascot({ size = 10, color = COLORS.ink }: { size?: number; color?: string }) {
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
      return <SiX size={size} color={color} />;
    case 'bluesky':
      return <SiBluesky size={size} color={color} />;
    case 'cara':
      // Cara has no vector brand mark (not in Simple Icons, site blocks non-browser fetches) —
      // using their favicon (cara.app/favicon.ico) as a fixed-color raster, saved to public/icons/cara.png.
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="/icons/cara.png" width={size} height={size} alt="Cara" style={{ borderRadius: '50%' }} />;
    case 'vgen':
      // Official VGen icon mark (vgen.co/img/logo-icon-black-outline.svg), flattened to `color` to match the other marks.
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={color}
            d="M15.019 7.535a8.337 8.337 0 0 1 11.774.617l.248.275c1.409 1.527 2.666 3.731 2.612 5.905a4.5 4.5 0 0 1-.665 2.252l-.082.131q-.068.109-.187.291c-.159.242-.383.578-.664.977a36 36 0 0 1-2.31 2.959c-.938 1.073-2.134 2.29-3.497 3.273-1.282.924-3.23 2.019-5.574 2.019-2.297 0-4.268-1.059-5.573-1.934-1.407-.944-2.688-2.122-3.718-3.176a41 41 0 0 1-3.53-4.15l-.091-.125a4.469 4.469 0 0 1 7.252-5.221l.033.045.145.194a31 31 0 0 0 1.084 1.354 8.3 8.3 0 0 1 2.743-5.686"
          />
          <path
            fill={color}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.317 9.048a5.47 5.47 0 0 1 7.725.405l.26.287.002.004c1.175 1.268 1.897 2.791 1.863 3.913v.003c-.007.274-.084.55-.239.802l-.019.03-.044.071-.166.258c-.143.219-.35.528-.61.897a33 33 0 0 1-2.123 2.72c-.863.989-1.897 2.029-3.014 2.834-1.088.784-2.438 1.478-3.899 1.478-1.444 0-2.833-.681-3.975-1.448-1.179-.79-2.305-1.817-3.264-2.798a38 38 0 0 1-3.325-3.919l-.02-.028c-.143-.224-.234-.383-.283-.69A1.598 1.598 0 0 1 7.1 12.054c.48.106.76.353.967.632l.001.001.01.014.04.055.167.223a35 35 0 0 0 2.82 3.287c.88.9 1.833 1.757 2.757 2.377.962.645 1.7.905 2.191.905.363 0 .842-.145 1.424-.481l.406-.235-.355-.306a4 4 0 0 1-.322-.315l-1.294-1.438a5.47 5.47 0 0 1 .405-7.725m6.07 4.945a30 30 0 0 1-1.832 2.339l-.017.019-.233.266-2.006-1.98-.007-.006a2.268 2.268 0 1 1 3.37-3.035l.26.287c.25.279.465.588.572.933.11.355.099.732-.073 1.12l-.014.03z"
          />
        </svg>
      );
    case 'instagram':
      return <SiInstagram size={size} color={color} />;
    case 'artstation':
      return <SiArtstation size={size} color={color} />;
    case 'linkedin':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 10 V17 M7 7 V7.01 M11 17 V12 Q11 10 13 10 Q15 10 15 12 V17" />
        </svg>
      );
    case 'behance':
      return <SiBehance size={size} color={color} />;
    case 'youtube':
      return <SiYoutube size={size} color={color} />;
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
        background: COLORS.border,
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
