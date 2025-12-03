import { defineConfig } from "vite"

export default defineConfig({
  base: "/",
  build: {
    target: "es2015",
    minify: "terser",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          simulator: ["./src/js/pages/simulator.js"],
        },
      },
    },
  },
  server: {
    port: 3000,
    https: false,
  },
})
