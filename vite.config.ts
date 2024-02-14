import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
    },
  },
  plugins: [pluginRewriteAll(), react(), svgr()],
});
