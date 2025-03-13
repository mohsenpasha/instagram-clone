import { transform } from "next/dist/build/swc/generated-native";
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
        xs:'400px',
        mdl:'875px'
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
        grayer:'#DBDBDB',
        st:'#1a1a1a'
      },
      textColor:{
        gray:'#737373',
        bl:'#0095F6',
        bll:'#00376B'
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: '0' },
          "100%": { opacity: '1' },
        },
        maxW: {
          "0%" : { maxWidth:"0px",opacity:'0' },
          "30%":{opacity:'0'},
          "100%" : {maxWidth:"384px",opacity:'1'}
        },
        maxWClose: {
          "0%" : {maxWidth:"384px",opacity:'1'},
          "100%" :{ maxWidth:"0px",opacity:'0' }
        },
        scale: {
          "0%" : {transform:"scale(0)",opacity:'0'},
          "30%":{opacity:'1'},
          "90%":{transform:"scale(1.1)"},
          "100%" :{transform:"scale(1)",opacity:'1' }
        },
        scaleOut: {
          "0%" : {transform:"scale(1)"},
          "100%" :{transform:"scale(0)"}
        },
        scaleInOut: {
          "0%" : {transform:"scale(0)",opacity:'0'},
          "10%":{opacity:'1'},
          "20%":{transform:"scale(2.1)"},
          "40%":{transform:"scale(2.1)"},
          "50%" :{transform:"scale(2.2)",opacity:'1'}, 
          "80%" :{opacity:'0'}, 
          "100%":{transform:"scale(0)",opacity:'0'}
        },
        FadeInOut: {
          "0%" : {opacity:'0'},
          "10%":{opacity:'1'},
          "90%":{opacity:'1'},
          "100%":{opacity:'0'}
        },
      },
      animation: {
        fadeIn: "fadeIn 0.1s ease-out forwards",
        maxW: "maxW 0.3s ease-out forwards",
        maxWClose: "maxWClose 0.3s ease-out forwards",
        scale: "scale 0.3s ease-out forwards",
        scaleOut: "scaleOut 0.2s ease-out forwards",
        scaleInOut: "scaleInOut 1s ease-out",
        FadeInOut: "FadeInOut 5s ease-out infinite",
        // fadeOut: "fadeOut 0.5s ease-out forwards",
      }
    },
  },
  plugins: [],
} satisfies Config;
