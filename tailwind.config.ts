import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        deriv: {
          red: "#ff444f",
          darkred: "#d43640",
          lightred: "#fff0f1",
          black: "#0e1117",
          cardDark: "#161b26",
          borderDark: "#262c3a",
        },
        risk: {
          safe: "#00a76f",
          warning: "#ff9800",
          danger: "#ff444f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
