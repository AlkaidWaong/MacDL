// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { getServerSideSitemap } from 'next-sitemap'

/**
 * 生成规范的URL
 * @param {string} baseUrl - 基础URL
 * @param {string} path - 路径
 * @param {string} locale - 语言
 * @param {boolean} isPost - 是否为文章
 * @returns {string} - 规范的URL
 */
function getCanonicalUrl(baseUrl, path, locale, isPost = false) {
  // 确保baseUrl没有结尾的斜杠
  baseUrl = baseUrl.replace(/\/$/, '')
  
  // 处理locale
  if (locale && locale.length > 0) {
    locale = locale.startsWith('/') ? locale : `/${locale}`
  } else {
    locale = ''
  }
  
  // 处理path
  path = path.startsWith('/') ? path.slice(1) : path
  
  // 如果是文章页面且启用了伪静态
  if (isPost && siteConfig('PSEUDO_STATIC') && !path.endsWith('.html')) {
    path = `${path}.html`
  }
  
  // 确保URL格式正确
  const url = `${baseUrl}${locale}${path ? '/' + path : ''}`
  return url.replace(/([^:]\/)\/+/g, '$1') // 移除多余的斜杠，但保留 http:// 中的双斜杠
}

export const getServerSideProps = async ctx => {
  let fields = []
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')
  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    // 第一个id站点默认语言
    const siteData = await getGlobalData({
      pageId: id,
      from: 'sitemap.xml'
    })
    const link = siteConfig('LINK', '', siteData.NOTION_CONFIG)
    const localeFields = generateLocalesSitemap(link, siteData.allPages, locale)
    fields = fields.concat(localeFields)
  }

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  return getServerSideSitemap(ctx, fields)
}

function generateLocalesSitemap(link, allPages, locale) {
  const today = new Date().toISOString().split('T')[0]
  
  // 定义固定页面
  const staticPages = [
    '',                 // 首页
    'archive',          // 归档
    'category',         // 分类
    'tag',             // 标签
    'search',          // 搜索
    'rss/feed.xml'     // RSS
  ]
  
  // 生成固定页面的sitemap条目
  const defaultFields = staticPages.map(path => ({
    loc: getCanonicalUrl(link, path, locale),
    lastmod: today,
    changefreq: 'daily',
    priority: path === '' ? '1.0' : '0.7' // 首页优先级更高
  }))

  // 生成文章页面的sitemap条目
  const postFields = allPages
    ?.filter(p => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)
    ?.map(post => {
      const slugWithoutLeadingSlash = post?.slug.startsWith('/')
        ? post?.slug?.slice(1)
        : post.slug
        
      // 对于文章页面，使用POST_URL_PREFIX
      const postPath = `${siteConfig('POST_URL_PREFIX')}/${slugWithoutLeadingSlash}`
      
      return {
        loc: getCanonicalUrl(link, postPath, locale, true),
        lastmod: new Date(post?.publishDay).toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      }
    }) ?? []

  return defaultFields.concat(postFields)
}

export default () => {}
