/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            display: ['Outfit', 'sans-serif'],
         },
         colors: {
            primary: {
               DEFAULT: 'var(--primary)',
               foreground: 'var(--primary-foreground)',
               50: 'oklch(0.97 0.01 240)',
               100: 'oklch(0.93 0.03 240)',
               500: 'oklch(0.6 0.18 245)',
               600: 'oklch(0.5 0.18 250)',
               700: 'oklch(0.4 0.16 255)',
            },
            secondary: {
               DEFAULT: 'var(--secondary)',
               foreground: 'var(--secondary-foreground)',
               500: 'oklch(0.556 0.22 284.07)',
            }
         },
         borderRadius: {
            xl: 'calc(var(--radius) + 4px)',
            '2xl': 'calc(var(--radius) + 8px)',
            '3xl': 'calc(var(--radius) + 12px)',
         },
         boxShadow: {
            premium: '0 20px 50px -12px oklch(0.15 0.05 240 / 0.12)',
            vibrant: '0 20px 30px -10px oklch(0.55 0.2 250 / 0.3)',
         }
      },
   },
   plugins: [
      require("tailwindcss-animate"),
   ],
}
