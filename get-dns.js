const https = require('https');
const TOKEN = '57fc07aa-69aa-4b7c-accb-142350c59c69';

function gql(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const req = https.request({
      hostname: 'backboard.railway.app', path: '/graphql/v2', method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

async function main() {
  const q = `query {
    customDomains(
      projectId: "5028fdbe-a2e2-46ee-8379-17029c4b8fed"
      serviceId: "2677c1a0-195c-4c83-bab9-f733afe639be"
      environmentId: "26154814-dc23-4dfd-bc94-40459883b661"
    ) {
      edges { node { id domain status } }
    }
  }`;
  const r = await gql(q);
  console.log(JSON.stringify(r, null, 2));
}
main().catch(console.error);
