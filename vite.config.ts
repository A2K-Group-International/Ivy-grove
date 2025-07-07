import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/context": path.resolve(__dirname, "./src/context"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
