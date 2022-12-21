const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
        "fugaz-one": ["Fugaz One", "curvsive"],
      },
      fontSize: {
        xxs: "0.6rem",
      },
    },
  },
  plugins: [],
};
