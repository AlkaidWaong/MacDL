import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import Card from './Card'

export const SidebarAds = () => {
  const adConfig = siteConfig('SIDEBAR_ADVERTISEMENT')
  
  if (!adConfig || !adConfig.ENABLE) return null

  return (
    <Card 
      className='bg-white dark:bg-[#1e1e1e] dark:text-white 
        hover:border-indigo-600 dark:hover:border-yellow-600 
        duration-200 mb-4'
    >
      <div>
        <div className='mb-2 px-1 flex flex-nowrap justify-between'>
          <div className='font-bold dark:text-gray-200'>
            <i className='mr-2 fas fa-gift' />
            {adConfig.TITLE}
          </div>
        </div>
        <div className='px-1'>
          <div className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
            {adConfig.SUBTITLE}
          </div>
          
          <div className='flex flex-col'>
            {adConfig.ADS.map((ad, index) => (
              <Link 
                key={index} 
                href={ad.LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className='my-3 flex group'
              >
                <div className='w-16 h-16 overflow-hidden relative rounded-lg
                  transition-all duration-300 ease-in-out
                  group-hover:shadow-lg group-hover:scale-[1.02]'>
                  <img 
                    src={ad.IMAGE} 
                    alt={ad.DESCRIPTION} 
                    className='object-cover w-full h-full
                      transition-all duration-300 ease-in-out
                      group-hover:brightness-90 group-hover:scale-110'
                  />
                </div>
                <div className='flex-1 overflow-x-hidden px-2 duration-200 rounded
                  dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-yellow-600
                  cursor-pointer items-center flex'>
                  <div className='w-full'>
                    <div className='line-clamp-2 text-sm menu-link
                      transition-all duration-200 ease-in-out
                      group-hover:translate-x-1'>
                      {ad.DESCRIPTION}
                    </div>
                    <div className='text-xs text-gray-400 mt-0.5 opacity-0 -translate-y-2
                      transition-all duration-200 ease-in-out
                      group-hover:opacity-100 group-hover:translate-y-0'>
                      点击查看详情 →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
