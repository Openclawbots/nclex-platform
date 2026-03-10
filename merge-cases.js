const fs = require('fs');
const path = require('path');

const base = __dirname;

// Load existing questions
const main = require('./nclex-questions.json');
console.log(`Base questions: ${main.length}`);

// Load all case files
const cases = [];
const allCaseQuestions = [];

for (let i = 1; i <= 20; i++) {
  const num = String(i).padStart(3, '0');
  const file = path.join(base, `ngn-case-${num}.json`);
  if (fs.existsSync(file)) {
    const c = require(file);
    cases.push({ case_id: c.case_id, title: c.title, scenario: c.scenario, question_count: c.questions.length });
    allCaseQuestions.push(...c.questions);
    console.log(`  ✅ case-${num}: ${c.title} (${c.questions.length} questions)`);
  } else {
    console.log(`  ❌ case-${num}: NOT FOUND`);
  }
}

console.log(`\nCase questions collected: ${allCaseQuestions.length}`);

// Renumber IDs to avoid conflicts (start after current max)
const maxId = Math.max(...main.map(q => q.id));
console.log(`Max existing ID: ${maxId}`);
allCaseQuestions.forEach((q, i) => { q.id = maxId + 1 + i; });

// Merge
const combined = [...main, ...allCaseQuestions];
fs.writeFileSync('./nclex-questions.json', JSON.stringify(combined, null, 2));

// Save cases index (for UI - scenarios + case metadata)
fs.writeFileSync('./ngn-cases-index.json', JSON.stringify(cases, null, 2));

// Also save full case data for UI rendering
const fullCases = [];
for (let i = 1; i <= 20; i++) {
  const num = String(i).padStart(3, '0');
  const file = path.join(base, `ngn-case-${num}.json`);
  if (fs.existsSync(file)) fullCases.push(require(file));
}
fs.writeFileSync('./ngn-cases-full.json', JSON.stringify(fullCases, null, 2));

console.log(`\n✅ MERGE COMPLETE`);
console.log(`Total questions: ${combined.length}`);
console.log(`NGN questions: ${combined.filter(q => q.ngn).length}`);
console.log(`Case studies: ${fullCases.length}`);
console.log(`Cases index saved: ngn-cases-index.json`);
console.log(`Full cases saved: ngn-cases-full.json`);
