"use strict";(()=>{var e={};e.id=553,e.ids=[553],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},5379:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{originalPathname:()=>T,patchFetch:()=>i,requestAsyncStorage:()=>p,routeModule:()=>c,serverHooks:()=>l,staticGenerationAsyncStorage:()=>d});var s=a(9303),n=a(8716),o=a(670),E=a(2050),u=e([E]);E=(u.then?(await u)():u)[0];let c=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/stats/route",pathname:"/api/admin/stats",filename:"route",bundlePath:"app/api/admin/stats/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\admin\\stats\\route.js",nextConfigOutput:"",userland:E}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:l}=c,T="/api/admin/stats/route";function i(){return(0,o.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:d})}r()}catch(e){r(e)}})},2050:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{GET:()=>E});var s=a(7070),n=a(4191),o=e([n]);async function E(e){try{let{searchParams:t}=new URL(e.url),a=t.get("password");if("DariusAdmin2026"!==a)return s.NextResponse.json({error:"Unauthorized"},{status:401});let r=(0,n.M)(),o=await r.query("SELECT COUNT(*) FROM nclex_users"),E=await r.query("SELECT COUNT(*) FROM nclex_users WHERE type = 'paid'"),u=await r.query("SELECT COUNT(*) FROM nclex_users WHERE type = 'tester'"),i=await r.query("SELECT AVG(score) FROM nclex_attempts WHERE score IS NOT NULL"),c=await r.query("SELECT COUNT(*) FROM nclex_feedback"),p=await r.query("SELECT COUNT(*) FROM nclex_sample_users"),d=await r.query("SELECT COUNT(*) FROM nclex_sample_users WHERE completed_at IS NOT NULL"),l=await r.query("SELECT COUNT(*) FROM nclex_sample_users WHERE converted_to_paid = TRUE"),T=await r.query(`
      SELECT u.id, u.name, u.email, u.type, u.created_at,
             a.score, a.completed_at
      FROM nclex_users u
      LEFT JOIN nclex_attempts a ON a.user_id = u.id
      ORDER BY u.created_at DESC
    `),R=await r.query(`
      SELECT f.*, u.name, u.email
      FROM nclex_feedback f
      JOIN nclex_users u ON u.id = f.user_id
      ORDER BY f.created_at DESC
    `),A=await r.query(`
      SELECT id, name, email, score, completed_at, converted_to_paid, created_at
      FROM nclex_sample_users
      ORDER BY created_at DESC
      LIMIT 100
    `),_=parseInt(p.rows[0].count),m=parseInt(l.rows[0].count),L=_>0?(m/_*100).toFixed(1):"0.0";return s.NextResponse.json({stats:{totalUsers:parseInt(o.rows[0].count),paidUsers:parseInt(E.rows[0].count),testerUsers:parseInt(u.rows[0].count),avgScore:i.rows[0].avg?parseFloat(i.rows[0].avg).toFixed(1):null,feedbackCount:parseInt(c.rows[0].count),sampleUsers:_,sampleCompleted:parseInt(d.rows[0].count),sampleConverted:m,sampleConversionRate:L},users:T.rows,feedback:R.rows,sampleUsers:A.rows})}catch(e){return console.error("Admin stats error:",e),s.NextResponse.json({error:"Server error"},{status:500})}}n=(o.then?(await o)():o)[0],r()}catch(e){r(e)}})},4191:(e,t,a)=>{a.a(e,async(e,r)=>{try{let u;a.d(t,{M:()=>o,z:()=>E});var s=a(8678),n=e([s]);function o(){return u||(u=new s.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),u}async function E(){let e=o();return await e.query(`
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
  `),!0}s=(n.then?(await n)():n)[0],r()}catch(e){r(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[276,972],()=>a(5379));module.exports=r})();