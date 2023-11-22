import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      colors: {
        primary: {
          50: "#E0F4FF",
          100: "#B1E4FF",
          200: "#7CD2FF",
          300: "#43C0FF",
          400: "#00B1FF",
          500: "#00A5FD",
          600: "#0097EE",
          700: "#0084D9",
          800: "#0073C5",
          900: "#0152A2",
          default: "#00B1FF",
        },
        secondary: {
          50: "#DDF7F6",
          100: "#A9EAE7",
          200: "#6DDDDA",
          300: "#00CECE",
          400: "#00C4C7",
          500: "#00B9C1",
          600: "#00A9AF",
          700: "#009496",
          800: "#00807F",
          900: "#005C55",
          default: "#00CECE",
        },
        info: {
          50: "#E0F4FF",
          500: "#00B1FF",
          700: "#0084D9",
        },
        success: {
          50: "#E5F5ED",
          400: "#45B889",
          700: "#008A5C",
        },
        warning: {
          50: "#FFF3E1",
          300: "#FFB855",
          500: "#FF8E1C",
        },
        error: {
          50: "#FFF3F4",
          300: "#FF6560",
          400: "#EE2C23",
        },
        wGray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
        },
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
