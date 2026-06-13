import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VIES - Vòng bi & Linh kiện công nghiệp',
    short_name: 'VIES',
    description:
      'Nhà phân phối vòng bi và linh kiện công nghiệp chính hãng SKF, FAG, NTN, TIMKEN tại Việt Nam',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0F4C75',
    lang: 'vi',
    icons: [
      { src: '/icon.png', sizes: 'any', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
