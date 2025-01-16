import { siteConfig } from '@/lib/config'

/**
 * 生成规范的URL
 * @param {string} path - 路径
 * @param {boolean} isPost - 是否为文章页面
 * @returns {string} - 规范的URL
 */
export const getCanonicalUrl = (path, isPost = false) => {
  // 移除开头的斜杠
  path = path.replace(/^\/+/, '')
  
  // 如果是文章页面且启用了伪静态
  if (isPost && siteConfig('PSEUDO_STATIC') && !path.endsWith('.html')) {
    path = `${path}.html`
  }

  // 获取基础URL，确保没有结尾的斜杠
  const baseUrl = siteConfig('LINK').replace(/\/$/, '')
  
  return `${baseUrl}/${path}`
}

/**
 * 生成内部链接的href属性
 * @param {string} path - 路径
 * @param {boolean} isPost - 是否为文章页面
 * @returns {string} - 用于Next.js Link组件的href
 */
export const getInternalLinkHref = (path, isPost = false) => {
  // 移除开头的斜杠
  path = path.replace(/^\/+/, '')
  
  // 如果是文章页面且启用了伪静态
  if (isPost && siteConfig('PSEUDO_STATIC') && !path.endsWith('.html')) {
    path = `${path}.html`
  }
  
  return `/${path}`
}
