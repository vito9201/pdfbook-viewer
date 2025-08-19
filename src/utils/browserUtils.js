// 浏览器环境工具函数

/**
 * 获取文件扩展名
 * @param {string} fileName - 文件名
 * @returns {string} 文件扩展名（小写）
 */
export const getFileExtension = (fileName) => {
  if (!fileName || typeof fileName !== 'string') return '';
  const match = fileName.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : '';
};

/**
 * 根据文件扩展名获取图标
 * @param {string} extension - 文件扩展名
 * @returns {string} 图标emoji
 */
export const getFileIcon = (extension) => {
  const iconMap = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'xls': '📊',
    'xlsx': '📊',
    'ppt': '📑',
    'pptx': '📑',
    'zip': '🗜️',
    'rar': '🗜️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'mp4': '🎬',
    'mp3': '🎵',
    'txt': '📄',
    'md': '📄',
    'html': '🌐',
    'css': '🎨',
    'js': '⚡',
    'json': '📊',
    'svg': '🎨'
  };
  
  return iconMap[extension.toLowerCase()] || '📄';
};

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化日期时间
 * @param {string|Date} date - 日期时间
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 构建下载路径
 * @param {string} currentPath - 当前路径
 * @param {string} fileName - 文件名
 * @returns {string} 完整的下载路径
 */
export const buildDownloadPath = (currentPath, fileName) => {
  // 在实际应用中，这里应该返回实际的文件下载URL
  // 由于这是模拟环境，我们返回一个模拟的URL
  return `/PDFbook${currentPath ? '/' + currentPath : ''}/${fileName}`;
};

/**
 * 导航到指定路径
 * @param {string} path - 目标路径
 */
export const navigateToPath = (path) => {
  // 在React应用中，这个函数通常由React Router或状态管理来处理
  // 这里我们只是打印路径，表示导航操作
  console.log(`Navigate to: ${path}`);
};

/**
 * 导航到上一级目录
 * @param {string} currentPath - 当前路径
 * @returns {string} 上一级目录路径
 */
export const navigateUp = (currentPath) => {
  if (!currentPath || currentPath === '') return '';
  
  const parts = currentPath.split('/').filter(Boolean);
  parts.pop();
  return parts.join('/');
};

/**
 * 导航到根目录
 * @returns {string} 根目录路径
 */
export const navigateToRoot = () => {
  return '';
};

/**
 * 获取当前目录内容
 * @param {Object} structure - 目录结构数据
 * @param {string} path - 当前路径
 * @returns {Array} 当前目录下的文件和子目录
 */
export const getCurrentDirectoryContent = (structure, path) => {
  if (!structure || !structure.children) return [];
  
  if (!path || path === '') {
    return structure.children;
  }
  
  const parts = path.split('/').filter(Boolean);
  let current = structure;
  
  for (const part of parts) {
    const found = current.children.find(item => item.name === part && item.type === 'directory');
    if (!found) return [];
    current = found;
  }
  
  return current.children || [];
};

/**
 * 搜索文件
 * @param {Object} structure - 目录结构数据
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 匹配的文件和目录列表
 */
export const searchFiles = (structure, keyword) => {
  const results = [];
  
  if (!structure || !keyword || keyword.trim() === '') {
    return results;
  }
  
  const keywordLower = keyword.toLowerCase();
  
  const search = (node, currentPath = '') => {
    const itemPath = currentPath ? `${currentPath}/${node.name}` : node.name;
    
    // 检查当前节点是否匹配
    if (node.name.toLowerCase().includes(keywordLower)) {
      results.push({
        name: node.name,
        type: node.type,
        path: itemPath,
        size: node.size,
        modified: node.modified
      });
    }
    
    // 递归搜索子目录
    if (node.type === 'directory' && node.children) {
      node.children.forEach(child => search(child, itemPath));
    }
  };
  
  search(structure);
  return results;
};