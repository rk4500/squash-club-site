import type { MetadataRoute } from 'next'

const SITE_URL = 'https://flamesquashclub.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/team', '/committee', '/ladder', '/ladder/bracket', '/events', '/gallery', '/contact']
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))
}
