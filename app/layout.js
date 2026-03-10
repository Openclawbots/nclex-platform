import './globals.css'

export const metadata = {
  title: 'NCLEX PrepPro — #1 NGN Case Study Bank Under $50 | Only $19',
  description: 'Most complete NGN prep under $50. 667 questions including 20 NGN clinical case studies — a $300 value for only $19 one-time. Bow-tie, trend, matrix, extended response. Updated for April 2026.',
  keywords: 'NCLEX practice test, NGN NCLEX questions, next generation NCLEX, NCLEX case studies, bow-tie questions, NCLEX 2026, CJMM, NCLEX prep, nursing exam practice',
  metadataBase: new URL('https://nclexprepro.com'),
  alternates: { canonical: 'https://nclexprepro.com' },
  openGraph: {
    title: 'NCLEX PrepPro — #1 NGN Case Study Bank Under $50 | Only $19',
    description: 'Most complete NGN prep under $50. 667 questions + 20 NGN case studies. A $300 value for only $19. Updated for April 2026.',
    url: 'https://nclexprepro.com',
    siteName: 'NCLEX PrepPro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NCLEX PrepPro — #1 NGN Case Study Bank Under $50',
    description: 'Most complete NGN prep under $50. 667 questions + 20 NGN case studies. $300 value for $19.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
