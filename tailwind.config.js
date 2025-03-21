/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        beige: "#f5f5dc", // beige 색상 추가
      },
    },
  },
  plugins: [],
};
