"use strict";(()=>{var e={};e.id=609,e.ids=[609],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},7702:e=>{e.exports=require("events")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},1764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},759:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{originalPathname:()=>A,patchFetch:()=>u,requestAsyncStorage:()=>E,routeModule:()=>p,serverHooks:()=>d,staticGenerationAsyncStorage:()=>l});var a=r(9303),n=r(8716),o=r(670),i=r(7423),c=e([i]);i=(c.then?(await c)():c)[0];let p=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/access/route",pathname:"/api/access",filename:"route",bundlePath:"app/api/access/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\access\\route.js",nextConfigOutput:"",userland:i}),{requestAsyncStorage:E,staticGenerationAsyncStorage:l,serverHooks:d}=p,A="/api/access/route";function u(){return(0,o.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:l})}s()}catch(e){s(e)}})},7423:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{POST:()=>u});var a=r(7070),n=r(9256),o=r(4673),i=r(4191),c=e([i]);i=(c.then?(await c)():c)[0];let p=new n.Z(process.env.STRIPE_SECRET_KEY);async function u(e){try{await (0,i.z)();let{name:t,email:r,promoCode:s,action:n}=await e.json();if(!t||!r)return a.NextResponse.json({error:"Name and email are required."},{status:400});if("promo"===n){if(!s||"NURSETEST"!==s.toUpperCase())return a.NextResponse.json({error:"Invalid promo code."},{status:400});let e=(0,o.Z)(),n=(0,i.M)(),c=await n.query("INSERT INTO nclex_users (name, email, type, access_token) VALUES ($1, $2, $3, $4) RETURNING id",[t,r,"tester",e]);return a.NextResponse.json({token:e,type:"tester",userId:c.rows[0].id})}if("stripe"===n){let e="http://localhost:3001",s=await p.checkout.sessions.create({payment_method_types:["card"],line_items:[{price_data:{currency:"usd",product_data:{name:"NCLEX PrepPro — Full Practice Exam",description:"497 real-style NCLEX questions with detailed rationales"},unit_amount:1900},quantity:1}],mode:"payment",metadata:{name:t,email:r},success_url:`${e}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${e}/?cancelled=1`,customer_email:r});return a.NextResponse.json({url:s.url})}return a.NextResponse.json({error:"Invalid action."},{status:400})}catch(e){return console.error("Access error:",e),a.NextResponse.json({error:"Server error."},{status:500})}}s()}catch(e){s(e)}})},4191:(e,t,r)=>{r.a(e,async(e,s)=>{try{let c;r.d(t,{M:()=>o,z:()=>i});var a=r(8678),n=e([a]);function o(){return c||(c=new a.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),c}async function i(){let e=o();return await e.query(`
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
  `),!0}a=(n.then?(await n)():n)[0],s()}catch(e){s(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972,52],()=>r(759));module.exports=s})();