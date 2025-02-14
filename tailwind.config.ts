import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens:{
        xs:'400px'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderColor:{
        ss:'#dbdbdb'
      },
      backgroundColor:{
        bl:'#0095F6',
        bler:'#1877F2',
        gray:'#EFEFEF',
        grayer:'#DBDBDB'
      },
      textColor:{
        gray:'#737373'
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: '0' },
          "100%": { opacity: '1' },
        }
      },
      
      animation: {
        fadeIn: "fadeIn 0.1s ease-out forwards",
        // fadeOut: "fadeOut 0.5s ease-out forwards",
      }
    },
  },
  plugins: [],
} satisfies Config;
