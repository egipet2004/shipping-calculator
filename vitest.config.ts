import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { configDefaults } from 'vitest/config' // <--- Добавьте этот импорт

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Добавляем исключение для папки e2e
    exclude: [...configDefaults.exclude, 'e2e/*'], 
  },
})