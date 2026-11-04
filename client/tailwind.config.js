/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 配置你指定的字体（匹配图片样式）
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"], // 图片对应的字体
        inter: ["Inter", "sans-serif"],
        gummy: ["Sour Gummy", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#0FB97F",
          gray: "#D4D4D4",
          dark: "#0A0A0A",
          light: "#F8F8F8",
        },
        text: {
          primary: "#111111",
          white: "#FFFFFF",
        },
        overlay: "rgba(10,10,10,0.75)",
      },
    },
  },
  plugins: [],
}
