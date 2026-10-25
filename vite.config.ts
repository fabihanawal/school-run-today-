import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const mockApiPlugin = () => ({
  name: 'mock-api-php',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const cleanUrl = req.url?.split('?')[0];
      if (cleanUrl === '/api.php') {
        const dbFile = path.resolve(__dirname, 'sia_db.json');
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              fs.writeFileSync(dbFile, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(dbFile)) {
            try {
              const content = fs.readFileSync(dbFile, 'utf-8');
              const parsed = JSON.parse(content);
              res.end(JSON.stringify({ status: 'ok', ...parsed }));
              return;
            } catch {
              // fallback
            }
          }
          res.end(JSON.stringify({ status: 'new' }));
          return;
        }
      }
      next();
    });
  }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      plugins: [react(), mockApiPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
