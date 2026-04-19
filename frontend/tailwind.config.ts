import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT:  "#f8f9fa",
          low:      "#f3f4f5",
          lowest:   "#ffffff",
          high:     "#e7e8e9",
          highest:  "#e1e3e4",
        },
        "on-surface": {
          DEFAULT: "#191c1d",
          variant: "#464554",
          faint:   "#9a9ba8",
        },
        primary: {
          DEFAULT:       "#4648d4",
          container:     "#6063ee",
          "fixed-dim":   "#c0c1ff",
        },
        "outline-variant": "#c7c4d7",
        error:   "#ba1a1a",
        success: "#386a20",
        warning: "#7d4e00",
      },
      borderRadius: {
        sm:   "0.5rem",   /* 8px  — badges */
        md:   "0.75rem",  /* 12px — inputs, buttons */
        lg:   "1rem",     /* 16px — cards */
        xl:   "1.25rem",  /* 20px — modals */
      },
      boxShadow: {
        sm:      "0 1px 3px rgba(17,24,39,0.05)",
        md:      "0 4px 12px rgba(17,24,39,0.06)",
        ambient: "0 20px 40px -12px rgba(17,24,39,0.08)",
        glass:   "0 8px 32px rgba(17,24,39,0.06)",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #4648d4, #6063ee)",
      },
      backdropBlur: {
        glass:   "20px",
        command: "32px",
      },
    },
  },
  plugins: [],
};

export default config;