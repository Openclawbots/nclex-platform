/**
 * Creates DIRECTORPASS Stripe coupon — 100% off, max 2 redemptions
 * For nursing program directors to test the platform before sharing with students
 */
require('dotenv').config();
const https = require('https');
const querystring = require('querystring');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

function stripePost(path, params) {
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
  console.log('Creating DIRECTORPASS coupon (100% off, 2 uses)...');

  const coupon = await stripePost('/v1/coupons', {
    id: 'DIRECTORPASS',
    percent_off: 100,
    duration: 'once',
    name: 'Director Free Access — NCLEX PrepPro',
    max_redemptions: 2,
  });

  if (coupon.status === 200) {
    console.log('✅ Coupon created:', coupon.body.id);
  } else if (coupon.body?.error?.code === 'resource_already_exists') {
    console.log('✅ Coupon DIRECTORPASS already exists');
  } else {
    console.log('Coupon response:', JSON.stringify(coupon.body, null, 2));
    if (coupon.body?.error) return;
  }

  const promo = await stripePost('/v1/promotion_codes', {
    'coupon': 'DIRECTORPASS',
    'restrictions[first_time_transaction]': 'false',
    code: 'DIRECTORPASS',
    active: 'true',
  });

  if (promo.status === 200) {
    console.log('✅ Promo code DIRECTORPASS active —', promo.body.id);
    console.log('   100% off, max 2 uses — ready to share with directors');
  } else if (promo.body?.error?.code === 'resource_already_exists') {
    console.log('✅ Promo code DIRECTORPASS already exists');
  } else {
    console.log('Promo response:', JSON.stringify(promo.body, null, 2));
  }
}

main().catch(console.error);
