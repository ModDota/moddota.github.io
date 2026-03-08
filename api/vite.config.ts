import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/api/",
  plugins: [
    react(),
    svgr({
      svgrOptions: { dimensions: false },
    }),
  ],
  build: {
    outDir: "../build/api",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "~utils": "/src/utils",
      "~components": "/src/components",
    },
  },
});
