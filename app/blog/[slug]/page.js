import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts, getPost, getAllSlugs } from '@/lib/posts';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keyword,
    metadataBase: new URL('https://nclexprepro.com'),
    alternates: { canonical: `https://nclexprepro.com/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://nclexprepro.com/blog/${post.slug}`,
      siteName: 'NCLEX PrePro',
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

async function getContent(slug) {
  try {
    const mod = await import(`@/lib/content/${slug}.js`);
    return mod.content;
  } catch {
    return null;
  }
}

export default async function BlogPost({ params }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const content = await getContent(params.slug);

  return (
    <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Nav */}
      <div style={{ background: '#1e3a5f', padding: '14px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>NCLEX PrePro</Link>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
        <Link href="/blog" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Study Guides</Link>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
        <span style={{ color: 'white', fontSize: '14px', opacity: 0.9 }}>{post.category}</span>
      </div>

      {/* Hero */}
      <div style={{ background: '#1e3a5f', padding: '48px 24px 56px', textAlign: 'center' }}>
        <span style={{ background: 'rgba(79,70,229,0.8)', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>{post.category}</span>
        <h1 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '800', margin: '16px auto', maxWidth: '780px', lineHeight: '1.3' }}>{post.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.readTime}
        </p>
      </div>

      {/* Article Body */}
      <div style={{ maxWidth: '780px', margin: '-24px auto 0', padding: '0 24px 64px', position: 'relative', zIndex: 1 }}>
        <article style={{ background: 'white', borderRadius: '12px', padding: 'clamp(24px, 5vw, 48px)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {content ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{ lineHeight: '1.8', color: '#374151', fontSize: '16px' }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
              <p>Article content coming soon.</p>
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{ background: '#eef2ff', border: '2px solid #4f46e5', borderRadius: '10px', padding: '28px', textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontWeight: '700', fontSize: '18px', color: '#1e3a5f', margin: '0 0 8px' }}>Ready to test your knowledge?</p>
            <p style={{ color: '#6b7280', margin: '0 0 20px', fontSize: '15px' }}>Take 10 free NCLEX-style practice questions right now — no account needed.</p>
            <Link href="/sample" style={{ background: '#4f46e5', color: 'white', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
              Start Free Practice Test →
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e3a5f', marginBottom: '16px' }}>More Study Guides</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {posts.filter(p => p.slug !== post.slug).slice(0, 3).map(related => (
              <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <p style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '600', margin: '0 0 6px' }}>{related.category}</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a5f', margin: '0', lineHeight: '1.4' }}>{related.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
