const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Roboto"',
          "Helvetica",
          "Arial",
          ...defaultTheme.fontFamily.sans,
        ],
        roboto: ['"Roboto"', "sans-serif"],
        "roboto-flex": ['"Roboto Flex"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
