import type { Metadata } from 'next'
import { Bebas_Neue, Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-condensed',
  display: 'swap',
})

const SITE_URL = 'https://flamesquashclub.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FLAME Squash Club',
    template: '%s | FLAME Squash Club',
  },
  description: 'FLAME Squash Club, the official squash club of FLAME University, Pune. Ladder rankings, tryouts, events, and the team building it.',
  keywords: ['FLAME Squash Club', 'FLAME squash', 'FLAME University squash', 'squash club Pune', 'FSC squash'],
  applicationName: 'FLAME Squash Club',
  icons: { icon: '/logo.png' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'FLAME Squash Club',
    title: 'FLAME Squash Club',
    description: 'The official squash club of FLAME University, Pune. Ladder rankings, tryouts, events, and the team building it.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'FLAME Squash Club' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLAME Squash Club',
    description: 'The official squash club of FLAME University, Pune. Ladder rankings, tryouts, events, and the team building it.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsClub',
  name: 'FLAME Squash Club',
  alternateName: 'FSC',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.jpg`,
  sport: 'Squash',
  email: 'squashclub@flame.edu.in',
  sameAs: ['https://instagram.com/flamesquashclub'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Arjuna Squash Courts, FLAME University',
    addressLocality: 'Lavale, Pune',
    addressRegion: 'Maharashtra',
    postalCode: '412115',
    addressCountry: 'IN',
  },
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: 'FLAME University',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="bg-[#05080f] text-white antialiased grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
