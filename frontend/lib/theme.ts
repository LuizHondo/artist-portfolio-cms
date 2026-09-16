// Single source of truth for the public site's palette. Matches the design
// canvas's TWEAK_DEFAULTS colors — mirrored in app/globals.css's :root for
// the few spots that need a plain CSS value instead of a JS style object.
export const COLORS = {
  background: '#f0ebe1', // page bg behind the Paper wrapper (about, artwork detail)
  ink: '#2e2e2e', // default body text; dark surfaces (active filter pill, ink-on-cream buttons, bar nav text)
  inkDark: '#2e2e2e', // home hero section background, behind the slideshow
  inkSoft: '#2e2e2e', // artwork detail meta/caption text (plate info, figure captions)
  cream: '#f6f4ef', // text/icons on dark surfaces (hero, gallery card overlays, links page, footer CTA button)
  creamWarm: '#fffdf8', // mobile "Enter Portfolio" button background
  border: '#e6e2d9', // placeholder image fallback background
  accent: '#355ecf', // brand accent — active nav link, artwork contact CTA
  white: '#ffffff', // footer text/mark, artwork contact card background, click-spark cursor color
  black: '#2e2e2e', // footer section background
} as const;
