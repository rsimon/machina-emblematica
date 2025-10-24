import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

export default defineConfig({
  integrations: [react()],
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    server: {
      open: 'test/index.html',
    }
  }
});