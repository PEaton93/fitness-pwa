import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const REPO_NAME = "fitness-pwa";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? `/${REPO_NAME}/` : "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.svg"],
      manifest: {
        name: "FitTrack - 8 Week Plan",
        short_name: "FitTrack",
        description: "8-Week Strength Return + Visible Recomp Tracker",
        theme_color: "#f97316",
        background_color: "#0f172a",
        display: "standalone",
        scope: `/${REPO_NAME}/`,
        start_url: `/${REPO_NAME}/`,
        icons: [
          { src: `/${REPO_NAME}/icons/icon.svg`, sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: `/${REPO_NAME}/icons/icon.svg`, sizes: "any", type: "image/svg+xml", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      }
    })
  ]
});
