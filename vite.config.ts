import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        serviceWorker: resolve(__dirname, "src/serviceWorker.ts"),
        contentScript: resolve(__dirname, "src/contentScript.ts"),
      },
      output: {
        entryFileNames: (assetInfo) => {
          if (assetInfo.name === "serviceWorker") return "serviceWorker.js";
          if (assetInfo.name === "contentScript") return "contentScript.js";
          return "[name].js";
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
