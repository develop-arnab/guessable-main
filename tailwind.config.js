/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "up-and-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },

      animation: {
        "up-and-down": "up-and-down 2s ease-in-out infinite",
      },
      colors: {
        header: "#d9e7f1",
        sidebar: "#f0f3fc",
        heading: "#42474e",
        selected: "#DBE2F9",
        primary: "#4CAF50",
        chat: "#d6d8e9",
        secondary: "#D9D9D900",
        auth: "#898e9c",
        white1: "#fdfbff",
        white3: "#edeff1",
        lightGray: "#989898",
        lightGray2: "#44464E",
        lightGray3: "#1B1B1E",
        LightPurple: "#725574",
        gray1: "#bdbdbd",
        gray2: "#F3F3F3",
        orange1: "#db884a",
        gray3: "#414c56",
        gray4: "#4f5c6a",
        purple: "#6359ec",
        lightRed: "#a26665",
        lightRed2: "#f2dbde",
        lightGreen3: "#d7eeeb",
        lightGray4: "#d0d8df",
        lightGreen: "#55ada2",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        shadow1:
          "0px 4px 4px 0px rgba(0, 0, 0, 0.30), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".truncate-2-lines": {
          display: "-webkit-box",
          "-webkit-line-clamp": "2",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
