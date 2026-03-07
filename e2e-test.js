const https = require('https');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'nclex-platform-production.up.railway.app',
      path, method,
      headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) },
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, body: d }); } });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('🧪 NCLEX Platform — Full E2E Test\n');
  let p = 0, f = 0;
  const ok  = (l, c, i='') => { if(c){console.log(`  ✅ ${l}`);p++;}else{console.log(`  ❌ ${l}`,i);f++;} };

  // 1. Landing page
  const home = await request('GET', '/');
  ok('Landing page live', home.status === 200);

  // 2. Free sample start
  console.log('\n📝 Free 10-Question Sample');
  const ts = Date.now();
  const s = await request('POST', '/api/sample/start', { name: 'Test Nurse', email: `test${ts}@example.com` });
  ok('Sample start 200', s.status === 200, s.body?.error);
  ok('Token returned', !!s.body?.sample_token);
  ok('Exactly 10 questions', s.body?.questions?.length === 10);
  ok('Correct answers hidden', !s.body?.questions?.[0]?.correct && !s.body?.questions?.[0]?.answer);

  // 3. Submit sample
  console.log('\n📊 Sample Grading');
  const answers = {};
  (s.body?.questions||[]).forEach(q => { answers[q.id] = Object.keys(q.choices||{})[0]||'A'; });
  const sub = await request('POST', '/api/sample/submit', { sample_token: s.body?.sample_token, answers });
  ok('Submit 200', sub.status === 200, sub.body?.error);
  ok('Score returned', sub.body?.score !== undefined);
  ok('Total is 10', sub.body?.total === 10);
  ok('Results included', Array.isArray(sub.body?.results) && sub.body.results.length > 0);
  console.log(`  ℹ️  Score: ${sub.body?.score}/${sub.body?.total}`);

  // 4. NURSETEST — full free tester access
  console.log('\n🎟️  NURSETEST Promo (full free access)');
  const nt = await request('POST', '/api/access', { name: 'Real Nurse', email: `nurse${ts}@example.com`, promoCode: 'NURSETEST', action: 'promo' });
  ok('NURSETEST accepted', nt.status === 200, nt.body?.error);
  ok('Access token returned', !!(nt.body?.token || nt.body?.access_token));
  ok('Marked as tester', nt.body?.type === 'tester');

  // 5. Stripe checkout session
  console.log('\n💳 Stripe Checkout ($19)');
  const stripe = await request('POST', '/api/access', { name: 'Paying Student', email: `pay${ts}@example.com`, action: 'stripe' });
  ok('Checkout session created', stripe.status === 200, stripe.body?.error);
  ok('Redirect URL returned', !!stripe.body?.url);
  if (stripe.body?.url) console.log(`  ℹ️  Checkout: ${stripe.body.url.slice(0,60)}...`);

  // 6. Admin stats
  console.log('\n🔐 Admin Dashboard');
  const adm = await request('GET', '/api/admin/stats');
  ok('Admin endpoint responds', adm.status === 200 || adm.status === 401);
  if (adm.status === 200) {
    console.log(`  ℹ️  Total users: ${adm.body?.totalUsers || adm.body?.total_users || '?'}`);
    console.log(`  ℹ️  Sample users: ${adm.body?.sampleUsers || adm.body?.sample_users || '?'}`);
  }

  // Summary
  console.log(`\n${'─'.repeat(38)}`);
  console.log(`  ${p} passed  |  ${f} failed`);
  if (f === 0) console.log('\n  🎉 Everything works — ready to share!');
  else console.log('\n  ⚠️  Fix failures before sharing');
}

run().catch(console.error);
