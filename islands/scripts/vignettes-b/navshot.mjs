import { chromium } from '@playwright/test';
const [tag]=process.argv.slice(2); const out='/home/luka/projects/kuberik/.work/landing-v6/ship/cost/';
const b=await chromium.launch();
for(const [vw,vh] of [[390,844],[1440,900]]) for(const th of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:vw,height:vh},colorScheme:th,deviceScaleFactor:1});
  await ctx.addInitScript(t=>{try{localStorage.setItem('color-theme',t)}catch{}},th);
  await ctx.route(/\/islands\/.*\.js(\?.*)?$/, r=>r.abort());
  const p=await ctx.newPage(); await p.goto('http://127.0.0.1:1376/',{waitUntil:'load'}); await p.waitForTimeout(800);
  await p.screenshot({path:`${out}nav-${tag}-${vw}-${th}.png`,clip:{x:0,y:0,width:vw,height:72}});
  await ctx.close();
}
await b.close();
