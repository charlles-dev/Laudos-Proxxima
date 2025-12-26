export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // based on root.classList.add('dark') in App.tsx
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
                surface: 'var(--color-surface)',
                paper: 'var(--color-paper)',
                txt: 'var(--color-text)', // mapped from 'text' in html config but 'text' is reserved
                line: 'var(--color-border)',
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
        }
    },
    plugins: [],
}
