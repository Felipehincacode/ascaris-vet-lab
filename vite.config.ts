import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path";
import { componentTagger } from "lovable-tagger";
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  plugins: [react(), qrcode(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
