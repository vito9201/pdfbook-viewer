# TODO 清单

以下是项目完成后的待办事项和后续操作指南：

## 环境配置问题

### 🔴 紧急问题：PowerShell执行策略限制
当前系统的PowerShell执行策略为`Restricted`，这导致无法直接运行npm命令。**必须先解决此问题，才能正常运行项目**。

解决方案：
1. 点击Windows开始菜单
2. 搜索"PowerShell"
3. 右键点击"Windows PowerShell"
4. 选择"以管理员身份运行"
5. 在打开的PowerShell窗口中，执行以下命令：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

此命令将允许当前用户运行本地脚本，解决npm命令无法执行的问题。

## 项目安装与运行

### 1. 安装项目依赖
解决执行策略问题后，运行以下命令安装项目依赖：
```bash
npm install
```

### 2. 更新目录结构数据
如果PDFbook文件夹内容有更新，运行以下脚本重新生成目录结构数据：
```bash
node generate-directory-structure.js
```

### 3. 启动开发服务器
安装依赖后，使用以下命令启动开发服务器：
```bash
npm run dev
```
服务器将在 http://localhost:3000 启动。

### 4. 构建生产版本
准备部署时，运行以下命令构建生产版本：
```bash
npm run build
```
构建文件将生成在`dist`目录中。

### 5. 预览生产版本
构建后，可以使用以下命令预览生产版本：
```bash
npm run preview
```
预览服务器将在 http://localhost:8080 启动。

## 部署指南

### 部署到Vercel
请参考 `DEPLOYMENT.md` 文件中的详细步骤进行部署。主要步骤包括：
1. 创建Vercel账号
2. 连接Git仓库
3. 配置项目设置
4. 部署项目
5. 配置自定义域名（可选）

## 代码优化建议

### 1. 增强错误处理
在`App.jsx`中可以添加更多的错误处理逻辑，特别是在处理目录导航和文件下载时。

### 2. 添加搜索功能
可以利用`browserUtils.js`中的`searchFiles`函数，在界面中添加搜索功能，方便用户快速查找文件。

### 3. 实现暗黑模式
可以为应用添加暗黑模式支持，提升用户体验。

### 4. 添加文件预览功能
对于PDF文件，可以考虑添加在线预览功能，而不仅仅是下载。

### 5. 优化加载性能
如果目录结构非常大，可以考虑实现虚拟滚动或分页加载，提高性能。

## 注意事项

- `src/utils/directoryUtils.js` 是Node.js环境下的工具文件，**不要在浏览器环境中直接导入或使用**。
- `src/utils/browserUtils.js` 是浏览器环境下的工具文件，可以安全地在React组件中使用。
- 确保`PDFbook`文件夹与`index.html`在同一目录下，或者根据实际部署情况调整`vite.config.js`中的相关配置。
- 如果更改了`PDFbook`文件夹的位置或结构，需要重新运行`generate-directory-structure.js`脚本更新目录结构数据。

## 常见问题排查

1. **文件下载链接无效**：检查Vite配置是否正确包含了PDF等文件类型的支持。
2. **开发服务器无法启动**：确保执行策略已修改，且依赖已正确安装。
3. **目录结构显示不正确**：运行`generate-directory-structure.js`脚本更新目录数据。

如需更多帮助，请参考项目文档或联系技术支持。