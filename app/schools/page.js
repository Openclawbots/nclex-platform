import Link from 'next/link';

export const metadata = {
  title: 'For Nursing Schools — NCLEX PrepPro | NGN Clinical Case Studies',
  description: 'NCLEX PrepPro offers 667 questions including 20 NGN clinical case studies mapped to the CJMM framework. Updated for April 2026. $19 per student, one-time.',
  alternates: { canonical: 'https://nclexprepro.com/schools' },
};

const caseStudies = [
  'Hip Fracture / Post-Op Ortho',
  'Sepsis & Septic Shock',
  'Diabetic Ketoacidosis (DKA)',
  'Heart Failure',
  'Ischemic Stroke',
  'Pediatric Asthma',
  'Acute Kidney Injury (AKI)',
  'Postpartum Hemorrhage',
  'Mental Health Crisis',
  'Pneumonia / DNI Decision',
  'Hypertensive Crisis',
  'Acute Pancreatitis',
  'Bacterial Meningitis',
  'Post-Cardiac Catheterization',
  'Alcohol Withdrawal (DTs)',
  'Thyroid Storm',
  'COPD Exacerbation',
  'Severe Burns',
  'Sickle Cell Crisis',
  'Pulmonary Embolism (PE)',
];

const ngnTypes = [
  {
    type: 'Bow-Tie',
    description:
      'Students identify the condition most likely present, select two nursing actions, and predict two parameters to monitor — replicating the exact clinical judgment structure on the NCLEX.',
  },
  {
    type: 'Extended Multiple Response',
    description:
      'Select all that apply questions with expanded answer sets, requiring students to demonstrate nuanced clinical knowledge rather than binary recognition.',
  },
  {
    type: 'Trend Analysis',
    description:
      'Time-series vital signs and lab data require students to identify deteriorating or improving trends and select appropriate clinical responses.',
  },
  {
    type: 'Cloze / Drop-Down',
    description:
      'Complete clinical documentation or physician orders by selecting contextually accurate terms from dropdown menus — testing precision in clinical language.',
  },
  {
    type: 'Matrix / Grid',
    description:
      'Students evaluate multiple interventions or assessment findings across a matrix, indicating whether each is indicated, contraindicated, or non-essential.',
  },
  {
    type: 'Priority Action',
    description:
      'Rank or sequence nursing interventions using the clinical judgment framework, mapping directly to CJMM Layer 6: Take Action.',
  },
];

export default function SchoolsPage() {
  const mailtoSubject = encodeURIComponent('Director Access Request — NCLEX PrepPro');
  const mailtoBody = encodeURIComponent(
    'Name: \nSchool / Program: \nEmail: \nPromo Code Request: DIRECTOR-[SCHOOL]\n\nI would like to request free director access to evaluate NCLEX PrepPro for our nursing program.'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] to-white">
      {/* Nav */}
      <nav className="bg-[#1e3a5f] text-white py-4 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🏥 NCLEX PrepPro</Link>
          <div className="flex gap-4 text-sm">
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/sample" className="hover:underline">Free Sample</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/schools" className="hover:underline font-semibold underline">For Schools</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1e3a5f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full mb-6 uppercase tracking-wide">
            Updated for April 1, 2026 NCLEX Test Plan
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            The Only NGN Clinical Case Study Bank Under $20
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            667 practice questions — including 20 full NGN clinical case study scenarios — mapped to NCSBN's Clinical Judgment Measurement Model. $19 per student, one-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:support@nclexprepro.com?subject=${mailtoSubject}&body=${mailtoBody}`}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
            >
              Request Director Access
            </a>
            <Link
              href="/sample"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition text-lg border border-white/30"
            >
              Try 10 Free Questions
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">

        {/* Why Directors Choose PrepPro */}
        <section>
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-4">Why Program Directors Choose PrepPro</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Built to reflect the clinical judgment emphasis of the current NCLEX — without the institutional contract, subscription overhead, or per-seat licensing.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">CJMM-Aligned</h3>
              <p className="text-gray-600 leading-relaxed">
                All 170 NGN questions are mapped to NCSBN's Clinical Judgment Measurement Model across all six cognitive layers: Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, and Evaluate Outcomes.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">April 2026 Test Plan</h3>
              <p className="text-gray-600 leading-relaxed">
                Our question bank reflects the NCSBN's updated test plan effective April 1, 2026 — including revised content category weightings, expanded NGN item types, and the clinical judgment emphasis that now defines passing or failing.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="text-3xl mb-4">💲</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">$19 One-Time vs. $349/yr</h3>
              <p className="text-gray-600 leading-relaxed">
                No institutional contract. No per-seat licensing. No subscription renewal. Students pay $19 once and keep lifetime access. UWorld costs $349/year per student. Kaplan starts at $399. We cost less than a textbook chapter.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#1e3a5f] text-white rounded-2xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-1">667</div>
              <div className="text-blue-100 text-sm">Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-1">170</div>
              <div className="text-blue-100 text-sm">NGN Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-1">20</div>
              <div className="text-blue-100 text-sm">Full Case Study Scenarios</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-1">$19</div>
              <div className="text-blue-100 text-sm">Per Student, One-Time</div>
            </div>
          </div>
        </section>

        {/* Case Study Grid */}
        <section>
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-4">20 Clinical Case Study Scenarios</h2>
          <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">
            Each scenario presents a complete patient case followed by 6 linked questions in mixed NGN formats — the exact structure used on the real NCLEX. 120 questions total across 20 cases.
          </p>
          <p className="text-center text-sm text-gray-500 mb-10">
            The real NCLEX includes 3 case studies (6 questions each). We give your students <strong>20</strong>.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {caseStudies.map((cs, i) => (
              <div
                key={i}
                className="bg-white border border-[#1e3a5f]/20 rounded-lg px-4 py-3 text-sm text-[#1e3a5f] font-medium shadow-sm flex items-center gap-2"
              >
                <span className="text-green-500 flex-shrink-0">✓</span>
                {cs}
              </div>
            ))}
          </div>
        </section>

        {/* NGN Question Types */}
        <section>
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-4">All 6 NGN Question Formats</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Complete coverage of every item type introduced with the Next Generation NCLEX — not just multiple-choice with a new label.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {ngnTypes.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-[#1e3a5f] mb-2">{item.type}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Director Access Form */}
        <section id="director-access" className="bg-[#f0f7ff] border border-[#1e3a5f]/20 rounded-2xl p-10">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">Request Free Director Access</h2>
            <p className="text-gray-600 mb-2">
              We provide free evaluation access to nursing program directors. Use promo code <strong>DIRECTOR-[SCHOOL]</strong> at checkout — or email us below and we'll set it up directly.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              No institutional contract. No minimum seats. No renewal. Students pay $19 individually when they're ready.
            </p>

            <div className="bg-white rounded-xl shadow-sm border p-8 text-left space-y-4">
              <p className="text-sm text-gray-600 font-medium">Send your request to <a href="mailto:support@nclexprepro.com" className="text-[#1e3a5f] underline">support@nclexprepro.com</a> — or click the button below to open a pre-filled email.</p>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 italic">Include in your email</div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">School / Nursing Program</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 italic">Include in your email</div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Your Email</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 italic">Reply-to address</div>
              </div>

              <a
                href={`mailto:support@nclexprepro.com?subject=${mailtoSubject}&body=${mailtoBody}`}
                className="block w-full text-center bg-[#1e3a5f] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#2a4f7f] transition mt-2"
              >
                Send Director Access Request →
              </a>
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section>
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-4">Institutional Pricing Comparison</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Per-student cost when recommending an NCLEX prep platform to your cohort. No volume minimums, no site licenses required with PrepPro.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left py-3 px-4 rounded-tl-lg">Platform</th>
                  <th className="py-3 px-4 bg-[#2a4f7f] font-bold rounded-none">NCLEX PrepPro</th>
                  <th className="py-3 px-4">UWorld</th>
                  <th className="py-3 px-4">Kaplan</th>
                  <th className="py-3 px-4 rounded-tr-lg">Archer</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Per-Student Cost</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">$19 one-time</td>
                  <td className="py-3 px-4 text-center">$349 / year</td>
                  <td className="py-3 px-4 text-center">~$399</td>
                  <td className="py-3 px-4 text-center">~$150</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">Billing Model</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">One-time</td>
                  <td className="py-3 px-4 text-center">Annual sub</td>
                  <td className="py-3 px-4 text-center">Course bundle</td>
                  <td className="py-3 px-4 text-center">Subscription</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">NGN Case Studies</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">20 full cases</td>
                  <td className="py-3 px-4 text-center">✓ (premium tier)</td>
                  <td className="py-3 px-4 text-center">limited</td>
                  <td className="py-3 px-4 text-center">partial</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">April 2026 Test Plan</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">partial</td>
                  <td className="py-3 px-4 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">CJMM Mapping</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">✓ All NGN Qs</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">partial</td>
                  <td className="py-3 px-4 text-center">partial</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4 font-medium">Institutional Contract</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">Not required</td>
                  <td className="py-3 px-4 text-center">Available</td>
                  <td className="py-3 px-4 text-center">Required</td>
                  <td className="py-3 px-4 text-center">Available</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Director Eval Access</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600 bg-green-50">Free</td>
                  <td className="py-3 px-4 text-center">Demo only</td>
                  <td className="py-3 px-4 text-center">Sales call</td>
                  <td className="py-3 px-4 text-center">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">Competitor pricing based on publicly available information. Verify current rates at each vendor's website.</p>
        </section>

        {/* CTA Bottom */}
        <section className="text-center bg-[#1e3a5f] text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Evaluate PrepPro?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Request free director access today. We'll respond within one business day. No sales call, no contract — just access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:support@nclexprepro.com?subject=${mailtoSubject}&body=${mailtoBody}`}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
            >
              Request Director Access
            </a>
            <Link
              href="/sample"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition text-lg border border-white/30"
            >
              Try 10 Free Questions First
            </Link>
          </div>
        </section>

      </main>

      <footer className="bg-gray-50 border-t py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>© 2026 NCLEX PrepPro · A product of American Thrives LLC · Milwaukee, WI</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/faq" className="hover:underline">FAQ</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/schools" className="hover:underline">For Schools</Link>
          </div>
          <p className="mt-3 text-xs text-gray-400">NCLEX® is a registered trademark of NCSBN. NCLEX PrepPro is not affiliated with or endorsed by NCSBN.</p>
        </div>
      </footer>
    </div>
  );
}
