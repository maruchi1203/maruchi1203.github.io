import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@images": path.resolve(__dirname, "./src/images"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.github.com", // API 서버의 주소
        changeOrigin: true, // 요청의 origin을 target에 맞게 수정
        rewrite: (path) => path.replace(/^\/api/, ""), // 필요시 경로 변경
      },
    },
  },
});
