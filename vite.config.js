import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Membuka akses agar bisa di-bind oleh Docker
    port: 5173,
    watch: {
      usePolling: true, // Menjamin HMR berjalan mendeteksi perubahan file di Windows/Mac/Linux
    },
  },
})
