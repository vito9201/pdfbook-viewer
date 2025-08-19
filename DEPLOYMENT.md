# Vercel部署指南

本指南将帮助您将PDFbook在线浏览与下载系统部署到Vercel平台。

## 前提条件

在开始之前，请确保您已经：

1. 拥有一个GitHub账号
2. 拥有一个Vercel账号
3. 已经将项目代码推送到GitHub仓库

## 部署步骤

### 步骤1：准备项目

确保您的项目包含以下文件：

- `package.json` - 项目配置文件
- `vite.config.js` - Vite构建配置
- `index.html` - HTML入口文件
- `PDFbook/` - 包含所有PDF文件和目录的文件夹

### 步骤2：在GitHub上创建仓库

1. 登录GitHub，点击"New repository"
2. 填写仓库名称，例如`pdfbook-viewer`
3. 选择仓库可见性（公开或私有）
4. 点击"Create repository"

### 步骤3：推送代码到GitHub

在您的项目目录中，打开命令行工具并执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/[您的用户名]/[您的仓库名].git

# 推送代码到GitHub
git push -u origin main
```

### 步骤4：在Vercel上导入项目

1. 登录Vercel：https://vercel.com/login
2. 点击"New Project"按钮
3. 在"Import Git Repository"部分，找到并选择您刚刚创建的GitHub仓库
4. 点击"Import"按钮

### 步骤5：配置部署设置

在导入项目后，Vercel会自动检测项目类型并配置相应的设置。对于React + Vite项目，通常不需要额外配置：

- **Framework Preset**: 应该自动选择"Vite"
- **Root Directory**: 保持为根目录(空)
- **Build Command**: 自动设置为`npm run build`
- **Output Directory**: 自动设置为`dist`
- **Install Command**: 自动设置为`npm install`

如果需要自定义配置，请根据您的需求进行调整。

### 步骤6：部署项目

1. 检查完配置后，点击"Deploy"按钮
2. Vercel将开始构建和部署您的项目
3. 部署完成后，您将看到一个成功消息和项目的URL

### 步骤7：验证部署

1. 点击提供的URL访问您的部署项目
2. 确认文件浏览器正常工作并且能够浏览和下载文件

## 自定义域名（可选）

如果您想使用自定义域名：

1. 在Vercel项目页面中，点击"Settings" > "Domains"
2. 输入您的自定义域名，然后点击"Add"
3. 按照Vercel提供的指示，在您的域名注册商处配置DNS记录

## 注意事项

- Vercel的免费计划对带宽和构建时间有限制，如果您的PDF文件很大或访问量很高，可能需要升级到付费计划
- 确保您的`PDFbook`文件夹结构与`src/data/directoryStructure.js`中定义的结构一致
- 如果您更新了`PDFbook`文件夹的内容，需要重新生成`directoryStructure.js`文件并重新部署项目
- 对于中文文件名，Vercel通常能够正确处理，但为了避免潜在问题，建议使用英文或数字命名文件

## 自动部署（可选）

您可以设置GitHub Actions来在每次推送代码时自动更新目录结构并部署项目：

1. 在项目中创建`.github/workflows/deploy.yml`文件
2. 添加以下内容：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: .
```

3. 在GitHub仓库的"Settings" > "Secrets"中添加您的Vercel令牌和项目信息

## 故障排除

如果遇到部署问题：

- 检查Vercel控制台中的构建日志，查找错误信息
- 确保您的`package.json`中包含正确的构建脚本
- 验证`vite.config.js`中的配置是否正确
- 确认所有依赖项都已正确安装

如有其他问题，请参考Vercel官方文档：https://vercel.com/docs