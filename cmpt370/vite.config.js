import { defineConfig } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  root: 'src', // Set the root directory for Vite
  publicDir: 'public/assets', // Specify the assets directory if needed
  build: {
    outDir: 'dist', // Output directory for the build
    // Customize any other build options as needed
  },
});
