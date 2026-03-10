const fs = require('fs');

// Fix 1: Case 001 Q2 — "TWO parameters" but 3 correct
const case001 = require('./ngn-case-001.json');
const q2 = case001.questions.find(q => q.id === 549);
if (q2) {
  // Change question text from "TWO" to "THREE" to match the 3 correct answers
  q2.question = q2.question.replace(/TWO parameters/gi, 'THREE parameters');
  console.log('Case 001 Q549 fixed: TWO → THREE parameters');
} else {
  console.log('Case 001 Q549 not found — check ID');
}
fs.writeFileSync('./ngn-case-001.json', JSON.stringify(case001, null, 2));

// Fix 2: Case 005 Q5 (ID 576) — flip the aspirin/tPA relationship
const case005 = require('./ngn-case-005.json');
const q5 = case005.questions.find(q => q.id === 576);
if (q5) {
  q5.question = 'Complete the nursing handoff note about tPA administration:\n\n"The nurse administered IV alteplase (tPA) at [TIME]. During infusion, BP is maintained below [VALUE]. For [DURATION] following tPA, the nurse will withhold [MEDICATION] and all anticoagulants, and monitor for signs of [COMPLICATION]."';
  q5.choices = {
    A: '185/110 mmHg',
    B: '160/90 mmHg',
    C: '200/100 mmHg',
    D: '24 hours',
    E: '12 hours',
    F: '48 hours',
    G: 'aspirin and antiplatelet agents',
    H: 'antihypertensives',
    I: 'hemorrhagic transformation',
    J: 'rebound hypertension',
    K: 'cerebral edema',
    L: 'hypotension'
  };
  q5.correct = 'A,D,G,I';
  q5.rationale = 'A: BP must be maintained below 185/110 mmHg during tPA infusion to reduce hemorrhagic transformation risk per AHA/ASA guidelines. D: Aspirin and antiplatelet agents are withheld for 24 hours following tPA administration because concurrent use significantly increases bleeding risk, including hemorrhagic transformation. G: Aspirin is the primary antiplatelet agent withheld post-tPA — prior aspirin use is NOT a contraindication to tPA, but aspirin must be held after tPA is given. I: Hemorrhagic transformation (bleeding into the ischemic area) is the primary complication of tPA and requires immediate recognition — signs include sudden neurological deterioration, headache, vomiting, and BP elevation.';
  q5.ngn_type = 'cloze';
  console.log('Case 005 Q576 fixed: flipped aspirin/tPA cloze direction');
} else {
  console.log('Case 005 Q576 not found — check ID');
}
fs.writeFileSync('./ngn-case-005.json', JSON.stringify(case005, null, 2));

// Now update these fixes in the main nclex-questions.json too
const main = require('./nclex-questions.json');
let fixed = 0;
for (let i = 0; i < main.length; i++) {
  if (main[i].id === 549 && main[i].case_id === 'case-001') {
    main[i].question = main[i].question.replace(/TWO parameters/gi, 'THREE parameters');
    fixed++;
  }
  if (main[i].id === 576 && main[i].case_id === 'case-005') {
    main[i].question = q5.question;
    main[i].choices = q5.choices;
    main[i].correct = q5.correct;
    main[i].rationale = q5.rationale;
    fixed++;
  }
}
fs.writeFileSync('./nclex-questions.json', JSON.stringify(main, null, 2));
console.log(`\nFixed ${fixed} questions in nclex-questions.json`);
console.log('All bugs patched.');
