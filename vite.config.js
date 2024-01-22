import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '^/(app|core.)/.*': {
          target: env.REACT_APP_PROXY_HOST,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'process.env': env,
    }
  };
})
