import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/api/",
  plugins: [
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
