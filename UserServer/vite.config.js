import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
	plugins: [uni()],
	// server: {
	//     proxy: {
	//       '/api': {
	//         target: 'http://localhost:8080',
	//         changeOrigin: true,
	//         rewrite: (path) => path.replace(/^\/api/, '')
	//       }
	//     }
	//   }
});