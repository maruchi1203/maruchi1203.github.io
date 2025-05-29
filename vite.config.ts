import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/maruchi1203.github.io/",
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src/frontend"),
      "@styles": path.resolve(__dirname, "./src/frontend/styles"),
    },
  },
  server: {
    proxy: {
      "/github": {
        target: "https://api.github.com", // API 서버의 주소
        changeOrigin: true, // 요청의 origin을 target에 맞게 수정
        rewrite: (path) => path.replace(/^\/github/, ""), // 필요시 경로 변경
      },
      "/velog": {
        target: "https://v2.velog.io/rss", // API 서버의 주소
        changeOrigin: true, // 요청의 origin을 target에 맞게 수정
        rewrite: (path) => path.replace(/^\/velog/, ""), // 필요시 경로 변경
      },
    },
  },
});
