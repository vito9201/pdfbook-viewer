# PDFbook 在线浏览与下载系统

这是一个用于浏览和下载PDFbook文件夹中内容的前端网站。该项目采用纯前端技术实现，无需后端服务器，可以轻松部署到Vercel等静态网站托管平台。

## 功能特性

- 📁 文件夹层级浏览 - 类似Windows资源管理器的文件浏览体验
- 📄 文件下载功能 - 直接下载PDF文件
- 📱 响应式设计 - 适配各种屏幕尺寸
- 🌓 暗色/亮色主题 - 根据系统设置自动切换
- 🚀 轻量级 - 快速加载和响应

## 项目结构

```
├── PDFbook/         # PDF文件和文件夹（用户提供）
├── src/             # 源代码目录
│   ├── App.jsx      # 主应用组件
│   ├── App.css      # 应用样式
│   ├── main.jsx     # 应用入口
│   └── index.css    # 全局样式
├── index.html       # HTML入口文件
├── package.json     # 项目配置
├── vite.config.js   # Vite配置
└── .gitignore       # Git忽略规则
```

## 如何开始

### 准备工作

1. 确保您的`PDFbook`文件夹包含所有需要展示的PDF文件和正确的目录结构
2. 安装Node.js（推荐v16或更高版本）

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
# 构建生产版本
npm run build
```