// Node.js环境目录处理工具函数
const fs = require('fs').promises;
const path = require('path');

// 从browserUtils导入共享函数
import { getFileExtension, getFileIcon, formatDateTime, formatFileSize } from './browserUtils.js';

/**
 * 递归扫描目录结构
 * 注意：这是一个Node.js环境下的函数，在浏览器环境中无法直接运行
 * @param {string} dirPath - 目录路径
 * @returns {Promise<Object>} 目录结构数据
 */
export const scanDirectory = async (dirPath) => {
  try {
    // 获取目录状态
    const stats = await fs.stat(dirPath);
    
    // 如果不是目录，返回null
    if (!stats.isDirectory()) return null;
    
    // 获取目录名
    const dirName = path.basename(dirPath);
    
    // 创建目录结构对象
    const directory = {
      name: dirName,
      type: 'directory',
      children: []
    };
    
    // 读取目录内容
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    // 处理每个条目
    const promises = entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // 递归扫描子目录
        const childDir = await scanDirectory(entryPath);
        if (childDir) {
          return childDir;
        }
      } else if (entry.isFile()) {
        // 获取文件信息
        const fileStats = await fs.stat(entryPath);
        
        // 创建文件对象
        return {
          name: entry.name,
          type: 'file',
          size: formatFileSize(fileStats.size),
          modified: formatDateTime(fileStats.mtime)
        };
      }
      return null;
    });
    
    // 等待所有操作完成
    const results = await Promise.all(promises);
    
    // 过滤掉null结果，并按类型和名称排序
    directory.children = results
      .filter(item => item !== null)
      .sort((a, b) => {
        // 目录排在文件前面
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        // 同类型按名称排序
        return a.name.localeCompare(b.name);
      });
    
    return directory;
  } catch (error) {
    console.error(`扫描目录失败: ${dirPath}`, error);
    return null;
  }
};

/**
 * 生成用于Vite的静态文件配置
 * 注意：这是一个Node.js环境下的函数，在浏览器环境中无法直接运行
 * @param {Object} directoryStructure - 目录结构数据
 * @returns {Array} Vite配置的assetsInclude数组
 */
export const generateViteAssetsConfig = (directoryStructure) => {
  const assets = [];
  
  const traverse = (structure) => {
    if (!structure) return;
    
    if (structure.type === 'file') {
      const ext = getFileExtension(structure.name);
      if (ext) {
        const pattern = `**/*.${ext}`;
        if (!assets.includes(pattern)) {
          assets.push(pattern);
        }
      }
    } else if (structure.type === 'directory' && structure.children) {
      structure.children.forEach(child => traverse(child));
    }
  };
  
  traverse(directoryStructure);
  return assets;
};

/**
 * 创建静态目录结构数据文件
 * 注意：这是一个Node.js环境下的函数，在浏览器环境中无法直接运行
 * @param {string} sourcePath - 源目录路径
 * @param {string} outputPath - 输出文件路径
 */
export const createStaticDirectoryData = async (sourcePath, outputPath) => {
  try {
    const structure = await scanDirectory(sourcePath);
    if (structure) {
      const data = `// 静态目录结构数据
// 此文件由directoryUtils.js生成
// 请在PDFbook文件夹结构更改后重新生成

export const directoryStructure = ${JSON.stringify(structure, null, 2)};

export default directoryStructure;`;
      
      await fs.writeFile(outputPath, data, 'utf-8');
      console.log(`目录结构数据已保存到: ${outputPath}`);
      
      // 生成Vite配置
      const viteConfigPath = path.resolve(__dirname, '../../vite.config.js');
      const viteConfig = await fs.readFile(viteConfigPath, 'utf-8');
      const assets = generateViteAssetsConfig(structure);
      
      let newViteConfig = viteConfig;
      if (viteConfig.includes('assetsInclude:')) {
        // 更新现有配置
        newViteConfig = viteConfig.replace(
          /assetsInclude:\s*\[(.*?)\]/,
          `assetsInclude: [${assets.map(a => `'${a}'`).join(', ')}]`
        );
      } else {
        // 添加新配置
        const configLine = `export default defineConfig({`;
        newViteConfig = viteConfig.replace(
          configLine,
          `${configLine}\n  assetsInclude: [${assets.map(a => `'${a}'`).join(', ')}],`
        );
      }
      
      await fs.writeFile(viteConfigPath, newViteConfig, 'utf-8');
      console.log(`Vite配置已更新: ${viteConfigPath}`);
    }
  } catch (error) {
    console.error('创建静态目录结构数据失败:', error);
  }
};

// 使用示例（在Node.js环境中运行）
// createStaticDirectoryData('../../../PDFbook', './src/data/directoryStructure.js');