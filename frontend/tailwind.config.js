export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         colors: {
            primary: {
               50: '#f0f9ff',
               100: '#e0f2fe',
               500: '#0ea5e9', // Sky blue
               600: '#0284c7',
               700: '#0369a1', // Deeper Ocean Blue
               800: '#075985', // Darker for Hover states
            },
            secondary: {
               500: '#8b5cf6', // Violet
            }
         },
         fontFamily: {
            sans: ['Inter', 'sans-serif'],
         }
      },
   },
   plugins: [],
}
