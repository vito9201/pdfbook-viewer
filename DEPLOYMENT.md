# PDFbook Viewer 部署指南

本指南提供了将PDFbook Viewer项目部署到各种环境的详细步骤。

## 目录

1. [前提条件](#前提条件)
2. [构建项目](#构建项目)
3. [静态部署](#静态部署)
   - [GitHub Pages](#github-pages)
   - [Netlify](#netlify)
   - [Vercel](#vercel)
   - [AWS S3](#aws-s3)
   - [阿里云OSS](#阿里云oss)
4. [Web服务器部署](#web服务器部署)
   - [Nginx](#nginx)
   - [Apache](#apache)
   - [IIS](#iis)
5. [Docker部署](#docker部署)
6. [环境变量配置](#环境变量配置)
7. [部署后验证](#部署后验证)
8. [常见问题](#常见问题)

## 前提条件

- Node.js 16+ 和 npm 7+ 或 yarn 1.22+（用于构建）
- Git（用于代码管理和某些部署方式）
- 目标部署环境的访问权限

## 构建项目

在部署前，需要先构建项目：

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建成功后，项目文件将生成在 `dist` 目录中。

## 静态部署

PDFbook Viewer 是一个纯静态网站，可以部署到任何支持静态文件托管的平台。

### GitHub Pages

1. 确保你已经将项目推送到GitHub仓库。

2. 安装 `gh-pages` 包：

   ```bash
   npm install --save-dev gh-pages
   ```

3. 在 `package.json` 中添加部署脚本：

   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

4. 配置 `vite.config.js` 中的 `base` 选项（如果你的仓库不是根域名）：

   ```javascript
   export default defineConfig({
     base: '/你的仓库名/',
     // 其他配置...
   })
   ```

5. 运行部署命令：

   ```bash
   npm run deploy
   ```

6. 在GitHub仓库设置中启用GitHub Pages，并选择 `gh-pages` 分支。

### Netlify

1. 访问 [Netlify](https://www.netlify.com/) 并登录。

2. 点击 "New site from Git" 并选择你的GitHub仓库。

3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`

4. 点击 "Deploy site" 开始部署。

### Vercel

1. 访问 [Vercel](https://vercel.com/) 并登录。

2. 点击 "New Project" 并选择你的GitHub仓库。

3. Vercel 会自动检测项目类型并配置构建设置，通常不需要额外配置。

4. 点击 "Deploy" 开始部署。

### AWS S3

1. 登录 [AWS Management Console](https://aws.amazon.com/console/) 并导航到 S3 服务。

2. 创建一个新的 S3 存储桶，并确保其名称与你的域名匹配（如果使用自定义域名）。

3. 配置存储桶属性：
   - 静态网站托管: 启用
   - 索引文档: `index.html`
   - 错误文档: `index.html` (用于SPA路由)

4. 配置存储桶权限，确保内容可以公开访问。

5. 使用 AWS CLI 或 S3 控制台上传 `dist` 目录中的所有文件。

   使用 AWS CLI 上传的示例：
   ```bash
   aws s3 sync dist/ s3://你的存储桶名称/
   ```

### 阿里云OSS

1. 登录 [阿里云控制台](https://homenew.console.aliyun.com/) 并导航到对象存储 OSS 服务。

2. 创建一个新的 OSS 存储空间。

3. 配置存储空间属性：
   - 静态网站托管: 启用
   - 默认首页: `index.html`
   - 默认404页: `index.html` (用于SPA路由)

4. 配置访问控制，确保内容可以公开访问。

5. 使用 OSS 控制台或 ossutil 工具上传 `dist` 目录中的所有文件。

   使用 ossutil 上传的示例：
   ```bash
   ossutil cp -r dist/* oss://你的存储空间名称/
   ```

## Web服务器部署

### Nginx

1. 安装 Nginx：

   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install nginx
   
   # CentOS/RHEL
   sudo yum install nginx
   ```

2. 创建 Nginx 配置文件：

   ```bash
   sudo nano /etc/nginx/sites-available/pdfbook-viewer
   ```

3. 添加以下配置（根据实际情况修改）：

   ```nginx
   server {
       listen 80;
       server_name pdfbook.example.com;
       
       root /var/www/pdfbook-viewer/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # 可选：添加压缩和缓存配置
       gzip on;
       gzip_types text/html text/css application/javascript image/svg+xml;
       
       location ~* \.(css|js|svg|png|jpg|jpeg|pdf)$ {
           expires 30d;
           add_header Cache-Control "public, max-age=2592000";
       }
   }
   ```

4. 创建符号链接并重启 Nginx：

   ```bash
   sudo ln -s /etc/nginx/sites-available/pdfbook-viewer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. 将 `dist` 目录中的文件复制到 `/var/www/pdfbook-viewer/dist`。

### Apache

1. 安装 Apache：

   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install apache2
   
   # CentOS/RHEL
   sudo yum install httpd
   ```

2. 启用必要的模块：

   ```bash
   # Ubuntu/Debian
   sudo a2enmod rewrite
   
   # CentOS/RHEL
   sudo vi /etc/httpd/conf/httpd.conf
   # 找到 LoadModule rewrite_module modules/mod_rewrite.so 并确保没有注释
   ```

3. 创建 Apache 配置文件：

   ```bash
   # Ubuntu/Debian
   sudo nano /etc/apache2/sites-available/pdfbook-viewer.conf
   
   # CentOS/RHEL
   sudo nano /etc/httpd/conf.d/pdfbook-viewer.conf
   ```

4. 添加以下配置（根据实际情况修改）：

   ```apache
   <VirtualHost *:80>
       ServerName pdfbook.example.com
       
       DocumentRoot /var/www/pdfbook-viewer/dist
       
       <Directory /var/www/pdfbook-viewer/dist>
           AllowOverride All
           Require all granted
           
           # 配置 SPA 路由
           RewriteEngine On
           RewriteBase /
           RewriteRule ^index\.html$ - [L]
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteRule . /index.html [L]
       </Directory>
       
       # 可选：添加压缩配置
       <IfModule mod_deflate.c>
           AddOutputFilterByType DEFLATE text/html text/css application/javascript
       </IfModule>
   </VirtualHost>
   ```

5. 启用站点并重启 Apache：

   ```bash
   # Ubuntu/Debian
   sudo a2ensite pdfbook-viewer.conf
   sudo apache2ctl configtest
   sudo systemctl restart apache2
   
   # CentOS/RHEL
   sudo systemctl restart httpd
   ```

6. 将 `dist` 目录中的文件复制到 `/var/www/pdfbook-viewer/dist`。

### IIS

1. 安装 IIS（Internet Information Services）。

2. 安装 URL Rewrite 模块：
   - 从 [Microsoft Web Platform Installer](https://www.microsoft.com/web/downloads/platform.aspx) 安装 URL Rewrite 2.0

3. 创建一个新的 IIS 网站：
   - 打开 IIS 管理器
   - 右键点击 "Sites" 并选择 "Add Website..."
   - 设置网站名称、物理路径（指向 `dist` 目录）和绑定信息

4. 配置 URL 重写以支持 SPA 路由：
   - 选择新创建的网站
   - 双击 "URL Rewrite"
   - 点击 "Add Rule(s)..."
   - 选择 "Blank Rule" 并点击 "OK"
   - 配置规则：
     - Name: `SPA Fallback`
     - Pattern: `*`
     - Action type: `Rewrite`
     - Rewrite URL: `/index.html`
     - 在 "Conditions" 下点击 "Add..."
     - Condition input: `{REQUEST_FILENAME}`
     - Check if input string: `Is not a file`
     - 点击 "OK"
     - 再次点击 "Add..."
     - Condition input: `{REQUEST_FILENAME}`
     - Check if input string: `Is not a directory`
     - 点击 "OK"
   - 点击 "Apply"

## Docker部署

1. 确保已安装 [Docker](https://www.docker.com/get-started)。

2. 在项目根目录创建 `Dockerfile`：

   ```dockerfile
   # 构建阶段
   FROM node:16-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   # 运行阶段
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. 创建 `nginx.conf` 文件：

   ```nginx
   server {
       listen 80;
       server_name localhost;
       
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. 构建 Docker 镜像：

   ```bash
   docker build -t pdfbook-viewer .
   ```

5. 运行 Docker 容器：

   ```bash
   docker run -d -p 80:80 pdfbook-viewer
   ```

6. 访问 `http://localhost` 查看应用。

## 环境变量配置

PDFbook Viewer 支持以下环境变量：

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| VITE_APP_API_URL | API 基础 URL（未来功能） | `/api` |
| VITE_APP_TITLE | 应用标题 | `PDFbook Viewer` |
| VITE_APP_BASE_PATH | 应用基础路径 | `/` |

在构建前设置这些环境变量，或创建 `.env` 文件：

```env
VITE_APP_API_URL=https://api.example.com
VITE_APP_TITLE=我的教材查看器
VITE_APP_BASE_PATH=/pdfbook/
```

## 部署后验证

部署完成后，执行以下检查以确保应用正常运行：

1. 访问应用 URL，检查是否能正常加载。
2. 导航到不同的目录，检查目录结构是否正确显示。
3. 尝试下载一个文件，确认下载功能正常。
4. 在不同设备和浏览器上测试响应式设计。
5. 检查页面加载速度和性能。

## 常见问题

### 路由问题

如果在刷新页面或直接访问子路由时出现 404 错误，确保你的服务器已正确配置以支持 SPA 路由（将所有非文件请求重定向到 index.html）。

### 文件下载问题

如果文件无法下载：
1. 检查文件是否存在且路径正确
2. 确认服务器配置允许访问这些文件类型
3. 检查浏览器控制台是否有错误信息

### 性能问题

对于大型目录结构，可能会遇到性能问题：
1. 优化 `generate-directory-structure.js` 脚本，只包含必要的文件和目录
2. 考虑实现懒加载或分页加载大型目录
3. 使用 CDN 分发静态资源

### 跨域问题

如果未来添加 API 集成时遇到跨域问题：
1. 配置服务器的 CORS 策略
2. 在 Vite 开发配置中设置代理

```javascript
// vite.config.js
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 升级指南

要升级已部署的应用：

1. 拉取最新代码：
   ```bash
   git pull origin main
   ```

2. 更新依赖：
   ```bash
   npm install
   ```

3. 重新构建：
   ```bash
   npm run build
   ```

4. 部署新的构建文件到你的目标环境。

## 监控与维护

为确保应用的稳定运行，建议：

1. 设置错误日志收集
2. 定期检查服务器资源使用情况
3. 定期更新依赖以修复安全漏洞
4. 根据访问量调整服务器配置

---

本指南最后更新于 2025-08-19