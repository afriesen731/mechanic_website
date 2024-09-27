import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Set the root directory for Vite
  publicDir: 'public/assets', // Specify the assets directory if needed
  build: {
    outDir: 'dist', // Output directory for the build
    // Customize any other build options as needed
  },
});
