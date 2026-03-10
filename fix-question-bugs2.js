const fs = require('fs');
const main = require('./nclex-questions.json');

let fixed = 0;
for (let i = 0; i < main.length; i++) {
  // Fix case-001 Q2 (id 524) — bow-tie has 3 parameters, fix question text
  if (main[i].id === 524 && main[i].case_id === 'case-001') {
    main[i].question = main[i].question.replace(/TWO parameters/gi, 'THREE parameters');
    main[i].question = main[i].question.replace(/two parameters/gi, 'three parameters');
    console.log('Fixed 524: question text updated');
    fixed++;
  }
  // Fix case-005 Q5 (id 551) — rewrite cloze to correct aspirin/tPA direction
  if (main[i].id === 551 && main[i].case_id === 'case-005') {
    main[i].question = 'Complete the nursing handoff note about tPA administration:\n\n"BP is maintained below [BLANK 1] during tPA infusion. For [BLANK 2] following tPA, the nurse withholds [BLANK 3] and monitors for [BLANK 4]."';
    main[i].choices = {
      A: '185/110 mmHg',
      B: '160/90 mmHg',
      C: '200/100 mmHg',
      D: '24 hours',
      E: '12 hours',
      F: '48 hours',
      G: 'aspirin and antiplatelet agents',
      H: 'all antihypertensives',
      I: 'hemorrhagic transformation',
      J: 'rebound hypertension'
    };
    main[i].correct = 'A,D,G,I';
    main[i].rationale = 'A: AHA/ASA guidelines require BP below 185/110 mmHg during tPA to reduce hemorrhagic transformation risk. D: Aspirin and antiplatelets are held for 24 hours post-tPA — prior aspirin USE is not a contraindication to tPA, but aspirin must be withheld AFTER tPA is given. G: Aspirin is the primary agent withheld post-tPA due to additive bleeding risk. I: Hemorrhagic transformation is the primary complication — monitor for sudden neuro deterioration, severe headache, vomiting, and acute BP elevation.';
    console.log('Fixed 551: cloze rewritten (correct tPA/aspirin direction)');
    fixed++;
  }
}

fs.writeFileSync('./nclex-questions.json', JSON.stringify(main, null, 2));
console.log(`\nFixed ${fixed} questions in nclex-questions.json. Total: ${main.length}`);
