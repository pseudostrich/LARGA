/* LARGA Panel Q&A — search, visual answers, and the read-only slide renderer.
   Data lives in qa-data.js; this file needs no edits to add or change questions.
   Two modes:
   • Deck (normal): a Q&A layer inside the stage. The deck underneath keeps its trigger,
     playback and fullscreen state; closing Q&A returns to it.
   • Embed (?qaEmbed): a chrome-less copy of the deck that renders one scene beat
     (current or archived) on request, used as a read-only snapshot inside Q&A. */
(function(){'use strict';
const params=new URLSearchParams(location.search);

/* ════════════════════════ EMBED MODE ════════════════════════ */
if(params.has('qaEmbed')){
 document.documentElement.classList.add('qa-embed');
 const host=document.getElementById('sceneHost');let current=null;
 function show(ref){
  const [sid,lb]=String(ref).split(':'),scene=window.LargaScenes?.['scene'+sid],beat=Number(lb);
  if(!scene||!Number.isInteger(beat)||beat<0||beat>=scene.beats.length){parent.postMessage({type:'larga-qa-embed-ready',ref,ok:false},location.origin);return}
  try{
   if(current&&current!==scene){current.stop?.();current.setVisible?.(false);}
   if(current!==scene){host.innerHTML='';const slot=document.createElement('div');slot.className='scene-slot';host.append(slot);scene.mount(slot);current=scene}
   scene.setVisible?.(true);scene.setBeat(beat);
   // Silence anything a scene might play.
   document.querySelectorAll('audio,video').forEach(m=>{try{m.muted=true;m.pause()}catch{}});
  }catch(error){console.warn('Q&A embed:',error.message)}
  // Report ready after two frames, or after a short timeout when frames are throttled (hidden/background tab).
  let sent=false;const ready=()=>{if(sent)return;sent=true;parent.postMessage({type:'larga-qa-embed-ready',ref,ok:true},location.origin)};
  requestAnimationFrame(()=>setTimeout(ready,40));setTimeout(ready,200);
 }
 window.addEventListener('message',event=>{if(event.source!==parent||event.data?.type!=='larga-qa-show')return;show(event.data.ref)});
 const first=params.get('qaEmbed');
 const start=()=>{if(first&&first!=='1')show(first);parent.postMessage({type:'larga-qa-embed-loaded'},location.origin)};
 if(document.readyState==='complete')start();else window.addEventListener('load',start,{once:true});
 return;
}

/* ════════════════════════ DECK MODE ════════════════════════ */
const data=window.LargaQAData,stage=document.getElementById('stage'),root=document.getElementById('presentation');
if(!data||!stage||!root)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const peso=v=>(v<0?'−':'')+'₱'+Math.round(Math.abs(v)).toLocaleString('en-PH');
const pesoShort=v=>{const a=Math.abs(v),s=v<0?'−':'';return a>=1e6?s+'₱'+(a/1e6).toFixed(a>=1e7?1:2).replace(/\.?0+$/,'')+'M':a>=1e3?s+'₱'+Math.round(a/1e3)+'k':s+'₱'+Math.round(a)};

/* ── Live model values for {{tokens}} ─────────────────────────────────── */
function tokens(){
 const f=window.PitchFinance,b=f?.base,d=f?.downside;if(!b)return {};
 const peak=b.monthly.reduce((a,m)=>m.cumulative<a.cumulative?m:a),cap=f.funding.reduce((a,v)=>a+v,0),ye=[11,23,35,47,59].map(i=>b.monthly[i]?.accounts);
 return {breakEven:b.breakEven,payback:b.payback,firstProfit:b.firstProfitable,peakNeed:peso(b.peakNeed),peakMonth:peak.month,
  capital:peso(cap),fundTech:peso(f.funding[0]),fundPrep:peso(f.funding[1]),fundWorking:peso(f.funding[2]),fundingBuffer:peso(cap-b.peakNeed),
  y1Rev:peso(b.annual[0].revenue),y1Cost:peso(b.annual[0].cost),y1Op:peso(b.annual[0].operating),y2Op:peso(b.annual[1].operating),y5Rev:pesoShort(b.annual[4].revenue),
  revByYear:b.annual.map((a,i)=>'Y'+(i+1)+' '+pesoShort(a.revenue)).join(' · '),
  fixedMonthly:peso(f.fixed),listThreshold:f.listThreshold,founderThreshold:f.accountsThreshold,y1Accounts:ye[0],accountsYE:ye.join(' → '),
  thresholdRevenue:peso(f.threshold),variablePct:Math.round(f.variableRate*100)+'%',y5Accounts:Math.round(b.annual[4].revenue/(12*f.yearPrice[4])),y5Cities:f.scaleCities[4],
  listPrice:peso(f.price),y1Price:peso(f.yearPrice[0]),fieldY1:peso(f.field[0]),
  downBreakEven:d?.breakEven??'—',downPayback:d?.payback??'—',downPeak:d?peso(d.peakNeed):'—'};
}
let T={};const fill=s=>String(s??'').replace(/\{\{(\w+)\}\}/g,(m,k)=>T[k]!==undefined?esc(T[k]):m);

/* ── Deck references: trigger numbers come from the live sequence ────── */
const seqBeats=()=>window.LargaSequence?.beats||[];
const topicName=chapter=>document.querySelector('[data-topic-scene="'+chapter+'"]')?.textContent?.replace(/^\d+\s*·\s*/,'')||'';
function deckRef(ref){
 const [sid,lb]=String(ref).split(':'),scene=window.LargaScenes?.['scene'+sid],beat=scene?.beats?.[Number(lb)];
 const index=seqBeats().findIndex(b=>b.sceneId===sid&&b.localBeat===Number(lb));
 const clean=String(beat?.label||'').replace(/^[\d.\s·]+/,'').trim();
 const chapter=index>=0?seqBeats()[index].chapterStart:null;
 return {sid,lb:Number(lb),scene,beat,index,archived:index<0,title:clean,
  source:index>=0?'Trigger '+(index+1)+' · '+(topicName(chapter)||scene?.name||''):'Archived · '+titleCase(clean)};
}
const titleCase=s=>String(s).toLowerCase().replace(/(^|[\s(&/-])([a-z])/g,(m,a,c)=>a+c.toUpperCase()).replace(/\bLarga\b/g,'LARGA').replace(/\bGps\b/g,'GPS').replace(/\bLgu\b/g,'LGU');
function slideSource(topic,slide){
 if(slide.deck)return deckRef(slide.deck).source;
 if(slide.app)return 'LARGA prototype · '+titleCase(slide.app)+' tab';
 return 'Answer slide · '+topic.section;
}

/* ════════════════════════ SEARCH ════════════════════════ */
const STOP=new Set('a an the of to in on for and or is are was be do does did you your we our us it its how what why who when where which this that with from at by as can will would should could i me my about there their they them have has had any much many tell explain please mean'.split(' '));
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/₱/g,' ').replace(/(\d),(\d)/g,'$1$2').replace(/[^a-z0-9\s-]/g,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim();
const toks=s=>norm(s).split(' ').filter(t=>t&&!STOP.has(t));
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const cur=[i];let best=i;for(let j=1;j<=b.length;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])cur[j]=Math.min(cur[j],prev[j-2]??cur[j]);best=Math.min(best,cur[j])}if(best>max)return max+1;prev=cur}return prev[b.length]}
function tokenScore(q,set){
 if(set.has(q))return 1;let best=0;
 for(const t of set){
  if(q.length>=3&&t.startsWith(q))best=Math.max(best,.82);
  else if(t.length>=4&&q.startsWith(t))best=Math.max(best,.7);
  else if(q.length>=4&&t.length>=4){const max=q.length>=7?2:1;if(lev(q,t,max)<=max)best=Math.max(best,max===1?.72:.62)}
  if(best>=.82)break;
 }
 return best;
}
let INDEX=null,VOCAB=null;
function buildIndex(){
 const docs=[];const covered=new Set();
 for(const t of data.topics){
  const slideText=t.slides.map(s=>{if(!s.deck)return (s.title||'')+' '+(s.caption||'');covered.add(s.deck);const r=deckRef(s.deck);return r.title+' '+(r.beat?.line||'')+' '+(s.caption||'')}).join(' ');
  docs.push({kind:'topic',topic:t,
   fields:[[toks(t.q),3.2],[toks(t.variants.join(' ')),3],[toks(t.keywords),2.4],[toks(t.section),1.2],[toks(slideText),1.3],[toks(t.preview+' '+t.say),1],[toks(String(t.notes).replace(/<[^>]+>/g,' ')),.45]].map(([a,w])=>[new Set(a),w]),
   phrases:[t.q,...t.variants].map(norm), simplified:[t.q,...t.variants].map(s=>toks(s).join(' '))});
 }
 // Every other deck beat (current or archived) stays searchable as its own slide result.
 for(const [key,scene] of Object.entries(window.LargaScenes||{})){
  if(!scene?.beats)continue;
  scene.beats.forEach((b,i)=>{const ref=scene.id+':'+i;if(covered.has(ref)||(data.hideSlides||[]).includes(ref))return;const r=deckRef(ref);if(!r.title)return;
   const topic={id:'slide-'+ref,section:titleCase(scene.name||'Slide'),q:titleCase(r.title),preview:String(b.line||'').replace(/\s+/g,' ').slice(0,150),say:String(b.line||''),slides:[{deck:ref}],notes:b.note?'<p>'+esc(b.note)+'</p>':'',sources:[],related:[],variants:[],keywords:''};
   docs.push({kind:'slide',topic,fields:[[new Set(toks(r.title)),2.6],[new Set(toks(b.line)),1.1],[new Set(toks(scene.name)),.8],[new Set(toks(b.note)),.4]],phrases:[norm(r.title)]});
  });
 }
 INDEX=docs;VOCAB=new Set();docs.forEach(d=>d.fields.forEach(([s])=>s.forEach(w=>w.length>=3&&VOCAB.add(w))));
}
function search(query){
 if(!INDEX)buildIndex();
 const phrase=norm(query),original=toks(query);
 const terms=[...new Set(original.length>1?original.filter(t=>t!=='larga'):original)];
 if(!terms.length)return [];
 const results=[];
 for(const doc of INDEX){
  const exact=doc.phrases.includes(phrase)||doc.simplified?.includes(original.join(' '));
  let score=0,coverage=0,strong=0;
  for(const term of terms){
   let direct=0,core=0,synonym=0;
   const aliases=toks(data.synonyms?.[term]);
   for(const [words,weight] of doc.fields){
    const match=tokenScore(term,words);
    direct=Math.max(direct,match*weight);
    if(weight>=2.4)core=Math.max(core,match);
    for(const alias of aliases){
     if(words.has(alias))synonym=Math.max(synonym,weight*.42);
    }
   }
   score+=Math.max(direct,synonym);
   if(core>=.7){coverage+=1;if(terms.length===1||!['app','davao','city','people','use'].includes(term))strong+=1}
   else if(direct>=.85||synonym>=1)coverage+=.55;
  }
  if(!exact&&(!strong||coverage/terms.length<.3))continue;
  score=score/terms.length*(.35+.65*coverage/terms.length);
  if(doc.kind==='slide')score*=.83;
  if(exact)score+=12;
  else if(phrase.length>=5&&doc.phrases.some(p=>(' '+p+' ').includes(' '+phrase+' ')))score+=2.5;
  results.push({score,topic:doc.topic});
 }
 results.sort((a,b)=>b.score-a.score);
 const best=results[0]?.score||0;
 return results.filter(r=>r.score>=Math.max(.85,Math.min(3,best*.31))).slice(0,8).map(r=>r.topic);
}
function didYouMean(query){
 if(!VOCAB)buildIndex();
 const words=norm(query).split(' ');
 const corrected=words.map(word=>{
  if(word.length<4||VOCAB.has(word)||STOP.has(word))return word;
  const limit=word.length>=7?2:1;
  let best=word,distance=limit+1;
  for(const candidate of VOCAB){
   const n=lev(word,candidate,limit);
   if(n<distance){best=candidate;distance=n}
  }
  return best;
 }).join(' ');
 return corrected!==words.join(' ')&&search(corrected).length?[corrected]:[];
}

/* ════════════════════════ COMPOSED ANSWER SLIDES ════════════════════════ */
const ICON={
 pin:'M32 57C24 46 12 35 12 23a20 20 0 1 1 40 0c0 12-12 23-20 34Z M32 15a8 8 0 1 0 0 16a8 8 0 1 0 0-16',
 clock:'M32 8a24 24 0 1 0 0 48a24 24 0 1 0 0-48 M32 18v15l10 7',
 route:'M14 50c12 0 12-18 24-18s12-18 24-18 M10 46a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M50 14a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
 signal:'M18 50a20 20 0 0 1 28-28 M24 44a12 12 0 0 1 16-16 M32 38h.1 M46 18l8-8',
 store:'M10 26l5-14h34l5 14 M10 26c0 6 9 6 9 0c0 6 9 6 9 0c0 6 9 6 9 0c0 6 9 6 9 0c0 6 8 6 8 0 M14 30v24h36V30 M27 54V40h10v14',
 shield:'M32 6l20 8v16c0 13-9 23-20 28C21 53 12 43 12 30V14Z M24 32l6 6 11-12',
 people:'M22 30a8 8 0 1 0 0-16a8 8 0 1 0 0 16 M8 54c0-9 6-16 14-16s14 7 14 16 M42 28a6 6 0 1 0 0-12 M40 38c8 0 14 6 14 16',
 chart:'M8 7v50h50 M17 45V31 M29 45V21 M41 45V10 M53 45V5',
 server:'M10 12h44v14H10Z M10 34h44v14H10Z M18 19h.1 M18 41h.1',
 coin:'M32 10a22 22 0 1 0 0 44a22 22 0 1 0 0-44 M26 24h9a5 5 0 0 1 0 10h-9 M26 24v18 M22 30h16',
 phone:'M20 6h24a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z M28 50h8',
 handshake:'M6 30l12-12 10 4 8-4 8 4 14 8 M18 18l14 22c2 3 6 3 8 0l10-10 M26 38l6 6 M22 42l5 5',
 building:'M10 56h44 M14 56V22L32 10l18 12v34 M24 30h4 M36 30h4 M24 40h4 M36 40h4 M29 56V46h6v10',
 jeep:'M8 40V26l6-10h36l6 10v14Z M8 40h48 M16 46a5 5 0 1 0 0.1 0 M48 46a5 5 0 1 0 0.1 0 M16 26h32',
 eye:'M4 32s10-16 28-16s28 16 28 16s-10 16-28 16S4 32 4 32Z M32 26a6 6 0 1 0 0 12a6 6 0 1 0 0-12',
 search:'M27 10a17 17 0 1 0 0 34a17 17 0 1 0 0-34 M39 39l15 15',
 star:'M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2Z',
 lock:'M18 28h28v24H18Z M24 28v-8a8 8 0 0 1 16 0v8',
 tag:'M8 30V10h20l26 26-20 20Z M18 20h.1',
 gift:'M10 26h44v10H10Z M14 36h36v20H14Z M32 26v30 M32 26c-6-10-18-8-12 0 M32 26c6-10 18-8 12 0',
 calendar:'M10 14h44v40H10Z M10 24h44 M22 8v10 M42 8v10',
 report:'M14 8h28l8 8v40H14Z M22 42V34 M30 42V28 M38 42V22',
 map:'M8 14l16-6 16 6 16-6v42l-16 6-16-6-16 6Z M24 8v42 M40 14v42',
 bus:'M16 8h32a6 6 0 0 1 6 6v32H10V14a6 6 0 0 1 6-6Z M10 30h44 M10 18h44 M18 46v7 M46 46v7 M19 38h.1 M45 38h.1'
};
const ico=(k,cls='')=>'<svg class="qa-ico '+cls+'" viewBox="0 0 64 64" aria-hidden="true"><path d="'+(ICON[k]||ICON.pin)+'"/></svg>';
const card=(i,icon,title,text,extra='')=>'<article class="qa-card qa-in '+extra+'" style="--i:'+i+'">'+ico(icon)+'<h3>'+title+'</h3><p>'+text+'</p></article>';
function lineChart({series,months,zero=true,markers=[],yFormat=pesoShort,height=100,bands=[]}){
 const W=1000,H=420,L=92,R=24,Tp=26,B=48;const all=series.flatMap(s=>s.values);let lo=Math.min(...all,zero?0:Infinity),hi=Math.max(...all,zero?0:-Infinity);const pad=(hi-lo)*.08;lo-=pad;hi+=pad;
 const x=i=>L+(W-L-R)*i/(months-1),y=v=>Tp+(H-Tp-B)*(1-(v-lo)/(hi-lo));
 const ticks=5,step=(hi-lo)/ticks;let grid='';for(let k=0;k<=ticks;k++){const v=lo+step*k;grid+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(v)+'" y2="'+y(v)+'" class="qa-grid"/><text x="'+(L-10)+'" y="'+(y(v)+5)+'" class="qa-axis" text-anchor="end">'+esc(yFormat(v))+'</text>'}
 let xt='';for(let m=0;m<months;m+=12){xt+='<line x1="'+x(m)+'" x2="'+x(m)+'" y1="'+Tp+'" y2="'+(H-B)+'" class="qa-grid qa-grid-v"/><text x="'+(x(m)+((W-L-R)/(months-1))*6)+'" y="'+(H-B+30)+'" class="qa-axis" text-anchor="middle">YEAR '+(m/12+1)+'</text>'}
 const bandSvg=bands.map(b=>'<rect x="'+x(b.from)+'" width="'+(x(b.to)-x(b.from))+'" y="'+Tp+'" height="'+(H-Tp-B)+'" class="qa-band"/>').join('');
 const zeroLine=zero&&lo<0&&hi>0?'<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(0)+'" y2="'+y(0)+'" class="qa-zero"/>':'';
 const paths=series.map((s,si)=>'<path class="qa-line '+(s.cls||'')+'" pathLength="1" d="'+s.values.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join('')+'"/>').join('');
 const mk=markers.map((m,i)=>{const px=x(m.month-1),py=y(m.value);const up=m.labelAbove??(py>H/2),ly=up?py-34-(m.lift||0):py+40;return '<g class="qa-marker qa-in '+(m.cls||'')+'" style="--i:'+(4+i)+'"><line x1="'+px+'" x2="'+px+'" y1="'+Tp+'" y2="'+(H-B)+'" class="qa-marker-line"/><circle cx="'+px+'" cy="'+py+'" r="9"/><text x="'+(px+(m.anchor==='end'?-14:14))+'" y="'+ly+'" text-anchor="'+(m.anchor||'start')+'" class="qa-marker-label">'+esc(m.label)+'</text><text x="'+(px+(m.anchor==='end'?-14:14))+'" y="'+(ly+22)+'" text-anchor="'+(m.anchor||'start')+'" class="qa-marker-sub">'+esc(m.sub||'')+'</text></g>'}).join('');
 return '<svg class="qa-chart" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" role="img">'+bandSvg+grid+xt+zeroLine+paths+mk+'</svg>';
}
const legend=items=>'<div class="qa-legend">'+items.map(([c,t])=>'<span><i class="'+c+'"></i>'+t+'</span>').join('')+'</div>';

const COMPOSERS={
 problemMap(){
  const rows=[['pin','“Where is my ride?”','Commuters can be left wondering where their jeepney is.','LIVE','See route vehicles and arrival estimates'],
   ['clock','“How long will it take?”','Hard to estimate total commute time.','TRIPS','Boarding points, transfers and travel time'],
   ['route','“Which route do I take?”','Uncertain which route or jeepney to ride.','GUIDE','Browse and search Davao jeepney routes']];
  return '<div class="qa-problem"><div class="qa-problem-head qa-in" style="--i:0"><span>WHAT WE HEARD</span><b>37 commuters · 13 PUJ drivers</b><span>WHAT WE BUILT</span></div>'+rows.map((r,i)=>'<div class="qa-problem-row qa-in" style="--i:'+(i+1)+'"><div class="qa-problem-find">'+ico(r[0])+'<div><h3>'+r[1]+'</h3><p>'+r[2]+'</p></div></div><svg class="qa-arrow" viewBox="0 0 80 20" aria-hidden="true"><path d="M2 10H74 M64 2l10 8-10 8"/></svg><div class="qa-problem-feature"><b>'+r[3]+'</b><p>'+r[4]+'</p></div></div>').join('')+'</div>';
 },
 tracking(){
  const st=[['TODAY · PROTOTYPE','server','Demo positions on real route paths','Simulated vehicles demonstrate arrivals along stored Davao routes.','now'],
   ['YEAR 1 · PILOT','phone','Planned GPS pilot on 15 jeepneys','Drivers share location while on route for a ₱800 monthly data allowance. A feed adapter is already built in.','next'],
   ['YEARS 2–5 · SCALE','building','Operator & LGU feeds','Fleet and city data supplement driver phones as new cities open.','later']];
  return '<div class="qa-track">'+st.map((s,i)=>'<article class="qa-track-stage qa-in is-'+s[4]+'" style="--i:'+i+'"><span>'+s[0]+'</span>'+ico(s[1])+'<h3>'+s[2]+'</h3><p>'+s[3]+'</p></article>'+(i<2?'<svg class="qa-arrow qa-in" style="--i:'+(i+.5)+'" viewBox="0 0 80 20" aria-hidden="true"><path d="M2 10H74 M64 2l10 8-10 8"/></svg>':'')).join('')+'<div class="qa-track-rules qa-in" style="--i:4">'+ico('clock')+'<p><b>ETA rules</b> Show when GPS last updated. Hide arrival estimates when GPS goes stale.</p></div></div>';
 },
 marketFunnel(){
  const lv=[['TAM','605,345','Jeepney commuters aged 15–64','1,848,947 residents × 65.48% aged 15–64 × 50% jeepney share'],['SAM','320,022','Digitally reachable','TAM × 53.4% internet use × 99% online by phone'],['SOM','7,500','Year 1 downloads','Midpoint of lifetime download thresholds: DavaoGo (5,000+) and Commute Davao (10,000+) ≈ 2.3% of SAM']];
  return '<div class="qa-funnel"><svg class="qa-circles qa-in" style="--i:0" viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="190" class="c1"/><circle cx="200" cy="262" r="128" class="c2"/><circle cx="200" cy="350" r="40" class="c3"/><text x="200" y="70" class="cl">TAM</text><text x="200" y="200" class="cl">SAM</text><text x="200" y="356" class="cl c3l">SOM</text></svg><div class="qa-funnel-rows">'+lv.map((l,i)=>'<div class="qa-funnel-row qa-in lv'+i+'" style="--i:'+(i+1)+'"><span>'+l[0]+'</span><strong>'+l[1]+'</strong><b>'+l[2]+'</b><p>'+l[3]+'</p></div>').join('')+'</div></div>';
 },
 somBenchmark(){
  const bars=[['DavaoGo','5,000+',5000,''],['LARGA Year 1 target','7,500',7500,'is-larga'],['Commute Davao','10,000+',10000,'']];
  return '<div class="qa-bench">'+bars.map((b,i)=>'<div class="qa-bench-row qa-in '+b[3]+'" style="--i:'+i+'"><span>'+b[0]+'</span><div class="qa-bench-track"><i style="--w:'+(b[2]/10000*100)+'%"></i></div><strong>'+b[1]+'</strong></div>').join('')+'<p class="qa-bench-note qa-in" style="--i:3">Google Play download thresholds of two Davao commuter apps. 7,500 is their midpoint — about <b>2.3%</b> of the 320,022 digitally reachable market.</p></div>';
 },
 adoption(){
  const sc=[['Low','1,470',1470],['Base','1,960',1960],['High','2,780',2780]];
  return '<div class="qa-adopt"><div class="qa-adopt-dl qa-in" style="--i:0"><span>YEAR 1 DOWNLOADS</span><strong>7,500</strong><p>cumulative, benchmark-based</p></div><svg class="qa-arrow qa-in" style="--i:.5" viewBox="0 0 80 20" aria-hidden="true"><path d="M2 10H74 M64 2l10 8-10 8"/></svg><div class="qa-adopt-mau"><span class="qa-in" style="--i:1">MONTHLY ACTIVE USERS · MONTH 12</span>'+sc.map((s,i)=>'<div class="qa-bench-row qa-in'+(i===1?' is-larga':'')+'" style="--i:'+(i+1.5)+'"><span>'+s[0]+'</span><div class="qa-bench-track"><i style="--w:'+(s[2]/3000*100)+'%"></i></div><strong>'+s[1]+'</strong></div>').join('')+'<p class="qa-bench-note qa-in" style="--i:5">Benchmark: transportation apps keep 4.4–4.8% of users at Day 30. Day-30 retention and monthly active users measure different things. These bars are pilot scenarios.</p></div></div>';
 },
 competitorNotes(){
  const c=[['Google Maps','search','General navigation and places. Davao jeepney routes not established.'],['DavaoGo','route','Jeepney and bus routes, trip planning and fare estimates.'],['Commute Davao','map','50+ jeepney routes and origin-to-destination paths.'],['Davao Commuters','jeep','Jeepney and bus suggestions; live tracking for DIBS buses only.'],['Sakay.ph','pin','National planner; early Davao data, regional coverage still incomplete.'],['LARGA','star','Davao trip planning and local discovery with a tracking and arrival-alert demo.']];
  return '<div class="qa-grid3">'+c.map((x,i)=>card(i,x[1],x[0],x[2],x[0]==='LARGA'?'is-larga':'')).join('')+'</div>';
 },
 moat(){
  const c=[['route','Verified Davao routes','Field-checked and corrected from rider reports — slow to replicate from outside.'],['jeep','Driver network','Pilot would test GPS sharing with participating drivers.'],['store','Local advertisers','Build relationships with local advertisers through trials and renewals.'],['building','City partnership','Proposed access to route data, signage, and commuter advisories.']];
  return '<div class="qa-grid4">'+c.map((x,i)=>card(i,x[0],x[1],x[2])).join('')+'</div><p class="qa-foot qa-in" style="--i:5">Big apps go wide. LARGA goes deep in one city first.</p>';
 },
 adValue(){
  const c=[['pin','Intent and location','The viewer is planning a trip that passes the store, so the ad works as directions.'],['jeep','Physical reach','Jeepney badges and QR posters reach passengers and people on the street.'],['star','Earned trust','Must-Stop badges come from verified reviews; sponsors are always labeled.']];
  return '<div class="qa-grid3">'+c.map((x,i)=>card(i,x[0],x[1],x[2])).join('')+'</div><div class="qa-offer qa-in" style="--i:4">'+ico('gift')+'<div><b>Year 1 founding partners · 50% off list</b><p>Monthly report on views, map taps, direction requests and QR redemptions.</p></div></div>';
 },
 adRamp(){
  const f=window.PitchFinance,m=f.base.monthly.slice(0,24);
  const svg=lineChart({series:[{values:m.map(x=>x.accounts),cls:'is-orange'}],months:24,zero:true,yFormat:v=>Math.round(v)+'',
   markers:[{month:12,value:m[11].accounts,label:m[11].accounts+' founding partners',sub:'end of Year 1 · break-even',anchor:'end'},{month:24,value:m[23].accounts,label:m[23].accounts+' accounts',sub:'end of Year 2 · 4 cities',anchor:'end'}]});
  return '<div class="qa-chartwrap qa-in" style="--i:0">'+svg+'</div>'+legend([['is-orange','Paying advertisers (Davao, then 4 cities)']])+'<p class="qa-foot qa-in" style="--i:6">Davao recorded 50,961 permit applications in 2025. This is context for local business activity.</p>';
 },
 drivers(){
  const c=[['coin','₱0 platform fee','Drivers never pay to be on LARGA.'],['signal','₱800 a month','Data allowance for sharing location while on route (₱500 incentive + ₱300 mobile data).'],['tag','Sponsor visibility','Jeepney badges carry local sponsors and the LARGA mark.']];
  return '<div class="qa-grid3">'+c.map((x,i)=>card(i,x[0],x[1],x[2])).join('')+'</div><div class="qa-offer qa-in" style="--i:4">'+ico('jeep')+'<div><b>Year 1 pilot · 15 jeepneys · '+esc(T.fieldY1||'₱144,000')+'</b><p>Already included in the financial model as the driver location-data pilot.</p></div></div>';
 },
 growthLoops(){
  const loop=(title,icon,steps,off)=>'<div class="qa-loop qa-in" style="--i:'+off+'"><h3>'+ico(icon)+title+'</h3><ol>'+steps.map((s,i)=>'<li class="qa-in" style="--i:'+(off+i*.6+.6)+'"><b>'+s[0]+'</b><span>'+s[1]+'</span></li>').join('')+'</ol></div>';
  return '<div class="qa-loops">'+loop('Commuters','people',[['Discover','Short route videos online, QR posters on jeepneys and campuses'],['Try','Free routes, trip planning and arrival times — no sign-up needed'],['Stay','Trip points redeemable at partner stores']],0)+loop('Advertisers','store',[['Trial','Founding-partner rates: 50% off in Year 1'],['Prove','Monthly reports: views, taps, direction requests, QR redemptions'],['Renew','Discounts for 3- or 6-month commitments']],1)+'</div>';
 },
 lgu(){
  const ask=[['route','Official route and stop data'],['map','QR signage at stops and terminals'],['building','Inclusion in city commuter advisories']];
  return '<div class="qa-lgu"><figure class="qa-in" style="--i:0"><img src="images/presscon.jpg" alt=""><figcaption>Concept visual</figcaption></figure><div class="qa-lgu-side"><div class="qa-status qa-in" style="--i:1"><span>STATUS</span><b>Proposed partnership · being pursued</b></div><h3 class="qa-in" style="--i:2">What we’re asking the city for</h3>'+ask.map((a,i)=>'<div class="qa-lgu-ask qa-in" style="--i:'+(3+i)+'">'+ico(a[0])+'<b>'+a[1]+'</b></div>').join('')+'</div></div>';
 },
 funding(){
  const f=window.PitchFinance,cap=f.funding.reduce((a,v)=>a+v,0),parts=[['server','Technical assets','Devices, test equipment'],['calendar','Pre-operating work','Development, testing, registration, research'],['coin','Working capital','Operating costs while advertisers grow']];
  return '<div class="qa-fund"><div class="qa-fund-total qa-in" style="--i:0"><span>STARTUP CAPITAL</span><strong>'+peso(cap)+'</strong></div><div class="qa-fund-bar qa-in" style="--i:1">'+f.funding.map((v,i)=>'<i class="p'+i+'" style="flex:'+v+'"></i>').join('')+'</div><div class="qa-grid3">'+parts.map((p,i)=>card(i+2,p[0],peso(f.funding[i])+' · '+p[1],p[2],'p'+i)).join('')+'</div><p class="qa-foot qa-in" style="--i:6">Covers a peak cash need of '+esc(T.peakNeed)+' (month '+esc(T.peakMonth)+') with about '+esc(T.fundingBuffer)+' to spare.</p></div>';
 },
 cashCurve(){
  const b=window.PitchFinance.base,m=b.monthly,peak=m.reduce((a,x)=>x.cumulative<a.cumulative?x:a);
  const svg=lineChart({series:[{values:m.map(x=>x.cumulative),cls:'is-orange'}],months:m.length,
   markers:[{month:peak.month,value:peak.cumulative,label:'Peak cash need '+pesoShort(-peak.cumulative),sub:'month '+peak.month,labelAbove:true,lift:14},{month:b.breakEven,value:m[b.breakEven-1].cumulative,label:'Operating break-even · month '+b.breakEven,sub:'profitable every month after',labelAbove:true,cls:'is-blue',lift:70},{month:b.payback,value:m[b.payback-1].cumulative,label:'Cash payback · month '+b.payback,sub:'cumulative cash turns positive',labelAbove:true,lift:14}]});
  return '<div class="qa-chartwrap qa-in" style="--i:0">'+svg+'</div>'+legend([['is-orange','Cumulative cash, including ₱180k setup']]);
 },
 downside(){
  const f=window.PitchFinance,b=f.base.monthly,d=f.downside.monthly;
  const svg=lineChart({series:[{values:b.map(x=>x.cumulative),cls:'is-orange'},{values:d.map(x=>x.cumulative),cls:'is-dash'}],months:b.length,
   markers:[{month:f.base.breakEven,value:b[f.base.breakEven-1].cumulative,label:'Plan: break-even month '+f.base.breakEven,sub:'payback month '+f.base.payback,labelAbove:true,lift:95},{month:f.downside.breakEven,value:d[f.downside.breakEven-1].cumulative,label:'Slower: break-even month '+f.downside.breakEven,sub:'payback month '+f.downside.payback+' · peak cash need '+pesoShort(f.downside.peakNeed),anchor:'end',labelAbove:true,lift:18,cls:'is-blue'}]});
  return '<div class="qa-chartwrap qa-in" style="--i:0">'+svg+'</div>'+legend([['is-orange','Plan'],['is-dash','Slower sales: 65% of accounts, 2-month collections, staged cost cuts']]);
 },
 year1(){
  const m=window.PitchFinance.base.monthly.slice(0,24),max=Math.max(...m.map(x=>Math.max(x.revenue,x.cost)));
  return '<div class="qa-bars qa-in" style="--i:0">'+m.map((x,i)=>'<div class="qa-bar'+(i>=12?' is-y2':'')+(i===11?' is-mark':'')+'"><i class="rev" style="--h:'+(x.revenue/max*100)+'%"></i><i class="cost" style="--h:'+(x.cost/max*100)+'%"></i><span>'+(i%3===2?'M'+(i+1):'')+'</span></div>').join('')+'</div>'+legend([['is-orange','Revenue'],['is-blue','Recurring cost']])+'<p class="qa-foot qa-in" style="--i:3">Year 1 '+esc(T.y1Op)+' at founding-partner rates · month '+esc(T.breakEven)+' revenue overtakes cost · Year 2 '+esc(T.y2Op)+'.</p>';
 },
 monthlyCosts(){
  const f=window.PitchFinance,team=f.team[0]/12,tech=f.technology[0]/12,field=f.field[0]/12,tot=team+tech+field;
  const seg=[['Team & operations',team,'p0','Founders ₱5k each · research · outreach · tools · contingency'],['Driver data pilot',field,'p2','15 jeepneys × ₱800'],['Technology',tech,'p1','Hosting, maps/API, storage']];
  return '<div class="qa-costs"><div class="qa-fund-total qa-in" style="--i:0"><span>FIXED COSTS · YEAR 1</span><strong>'+peso(tot)+'<small> / month</small></strong></div><div class="qa-fund-bar qa-in" style="--i:1">'+seg.map(s=>'<i class="'+s[2]+'" style="flex:'+s[1]+'"></i>').join('')+'</div><div class="qa-grid3">'+seg.map((s,i)=>'<article class="qa-card qa-in '+s[2]+'" style="--i:'+(2+i)+'"><h3>'+peso(s[1])+'</h3><b>'+s[0]+'</b><p>'+s[3]+'</p></article>').join('')+'</div><div class="qa-offer qa-in" style="--i:5">'+ico('chart')+'<div><b>+ 20% of revenue</b><p>12% delivery · 5% sales commission · 3% business tax and payment fees</p></div></div></div>';
 },
 rollout(){
  const f=window.PitchFinance,yrs=f.scaleCities,gates=[['route','Verified route data'],['jeep','Driver & operator partners'],['building','LGU relationship'],['store','Paying local advertisers']];
  return '<div class="qa-roll"><div class="qa-roll-years">'+yrs.map((c,i)=>'<div class="qa-roll-year qa-in" style="--i:'+i+'"><i style="--h:'+(c/40*100)+'%"></i><strong>'+c+'</strong><span>'+(c===1?'city':'cities')+'</span><b>YEAR '+(i+1)+'</b></div>').join('')+'</div><div class="qa-roll-gates"><span class="qa-in" style="--i:5">EVERY NEW CITY PASSES FOUR GATES</span>'+gates.map((g,i)=>'<div class="qa-lgu-ask qa-in" style="--i:'+(5.5+i*.5)+'">'+ico(g[0])+'<b>'+g[1]+'</b></div>').join('')+'</div></div>';
 },
 riskActions(){
  const r=[['route','Route accuracy','Outdated routes or stops','Field-check routes; correct rider-reported errors'],['signal','Vehicle data','Missing or stale locations','Pilot driver phones; show update times; hide stale ETAs'],['store','Adoption & demand','Low use or weak ad renewals','Trip points; founding-partner trials with visit reports; 3- or 6-month discounts'],['shield','Privacy & ads','Location misuse or misleading ads','Limit stored location data; label every sponsored placement'],['server','Uptime & costs','Outages or rising map costs','Cache route guides; monitor uptime; set API spend alerts']];
  return '<div class="qa-risks">'+r.map((x,i)=>'<div class="qa-risk qa-in" style="--i:'+i+'">'+ico(x[0])+'<div><b>'+x[1]+'</b><span>'+x[2]+'</span></div><svg class="qa-arrow" viewBox="0 0 80 20" aria-hidden="true"><path d="M2 10H74 M64 2l10 8-10 8"/></svg><p>'+x[3]+'</p></div>').join('')+'</div>';
 },
 privacy(){
  const c=[['lock','Minimum data','Location is used to show nearby routes and arrivals; stored history is limited.'],['signal','Drivers on route only','Driver location is shared only while on a route.'],['tag','Ads always labeled','Sponsored placements are marked and never change routes or ratings.'],['shield','Data Privacy Act','Consent, purpose limits and retention rules under RA 10173.']];
  return '<div class="qa-grid4">'+c.map((x,i)=>card(i,x[0],x[1],x[2])).join('')+'</div>';
 },
 phaseout(){
  const c=[['bus','Interim DC Bus','The city launched the interim service in November 2025 to supplement existing public transport.'],['route','Davao Bus Project','The modernization project plans about 30 routes and an intelligent transport system.'],['map','What LARGA can add','Add routes and boarding points as operators publish data. Show live arrivals where reliable vehicle feeds are available.']];
  return '<div class="qa-grid3">'+c.map((x,i)=>card(i,x[0],x[1],x[2])).join('')+'</div><p class="qa-src-note qa-in" style="--i:4">Sources · City Government of Davao and Asian Development Bank</p>';

 },
 multimodal(){
  const c=[['jeep','Jeepneys','Today’s main ride, and still the backbone outside Davao.'],['bus','DC Bus','The city’s interim buses on Toril, Calinan and Catalunan Grande routes.'],['route','Davao Bus Project','Planned coverage as routes open and route data becomes available.'],['handshake','Private operators','Peak-hour augmentation buses and other private fleets, via their feeds.']];
  return '<div class="qa-grid4">'+c.map((x,i)=>card(i,x[0],x[1],x[2])).join('')+'</div><p class="qa-foot qa-in" style="--i:5">One trip, any operator — LARGA plans the whole ride across every mode.</p>';
 }
};

/* ════════════════════════ UI ════════════════════════ */
const view=document.createElement('section');view.className='qa';view.id='qaView';view.hidden=true;view.setAttribute('aria-label','Panel Q&A');
view.innerHTML='<div class="qa-search-view"><header class="qa-top"><button class="qa-close" type="button" aria-label="Close Q&amp;A (Esc)">Close <kbd>Esc</kbd></button></header><div class="qa-search-center"><div class="qa-search-box">'+ico('search')+'<input class="qa-input" type="search" autocomplete="off" spellcheck="false" placeholder="Search questions or keywords" aria-label="Search a question or keyword" role="combobox" aria-expanded="false" aria-controls="qaResults" aria-autocomplete="list"><button class="qa-clear" type="button" aria-label="Clear search" hidden>×</button></div><div class="qa-results-wrap" hidden><p class="qa-results-label" role="status"></p><ul class="qa-results" id="qaResults" role="listbox"></ul></div></div><footer class="qa-hints" hidden><span><kbd>↑</kbd><kbd>↓</kbd> select</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></footer></div>'+
 '<div class="qa-answer-view" hidden><header class="qa-answer-top"><button class="qa-back" type="button">← Back to results</button><p class="qa-qmini"></p><div class="qa-steps"><button class="qa-prev" type="button" aria-label="Previous supporting slide">‹</button><span class="qa-count"></span><button class="qa-next" type="button" aria-label="Next supporting slide">›</button></div><button class="qa-close" type="button" aria-label="Close Q&amp;A">×</button></header><div class="qa-heading"><h2></h2></div><div class="qa-visual"><div class="qa-compose"></div><div class="qa-frame-box"><span class="qa-archived">ARCHIVED</span></div><div class="qa-app-box"><div class="qa-phone"><iframe class="qa-app-frame" title="LARGA app" tabindex="-1" aria-hidden="true"></iframe></div><div class="qa-app-tabs"></div></div><div class="qa-loading">Loading…</div></div><footer class="qa-takeaway"><p></p><button class="qa-notes-toggle" type="button" aria-expanded="false">Presenter notes <kbd>N</kbd></button></footer><aside class="qa-notes" hidden><div class="qa-notes-head"><h3>Presenter notes</h3><button type="button" class="qa-notes-close" aria-label="Close notes">×</button></div><div class="qa-notes-body"></div></aside></div>';
stage.append(view);
const $=s=>view.querySelector(s);
const input=$('.qa-input'),list=$('.qa-results'),label=$('.qa-results-label'),resultsWrap=$('.qa-results-wrap'),clearSearch=$('.qa-clear'),hints=$('.qa-hints'),searchView=$('.qa-search-view'),answerView=$('.qa-answer-view');
const appFrame=$('.qa-app-frame'),frameBox=$('.qa-frame-box'),appBox=$('.qa-app-box'),composeEl=$('.qa-compose'),loading=$('.qa-loading');
// Keep taps inside Q&A from reaching the deck's tap-to-advance handler.
['pointerdown','pointerup','click','touchstart','touchend'].forEach(type=>view.addEventListener(type,e=>e.stopPropagation()));

let open=false,results=[],sel=0,topic=null,step=0,notesOpen=false,returnState=null,savedScroll=0,lastQuery='';
const byId=id=>data.topics.find(t=>t.id===id);

/* ── Search view ── */
function renderResults(){
 const q=input.value.trim();lastQuery=input.value;
 if(!q){
  results=[];label.textContent='';
 }else{
  results=search(q);
  if(results.length)label.textContent=results.length+' match'+(results.length>1?'es':'');
  else{const dym=didYouMean(q);label.innerHTML='No matching answer for “'+esc(q)+'”.'+(dym.length?' Try: '+dym.map(w=>'<button type="button" class="qa-dym">'+esc(w)+'</button>').join(' '):'')}
 }
 resultsWrap.hidden=!q;clearSearch.hidden=!input.value;hints.hidden=!results.length;
 sel=Math.min(sel,Math.max(0,results.length-1));
 const words=toks(q);
 const mark=s=>{let h=esc(s);for(const w of words){if(w.length<3)continue;h=h.replace(new RegExp('\\b('+w.replace(/[^a-z0-9]/g,'')+'[a-z]*)','gi'),'<mark>$1</mark>')}return h};
 list.innerHTML=results.map((t,i)=>'<li role="option" id="qaOpt'+i+'" aria-selected="'+(i===sel)+'" data-i="'+i+'"><div><b>'+mark(t.q)+'</b><p>'+esc(fill(t.preview))+'</p></div><span class="qa-src'+(String(slideSource(t,t.slides[0])).startsWith('Archived')?' is-arch':'')+'">'+esc(slideSource(t,t.slides[0]))+'</span></li>').join('');
 clearTimeout(renderResults.p);renderResults.p=setTimeout(()=>prepTopic(results[sel]),60);
 input.setAttribute('aria-expanded',String(results.length>0));input.setAttribute('aria-activedescendant',results.length?'qaOpt'+sel:'');
 view.querySelectorAll('.qa-dym').forEach(b=>b.addEventListener('click',()=>{input.value=b.textContent;sel=0;renderResults();input.focus()}));
}
function moveSel(d){if(!results.length)return;sel=(sel+d+results.length)%results.length;prepTopic(results[sel]);list.querySelectorAll('li').forEach((li,i)=>li.setAttribute('aria-selected',String(i===sel)));input.setAttribute('aria-activedescendant','qaOpt'+sel);list.querySelector('li[aria-selected="true"]')?.scrollIntoView({block:'nearest'})}
list.addEventListener('pointerover',e=>{const li=e.target.closest('li');if(li)prepTopic(results[Number(li.dataset.i)])});
list.addEventListener('click',e=>{const li=e.target.closest('li');if(!li)return;sel=Number(li.dataset.i);openTopic(results[sel])});
input.addEventListener('input',()=>{sel=0;renderResults()});
clearSearch.addEventListener('click',()=>{input.value='';sel=0;renderResults();input.focus()});

/* ── Answer view ── */
let deckPending=null,appLoaded=false,appQueue=Promise.resolve(),rpcId=0;const rpcWait=new Map();
/* One preloaded preview frame per deck scene: switching between answers only changes a beat, never reloads a page. */
const pool=new Map();
function poolFor(sid,ref){
 let p=pool.get(sid);if(p)return p;
 const f=document.createElement('iframe');f.className='qa-deck-frame';f.title='Slide preview';f.tabIndex=-1;f.setAttribute('aria-hidden','true');
 p={sid,frame:f,loaded:false,shown:null,want:ref};pool.set(sid,p);
 frameBox.insertBefore(f,frameBox.firstChild);f.src='index.html?qaEmbed='+encodeURIComponent(ref);
 return p;
}
function activate(p){pool.forEach(q=>q.frame.classList.toggle('is-on',q===p));frameBox.classList.add('is-ready');loading.hidden=true;clearTimeout(showDeck.t)}
/* Pre-rendered snapshots (qa-snaps.js) show instantly; the live preview frames are only a fallback. */
const SNAPS=window.LargaQASnaps||{},snapCache=new Map();
function snapImg(ref){let img=snapCache.get(ref);if(!img&&SNAPS[ref]){img=new Image();img.className='qa-snap';img.alt='';img.decoding='async';img.src=SNAPS[ref];snapCache.set(ref,img)}return img}
function placeSnap(img){frameBox.querySelectorAll('.qa-snap').forEach(x=>{if(x!==img)x.remove()});if(img.parentNode!==frameBox)frameBox.prepend(img);pool.forEach(q=>q.frame.classList.remove('is-on'));frameBox.classList.add('is-ready');loading.hidden=true;clearTimeout(showDeck.t)}
function showDeck(ref){
 const img=snapImg(ref);
 if(img){deckPending=ref;clearTimeout(showDeck.w1);clearTimeout(showDeck.w2);
  if(img.complete&&img.naturalWidth){placeSnap(img);return}
  img.decode().then(()=>{if(deckPending===ref)placeSnap(img)}).catch(()=>{if(deckPending===ref){snapCache.delete(ref);delete SNAPS[ref];showDeck(ref)}});return}
 frameBox.querySelectorAll('.qa-snap').forEach(x=>x.remove());
 const sid=String(ref).split(':')[0],p=poolFor(sid,ref);deckPending=ref;
 if(p.shown===ref){activate(p);return}
 // Same scene already on screen: keep its current beat visible until the new one is ready (no blank flash).
 const onScreen=p.frame.classList.contains('is-on')&&frameBox.classList.contains('is-ready')&&frameBox.classList.contains('is-active');
 if(!onScreen){frameBox.classList.remove('is-ready');pool.forEach(q=>q.frame.classList.remove('is-on'))}
 clearTimeout(showDeck.t);loading.hidden=true;
 showDeck.t=setTimeout(()=>{if(!onScreen&&deckPending===ref&&p.shown!==ref)loading.hidden=false},180);
 p.want=ref;if(p.loaded)p.frame.contentWindow?.postMessage({type:'larga-qa-show',ref},location.origin);
 // Never sit on "Loading…": re-ask once, then reveal whatever is there.
 clearTimeout(showDeck.w1);clearTimeout(showDeck.w2);
 showDeck.w1=setTimeout(()=>{if(deckPending===ref&&p.shown!==ref&&p.loaded)p.frame.contentWindow?.postMessage({type:'larga-qa-show',ref},location.origin)},1800);
 showDeck.w2=setTimeout(()=>{if(deckPending===ref&&p.shown!==ref)activate(p)},4000);
}
/* Line up a slide in its scene's frame before it's asked for (selected result, next step). */
function prep(ref){if(!ref)return;const im=snapImg(ref);if(im){im.decode?.().catch(()=>{});return}const sid=String(ref).split(':')[0];const p=pool.get(sid);if(!p||p.shown===ref||p.want===ref)return;
 const cur=deckPending&&String(deckPending).split(':')[0];if(open&&!answerView.hidden&&cur===sid)return;
 p.want=ref;if(p.loaded)p.frame.contentWindow?.postMessage({type:'larga-qa-show',ref},location.origin)}
function prepTopic(t){const sl=t?.slides?.[0];if(sl?.deck)prep(sl.deck)}
function warmSnaps(){Object.keys(SNAPS).forEach(snapImg)}
(window.requestIdleCallback||(f=>setTimeout(f,1500)))(()=>setTimeout(warmSnaps,2500));
/* Warm every scene the answers use, one at a time, as soon as Q&A opens. */
let warmed=false;
function prewarm(){
 if(warmed)return;warmed=true;
 const order=[],firstRef={};
 const add=t=>(t?.slides||[]).forEach(sl=>{if(!sl.deck||SNAPS[sl.deck])return;const sid=sl.deck.split(':')[0];if(!(sid in firstRef)){firstRef[sid]=sl.deck;order.push(sid)}});
 data.suggested.map(byId).forEach(add);data.topics.forEach(add);
 ensureApp();
 const next=()=>{const sid=order.find(x=>!pool.has(x));if(!sid)return;const p=poolFor(sid,firstRef[sid]);const done=()=>setTimeout(next,120);
  if(p.loaded)done();else{p.onload=done;setTimeout(()=>{if(p.onload===done){p.onload=null;done()}},6000)}};
 next();
}
function rpc(fn,...args){return new Promise(res=>{const id=++rpcId;rpcWait.set(id,res);appFrame.contentWindow?.postMessage({type:'larga-film',id,fn,args},'*');setTimeout(()=>{if(rpcWait.has(id)){rpcWait.delete(id);res(null)}},6000)})}
const APP_TABS=['live','guide','trips','discover'];
function ensureApp(){if(appFrame.getAttribute('src'))return;appFrame.src='assets/product-app-archive/index.html?v=f5&qa=1';appFrame.addEventListener('load',()=>{setTimeout(()=>{appLoaded=true;appQueue=appQueue.then(()=>rpc('open'));},500)},{once:true})}
function showApp(tab,slide={}){
 ensureApp();appBox.classList.add('is-ready');
 $('.qa-app-tabs').innerHTML='<div class="qa-app-head"><b>'+esc(fill(slide.title||topic.q))+'</b>'+(slide.caption?'<small>'+esc(fill(slide.caption))+'</small>':'')+'</div>'+APP_TABS.map(t=>'<span class="'+(t===tab?'is-active':'')+'">'+titleCase(t)+'</span>').join('');
 // Switch tabs directly (same origin) so it's instant; fall back to the film RPC.
 const go=()=>{try{const d=appFrame.contentDocument,b=d?.querySelector('.bottom-nav [data-page="'+tab+'"]')||d?.querySelector('[data-page="'+tab+'"]');if(b){b.click();d.querySelectorAll('.film-wipe,.film-ripple').forEach(n=>n.remove());return}}catch{}appQueue=appQueue.then(()=>rpc('tab',APP_TABS.indexOf(tab)))};
 if(appLoaded)go();else appFrame.addEventListener('load',()=>setTimeout(go,900),{once:true});
}
window.addEventListener('message',e=>{
 for(const p of pool.values()){
  if(e.source!==p.frame.contentWindow)continue;
  if(e.data?.type==='larga-qa-embed-loaded'){p.loaded=true;if(p.want&&p.want!==p.shown)p.frame.contentWindow.postMessage({type:'larga-qa-show',ref:p.want},location.origin);const f=p.onload;p.onload=null;f?.()}
  if(e.data?.type==='larga-qa-embed-ready'){p.shown=e.data.ref;if(e.data.ref===deckPending&&open&&topic&&topic.slides[step]?.deck===e.data.ref)activate(p)}
 }
 if(e.source===appFrame.contentWindow&&e.data?.type==='larga-film-reply'){const r=rpcWait.get(e.data.id);if(r){rpcWait.delete(e.data.id);r(e.data.result)}}
});
function fitPhone(){const box=$('.qa-phone');if(!box||!box.clientHeight)return;const s=Math.min(box.clientHeight/844,box.clientWidth/390);appFrame.style.transform='scale('+s+')'}
new ResizeObserver(fitPhone).observe($('.qa-phone'));

function renderStep(){
 const s=topic.slides[step],n=topic.slides.length;
 $('.qa-heading h2').textContent=fill(topic.q);
 $('.qa-qmini').textContent=fill(topic.q);answerView.dataset.kind=s.deck?'deck':s.app?'app':'compose';
 $('.qa-count').textContent=(step+1)+' / '+n;$('.qa-steps').hidden=n<2;$('.qa-prev').disabled=step===0;$('.qa-next').disabled=step===n-1;
 $('.qa-takeaway p').innerHTML=fill(topic.say);
 const visual=$('.qa-visual');visual.dataset.kind=s.deck?'deck':s.app?'app':'compose';
 frameBox.classList.toggle('is-active',!!s.deck);appBox.classList.toggle('is-active',!!s.app);composeEl.classList.toggle('is-active',!!s.compose);
 composeEl.innerHTML='';loading.hidden=true;
 if(s.deck){const r=deckRef(s.deck);$('.qa-archived').hidden=!r.archived;showDeck(s.deck)}
 else if(s.app){showApp(s.app,s)}
 else{const c=COMPOSERS[s.compose];composeEl.innerHTML=c?'<div class="qa-compose-inner qa-'+s.compose+'">'+c()+'</div>':'<p>Missing composer: '+esc(s.compose)+'</p>';composeEl.classList.remove('is-playing');void composeEl.offsetWidth;composeEl.classList.add('is-playing')}
 renderNotes();
 const nx=topic.slides[step+1];if(nx?.deck&&String(nx.deck).split(':')[0]!==String(s.deck||'').split(':')[0])prep(nx.deck);
}
function renderNotes(){
 const rel=(topic.related||[]).map(byId).filter(Boolean);
 $('.qa-notes-body').innerHTML=fill(topic.notes||'<p>No extra notes.</p>')+
  (topic.sources?.length?'<h4>Sources</h4><div class="qa-links">'+topic.sources.map(s=>'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.label)+' ↗</a>').join('')+'</div>':'')+
  (rel.length?'<h4>Related questions</h4><div class="qa-related">'+rel.map(t=>'<button type="button" data-id="'+t.id+'">'+esc(t.q)+'</button>').join('')+'</div>':'')+
  '<h4>Slides in this answer</h4><ol class="qa-steplist">'+topic.slides.map((s,i)=>'<li><button type="button" data-step="'+i+'"'+(i===step?' aria-current="true"':'')+'>'+esc(fill(s.title||s.caption||(s.deck?deckRef(s.deck).title:s.app?titleCase(s.app)+' tab':'Answer slide')))+' <small>'+esc(slideSource(topic,s))+'</small></button></li>').join('')+'</ol>';
 $('.qa-notes-body').querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>openTopic(byId(b.dataset.id),{keepNotes:false})));
 $('.qa-notes-body').querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{step=Number(b.dataset.step);renderStep()}));
}
function setNotes(v){notesOpen=v;$('.qa-notes').hidden=!v;$('.qa-notes-toggle').setAttribute('aria-expanded',String(v))}
function openTopic(t){if(!t)return;T=tokens();topic=t;step=0;savedScroll=list.parentElement.scrollTop;setNotes(false);searchView.hidden=true;answerView.hidden=false;renderStep();$('.qa-back').focus({preventScroll:true})}
function backToResults(){answerView.hidden=true;searchView.hidden=false;setNotes(false);input.value=lastQuery;renderResults();list.parentElement.scrollTop=savedScroll;moveSel(0);input.focus({preventScroll:true})}
function go(d){if(!topic)return;const n=step+d;if(n<0||n>=topic.slides.length)return;step=n;renderStep()}

/* ── Open / close ── */
function setOpen(v,opts={}){
 if(v===open)return;
 const api=window.LargaPresentation;
 if(v){
  if(window.LargaReview?.isOpen?.())window.LargaReview.close();
  T=tokens();if(!INDEX)buildIndex();
  const st=api?.getState?.();returnState=st?{scene:st.scene,global:st.globalBeat}:null;
  window.LargaScenes?.['scene'+st?.scene]?.setVisible?.(false);
  open=true;view.hidden=false;root.dataset.qa='open';$('#qaTab')?.setAttribute('aria-selected','true');
  document.getElementById('qaTab')?.setAttribute('aria-selected','true');document.getElementById('presentationTab')?.setAttribute('aria-selected','false');
  answerView.hidden=true;searchView.hidden=false;if(!opts.keepQuery){input.value='';lastQuery=''}sel=0;renderResults();
  prewarm();requestAnimationFrame(()=>input.focus({preventScroll:true}));
 }else{
  open=false;view.hidden=true;delete root.dataset.qa;setNotes(false);
  document.getElementById('qaTab')?.setAttribute('aria-selected','false');document.getElementById('presentationTab')?.setAttribute('aria-selected','true');
  const st=api?.getState?.();
  // The deck was never moved, so the original trigger is still current; only re-show its scene.
  window.LargaScenes?.['scene'+(st?.scene??returnState?.scene)]?.setVisible?.(true);
  stage.focus?.({preventScroll:true});
 }
}
$('.qa-search-view .qa-close').addEventListener('click',()=>setOpen(false));
$('.qa-answer-view .qa-close').addEventListener('click',()=>setOpen(false));
$('.qa-back').addEventListener('click',backToResults);$('.qa-prev').addEventListener('click',()=>go(-1));$('.qa-next').addEventListener('click',()=>go(1));
$('.qa-notes-toggle').addEventListener('click',()=>setNotes(!notesOpen));$('.qa-notes-close').addEventListener('click',()=>setNotes(false));

/* ── Tab button in the presenter bar ── */
const tablist=document.querySelector('.presenter-tabs [role="tablist"]');
if(tablist){const b=document.createElement('button');b.id='qaTab';b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected','false');b.innerHTML='Q&amp;A <kbd>Q</kbd>';b.addEventListener('click',()=>setOpen(!open));tablist.append(b);
 document.getElementById('presentationTab')?.addEventListener('click',()=>setOpen(false));document.getElementById('reviewTab')?.addEventListener('click',()=>setOpen(false));}

/* ── Keyboard: Q&A owns every key while it is open ── */
window.addEventListener('keydown',e=>{
 const typing=e.target===input;
 if(!open){
  const isQ=(e.code==='KeyQ'||String(e.key).toLowerCase()==='q')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat;
  if(isQ&&!e.target?.matches?.('input,textarea,select,[contenteditable="true"]')){e.preventDefault();e.stopPropagation();setOpen(true)}
  return;
 }
 if(e.ctrlKey||e.metaKey)return;
 e.stopPropagation();
 const k=e.key;
 if(!answerView.hidden){
  if(k==='Escape'){e.preventDefault();notesOpen?setNotes(false):backToResults();return}
  if(k==='ArrowRight'||k==='PageDown'||(k===' '&&!e.target?.matches?.('button'))){e.preventDefault();go(1);return}
  if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();go(-1);return}
  if(k==='Backspace'){e.preventDefault();backToResults();return}
  if(k==='n'||k==='N'){e.preventDefault();setNotes(!notesOpen);return}
  if(k==='f'||k==='F'){e.preventDefault();window.LargaPresentation?.toggleFullscreen?.();return}
  if(k==='q'||k==='Q'){e.preventDefault();setOpen(false);return}
  if(k.length===1&&/\S/.test(k)&&!e.altKey){backToResults();input.value='';sel=0;return}// start a new search by typing
  return;
 }
 if(k==='Escape'){e.preventDefault();if(input.value){input.value='';sel=0;renderResults()}else setOpen(false);return}
 if(k==='ArrowDown'){e.preventDefault();moveSel(1);return}
 if(k==='ArrowUp'){e.preventDefault();moveSel(-1);return}
 if(k==='Enter'&&!e.target?.matches?.('button')){e.preventDefault();if(results[sel])openTopic(results[sel]);return}
 if(!typing&&k.length===1){input.focus()}
},true);

/* ── Side buttons / history navigation route here while open ── */
function side(direction){if(!open)return false;if(!answerView.hidden)go(direction);else if(direction>0&&results[sel])openTopic(results[sel]);else if(direction<0)setOpen(false);return true}
for(const type of ['pointerdown','mousedown','pointerup','mouseup','auxclick'])window.addEventListener(type,e=>{if(!open||(e.button!==3&&e.button!==4))return;e.preventDefault();e.stopPropagation();if(type==='pointerdown'||(type==='mousedown'&&!window.PointerEvent))side(e.button===4?1:-1)},true);

window.LargaQA=Object.freeze({open:o=>setOpen(true,o),close:()=>setOpen(false),toggle:()=>setOpen(!open),isOpen:()=>open,side,search,openTopic:id=>{if(!open)setOpen(true);openTopic(byId(id))},getState:()=>({open,query:input.value,topic:topic?.id||null,step,returnState})});
})();
