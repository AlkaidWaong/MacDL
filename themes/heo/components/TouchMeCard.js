import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import FlipCard from '@/components/FlipCard'
import { useState } from 'react'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  const [isHovered, setIsHovered] = useState(false)

  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }

  const qrCodeUrl = siteConfig('HEO_SOCIAL_CARD_QR_CODE', null, CONFIG)
  const bgColor = siteConfig('HEO_SOCIAL_CARD_BG_COLOR', null, CONFIG) || '#4f65f0'

  return (
    <div 
      className={'relative h-28 text-white flex flex-col group'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FlipCard
        className={`cursor-pointer lg:p-6 p-4 border rounded-xl transition-all duration-300 
          dark:border-gray-600`}
        frontContent={
          <div 
            className='h-full relative rounded-xl overflow-hidden'
            style={{ 
              backgroundColor: bgColor,
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            <div className='p-4'>
              <h2 className='font-[1000] text-3xl'>
                {siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG)}
              </h2>
              <h3 className='pt-2'>
                {siteConfig('HEO_SOCIAL_CARD_TITLE_2', null, CONFIG)}
              </h3>
            </div>
            {qrCodeUrl && (
              <div 
                className={`absolute top-0 right-0 w-20 h-20 transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${qrCodeUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            )}
            <div
              className='absolute left-0 top-0 w-full h-full'
              style={{
                background:
                  'url(https://bu.dusays.com/2023/05/16/64633c4cd36a9.png) center center no-repeat',
                backgroundColor: bgColor,
                mixBlendMode: 'overlay'
              }}
            />
          </div>
        }
        backContent={
          <div 
            className='flex items-center h-full rounded-xl overflow-hidden px-5 py-4'
            style={{ 
              backgroundColor: bgColor,
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            <div className='flex-grow pr-5'>
              <h3 className='text-xl font-bold leading-tight'>
                {siteConfig('HEO_SOCIAL_CARD_TITLE_3', null, CONFIG)}
              </h3>
              <p className='text-sm text-white/80 mt-1'>
                {siteConfig('HEO_SOCIAL_CARD_TITLE_4', null, CONFIG)}
              </p>
            </div>
            {qrCodeUrl && (
              <div 
                className='w-24 h-24 rounded-xl flex-shrink-0'
                style={{
                  backgroundImage: `url(${qrCodeUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            )}
          </div>
        }
      />
    </div>
  )
}
