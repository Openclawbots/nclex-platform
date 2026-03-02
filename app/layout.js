import './globals.css'

export const metadata = {
  title: 'NCLEX PrepPro — Free NCLEX Practice Test | 497 Questions',
  description: 'Prepare for the NCLEX with 497 real-style practice questions covering Med-Surg, Pharmacology, Safety, Prioritization, and SATA. Free 10-question sample — no signup required.',
  keywords: 'NCLEX practice test, NCLEX prep, NCLEX questions, nursing exam practice, NCLEX RN, NCLEX PN, free NCLEX test',
  metadataBase: new URL('https://nclexprepro.com'),
  alternates: { canonical: 'https://nclexprepro.com' },
  openGraph: {
    title: 'NCLEX PrepPro — Free NCLEX Practice Test',
    description: 'Practice with 497 real-style NCLEX questions. Free 10-question sample, no signup needed.',
    url: 'https://nclexprepro.com',
    siteName: 'NCLEX PrepPro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NCLEX PrepPro — Free NCLEX Practice Test',
    description: 'Practice with 497 real-style NCLEX questions. Free sample, no signup.',
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
