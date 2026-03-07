import Link from 'next/link';
import { posts } from '@/lib/posts';

export const metadata = {
  title: 'NCLEX Study Guides & Tips | NCLEX PrePro Blog',
  description: 'Free NCLEX study guides, strategies, and tips from NCLEX PrePro. Learn how to pass the NCLEX with proven strategies for pharmacology, SATA, priority questions, and more.',
  metadataBase: new URL('https://nclexprepro.com'),
  alternates: { canonical: 'https://nclexprepro.com/blog' },
};

const categoryColors = {
  'Study Tips': 'bg-blue-100 text-blue-700',
  'Pharmacology': 'bg-purple-100 text-purple-700',
  'Exam Prep': 'bg-green-100 text-green-700',
  'Question Strategy': 'bg-orange-100 text-orange-700',
  'Study Plans': 'bg-pink-100 text-pink-700',
};

export default function BlogPage() {
  return (
    <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#1e3a5f', color: 'white', padding: '48px 24px', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Back to NCLEX PrePro</Link>
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '16px 0 8px' }}>NCLEX Study Guides</h1>
        <p style={{ fontSize: '18px', opacity: 0.85, maxWidth: '540px', margin: '0 auto' }}>
          Free, in-depth guides written to help nursing students pass the NCLEX on their first attempt.
        </p>
      </div>

      {/* Posts Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'; }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>{post.category}</span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 12px', lineHeight: '1.4' }}>{post.title}</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', flex: 1, margin: '0 0 16px' }}>{post.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#9ca3af' }}>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#1e3a5f', borderRadius: '12px', padding: '40px', textAlign: 'center', marginTop: '48px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', margin: '0 0 12px' }}>Ready to Practice?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 24px' }}>Test your knowledge with 10 free NCLEX-style questions — no account needed.</p>
          <Link href="/sample" style={{ background: '#4f46e5', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', display: 'inline-block' }}>
            Take Free Practice Test →
          </Link>
        </div>
      </div>
    </main>
  );
}
