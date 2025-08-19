const fs = require('fs');
const path = require('path');

/**
 * 递归扫描目录并生成目录结构数据
 * @param {string} dirPath - 要扫描的目录路径
 * @param {string} basePath - 基础路径，用于计算相对路径
 * @returns {Object} 目录结构数据
 */
function scanDirectory(dirPath, basePath = dirPath) {
  const stats = fs.statSync(dirPath);
  const relativePath = path.relative(basePath, dirPath);
  
  // 跳过隐藏文件和目录
  if (path.basename(dirPath).startsWith('.')) {
    return null;
  }

  if (stats.isDirectory()) {
    const dir = {
      name: path.basename(dirPath),
      path: relativePath === '' ? '/' : `/${relativePath.replace(/\\/g, '/')}`,
      type: 'directory',
      children: []
    };

    try {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const childPath = path.join(dirPath, file);
        const child = scanDirectory(childPath, basePath);
        if (child) {
          dir.children.push(child);
        }
      }

      // 按类型排序，目录在前，文件在后，然后按名称排序
      dir.children.sort((a, b) => {
        if (a.type === 'directory' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name, 'zh-CN');
      });

      return dir;
    } catch (error) {
      console.error(`无法读取目录 ${dirPath}:`, error);
      return null;
    }
  } else if (stats.isFile()) {
    // 只包含支持的文件类型
    const supportedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const ext = path.extname(dirPath).toLowerCase();
    
    if (supportedExtensions.includes(ext)) {
      return {
        name: path.basename(dirPath),
        path: `/${relativePath.replace(/\\/g, '/')}`,
        type: 'file',
        size: stats.size,
        extension: ext.substring(1),
        mtime: stats.mtime.toISOString()
      };
    }
  }
  
  return null;
}

/**
 * 生成Vite静态文件配置
 * @param {Object} directoryData - 目录结构数据
 * @returns {Array} 包含所有支持的文件路径的数组
 */
function generateViteAssetsConfig(directoryData) {
  const assets = [];
  
  function collectAssets(node) {
    if (node.type === 'file') {
      const ext = path.extname(node.name).toLowerCase();
      if (ext && !assets.includes(`**/*${ext}`)) {
        assets.push(`**/*${ext}`);
      }
    } else if (node.type === 'directory' && node.children) {
      for (const child of node.children) {
        collectAssets(child);
      }
    }
  }
  
  collectAssets(directoryData);
  return assets;
}

/**
 * 创建静态目录结构数据并更新Vite配置
 */
function createStaticDirectoryData() {
  try {
    // 扫描PDFbook目录
    const pdfbookDir = path.join(__dirname, 'PDFbook');
    if (!fs.existsSync(pdfbookDir)) {
      console.error(`PDFbook目录不存在: ${pdfbookDir}`);
      return;
    }

    console.log(`开始扫描目录: ${pdfbookDir}`);
    const directoryData = scanDirectory(pdfbookDir);
    
    if (!directoryData) {
      console.error('未能生成目录结构数据');
      return;
    }

    // 生成目录结构数据文件
    const dataDir = path.join(__dirname, 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, 'directoryStructure.js');
    const fileContent = `// 静态目录结构数据 - 自动生成\n// 运行 node generate-directory-structure.js 来更新此文件\n\nexport const directoryStructure = ${JSON.stringify(directoryData, null, 2)};\n`;
    
    fs.writeFileSync(outputPath, fileContent);
    console.log(`目录结构数据已保存到: ${outputPath}`);

    // 更新Vite配置文件中的assetsInclude
    const viteConfigPath = path.join(__dirname, 'vite.config.js');
    if (fs.existsSync(viteConfigPath)) {
      const assets = generateViteAssetsConfig(directoryData);
      const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8');
      
      // 替换assetsInclude配置
      const updatedContent = viteConfigContent.replace(
        /assetsInclude: \[([\s\S]*?)\],/,
        `assetsInclude: [${assets.map(asset => `'${asset}'`).join(', ')}],`
      );
      
      fs.writeFileSync(viteConfigPath, updatedContent);
      console.log(`Vite配置已更新: ${viteConfigPath}`);
    }

    console.log('目录结构数据生成完成！');
  } catch (error) {
    console.error('生成目录结构数据时出错:', error);
  }
}

// 执行函数
createStaticDirectoryData();

// 导出函数，以便在其他脚本中使用
module.exports = {
  scanDirectory,
  generateViteAssetsConfig,
  createStaticDirectoryData
};