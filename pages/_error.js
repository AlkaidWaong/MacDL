import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getBaseLayoutByTheme } from '@/themes/theme'

function Error({ statusCode }) {
  const GLayout = getBaseLayoutByTheme(siteConfig('THEME', BLOG.THEME))
  return (
    <GLayout>
      <div className="error-page">
        <h1>
          {statusCode
            ? `${statusCode} - Server Error`
            : 'An error occurred on client'}
        </h1>
        <p>Sorry, something went wrong.</p>
      </div>
      <style jsx>{`
        .error-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          text-align: center;
        }
        h1 {
          margin-bottom: 1rem;
          font-size: 2rem;
          font-weight: bold;
        }
        p {
          color: #666;
        }
      `}</style>
    </GLayout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
