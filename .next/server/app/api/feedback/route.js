"use strict";(()=>{var e={};e.id=573,e.ids=[573],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},9243:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{originalPathname:()=>T,patchFetch:()=>E,requestAsyncStorage:()=>A,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>p});var s=r(9303),n=r(8716),o=r(670),i=r(3999),c=e([i]);i=(c.then?(await c)():c)[0];let u=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/feedback/route",pathname:"/api/feedback",filename:"route",bundlePath:"app/api/feedback/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\feedback\\route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:A,staticGenerationAsyncStorage:p,serverHooks:d}=u,T="/api/feedback/route";function E(){return(0,o.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:p})}a()}catch(e){a(e)}})},3999:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{POST:()=>i});var s=r(7070),n=r(4191),o=e([n]);async function i(e){try{let{token:t,rating:r,helpful:a,improve:o,wouldPay:i}=await e.json(),c=(0,n.M)(),E=await c.query("SELECT id, type FROM nclex_users WHERE access_token = $1",[t]);if(0===E.rows.length)return s.NextResponse.json({error:"Unauthorized"},{status:401});let u=E.rows[0];if("tester"!==u.type)return s.NextResponse.json({error:"Feedback only for testers."},{status:403});return await c.query("INSERT INTO nclex_feedback (user_id, rating, helpful, improve, would_pay) VALUES ($1, $2, $3, $4, $5)",[u.id,r,a,o,i]),s.NextResponse.json({success:!0})}catch(e){return console.error("Feedback error:",e),s.NextResponse.json({error:"Server error"},{status:500})}}n=(o.then?(await o)():o)[0],a()}catch(e){a(e)}})},4191:(e,t,r)=>{r.a(e,async(e,a)=>{try{let c;r.d(t,{M:()=>o,z:()=>i});var s=r(8678),n=e([s]);function o(){return c||(c=new s.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),c}async function i(){let e=o();return await e.query(`
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
  `),!0}s=(n.then?(await n)():n)[0],a()}catch(e){a(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,972],()=>r(9243));module.exports=a})();