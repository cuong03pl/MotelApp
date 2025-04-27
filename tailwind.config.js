/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./HKCCinemas/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#000000",
        btnSignIn: "#FCC434",
        search: "#1C1C1C",
        sub: "#1C1C1C",
      },
      colors: {
        primary: "#F2F2F2",
        subtext: "#BFBFBF",
        title: "#FCC434",
      },
    },
  },
  plugins: [],
};
