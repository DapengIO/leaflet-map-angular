/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontSize: {
        "2sm": "0.5rem",
      },
      zIndex: {
        999: "999",
      },
    },
  },
  plugins: [],
};
