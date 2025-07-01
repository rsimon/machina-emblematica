import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
    open: 'test/index.html',
    proxy: {
      '/indexes': {
        target: 'http://92.112.48.13:8882',
        changeOrigin: true
      }
    }
  }
  },
  integrations: [react()]
});