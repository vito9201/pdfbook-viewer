import React, { useState } from 'react';
import './App.css';

// 从数据文件导入目录结构
import { directoryStructure } from './data/directoryStructure.js';

// 从浏览器工具函数导入
import {
  getFileIcon,
  getFileExtension,
  buildDownloadPath,
  navigateToPath,
  navigateUp,
  getCurrentDirectoryContent
} from './utils/browserUtils.js';

function FileItem({ item, currentPath, onNavigate }) {
  if (item.type === 'directory') {
    return (
      <li className="file-item directory">
        <span 
          className="item-name" 
          onClick={() => navigateToPath([...currentPath, item.name], onNavigate)}
        >
          📁 {item.name}
        </span>
      </li>
    );
  }
  
  const extension = getFileExtension(item.name);
  const icon = getFileIcon(extension);
  
  return (
    <li className="file-item file">
      <span className="item-name">{icon} {item.name}</span>
      <a 
        href={buildDownloadPath('/PDFbook', currentPath, item.name)} 
        className="download-link"
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        下载
      </a>
    </li>
  );
}

function DirectoryBreadcrumb({ currentPath, onNavigate }) {
  const breadcrumbs = [];
  
  // 添加根目录
  breadcrumbs.push({
    name: 'PDFbook',
    path: []
  });
  
  // 添加中间路径
  let current = [];
  for (const segment of currentPath) {
    current = [...current, segment];
    breadcrumbs.push({
      name: segment,
      path: current
    });
  }
  
  return (
    <div className="breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && ' / '}
          <button 
            className={index === breadcrumbs.length - 1 ? 'active' : ''}
            onClick={() => navigateToPath(crumb.path, onNavigate)}
          >
            {crumb.name}
          </button>
        </span>
      ))}
    </div>
  );
}

// 已从browserUtils.js导入getCurrentDirectoryContent函数，此处不再重复定义

function App() {
  const [currentPath, setCurrentPath] = useState([]);
  const currentContent = getCurrentDirectoryContent(directoryStructure, currentPath);

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  const handleGoBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>教材下载</h1>
      </header>
      <main className="app-main">
        <div className="file-explorer">
          <div className="explorer-header">
            {currentPath.length > 0 && (
              <button className="back-button" onClick={handleGoBack}>
                ← 返回上一级
              </button>
            )}
            <DirectoryBreadcrumb 
              currentPath={currentPath} 
              onNavigate={handleNavigate} 
            />
          </div>
          <ul className="file-list">
            {currentContent.map((item, index) => (
              <FileItem 
                key={index} 
                item={item} 
                currentPath={currentPath} 
                onNavigate={handleNavigate} 
              />
            ))}
          </ul>
        </div>
      </main>
      <footer className="app-footer">
        <p>PDFbook 在线浏览与下载系统</p>
      </footer>
    </div>
  );
}

export default App;