import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite Server Plugin for Secure Server-Side AI API Endpoints
function secureAiProxyPlugin() {
  return {
    name: 'secure-ai-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/ai/health', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok', engine: 'MindTrace Server API Proxy' }));
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    secureAiProxyPlugin(),
  ],
});
