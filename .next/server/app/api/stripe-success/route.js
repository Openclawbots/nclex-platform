"use strict";(()=>{var e={};e.id=85,e.ids=[85],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},7702:e=>{e.exports=require("events")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},1764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},4785:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{originalPathname:()=>l,patchFetch:()=>p,requestAsyncStorage:()=>E,routeModule:()=>u,serverHooks:()=>T,staticGenerationAsyncStorage:()=>A});var a=r(9303),i=r(8716),n=r(670),c=r(7546),o=e([c]);c=(o.then?(await o)():o)[0];let u=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/stripe-success/route",pathname:"/api/stripe-success",filename:"route",bundlePath:"app/api/stripe-success/route"},resolvedPagePath:"C:\\Users\\Botz_King\\.openclaw\\workspace\\nclex-platform\\app\\api\\stripe-success\\route.js",nextConfigOutput:"",userland:c}),{requestAsyncStorage:E,staticGenerationAsyncStorage:A,serverHooks:T}=u,l="/api/stripe-success/route";function p(){return(0,n.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:A})}s()}catch(e){s(e)}})},7546:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{GET:()=>p});var a=r(7070),i=r(9256),n=r(4673),c=r(4191),o=e([c]);c=(o.then?(await o)():o)[0];let u=new i.Z(process.env.STRIPE_SECRET_KEY);async function p(e){try{await (0,c.z)();let{searchParams:t}=new URL(e.url),r=t.get("session_id"),s=await u.checkout.sessions.retrieve(r);if("paid"!==s.payment_status)return a.NextResponse.redirect(new URL("/?error=payment_failed",e.url));let i=s.metadata?.name||"Student",o=s.customer_email||s.metadata?.email,p=(0,n.Z)(),E=(0,c.M)();await E.query("INSERT INTO nclex_users (name, email, type, access_token) VALUES ($1, $2, $3, $4) ON CONFLICT (access_token) DO NOTHING",[i,o,"paid",p]);let A=new URL("/test","http://localhost:3001");return A.searchParams.set("token",p),A.searchParams.set("type","paid"),a.NextResponse.redirect(A)}catch(t){return console.error("Stripe success error:",t),a.NextResponse.redirect(new URL("/?error=server",e.url))}}s()}catch(e){s(e)}})},4191:(e,t,r)=>{r.a(e,async(e,s)=>{try{let o;r.d(t,{M:()=>n,z:()=>c});var a=r(8678),i=e([a]);function n(){return o||(o=new a.Pool({connectionString:process.env.DATABASE_URL,ssl:!!process.env.DATABASE_URL?.includes("railway")&&{rejectUnauthorized:!1}})),o}async function c(){let e=n();return await e.query(`
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
  `),!0}a=(i.then?(await i)():i)[0],s()}catch(e){s(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972,52],()=>r(4785));module.exports=s})();