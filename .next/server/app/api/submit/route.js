"use strict";(()=>{var e={};e.id=499,e.ids=[499],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},8678:e=>{e.exports=import("pg")},7429:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{originalPathname:()=>T,patchFetch:()=>u,requestAsyncStorage:()=>E,routeModule:()=>p,serverHooks:()=>l,staticGenerationAsyncStorage:()=>A});var a=r(9303),o=r(8716),n=r(670),i=r(8359),c=e([i]);i=(c.then?(await c)():c)[0];let p=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/submit/route",pathname:"/api/submit",filename:"route",bundlePath:"app/api/submit/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\submit\\route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:E,staticGenerationAsyncStorage:A,serverHooks:l}=p,T="/api/submit/route";function u(){return(0,n.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:A})}s()}catch(e){s(e)}})},8359:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{POST:()=>E});var a=r(7070),o=r(4191),n=r(2048),i=r.n(n),c=r(5315),u=r.n(c),p=e([o]);async function E(e){try{let{token:t,answers:r,startedAt:s}=await e.json();if(!t)return a.NextResponse.json({error:"Unauthorized"},{status:401});let n=(0,o.M)(),c=await n.query("SELECT id, type FROM nclex_users WHERE access_token = $1",[t]);if(0===c.rows.length)return a.NextResponse.json({error:"Unauthorized"},{status:401});let p=c.rows[0],E=u().join(process.cwd(),"nclex-questions.json"),A=JSON.parse(i().readFileSync(E,"utf-8")),l={};A.forEach(e=>{l[e.id]=e});let T=0,d=Object.keys(r).length,R={},N={};for(let[e,t]of Object.entries(r)){let r=l[parseInt(e)];if(!r)continue;let s=r.category;N[s]||(N[s]={correct:0,total:0}),N[s].total++;let a=!1;if("sata"===r.type){let e=Array.isArray(r.correct)?r.correct.sort():[r.correct].sort(),s=Array.isArray(t)?t.sort():[t].sort();a=JSON.stringify(e)===JSON.stringify(s)}else a=t===r.correct;a&&(T++,N[s].correct++),R[e]={correct:a,userAnswer:t,correctAnswer:r.correct,rationale:r.rationale,question:r.question,choices:r.choices,category:r.category,type:r.type}}let S=d>0?T/d*100:0;return await n.query("INSERT INTO nclex_attempts (user_id, started_at, completed_at, score, answers) VALUES ($1, $2, NOW(), $3, $4)",[p.id,s||new Date().toISOString(),S,JSON.stringify(r)]),a.NextResponse.json({score:Math.round(10*S)/10,correct:T,total:d,passed:S>=75,results:R,categoryStats:N,userType:p.type})}catch(e){return console.error("Submit error:",e),a.NextResponse.json({error:"Server error"},{status:500})}}o=(p.then?(await p)():p)[0],s()}catch(e){s(e)}})},4191:(e,t,r)=>{r.a(e,async(e,s)=>{try{let c;r.d(t,{M:()=>n,z:()=>i});var a=r(8678),o=e([a]);function n(){return c||(c=new a.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),c}async function i(){let e=n();return await e.query(`
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
  `),!0}a=(o.then?(await o)():o)[0],s()}catch(e){s(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972],()=>r(7429));module.exports=s})();