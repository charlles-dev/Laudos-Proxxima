/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Semantic Application Colors
                // Semantic Application Colors (Dynamic via App.tsx)
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
                surface: 'var(--color-surface)',
                paper: 'var(--color-paper)',
                txt: 'var(--color-text)',
                line: 'var(--color-border)',

                // Strict Palette Direct Access
                'proxxima-disco': '#9B2071',
                'proxxima-cerise': '#CD2784',
                'proxxima-tundora': '#444444',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.2s ease-out',
            }
        },
    },
    plugins: [],
}
