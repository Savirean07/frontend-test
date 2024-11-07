import plugin from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    keyframes: {
      "move-bobble": {
        "0%": {
          transform: "translate3d(var(--bobble-x-0), var(--bobble-y-0), 0px)",
          opacity: 1,
        },
        "25%": {
          transform: "translate3d(var(--bobble-x-1), var(--bobble-y-1), 0px)",
          opacity: 1,
        },
        "35%": {
          transform: "translate3d(var(--bobble-x-2), var(--bobble-y-2), 0px)",
          opacity: 1,
        },
        "50%": {
          transform: "translate3d(var(--bobble-x-3), var(--bobble-y-3), 0px)",
          opacity: 1,
        },
        "65%": {
          transform: "translate3d(var(--bobble-x-4), var(--bobble-y-4), 0px)",
          opacity: 1,
        },
        "75%": {
          transform: "translate3d(var(--bobble-x-5), var(--bobble-y-5), 0px)",
          opacity: 1,
        },
        "100%": {
          transform: "translate3d(var(--bobble-x-0), var(--bobble-y-0), 0px)",
          opacity: 1,
        },
      },

      "move-up": {
        "0%": { opacity: 0, transform: "translateY(20%)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
      "move-right": {
        "0%": { opacity: 0, transform: "translateX(3vw)" },
        "100%": { opacity: 1, transform: "translateX(0vw)" },
      },
      "move-left": {
        "0%": { opacity: 0, transform: "translateX(-3vw)" },
        "100%": { opacity: 1, transform: "translateX(0vw)" },
      },
      "move-down": {
        "0%": { opacity: 0, transform: "translateY(-20%)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
      "fade-in": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      "popup-dialog": {
        "0%": { opacity: 0, transform: "scale(0.5)" },
        "100%": { opacity: 1, transform: "scale(1)" },
      },
      blink: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      "width-increase": {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
      "grow-x": {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
      "grow-y": {
        "0%": { height: "0%" },
        "100%": { height: "100%" },
      },
      "pulse-progress": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
    },
    animation: {
      "waving-hand": "wave 2s linear infinite",
      "pop-up": "popup 500ms forwards ease-in-out",
      "slide-up": "move-up 300ms forwards ease-in-out",
      "slide-right":
        "move-right 200ms var(--delay-animation, 0s) forwards ease-in-out",
      "slide-left":
        "move-left 200ms var(--delay-animation, 0s) forwards ease-in-out",
      "slide-down":
        "move-down 200ms var(--delay-animation, 0s) forwards ease-in-out",
      "fade-in": "fade-in 300ms forwards ease-in-out",
      "text-blink": "blink 1s forwards ease-in-out infinite",
      bobble: "move-bobble 60s var(--delay-animation, 0s) infinite ease-in-out",
      "width-increase": "width-increase 300ms forwards ease-in-out",
      "grow-x": "grow-x var(--duration-animation, 1000ms) forwards ease-in-out",
      "grow-y": "grow-y var(--duration-animation, 1000ms) forwards ease-in-out",
      "pulse-progress":
        "pulse-progress 1000ms var(--delay-animation, 0s) linear infinite",
    },
    backgroundImage: {
      "gradient-none": "none",
    },
    textColor: {
      error: "#ff0000",
    },
    fontFamily: {
      cascade: "Cascade, sans-serif",
    },
    colors: {
      primary: {
        night: "#111111",
        "dark-purple": "#301934",
        "rich-black": "#010B13",
        "dark-blue": "#1363DF",
        "light-blue": "#47B5FF",
        "light-purple": "#4385FF",
        "light-green": "#45C48D",
        "light-yellow": "#FFAA1D",
        "light-red": "#FF006E",
        "light-gray": "#F9F9F9",
        "dark-gray": "#4F4F4F",
        "light-white": "#F2F2F2",
        "dark-white": "#F9F9F9",
      },
      secondary: "#F9F9F9",
      tertiary: "#F3F3F3",
      quaternary: "#E7E7E7",
      quinary: "#D1D1D1",
      senary: "#BDBDBD",
      septenary: "#A0A0A0",
      octonary: "#828282",
      nonary: "#4F4F4F",
      denary: "#333333",
      error: "#ff0000",
      success: "#00ff00",
      black: {
        DEFAULT: "#000000",
        50: "#f2f2f2",
        100: "#e6e6e6",
        200: "#cccccc",
        300: "#b3b3b3",
        400: "#999999",
        500: "#808080",
        600: "#666666",
        700: "#4d4d4d",
        800: "#333333",
        900: "#1a1a1a",
      },
      social: {
        facebook: "#1877F2",
        X: "#000000",
        google: "#DB4437",
        github: "#333",
        linkedin: "#0A66C2",
        whatsapp: "#25D366",
        instagram: "#C13584",
        twitter: "#1DA1F2",
        youtube: "#FF0000",
        apple: "#A2AAAD",
        microsoft: {
          DEFAULT: "#2F2F2F",
          "orange-red": "#F25022",
          green: "#7FBA00",
          blue: "#00A4EF",
          yellow: "#FFB900",
          gray: "#737373",
        },
      },
      gradient: {
        primary: "#FF2DF7",
        secondary: "#5200FF",
      },
    },
    screens: {
      xs: "375px",
    },
    width: {
      "button-width": "calc(var(--x) + 8px)",
    },
  },
};
export const plugins = [
  plugin(({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "animation-delay": (value) => {
          return {
            "animation-delay": value,
          };
        },
      },
      {
        values: theme("transitionDelay"),
      }
    );
  }),
];
