const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000' // el color principal por defecto
        },
        textColor: {
          primary: '#f2f2f2', // color de foreground personalizado
          // Puedes agregar más colores personalizados aquí
        },
      },
  },
  plugins: [nextui()],
}

