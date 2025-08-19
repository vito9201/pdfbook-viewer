import React, { useState } from 'react'
import './App.css'
import directoryStructure from './data/directoryStructure.js'
import { navigateToPath, navigateUp, getCurrentDirectoryContent, buildDownloadPath } from './utils/browserUtils.js'

// 文件项组件
const FileItem = ({ item, currentPath, onNavigate }) => {
  // 如果是目录，处理导航
  if (item.type === 'directory') {
    return (
      <div 
        className="file-item directory"
        onClick={() => onNavigate(currentPath + '/' + item.name)}
      >
        <span className="file-icon">📁</span>
        <span className="file-name">{item.name}</span>
        <span className="file-size"></span>
        <span className="file-modified"></span>
      </div>
    )
  }

  // 如果是文件，提供下载链接
  return (
    <div className="file-item">
      <span className="file-icon">📄</span>
      <span className="file-name">{item.name}</span>
      <span className="file-size">{item.size}</span>
      <span className="file-modified">{item.modified}</span>
      <a 
        href={buildDownloadPath(currentPath, item.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="download-link"
      >
        下载
      </a>
    </div>
  )
}

// 面包屑导航组件
const DirectoryBreadcrumb = ({ path, onNavigate }) => {
  const parts = path.split('/').filter(Boolean)
  
  return (
    <div className="breadcrumb">
      <span 
        className="breadcrumb-item"
        onClick={() => onNavigate('')}
      >
        根目录
      </span>
      {parts.map((part, index) => {
        const fullPath = parts.slice(0, index + 1).join('/')
        return (
          <>
            <span className="breadcrumb-separator">/</span>
            <span 
              key={fullPath}
              className="breadcrumb-item"
              onClick={() => onNavigate(fullPath)}
            >
              {part}
            </span>
          </>
        )
      })}
    </div>
  )
}

function App() {
  // 当前路径状态
  const [currentPath, setCurrentPath] = useState('')
  
  // 获取当前目录内容
  const currentContent = getCurrentDirectoryContent(directoryStructure, currentPath)
  
  // 处理导航
  const handleNavigate = (path) => {
    setCurrentPath(path)
  }
  
  // 处理返回上级目录
  const handleBack = () => {
    const parentPath = navigateUp(currentPath)
    setCurrentPath(parentPath)
  }
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>教材下载</h1>
      </header>
      
      <main className="app-main">
        <div className="file-browser">
          {currentPath && (
            <button className="back-button" onClick={handleBack}>
              ← 返回上级目录
            </button>
          )}
          
          <DirectoryBreadcrumb 
            path={currentPath} 
            onNavigate={handleNavigate}
          />
          
          <div className="file-list">
            {currentContent && currentContent.length > 0 ? (
              currentContent.map((item, index) => (
                <FileItem 
                  key={index} 
                  item={item} 
                  currentPath={currentPath} 
                  onNavigate={handleNavigate}
                />
              ))
            ) : (
              <p className="empty-message">该目录为空</p>
            )}
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>PDFbook 在线浏览与下载系统</p>
      </footer>
    </div>
  )
}

export default App