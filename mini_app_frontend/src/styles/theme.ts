/**
 * Shared Design System — Flat Black & White Theme
 * Used by both the admin dashboard and the Telegram Mini App.
 *
 * Philosophy:
 *  - Pure flat design: no gradients, no shadows, sharp edges
 *  - Black (#000) as primary / brand colour
 *  - White (#FFF) as background
 *  - Greys for hierarchy and muted states
 *  - Status distinctions via fill + border, never colour-coded
 */

// ─── Colour Tokens ──────────────────────────────────────────────────────────
export const colors = {
    black:   '#000000',
    white:   '#FFFFFF',
    gray50:  '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#E8E8E8',
    gray300: '#D0D0D0',
    gray400: '#A0A0A0',
    gray500: '#707070',
    gray600: '#505050',
    gray700: '#303030',
    gray800: '#1A1A1A',
    gray900: '#0A0A0A',

    // Semantic aliases
    background:    '#FFFFFF',
    backgroundAlt: '#F5F5F5',
    surface:       '#FFFFFF',
    surfaceHover:  '#F5F5F5',
    border:        '#E8E8E8',
    borderStrong:  '#000000',

    textPrimary:   '#000000',
    textSecondary: '#505050',
    textMuted:     '#A0A0A0',
    textDisabled:  '#D0D0D0',
    textInverse:   '#FFFFFF',

    // Status — flat fills
    statusActive:  { bg: '#000000', text: '#FFFFFF' },
    statusExpired: { bg: '#E8E8E8', text: '#505050' },
    statusFrozen:  { bg: '#A0A0A0', text: '#FFFFFF' },
} as const;

// ─── Typography ─────────────────────────────────────────────────────────────
export const typography = {
    fontFamily:     'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontFamilyMono: '"SF Mono", "Fira Code", Consolas, monospace',
    fontSize: {
        xs:   '0.75rem',
        sm:   '0.875rem',
        base: '1rem',
        lg:   '1.125rem',
        xl:   '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
    },
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight:  { tight: 1.2, normal: 1.5, loose: 1.8 },
    letterSpacing: { tight: '-0.02em', normal: '0em', wide: '0.05em', wider: '0.1em' },
} as const;

// ─── Spacing ────────────────────────────────────────────────────────────────
export const spacing = {
    0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
    5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px',
    16: '64px', 20: '80px',
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────
export const borderRadius = {
    none: '0px', sm: '2px', md: '4px', lg: '8px',
    xl: '12px', '2xl': '16px', full: '9999px',
} as const;

// ─── Shadows — flat: barely-there ────────────────────────────────────────────
export const shadows = {
    none: 'none',
    xs: '0 1px 2px rgba(0,0,0,0.04)',
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 2px 6px rgba(0,0,0,0.10)',
} as const;

// ─── Transitions ─────────────────────────────────────────────────────────────
export const transitions = {
    fast: '100ms ease', base: '150ms ease', slow: '250ms ease',
} as const;

// ─── Z-Index ─────────────────────────────────────────────────────────────────
export const zIndex = {
    base: 0, dropdown: 100, modal: 200, toast: 300, tooltip: 400,
} as const;

// ─── Component Recipes ────────────────────────────────────────────────────────
export const recipes = {
    btnPrimary:   'bg-black text-white font-medium hover:bg-gray-900 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-150',
    btnSecondary: 'bg-white text-black font-medium border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150',
    btnGhost:     'bg-transparent text-black font-medium hover:bg-gray-100 transition-colors duration-150',
    card:         'bg-white border border-gray-200',
    cardStrong:   'bg-white border-2 border-black',
    input:        'bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-150',
    label:        'text-sm font-medium text-black',
    labelMuted:   'text-sm text-gray-500',
    divider:      'border-t border-gray-200',
    dividerStrong:'border-t-2 border-black',
} as const;

// ─── Composed export ─────────────────────────────────────────────────────────
export const theme = {
    colors, typography, spacing, borderRadius, shadows, transitions, zIndex, recipes,
} as const;

export type Theme = typeof theme;
export default theme;

