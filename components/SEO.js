import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { getCanonicalUrl } from '@/lib/utils/url'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// IndexNow配置
const INDEX_NOW_CONFIG = {
  apiKey: 'c40a448fa32a4d35bc65fe8d0ec8e772',
  apiEndpoint: 'https://api.indexnow.org/indexnow'
}

// 提交URL到IndexNow
const submitToIndexNow = async (urls) => {
  // 仅在生产环境下运行
  if (process.env.NODE_ENV !== 'production') {
    console.log('IndexNow: 开发环境下不提交URL:', urls)
    return
  }

  try {
    const response = await fetch(INDEX_NOW_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        host: window.location.hostname,
        key: INDEX_NOW_CONFIG.apiKey,
        urlList: Array.isArray(urls) ? urls : [urls],
        keyLocation: `https://${window.location.hostname}/${INDEX_NOW_CONFIG.apiKey}.txt`
      })
    })

    if (response.ok) {
      console.log('IndexNow: URL提交成功:', urls)
      return true
    } else {
      console.error('IndexNow: URL提交失败:', await response.text())
      return false
    }
  } catch (error) {
    console.error('IndexNow: 提交过程中出错:', error)
    return false
  }
}

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')
  
  // 使用新的URL工具生成规范URL
  const canonicalUrl = getCanonicalUrl(
    router.asPath.split('?')[0].split('#')[0],
    post?.type === 'Post'
  )

  useEffect(() => {
    // 使用WebFontLoader字体加载
    loadExternalResource(
      'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
      'js'
    ).then(url => {
      const WebFont = window?.WebFont
      if (WebFont) {
        // console.log('LoadWebFont', webFontUrl)
        WebFont.load({
          custom: {
            // families: ['"LXGW WenKai"'],
            urls: webFontUrl
          }
        })
      }
    })
  }, [])

  // 监听文章变化，自动提交到IndexNow
  useEffect(() => {
    if (post?.id && process.env.NODE_ENV === 'production') {
      const postUrl = `${siteConfig('LINK')}${router.asPath}`
      submitToIndexNow(postUrl).catch(console.error)
    }
  }, [post, router.asPath])

  // SEO关键词
  let keywords = meta?.tags || siteConfig('KEYWORDS')
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    const url = `${siteConfig('LINK')}${meta.slug}`
    const image = meta.image || '/bg_image.jpg'
    const title = meta?.title || siteConfig('TITLE')
    const description = meta?.description || `${siteInfo?.description}`
    const type = meta?.type || 'website'
    const lang = siteConfig('LANG').replace('-', '_') // Facebook OpenGraph 要 zh_CN 这样的格式才抓得到语言
    const category = meta?.category || siteConfig('KEYWORDS') // section 主要是像是 category 这样的分类，Facebook 用这个来抓连结的分分类
    const favicon = siteConfig('BLOG_FAVICON')
    const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

    const SEO_BAIDU_SITE_VERIFICATION = siteConfig(
      'SEO_BAIDU_SITE_VERIFICATION',
      null,
      NOTION_CONFIG
    )

    const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
      'SEO_GOOGLE_SITE_VERIFICATION',
      null,
      NOTION_CONFIG
    )

    const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)

    const COMMENT_WEBMENTION_ENABLE = siteConfig(
      'COMMENT_WEBMENTION_ENABLE',
      null,
      NOTION_CONFIG
    )

    const COMMENT_WEBMENTION_HOSTNAME = siteConfig(
      'COMMENT_WEBMENTION_HOSTNAME',
      null,
      NOTION_CONFIG
    )
    const COMMENT_WEBMENTION_AUTH = siteConfig(
      'COMMENT_WEBMENTION_AUTH',
      null,
      NOTION_CONFIG
    )
    const ANALYTICS_BUSUANZI_ENABLE = siteConfig(
      'ANALYTICS_BUSUANZI_ENABLE',
      null,
      NOTION_CONFIG
    )

    const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)

    return (
      <Head>
        <link rel='icon' href={favicon} />
        <title>{title}</title>
        <meta name='theme-color' content={BACKGROUND_DARK} />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
        />
        <meta name='robots' content='follow, index' />
        <meta charSet='UTF-8' />
        {SEO_GOOGLE_SITE_VERIFICATION && (
          <meta
            key="google-site-verification"
            name='google-site-verification'
            content={SEO_GOOGLE_SITE_VERIFICATION}
          />
        )}
        {SEO_BAIDU_SITE_VERIFICATION && (
          <meta
            key="baidu-site-verification"
            name='baidu-site-verification'
            content={SEO_BAIDU_SITE_VERIFICATION}
          />
        )}
        <meta key="keywords" name='keywords' content={keywords} />
        <meta key="description" name='description' content={description} />
        <meta key="og:locale" property='og:locale' content={lang} />
        <meta key="og:title" property='og:title' content={title} />
        <meta key="og:description" property='og:description' content={description} />
        <meta key="og:url" property='og:url' content={url} />
        <meta key="og:image" property='og:image' content={image} />
        <meta key="og:site_name" property='og:site_name' content={title} />
        <meta key="og:type" property='og:type' content={type} />
        <meta key="twitter:card" name='twitter:card' content='summary_large_image' />
        <meta key="twitter:description" name='twitter:description' content={description} />
        <meta key="twitter:title" name='twitter:title' content={title} />

        <link rel='icon' href={BLOG_FAVICON} />
        <link rel='canonical' href={canonicalUrl} />

        {COMMENT_WEBMENTION_ENABLE && (
          <>
            <link
              rel='webmention'
              href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`}
            />
            <link
              rel='pingback'
              href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`}
            />
            {COMMENT_WEBMENTION_AUTH && (
              <link href={COMMENT_WEBMENTION_AUTH} rel='me' />
            )}
          </>
        )}

        {ANALYTICS_BUSUANZI_ENABLE && (
          <meta name='referrer' content='no-referrer-when-downgrade' />
        )}
        {meta?.type === 'Post' && (
          <>
            <meta property='article:published_time' content={meta.publishDay} />
            <meta property='article:author' content={siteConfig('AUTHOR')} />
            <meta property='article:section' content={category} />
            <meta property='article:publisher' content={FACEBOOK_PAGE} />
          </>
        )}
        {children}
      </Head>
    )
  }
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s

  switch (router.route) {
    case '/':
      return {
        title: `${siteInfo?.title} | ${siteConfig('BIO')}`,
        description: siteInfo?.description || siteConfig('DESCRIPTION'),
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `浏览 ${siteInfo?.title} 中所有关于 ${category} 的文章和资源。发现更多 Mac 软件使用技巧与教程。`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `查看 ${siteInfo?.title} 中所有标记为 ${tag} 的文章。了解更多相关 Mac 软件资讯与使用方法。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: siteConfig('TITLE'),
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteInfo?.title} | 页面找不到啦`,
        image: `${siteInfo?.pageCover}`
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      }
    default:
      return {
        title: post
          ? `${post?.title} | ${siteInfo?.title}`
          : `${siteInfo?.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default SEO
