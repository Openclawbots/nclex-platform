export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: 'https://nclexprepro.com/sitemap.xml',
  };
}
