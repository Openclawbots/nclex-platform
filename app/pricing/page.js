import Link from 'next/link';

export const metadata = {
  title: 'NCLEX PrepPro Pricing — 667 Questions + 20 NGN Case Studies for $19',
  description: 'Get full access to 667 NCLEX practice questions including 170 NGN questions and 20 clinical case studies for just $19. One-time payment, no subscription. Compare with UWorld, Archer, and more.',
  alternates: { canonical: 'https://nclexprepro.com/pricing' },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] to-white">
      <nav className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🏥 NCLEX PrepPro</Link>
          <div className="flex gap-4 text-sm">
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/sample" className="hover:underline">Free Sample</Link>
            <Link href="/schools" className="hover:underline">For Schools</Link>
            <Link href="/about" className="hover:underline">About</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Simple Pricing. No Surprises.</h1>
          <p className="text-xl text-gray-600">One-time payment. Lifetime access. No subscription.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Free Sample</h2>
              <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
              <p className="text-gray-500 text-sm mb-6">No credit card required</p>
            </div>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> 10 practice questions</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Full rationales for wrong answers</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Score + category breakdown</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Includes NGN question preview</li>
              <li className="flex items-start gap-2 text-gray-400"><span className="mt-1">✗</span> Limited to 10 questions</li>
            </ul>
            <Link href="/sample" className="block text-center bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition">
              Take Free Sample
            </Link>
          </div>

          {/* Full Access */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a5f] p-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1e3a5f] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              MOST COMPLETE NGN PREP AT $19
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">Full Access</h2>
              <div className="text-4xl font-bold text-[#1e3a5f] mb-1">$19</div>
              <p className="text-gray-500 text-sm mb-6">One-time payment</p>
            </div>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> <strong>667 practice questions</strong></li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Detailed rationales for every question</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> All 7 categories including NGN</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> <strong>20 NGN clinical case studies</strong> — exam-format bow-tie, matrix, trend</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Updated for April 2026 NCLEX test plan</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Timed exam simulation</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Score breakdown by category</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">✓</span> Lifetime access — no expiration</li>
            </ul>
            <Link href="/" className="block text-center bg-[#1e3a5f] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#2a4f7f] transition">
              Get Full Access
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-[#1e3a5f] mb-8">How We Compare</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left py-3 px-4 rounded-tl-lg">Feature</th>
                  <th className="py-3 px-4 bg-[#2a4f7f] font-bold">NCLEX PrepPro</th>
                  <th className="py-3 px-4">UWorld</th>
                  <th className="py-3 px-4">Archer Review</th>
                  <th className="py-3 px-4 rounded-tr-lg">Kaplan</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Price</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">$19</td>
                  <td className="py-3 px-4 text-center">$139–449</td>
                  <td className="py-3 px-4 text-center">$59–399</td>
                  <td className="py-3 px-4 text-center">$200–500</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">Billing</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">One-time</td>
                  <td className="py-3 px-4 text-center">30-730 day sub</td>
                  <td className="py-3 px-4 text-center">Subscription</td>
                  <td className="py-3 px-4 text-center">Course bundle</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Questions</td>
                  <td className="py-3 px-4 text-center bg-green-50 font-bold text-green-700">667 (170 NGN)</td>
                  <td className="py-3 px-4 text-center">2,200+</td>
                  <td className="py-3 px-4 text-center">3,100+</td>
                  <td className="py-3 px-4 text-center">1,000+</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">NGN Case Studies</td>
                  <td className="py-3 px-4 text-center bg-green-50 font-bold text-green-700">20 full cases</td>
                  <td className="py-3 px-4 text-center">✓ (premium)</td>
                  <td className="py-3 px-4 text-center">partial</td>
                  <td className="py-3 px-4 text-center">limited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">April 2026 Test Plan</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">partial</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">Rationales</td>
                  <td className="py-3 px-4 text-center bg-green-50">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Lifetime Access</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">✓</td>
                  <td className="py-3 px-4 text-center text-red-500">✗</td>
                  <td className="py-3 px-4 text-center text-red-500">✗</td>
                  <td className="py-3 px-4 text-center text-red-500">✗</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">Free Trial</td>
                  <td className="py-3 px-4 text-center bg-green-50">10 questions</td>
                  <td className="py-3 px-4 text-center">Limited</td>
                  <td className="py-3 px-4 text-center">Limited</td>
                  <td className="py-3 px-4 text-center">3 questions</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Cost per Question</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">$0.03</td>
                  <td className="py-3 px-4 text-center">$0.06–0.20</td>
                  <td className="py-3 px-4 text-center">$0.02–0.13</td>
                  <td className="py-3 px-4 text-center">$0.20–0.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Promo Code */}
        <div className="mt-12 text-center bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Have a promo code?</h3>
          <p className="text-gray-600 mb-4">Enter it at checkout to receive your discount. Follow us on social media for exclusive offers.</p>
          <Link href="/" className="inline-block bg-[#1e3a5f] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#2a4f7f] transition">
            Get Started
          </Link>
        </div>

        {/* Schools CTA */}
        <div className="mt-8 text-center bg-[#f0f7ff] border border-[#1e3a5f]/20 rounded-xl p-8">
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Nursing Program Director?</h3>
          <p className="text-gray-600 mb-4">Request free director access for evaluation. No institutional contract required.</p>
          <Link href="/schools" className="inline-block bg-[#1e3a5f] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#2a4f7f] transition">
            Learn More for Schools →
          </Link>
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
            <Link href="/schools" className="hover:underline">For Schools</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
