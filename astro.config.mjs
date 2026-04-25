import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://djmisha.com',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    server: {
      proxy: {
        '/php': 'http://localhost:8080'
      }
    }
  }
});
