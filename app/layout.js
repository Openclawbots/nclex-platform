import './globals.css'

export const metadata = {
  title: 'NCLEX PrepPro — #1 NGN Case Study Bank | 667 Questions for $19',
  description: 'The most complete NGN prep under $50. 667 questions including 20 clinical case studies with bow-tie, trend, matrix, and extended response formats. Updated for April 2026 NCLEX test plan. $19 one-time.',
  keywords: 'NCLEX practice test, NGN NCLEX questions, next generation NCLEX, NCLEX case studies, bow-tie questions, NCLEX 2026, CJMM, NCLEX prep, nursing exam practice',
  metadataBase: new URL('https://nclexprepro.com'),
  alternates: { canonical: 'https://nclexprepro.com' },
  openGraph: {
    title: 'NCLEX PrepPro — #1 NGN Case Study Bank Under $20',
    description: '667 questions including 20 NGN clinical case studies. Bow-tie, trend, matrix formats. Updated for April 2026 NCLEX test plan. $19 one-time.',
    url: 'https://nclexprepro.com',
    siteName: 'NCLEX PrepPro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NCLEX PrepPro — #1 NGN Case Study Bank Under $20',
    description: '667 NCLEX questions including 20 NGN clinical case studies. Updated for April 2026. $19 one-time.',
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
