import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 配置静态资源处理
  assetsInclude: ['**/*.1', '**/*.2', '**/*.pdf', '**/*.3', '**/*.djvu', '**/*.4', '**/*.5', '**/*.6', '**/*.exe', '**/*.jpg', '**/*.7', '**/*.8', '**/*.10', '**/*.11', '**/*.9'],
  // 配置开发服务器
  server: {
    open: true,
    port: 3000,
  },
  // 配置构建选项
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // 确保PDFbook目录被正确复制到构建目录
      preserveEntrySignatures: 'exports-only',
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  // 配置resolve选项
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 配置预览服务器
  preview: {
    port: 8080,
  },
})