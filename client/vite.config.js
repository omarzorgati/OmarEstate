import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  //adding a proxy : meaning each time u see /api automaticly use the target
  server: {
    proxy: {
      '/api' : { 
        target : 'http://localhost:3001',
        sercure : false,
    },
  },
},
  plugins: [react()],
})
