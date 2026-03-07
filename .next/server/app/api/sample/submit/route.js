"use strict";(()=>{var e={};e.id=191,e.ids=[191],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},1063:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{originalPathname:()=>T,patchFetch:()=>l,requestAsyncStorage:()=>p,routeModule:()=>u,serverHooks:()=>A,staticGenerationAsyncStorage:()=>E});var s=r(9303),o=r(8716),n=r(670),i=r(7120),c=e([i]);i=(c.then?(await c)():c)[0];let u=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/sample/submit/route",pathname:"/api/sample/submit",filename:"route",bundlePath:"app/api/sample/submit/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\sample\\submit\\route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:E,serverHooks:A}=u,T="/api/sample/submit/route";function l(){return(0,n.patchFetch)({serverHooks:A,staticGenerationAsyncStorage:E})}a()}catch(e){a(e)}})},7120:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{POST:()=>i});var s=r(7070),o=r(4191),n=e([o]);async function i(e){try{let{sample_token:t,answers:r}=await e.json();if(!t)return s.NextResponse.json({error:"Invalid session"},{status:400});let a=(0,o.M)(),n=await a.query("SELECT * FROM nclex_sample_users WHERE sample_token = $1",[t]);if(0===n.rows.length)return s.NextResponse.json({error:"Session not found"},{status:404});let i=n.rows[0];if(i.completed_at)return s.NextResponse.json({error:"Already submitted"},{status:400});let c=i.sample_questions,l={};c.forEach(e=>{l[e.id]=e});let u=0,p=c.length,E={},A={};for(let e of c){let t=r[e.id]??r[String(e.id)],a=e.category;A[a]||(A[a]={correct:0,total:0}),A[a].total++;let s=!1;if("sata"===e.type){let r=Array.isArray(e.correct)?[...e.correct].sort():[e.correct].sort(),a=Array.isArray(t)?[...t].sort():t?[t].sort():[];s=JSON.stringify(r)===JSON.stringify(a)}else s=t===e.correct;s&&(u++,A[a].correct++),E[e.id]={correct:s,userAnswer:t,correctAnswer:e.correct,rationale:s?null:e.rationale,question:e.question,choices:e.choices,category:e.category,type:e.type}}let T=`${u}/${p}`;return await a.query("UPDATE nclex_sample_users SET score = $1, completed_at = NOW() WHERE sample_token = $2",[T,t]),s.NextResponse.json({score:T,correct:u,total:p,results:E,categoryStats:A,email:i.email})}catch(e){return console.error("Sample submit error:",e),s.NextResponse.json({error:"Server error"},{status:500})}}o=(n.then?(await n)():n)[0],a()}catch(e){a(e)}})},4191:(e,t,r)=>{r.a(e,async(e,a)=>{try{let c;r.d(t,{M:()=>n,z:()=>i});var s=r(8678),o=e([s]);function n(){return c||(c=new s.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),c}async function i(){let e=n();return await e.query(`
    CREATE TABLE IF NOT EXISTS nclex_users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'paid',
      access_token VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `),await e.query(`
    CREATE TABLE IF NOT EXISTS nclex_attempts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES nclex_users(id),
      started_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP,
      score DECIMAL(5,2),
      answers JSONB
    );
  `),await e.query(`
    CREATE TABLE IF NOT EXISTS nclex_feedback (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES nclex_users(id),
      rating INTEGER,
      helpful TEXT,
      improve TEXT,
      would_pay BOOLEAN,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `),await e.query(`
    CREATE TABLE IF NOT EXISTS nclex_sample_users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) NOT NULL,
      sample_token VARCHAR(255) UNIQUE NOT NULL,
      sample_questions JSONB,
      score VARCHAR(20),
      completed_at TIMESTAMP,
      converted_to_paid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `),!0}s=(o.then?(await o)():o)[0],a()}catch(e){a(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,972],()=>r(1063));module.exports=a})();