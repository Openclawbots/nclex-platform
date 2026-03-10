import Link from 'next/link';

export const metadata = {
  title: 'About NCLEX PrepPro — #1 NGN Case Study Bank Under $20',
  description: 'NCLEX PrepPro offers 667 NCLEX practice questions including 20 NGN clinical case studies mapped to the CJMM framework. Updated for the April 2026 test plan. $19 one-time.',
  alternates: { canonical: 'https://nclexprepro.com/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] to-white">
      <nav className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🏥 NCLEX PrepPro</Link>
          <div className="flex gap-4 text-sm">
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/sample" className="hover:underline">Free Sample</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/schools" className="hover:underline">For Schools</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#1e3a5f] mb-8">About NCLEX PrepPro</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-xl leading-relaxed">
            NCLEX PrepPro was built with one goal: give nursing students access to high-quality NCLEX practice questions
            without the $200-400 price tag that other prep courses charge.
          </p>

          <h2 className="text-2xl font-bold text-[#1e3a5f] mt-10">Why We Exist</h2>
          <p>
            The average nursing student graduates with <strong>$40,000+ in student loan debt</strong>. Then they're told they need to
            spend another $200-400 on NCLEX prep materials — money most new graduates don't have.
          </p>
          <p>
            We built NCLEX PrepPro to prove that effective NCLEX preparation doesn't have to be expensive. Our question bank
            covers the same clinical judgment, prioritization, and critical thinking that the real NCLEX tests — at a
            price that doesn't add to your financial stress.
          </p>

          <h2 className="text-2xl font-bold text-[#1e3a5f] mt-10">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">667 Practice Questions</h3>
              <p className="text-sm text-gray-600">Including 170 Next Generation NCLEX (NGN) questions across 20 full clinical case studies. All mapped to the NCSBN CJMM framework and updated for the April 2026 test plan.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Detailed Rationales</h3>
              <p className="text-sm text-gray-600">Every question includes a thorough explanation of why the correct answer is right and why the others are wrong.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">7 Categories + NGN</h3>
              <p className="text-sm text-gray-600">Med-Surg, Pharmacology, Safety, Prioritization, SATA — plus 20 NGN clinical case studies featuring bow-tie, trend, matrix, and extended response formats.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Timed Practice</h3>
              <p className="text-sm text-gray-600">60-minute timed exams simulate real NCLEX conditions so you build test-taking stamina.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#1e3a5f] mt-10">Our Philosophy</h2>
          <p>
            We believe in <strong>questions over content</strong>. Research consistently shows that active practice with
            rationale review is more effective than passive reading for NCLEX preparation. That's why we focus entirely on
            giving you the highest-quality practice questions at the lowest possible price.
          </p>

          <h2 className="text-2xl font-bold text-[#1e3a5f] mt-10">Based in Milwaukee, WI</h2>
          <p>
            NCLEX PrepPro is a product of American Thrives LLC, based in Milwaukee, Wisconsin. We're committed to
            helping the next generation of nurses enter the profession prepared and confident.
          </p>

          <div className="bg-[#f0f7ff] border-l-4 border-[#1e3a5f] p-6 rounded-r-lg mt-10">
            <p className="font-bold text-[#1e3a5f] mb-2">Questions?</p>
            <p className="text-gray-600">
              Email us at <a href="mailto:support@nclexprepro.com" className="text-[#1e3a5f] underline">support@nclexprepro.com</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>© 2026 NCLEX PrepPro · A product of American Thrives LLC · Milwaukee, WI</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/faq" className="hover:underline">FAQ</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
