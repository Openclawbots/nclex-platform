"use strict";(()=>{var e={};e.id=330,e.ids=[330],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},8678:e=>{e.exports=import("pg")},1528:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{originalPathname:()=>R,patchFetch:()=>c,requestAsyncStorage:()=>p,routeModule:()=>E,serverHooks:()=>T,staticGenerationAsyncStorage:()=>A});var a=r(9303),n=r(8716),o=r(670),i=r(2946),u=e([i]);i=(u.then?(await u)():u)[0];let E=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/questions/route",pathname:"/api/questions",filename:"route",bundlePath:"app/api/questions/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\questions\\route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:A,serverHooks:T}=E,R="/api/questions/route";function c(){return(0,o.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:A})}s()}catch(e){s(e)}})},2946:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{GET:()=>p});var a=r(7070),n=r(4191),o=r(2048),i=r.n(o),u=r(5315),c=r.n(u),E=e([n]);async function p(e){try{let{searchParams:t}=new URL(e.url),r=t.get("token");if(!r)return a.NextResponse.json({error:"Unauthorized"},{status:401});let s=(0,n.M)(),o=await s.query("SELECT id, type FROM nclex_users WHERE access_token = $1",[r]);if(0===o.rows.length)return a.NextResponse.json({error:"Unauthorized"},{status:401});let u=c().join(process.cwd(),"nclex-questions.json"),E=[...JSON.parse(i().readFileSync(u,"utf-8"))].sort(()=>Math.random()-.5).map(e=>({id:e.id,category:e.category,type:e.type,question:e.question,choices:e.choices}));return a.NextResponse.json({questions:E,userType:o.rows[0].type})}catch(e){return console.error("Questions error:",e),a.NextResponse.json({error:"Server error"},{status:500})}}n=(E.then?(await E)():E)[0],s()}catch(e){s(e)}})},4191:(e,t,r)=>{r.a(e,async(e,s)=>{try{let u;r.d(t,{M:()=>o,z:()=>i});var a=r(8678),n=e([a]);function o(){return u||(u=new a.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),u}async function i(){let e=o();return await e.query(`
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
  `),!0}a=(n.then?(await n)():n)[0],s()}catch(e){s(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972],()=>r(1528));module.exports=s})();