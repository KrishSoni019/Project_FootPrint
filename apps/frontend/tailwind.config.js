/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "!./src/**/_archive/**"],
  theme: {
    extend: {
      colors: {
        // Base "ink" surfaces — deep, cool near-black. The evidence room at night.
        ink: {
          950: "#0A0C10",
          900: "#0D1016",
          850: "#12151C",
          800: "#181C25",
          700: "#232733",
          600: "#2E3341",
        },
        // Warm parchment text — evidence-on-paper, not clinical pure white.
        paper: {
          100: "#EDEAE2",
          300: "#C7C2B5",
        },
        // Cool slate-blue for secondary / meta text and UI chrome.
        mist: {
          400: "#8A93A6",
          500: "#6B7386",
          600: "#545C6E",
        },
        // Signature accent #1 — a brass / stamp amber. Used for "verified", CTAs, key numbers.
        signal: {
          300: "#F0C583",
          400: "#EEB763",
          500: "#E3A23B",
          600: "#C4841F",
          700: "#9C6B18",
        },
        // Signature accent #2 — a cool trail teal. Used only for the trail motif + data viz.
        trace: {
          300: "#8FE6D8",
          400: "#5FD6C4",
          500: "#3FBFAC",
          600: "#2E9A8A",
        },
        // Rare use — flagged / anomaly states only.
        flag: {
          400: "#E2847A",
          500: "#D9695D",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.2 },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        blink: "blink 1.4s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(95, 214, 196, 0.35)",
        "glow-amber": "0 0 60px -15px rgba(227, 162, 59, 0.35)",
      },
    },
  },
  plugins: [],
};
