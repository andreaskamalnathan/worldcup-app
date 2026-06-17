import { defineConfig } from 'vite'

export default defineConfig({
  // This tells Vite to resolve all asset links relative to index.html 
  // instead of assuming your app is hosted at the root domain.
  base: './', 
})