require('dotenv').config();
const https = require('https');
const querystring = require('querystring');

const body = querystring.stringify({
  'coupon': 'DIRECTORPASS',
  'code': 'DIRECTORPASS',
  'active': 'true',
});

const options = {
  hostname: 'api.stripe.com',
  path: '/v1/promotion_codes',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.STRIPE_SECRET_KEY,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(body),
    'Stripe-Version': '2023-10-16',
  },
};

const req = https.request(options, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const parsed = JSON.parse(d);
    if (parsed.id) {
      console.log('✅ Promo code DIRECTORPASS active!');
      console.log('   ID:', parsed.id);
      console.log('   Code:', parsed.code);
      console.log('   100% off, max 2 uses');
    } else {
      console.log('Response:', JSON.stringify(parsed, null, 2));
    }
  });
});
req.on('error', e => console.error('Error:', e.message));
req.write(body);
req.end();
