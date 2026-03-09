import Link from 'next/link';

export const metadata = {
  title: 'FAQ — NCLEX PrepPro',
  description: 'Frequently asked questions about NCLEX PrepPro, our practice questions, pricing, and how to prepare for the NCLEX exam.',
  alternates: { canonical: 'https://nclexprepro.com/faq' },
};

const faqs = [
  {
    q: 'How many questions does NCLEX PrepPro have?',
    a: 'We currently offer 497 NCLEX-style practice questions across 5 categories: Med-Surg (100), Pharmacology (100), Safety (100), Prioritization (99), and Select All That Apply (98).',
  },
  {
    q: 'How much does it cost?',
    a: 'Full access is $19 — a one-time payment. No subscription, no recurring charges, no expiration. You can also try 10 free questions before purchasing.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! Take our free 10-question sample exam (2 questions from each category) with full rationales. No credit card required — just enter your name and email.',
  },
  {
    q: 'Do you provide answer rationales?',
    a: 'Yes. Every single question includes a detailed rationale explaining why the correct answer is right and why the other options are wrong. This is where the real learning happens.',
  },
  {
    q: 'How does NCLEX PrepPro compare to UWorld or Archer Review?',
    a: "UWorld costs $139-449 and Archer starts at $59. We offer 497 questions with rationales for $19 — one-time, lifetime access. We're designed for students who want quality practice without the premium price tag. Check our pricing page for a detailed comparison.",
  },
  {
    q: 'What question types are included?',
    a: 'We include standard multiple-choice questions and Select All That Apply (SATA) questions — the two most common question types on the NCLEX. All questions are written at the application and analysis level, matching the difficulty of the real exam.',
  },
  {
    q: 'Does access expire?',
    a: "No. Once you purchase full access, it's yours forever. No expiration date, no renewal fees. Come back and retake the practice tests as many times as you want.",
  },
  {
    q: 'Can I use NCLEX PrepPro on my phone?',
    a: 'Yes. NCLEX PrepPro is fully responsive and works on any device — phone, tablet, or desktop. No app download required.',
  },
  {
    q: 'Is this enough to pass the NCLEX?',
    a: "NCLEX PrepPro is a practice question bank, not a comprehensive review course. We recommend using it alongside a content review resource (like Saunders or ATI). Our questions are designed to build clinical judgment and test-taking skills — which is what the NCLEX actually tests.",
  },
  {
    q: 'I have a promo code. Where do I enter it?',
    a: 'Enter your promo code at checkout. Current codes include SAMPLE15 for 15% off. Follow us on Twitter @NCLEXPrepPro for exclusive discount codes.',
  },
  {
    q: 'What if I just failed the NCLEX?',
    a: "You're not alone — 18% of first-time takers don't pass. Use your Candidate Performance Report (CPR) to identify weak areas, then focus your practice on those categories. Our question bank lets you practice by category so you can target exactly where you need improvement. Read our guide: What Happens If You Fail the NCLEX?",
  },
  {
    q: 'How do I get help or report an issue?',
    a: 'Email us at support@nclexprepro.com. We typically respond within 24 hours.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] to-white">
      <nav className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🏥 NCLEX PrepPro</Link>
          <div className="flex gap-4 text-sm">
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/sample" className="hover:underline">Free Sample</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 mb-12">Everything you need to know about NCLEX PrepPro.</p>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-3">{faq.q}</h2>
              <p className="text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-[#f0f7ff] border border-[#1e3a5f]/20 rounded-xl p-8">
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">We're here to help.</p>
          <a href="mailto:support@nclexprepro.com" className="inline-block bg-[#1e3a5f] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#2a4f7f] transition">
            Email Us
          </a>
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
