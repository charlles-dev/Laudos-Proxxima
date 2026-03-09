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
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                slideUpFade: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.2s ease-out',
                shimmer: 'shimmer 2s infinite',
                pulseSoft: 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                slideUpFade: 'slideUpFade 0.4s ease-out forwards',
            }
        }
    },
    plugins: [],
}
