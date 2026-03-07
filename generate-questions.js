require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CATEGORIES = [
  { name: 'Med-Surg', label: 'Medical-Surgical Nursing', type: 'multiple-choice', count: 100 },
  { name: 'Pharmacology', label: 'Pharmacology', type: 'multiple-choice', count: 100 },
  { name: 'Safety & Infection Control', label: 'Safety & Infection Control', type: 'multiple-choice', count: 100 },
  { name: 'Prioritization & Delegation', label: 'Prioritization & Delegation', type: 'multiple-choice', count: 100 },
  { name: 'SATA', label: 'Select All That Apply', type: 'sata', count: 100 },
];

function getPrompt(category, batchNum, batchSize) {
  const startId = category.startId + (batchNum * batchSize);
  const isSATA = category.type === 'sata';
  
  return `Generate ${batchSize} NCLEX-style nursing exam questions for the category: "${category.label}".

Requirements:
- Each question must be clinically accurate and test application/analysis level thinking
- Use real drug names, real lab values (e.g. Na+ 128 mEq/L, K+ 6.2 mEq/L), real clinical scenarios
- ${isSATA ? 'These are Select All That Apply (SATA) questions. The "correct" field must be an array of 3-5 correct answers (e.g. ["A","B","D"]). Type must be "sata".' : 'These are standard multiple-choice questions with exactly ONE correct answer. The "correct" field must be a single letter string.'}
- ${category.name === 'Prioritization & Delegation' ? 'Questions must use ABCs (Airway, Breathing, Circulation), Maslow hierarchy, or delegation principles (RN vs LPN vs UAP scope).' : ''}
- ${category.name === 'Pharmacology' ? 'Use real medications with correct dosages, mechanisms, side effects, and nursing considerations.' : ''}
- ${category.name === 'Safety & Infection Control' ? 'Cover standard/transmission-based precautions, hand hygiene, PPE, surgical asepsis, OSHA guidelines.' : ''}
- ${category.name === 'Med-Surg' ? 'Cover major body systems: cardiac, respiratory, neuro, renal, GI, endocrine, musculoskeletal.' : ''}
- Each rationale must explain why the correct answer is right AND why each wrong answer is wrong
- Vary difficulty: mix easy/medium/hard
- IDs start at ${startId}

Return ONLY a valid JSON array of ${batchSize} objects. No markdown, no explanation, just the JSON array.

Format:
[
  {
    "id": ${startId},
    "category": "${category.name}",
    "type": "${isSATA ? 'sata' : 'multiple-choice'}",
    "question": "A client with...",
    "choices": {
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "..."
    },
    "correct": ${isSATA ? '["A","C","D"]' : '"B"'},
    "rationale": "The correct answer(s) are correct because... Each wrong answer is wrong because...",
    "difficulty": "medium"
  }
]`;
}

async function generateBatch(category, batchNum, batchSize, retryCount = 0) {
  const prompt = getPrompt(category, batchNum, batchSize);
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert NCLEX question writer with 20 years of nursing education experience. You generate high-quality, clinically accurate NCLEX-style exam questions. Always return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });
    
    const content = response.choices[0].message.content.trim();
    // Clean up potential markdown wrapping
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const questions = JSON.parse(jsonStr);
    return questions;
  } catch (e) {
    console.error(`  Batch ${batchNum} failed (attempt ${retryCount + 1}): ${e.message}`);
    if (retryCount === 0) {
      console.log('  Retrying...');
      await new Promise(r => setTimeout(r, 2000));
      return generateBatch(category, batchNum, batchSize, 1);
    }
    console.error(`  Skipping batch ${batchNum} after retry failure`);
    return [];
  }
}

async function main() {
  const allQuestions = [];
  const summary = { total: 0, byCategory: {}, errors: [], timestamp: new Date().toISOString() };
  
  let globalId = 1;
  
  for (const category of CATEGORIES) {
    console.log(`\n=== Generating ${category.count} ${category.label} questions ===`);
    summary.byCategory[category.name] = 0;
    category.startId = globalId;
    
    const batchSize = 10;
    const numBatches = category.count / batchSize;
    const categoryQuestions = [];
    
    for (let b = 0; b < numBatches; b++) {
      console.log(`  Batch ${b + 1}/${numBatches} (IDs ${globalId}-${globalId + batchSize - 1})...`);
      const batch = await generateBatch(category, b, batchSize);
      
      // Reassign IDs to ensure uniqueness
      batch.forEach((q, i) => {
        q.id = globalId++;
        q.category = category.name;
        if (category.type === 'sata') q.type = 'sata';
        categoryQuestions.push(q);
      });
      
      console.log(`  Got ${batch.length} questions. Total so far: ${allQuestions.length + categoryQuestions.length}`);
      
      // Save progress after each batch
      const allSoFar = [...allQuestions, ...categoryQuestions];
      fs.writeFileSync('nclex-questions.json', JSON.stringify(allSoFar, null, 2));
      
      // Small delay to avoid rate limits
      if (b < numBatches - 1) await new Promise(r => setTimeout(r, 500));
    }
    
    allQuestions.push(...categoryQuestions);
    summary.byCategory[category.name] = categoryQuestions.length;
    console.log(`  ${category.label}: ${categoryQuestions.length} questions generated`);
  }
  
  summary.total = allQuestions.length;
  
  // Final save
  fs.writeFileSync('nclex-questions.json', JSON.stringify(allQuestions, null, 2));
  console.log(`\n✅ Final JSON saved: ${allQuestions.length} questions`);
  
  // Validate
  const loaded = JSON.parse(fs.readFileSync('nclex-questions.json', 'utf8'));
  console.log(`✅ Validation passed: ${loaded.length} questions in file`);
  
  // Summary
  const summaryText = [
    `NCLEX Question Generation Summary`,
    `==================================`,
    `Timestamp: ${summary.timestamp}`,
    `Total questions: ${summary.total}`,
    ``,
    `By Category:`,
    ...Object.entries(summary.byCategory).map(([k, v]) => `  ${k}: ${v}`),
    ``,
    `Errors: ${summary.errors.length === 0 ? 'None' : summary.errors.join('\n')}`,
  ].join('\n');
  
  fs.writeFileSync('generation-summary.txt', summaryText);
  console.log(`✅ Summary saved to generation-summary.txt`);
  console.log('\n' + summaryText);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
