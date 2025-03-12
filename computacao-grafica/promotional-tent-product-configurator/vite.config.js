import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    outDir: "public/dist",
    rollupOptions: {
      input: {
        index: "src/js/index.ts",
        // about: "src/js/about.ts",
        // contact: "src/js/contact.ts",
      },
      output: {
        entryFileNames: "js/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "css/[name].css"; // Place CSS in public/css/
          return "assets/[name].[ext]"; // Default for other assets
        },
      },
    },
    copyPublicDir: false,
  },
  plugins: [
    tailwindcss(),
  ],
});
