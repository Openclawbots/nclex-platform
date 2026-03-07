export const content = `
<h1>NCLEX Lab Values Guide: Normal Ranges, Critical Values, and Clinical Implications</h1>

<p>Lab values are tested throughout the NCLEX — in pharmacology questions, fluid and electrolyte scenarios, acid-base balance, and management of care. You don't need to memorize every laboratory reference range, but you absolutely must know the high-yield values that appear repeatedly on the exam. This guide gives you the complete reference table, explains critical values, and connects each lab to its clinical meaning.</p>

<h2>Complete NCLEX Lab Values Reference Table</h2>

<table style="width:100%;border-collapse:collapse;font-size:14px;margin:24px 0;">
  <thead>
    <tr style="background:#1e3a5f;color:white;">
      <th style="padding:10px 12px;text-align:left;border:1px solid #ddd;">Lab Value</th>
      <th style="padding:10px 12px;text-align:left;border:1px solid #ddd;">Normal Range</th>
      <th style="padding:10px 12px;text-align:left;border:1px solid #ddd;">Critical Low</th>
      <th style="padding:10px 12px;text-align:left;border:1px solid #ddd;">Critical High</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Sodium (Na⁺)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">136–145 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;120 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;160 mEq/L</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Potassium (K⁺)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">3.5–5.0 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;2.5 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;6.5 mEq/L</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Calcium (Ca²⁺)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">8.5–10.5 mg/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;7.0 mg/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;13.0 mg/dL</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Magnesium (Mg²⁺)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">1.5–2.5 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;1.0 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;9.0 mEq/L</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Chloride (Cl⁻)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">98–106 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;80 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;115 mEq/L</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>BUN (Blood Urea Nitrogen)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">10–20 mg/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">—</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;100 mg/dL</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Creatinine</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">0.6–1.2 mg/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">—</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;10 mg/dL</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Glucose (fasting)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">70–100 mg/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;40 mg/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;500 mg/dL</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Hemoglobin (Hgb) — Female</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">12–16 g/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;7 g/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;20 g/dL</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Hemoglobin (Hgb) — Male</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">14–18 g/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;7 g/dL</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;20 g/dL</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Hematocrit (Hct) — Female</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">37–47%</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;21%</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;65%</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Hematocrit (Hct) — Male</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">42–52%</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;21%</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;65%</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>Platelets</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">150,000–400,000/mm³</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;50,000/mm³</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;1,000,000/mm³</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>WBC (White Blood Cells)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">5,000–10,000/mm³</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;2,000/mm³</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;30,000/mm³</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>PT (Prothrombin Time)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">11–13 seconds</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">—</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;20 sec (critical)</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>INR (normal, not on anticoag)</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">0.8–1.2</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">—</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;4.0 (critical)</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>ABG: pH</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">7.35–7.45</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;7.20</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;7.60</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>ABG: PaCO₂</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">35–45 mmHg</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;20 mmHg</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;70 mmHg</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>ABG: PaO₂</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">80–100 mmHg</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;40 mmHg</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">—</td>
    </tr>
    <tr>
      <td style="padding:9px 12px;border:1px solid #ddd;"><strong>ABG: HCO₃⁻</strong></td>
      <td style="padding:9px 12px;border:1px solid #ddd;">22–26 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&lt;10 mEq/L</td>
      <td style="padding:9px 12px;border:1px solid #ddd;">&gt;40 mEq/L</td>
    </tr>
  </tbody>
</table>

<h2>Understanding Critical Values</h2>
<p>A critical value is a lab result so far outside the normal range that it represents immediate risk to the patient's life. When a critical value is reported, the nurse must notify the physician or provider <em>immediately</em> and document the communication.</p>

<h3>Potassium: The NCLEX Favorite</h3>
<p>Potassium is tested more than any other electrolyte. Both hypokalemia and hyperkalemia cause life-threatening cardiac dysrhythmias:</p>
<ul>
  <li><strong>Hypokalemia (&lt;3.5 mEq/L):</strong> Muscle weakness, cramps, constipation, U waves on EKG, increased digoxin toxicity risk. Causes: diuretics, vomiting, diarrhea.</li>
  <li><strong>Hyperkalemia (&gt;5.0 mEq/L):</strong> Peaked T waves, widened QRS, bradycardia, cardiac arrest. Causes: renal failure, ACE inhibitors, potassium-sparing diuretics, cell lysis.</li>
</ul>

<h3>Sodium: Neuro Impact</h3>
<ul>
  <li><strong>Hyponatremia (&lt;136 mEq/L):</strong> Headache, confusion, seizures, coma. Severe (&lt;120) = seizure risk. Correct <em>slowly</em> to avoid osmotic demyelination.</li>
  <li><strong>Hypernatremia (&gt;145 mEq/L):</strong> Thirst, restlessness, dry mucous membranes, neurological changes. Caused by fluid loss or excess sodium intake.</li>
</ul>

<h3>Calcium: Muscle and Nerve Function</h3>
<ul>
  <li><strong>Hypocalcemia (&lt;8.5 mg/dL):</strong> Trousseau's sign (carpopedal spasm with BP cuff), Chvostek's sign (facial twitching with nerve tap), tetany, seizures. Post-thyroidectomy risk.</li>
  <li><strong>Hypercalcemia (&gt;10.5 mg/dL):</strong> "Bones, groans, stones, psychic moans" — bone pain, constipation, renal stones, confusion. Associated with hyperparathyroidism and malignancy.</li>
</ul>

<h3>ABG Interpretation: ROME Method</h3>
<p>Use the <strong>ROME</strong> mnemonic to interpret ABGs: <em>Respiratory Opposite, Metabolic Equal</em></p>
<ul>
  <li><strong>Respiratory acidosis:</strong> pH ↓, PaCO₂ ↑ (opposite direction). Cause: hypoventilation (COPD, sedation).</li>
  <li><strong>Respiratory alkalosis:</strong> pH ↑, PaCO₂ ↓ (opposite). Cause: hyperventilation (anxiety, PE, mechanical ventilation).</li>
  <li><strong>Metabolic acidosis:</strong> pH ↓, HCO₃⁻ ↓ (same direction). Cause: DKA, renal failure, lactic acidosis.</li>
  <li><strong>Metabolic alkalosis:</strong> pH ↑, HCO₃⁻ ↑ (same direction). Cause: vomiting, NG suctioning, antacid overuse.</li>
</ul>

<h2>NCLEX Practice Question</h2>
<div style="background:#f8fafc;border-left:4px solid #4f46e5;padding:20px;border-radius:6px;margin:24px 0;">
  <p><strong>Question:</strong> The nurse reviews morning lab results for a client receiving furosemide. Which result requires immediate notification of the physician?</p>
  <p>A) Sodium 138 mEq/L<br>
  B) Potassium 2.4 mEq/L<br>
  C) BUN 18 mg/dL<br>
  D) Creatinine 0.9 mg/dL</p>
  <p><strong>Correct Answer: B</strong></p>
  <p><strong>Rationale:</strong> A potassium of 2.4 mEq/L is below the critical threshold (&lt;2.5 mEq/L) and represents a critical value requiring immediate physician notification. Furosemide is a potassium-wasting diuretic, making hypokalemia a known and dangerous side effect. Hypokalemia can cause life-threatening cardiac dysrhythmias. All other values (A, C, D) are within normal range.</p>
</div>

<div style="background:#eef2ff;padding:24px;border-radius:10px;margin:40px 0;text-align:center;">
  <p style="font-size:18px;font-weight:bold;color:#1e3a5f;margin:0 0 8px;">Ready to test your knowledge?</p>
  <p style="color:#6b7280;margin:0 0 16px;">Try 10 free NCLEX-style practice questions — no account needed.</p>
  <a href="https://nclexprepro.com/sample" style="background:#4f46e5;color:white;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">Start Free Practice Test →</a>
</div>
`;
