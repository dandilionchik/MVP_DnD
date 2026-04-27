/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#120d0c",
        ember: "#8f2f23",
        wine: "#44201d",
        parchment: "#e9d9b7",
        brass: "#b98a4a",
        moss: "#31453a",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"],
      },
      boxShadow: {
        glow: "0 16px 45px rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeSlide: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        "fade-slide": "fadeSlide 0.45s ease-out",
      },
    },
  },
  plugins: [],
};
