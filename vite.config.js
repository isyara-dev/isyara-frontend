import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import removeConsole from "vite-plugin-remove-console";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tailwindcss(),
      react(),
      mode === "production" && removeConsole(),
    ].filter(Boolean),
    server: {
      host: true,
      allowedHosts: ["459ca1dff9a8.ngrok-free.app"],
    },
  };
});
