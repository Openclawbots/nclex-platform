const fs = require('fs');
const base = require('./ngn-questions.json');
const main = require('./nclex-questions.json');
const combined = [...main, ...base];
fs.writeFileSync('./nclex-questions.json', JSON.stringify(combined, null, 2));
console.log(`Done: ${main.length} + ${base.length} = ${combined.length} total questions`);
const ngn = combined.filter(q => q.ngn);
console.log(`NGN questions: ${ngn.length}`);
