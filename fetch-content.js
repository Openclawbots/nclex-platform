const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const urls = [
    'https://r.jina.ai/https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction',
    'https://r.jina.ai/https://www.cdc.gov/infectioncontrol/guidelines/healthcare-personnel/index.html',
    'https://r.jina.ai/https://www.ncsbn.org/exams/next-generation-nclex.page'
  ];
  const limits = [8000, 6000, 6000];
  let combined = '';
  for (let i = 0; i < urls.length; i++) {
    try {
      console.log(`Fetching ${urls[i]}...`);
      const content = await fetchUrl(urls[i]);
      combined += content.slice(0, limits[i]) + '\n\n---\n\n';
      console.log(`Got ${Math.min(content.length, limits[i])} chars`);
    } catch (e) {
      console.error(`Failed to fetch ${urls[i]}: ${e.message}`);
    }
  }
  fs.writeFileSync('source-content.txt', combined);
  console.log('Saved source-content.txt');
}

main();
