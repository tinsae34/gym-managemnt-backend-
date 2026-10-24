/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FFFFFF',
                surface: '#F5F5F5',
                border: '#E0E0E0',
                text: {
                    primary: '#000000',
                    secondary: '#666666',
                    disabled: '#999999',
                },
                status: {
                    active: '#000000',
                    expired: '#666666',
                    frozen: '#999999',
                },
                accent: '#000000',
                hover: '#F0F0F0',
            },
            borderRadius: {
                'none': '0px',
                'sm': '2px',
                'md': '4px',
                'lg': '8px',
            },
            boxShadow: {
                'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'md': '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
