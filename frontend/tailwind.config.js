/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/*/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#FFFFFF",
        back: "#F4F4F4",
        customorange: "#E79A82",
        customgreen: "#9EAB71",
        customyellow: "#E7D582",
        custompink: "#DFACD4",
        custompurple: "#B5B1E1",
        buttoncategory: "#CACACA"
      },
      boxShadow: {
        'custom': '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'custom-bg': "url('/src/images/bg.png')",
      },
    },
  },
  plugins: [],
}
