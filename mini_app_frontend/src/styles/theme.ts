// Shared theme for both admin dashboard and mini app
export const theme = {
    colors: {
        // Black & White palette  
        background: '#FFFFFF',
        surface: '#F5F5F5',
        border: '#E0E0E0',
        text: {
            primary: '#000000',
            secondary: '#666666',
            disabled: '#999999',
        },
        // Status colors (minimal, flat)
        status: {
            active: '#000000',
            expired: '#666666',
            frozen: '#999999',
        },
        // Accent (minimal black)
        accent: '#000000',
        hover: '#F0F0F0',
    },

    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },

    borderRadius: {
        none: '0px',
        sm: '2px',
        md: '4px',
        lg: '8px',
    },

    fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '24px',
        '2xl': '32px',
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    shadows: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
};

export type Theme = typeof theme;
