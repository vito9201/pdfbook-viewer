// 浏览器环境中可用的工具函数

/**
 * 获取文件的扩展名
 * @param {string} filename - 文件名
 * @returns {string} 文件扩展名（不含点号）
 */
export const getFileExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.substring(lastDotIndex + 1).toLowerCase();
};

/**
 * 根据文件扩展名获取图标
 * @param {string} extension - 文件扩展名
 * @returns {string} 图标emoji
 */
export const getFileIcon = (extension) => {
  const iconMap = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📋',
    pptx: '📋',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    mp3: '🎵',
    mp4: '🎬',
    zip: '🗜️',
    rar: '🗜️',
    '7z': '🗜️'
  };
  
  return iconMap[extension] || '📄';
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化日期时间
 * @param {string} dateString - ISO格式的日期字符串
 * @returns {string} 格式化后的日期时间
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 构建文件下载路径
 * @param {string} basePath - 基础路径（如'/PDFbook'）
 * @param {Array} currentPath - 当前路径数组
 * @param {string} filename - 文件名
 * @returns {string} 完整的下载路径
 */
export const buildDownloadPath = (basePath, currentPath, filename) => {
  // 确保basePath以斜杠开头
  const normalizedBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  // 移除末尾斜杠
  const cleanBasePath = normalizedBasePath.endsWith('/') ? normalizedBasePath.slice(0, -1) : normalizedBasePath;
  // 构建完整路径
  return `${cleanBasePath}/${currentPath.join('/')}/${filename}`;
};

/**
 * 导航到指定路径
 * @param {Array} path - 目标路径数组
 * @param {Function} setCurrentPath - 设置当前路径的函数
 */
export const navigateToPath = (path, setCurrentPath) => {
  if (Array.isArray(path)) {
    setCurrentPath([...path]);
  }
};

/**
 * 返回上一级目录
 * @param {Array} currentPath - 当前路径数组
 * @param {Function} setCurrentPath - 设置当前路径的函数
 */
export const navigateUp = (currentPath, setCurrentPath) => {
  if (currentPath.length > 0) {
    setCurrentPath(currentPath.slice(0, -1));
  }
};

/**
 * 返回根目录
 * @param {Function} setCurrentPath - 设置当前路径的函数
 */
export const navigateToRoot = (setCurrentPath) => {
  setCurrentPath([]);
};

/**
 * 根据当前路径获取目录内容
 * @param {Object} directoryStructure - 完整的目录结构
 * @param {Array} currentPath - 当前路径数组
 * @returns {Array} 当前目录下的文件和子目录
 */
export const getCurrentDirectoryContent = (directoryStructure, currentPath) => {
  let current = directoryStructure;
  
  for (const segment of currentPath) {
    if (current && current.children) {
      const found = current.children.find(child => 
        child.type === 'directory' && child.name === segment
      );
      if (found) {
        current = found;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  
  return current.children || [];
};

/**
 * 搜索文件和目录
 * @param {Object} directoryStructure - 完整的目录结构
 * @param {string} query - 搜索关键词
 * @returns {Array} 搜索结果数组
 */
export const searchFiles = (directoryStructure, query) => {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  const search = (structure, currentPath = []) => {
    if (!structure) return;
    
    // 检查当前项是否匹配搜索词
    if (structure.name.toLowerCase().includes(searchTerm)) {
      results.push({
        ...structure,
        path: currentPath
      });
    }
    
    // 递归搜索子目录
    if (structure.type === 'directory' && structure.children) {
      structure.children.forEach(child => 
        search(child, [...currentPath, structure.name])
      );
    }
  };
  
  search(directoryStructure);
  return results;
};