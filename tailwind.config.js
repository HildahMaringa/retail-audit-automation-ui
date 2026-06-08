/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kantar: {
          navy: "#0B1026",
          ink: "#111827",
          blue: "#0756D8",
          purple: "#5B2FB8",
          violet: "#7C3AED",
          soft: "#F7F7FC"
        }
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.08)",
        card: "0 10px 30px rgba(11, 16, 38, 0.08)"
      }
    }
  },
  plugins: []
}
