/**
 * Creates one unique Stripe promo code per nursing school
 * Each code: 100% off, max 2 uses (director + 1 colleague)
 * Lets you track which schools are engaging
 */
require('dotenv').config();
const https = require('https');
const querystring = require('querystring');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

const SCHOOLS = [
  { code: 'DIRECTOR-MARQUETTE',   name: 'Free Access - Marquette' },
  { code: 'DIRECTOR-CARROLL',     name: 'Free Access - Carroll' },
  { code: 'DIRECTOR-CONCORDIA',   name: 'Free Access - Concordia' },
  { code: 'DIRECTOR-HERZING',     name: 'Free Access - Herzing' },
  { code: 'DIRECTOR-LOYOLA',      name: 'Free Access - Loyola' },
  { code: 'DIRECTOR-CHAMBERLAIN', name: 'Free Access - Chamberlain' },
  { code: 'DIRECTOR-UMNURSING',   name: 'Free Access - UMN' },
  { code: 'DIRECTOR-STCATH',      name: 'Free Access - StCath' },
];

function stripePost(path, params, version = '2023-10-16') {
  return new Promise((resolve, reject) => {
    const body = querystring.stringify(params);
    const options = {
      hostname: 'api.stripe.com',
      path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'Stripe-Version': version,
      },
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🎓 Creating per-director promo codes (100% off, 2 uses each)\n');

  const results = [];

  for (const school of SCHOOLS) {
    process.stdout.write(`  ${school.code.padEnd(28)} `);

    try {
      // Create coupon for this school
      const coupon = await stripePost('/v1/coupons', {
        id: `C-${school.code}`,
        percent_off: 100,
        duration: 'once',
        name: school.name,
        max_redemptions: 2,
      });

      const couponId = coupon.body?.id || `COUPON-${school.code}`;
      const couponOk = coupon.status === 200 || coupon.body?.error?.code === 'resource_already_exists';

      if (!couponOk) {
        console.log(`❌ coupon failed: ${coupon.body?.error?.message}`);
        continue;
      }

      // Create promo code
      const promo = await stripePost('/v1/promotion_codes', {
        'coupon': couponId,
        'code': school.code,
        'active': 'true',
      });

      if (promo.status === 200) {
        console.log(`✅  2 uses`);
        results.push({ school: school.name, code: school.code, status: 'created' });
      } else if (promo.body?.error?.code === 'resource_already_exists') {
        console.log(`✓  already exists`);
        results.push({ school: school.name, code: school.code, status: 'existing' });
      } else {
        console.log(`❌  ${promo.body?.error?.message}`);
        results.push({ school: school.name, code: school.code, status: 'failed' });
      }
    } catch (err) {
      console.log(`❌  ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 300)); // avoid rate limit
  }

  console.log('\n📋 Summary:');
  results.forEach(r => {
    const icon = r.status === 'created' ? '✅' : r.status === 'existing' ? '✓' : '❌';
    console.log(`  ${icon} ${r.code} — ${r.school}`);
  });

  console.log('\n✅ Done! Each director gets their own 2-use code.');
  console.log('Track redemptions at: https://dashboard.stripe.com/promotion_codes');
}

main().catch(console.error);
