import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"], // Add other themes if needed
  },
  theme: {
    extend: {},
  },
};
