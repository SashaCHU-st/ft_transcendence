
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//     },
//   },
//   plugins: [],
// }

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        neon: `
          -8px -8px 60px rgba(255, 0, 255, 0.7),
           8px -8px 20px rgba(0, 255, 255, 0.7),
          -2px 2px 10px rgba(0, 252, 101, 0.7),
           8px 8px 20px rgba(113, 240, 2, 0.7),
           0 0 10px rgba(255, 0, 255, 0.6),
           0 0 20px rgba(255, 0, 255, 0.4),
           0 0 40px rgba(255, 0, 255, 0.2)
        `,
        'neon-btn': '0 0 15px 2px rgba(255, 0, 255, 0.5)',
      },
      colors: {
        neonPink: '#ff00ff',
        neonGreen: '#00fc65',
        neonCyan: '#00ffff',
        neonIndigo: '#6600ff',
		mainNeon: '#0a0a23',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // make sure this matches your file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}