"use strict";(()=>{var e={};e.id=296,e.ids=[296],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},8678:e=>{e.exports=import("pg")},2759:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{originalPathname:()=>T,patchFetch:()=>p,requestAsyncStorage:()=>l,routeModule:()=>u,serverHooks:()=>A,staticGenerationAsyncStorage:()=>E});var s=r(9303),o=r(8716),n=r(670),i=r(6615),c=e([i]);i=(c.then?(await c)():c)[0];let u=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/sample/start/route",pathname:"/api/sample/start",filename:"route",bundlePath:"app/api/sample/start/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\sample\\start\\route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:l,staticGenerationAsyncStorage:E,serverHooks:A}=u,T="/api/sample/start/route";function p(){return(0,n.patchFetch)({serverHooks:A,staticGenerationAsyncStorage:E})}a()}catch(e){a(e)}})},6615:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{POST:()=>E});var s=r(7070),o=r(4191),n=r(4770),i=r(2048),c=r.n(i),p=r(5315),u=r.n(p),l=e([o]);async function E(e){try{await (0,o.z)();let{name:t,email:r}=await e.json();if(!r||!r.trim())return s.NextResponse.json({error:"Email is required"},{status:400});let a=u().join(process.cwd(),"nclex-questions.json"),i=JSON.parse(c().readFileSync(a,"utf-8")),p=[];for(let e of["Med-Surg","Pharmacology","Safety & Infection Control","Prioritization & Delegation","SATA"]){let t=i.filter(t=>t.category===e).sort(()=>Math.random()-.5);p.push(...t.slice(0,2))}let l=(0,n.randomUUID)(),E=(0,o.M)();await E.query("INSERT INTO nclex_sample_users (name, email, sample_token, sample_questions, created_at) VALUES ($1, $2, $3, $4, NOW())",[t?.trim()||null,r.trim().toLowerCase(),l,JSON.stringify(p)]);let A=p.map(e=>({id:e.id,category:e.category,type:e.type,question:e.question,choices:e.choices}));return s.NextResponse.json({sample_token:l,questions:A})}catch(e){return console.error("Sample start error:",e),s.NextResponse.json({error:"Server error"},{status:500})}}o=(l.then?(await l)():l)[0],a()}catch(e){a(e)}})},4191:(e,t,r)=>{r.a(e,async(e,a)=>{try{let c;r.d(t,{M:()=>n,z:()=>i});var s=r(8678),o=e([s]);function n(){return c||(c=new s.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),c}async function i(){let e=n();return await e.query(`
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
  `),!0}s=(o.then?(await o)():o)[0],a()}catch(e){a(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,972],()=>r(2759));module.exports=a})();