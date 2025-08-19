# PDFbook Viewer

PDFbook Viewer 是一个基于 React 和 Vite 构建的在线教材浏览与下载系统，提供友好的界面让用户浏览和下载 PDF 教材文件。

## 项目特点

- 直观的目录结构浏览体验
- 支持 PDF 等多种文件格式的下载
- 响应式设计，适配桌面和移动设备
- 支持明暗主题切换
- 简洁美观的用户界面

## 技术栈

- React 18
- Vite 4
- JavaScript (ES6+)
- CSS

## 快速开始

### 环境要求

- Node.js 16+ 
- npm 7+ 或 yarn 1.22+

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
 yarn install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
 yarn dev
```

开发服务器将在 http://localhost:3000 启动。

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 yarn
 yarn build
```

构建后的文件将输出到 `dist` 目录。

### 预览生产版本

```bash
# 使用 npm
npm run preview

# 或使用 yarn
 yarn preview
```

## 项目结构

```
├── public/          # 静态资源
├── src/             # 源代码
│   ├── data/        # 数据文件
│   ├── utils/       # 工具函数
│   ├── App.jsx      # 主应用组件
│   ├── main.jsx     # 应用入口
│   ├── App.css      # 组件样式
│   └── index.css    # 全局样式
├── .gitignore       # Git 忽略文件
├── package.json     # 项目配置和依赖
├── vite.config.js   # Vite 配置
└── README.md        # 项目说明
```

## 功能说明

### 目录浏览

- 点击目录可以进入子目录
- 点击返回按钮可以返回上一级目录
- 支持面包屑导航，显示当前位置

### 文件下载

- 点击文件旁边的"下载"按钮可以下载文件
- 支持多种常见文件格式

### 主题切换

- 根据系统设置自动切换明暗主题
- 支持手动切换主题（未来功能）

## 自定义配置

### 添加新的教材文件

1. 将教材文件放入对应的目录中
2. 运行目录结构更新脚本以更新静态数据

```bash
node generate-directory-structure.js
```

## 部署说明

### 静态部署

项目构建后的 `dist` 目录包含了完整的静态网站文件，可以部署到任何支持静态网站托管的平台，如：

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- 任何 Web 服务器（Nginx、Apache 等）

### 配置 Web 服务器

如果使用 Nginx 等 Web 服务器部署，建议添加以下配置以支持 SPA 路由：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 开发指南

### 代码规范

- 使用 ES6+ 语法
- 遵循 React 最佳实践
- 组件化设计
- 注释关键逻辑和函数

### 提交流程

1. 创建功能分支
2. 提交代码前运行 `npm run lint` 检查代码规范
3. 提交代码并创建 Pull Request

## 常见问题

### 文件无法下载

确保文件路径正确，并且 Vite 配置中包含了对应的文件类型。

### 页面显示不正确

尝试清除浏览器缓存或重新构建项目。

## 许可证

MIT

## 更新日志

### v0.0.1 (2025-08-19)

- 初始版本发布
- 基础的目录浏览功能
- 文件下载功能
- 响应式设计