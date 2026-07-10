import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // ⚠️ Ganti 'svelte-spa-app' dengan NAMA REPO KAMU!
  base: '/svelte/', 
  plugins: [svelte(), tailwindcss()],
});
