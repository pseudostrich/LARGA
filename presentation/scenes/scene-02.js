/* Scene 02: official branding and local, source-derived LARGA product demo. */
(function(){
 'use strict';
 const data=window.LargaRevealData,ease='cubic-bezier(.45,0,.2,1)',out='cubic-bezier(.22,1,.36,1)';
 const overviewBeats=[
  {label:'02.0 · A CLEARER DIRECTION',line:'What if the answers were already in your hands?',note:'The approved phone outline contracts into the official LARGA symbol. Same background; no return to the removed route graphic.'},
  {label:'02.1 · LARGA',line:'LARGA: Live Area and Route Guide Access.',note:'Official wordmark and a short masked tagline reveal.'},
  {label:'02.2 · THE APP',line:'Commuting, made clearer.',note:'The phone embeds the actual supplied app with its original UI, data and behavior. Maps and Places require the existing online setup.'},
  {label:'02.3 · GUIDE',line:'In Guide, check which jeepney serves your destination and where to board.',note:'Guide styling and stored route geometry from the supplied app. Map backdrop is schematic; boarding and destination points illustrate the interaction, not verified stops.'},
  {label:'02.4 · LIVE',line:'Live shows the vehicle moving and updates the estimated wait. This prototype uses simulated locations to demonstrate how the feature works.',note:'Live opens the actual app Live tab. Its generated-position/feed behavior is unchanged; no production feed has been added.'},
  {label:'02.5 · TRIPS',line:'Plan from your starting point to your destination. Check the boarding steps and transfers, then save the trip for later.',note:'Guide > Plan a Trip, below Browse Routes. Demonstrate FROM/TO, Plan My Trip, expandable ride instructions, Save Trip and View in Live. Use the actual form and route planner interactively; no endpoints are prefilled by the presentation.'},
  {label:'02.6 · DISCOVER',line:"In Discover, find nearby places and go straight from a place listing to planning your ride.",note:'Local landmark preview and trip-planning interaction. No ratings, reviews, paid partnerships or walking accessibility claims are invented.'},
  {label:'02.7 · VALUE PROPOSITION',line:'See where your jeepney is, know when to head to your stop, and plan the rest of your trip in one app.',note:'Show how live vehicle location, arrival estimates and trip guidance work together. The live feed remains simulated in the prototype.'}
 ];
 const order=[0,1,2,4,7],reelBeat=3;
 const reelShots=[
  [4,'LIVE','See your','jeepney coming.','Simulated vehicle locations and ETAs',5000],
  [3,'GUIDE','Find the','right jeepney.','Routes and boarding guidance',4000],
  [5,'TRIPS','Plan the','whole ride.','Trip planning, transfers and saved trips',4000],
  [6,'DISCOVER','Find a place.','Then get there.','Local discovery and route planning',5000]
 ];
 const beats=order.map((n,i)=>i===reelBeat?{label:'02 · APP DEMO',line:'Live, Guide, Trips and Discover.',note:'One automatic 20-second sequence. Vehicle locations and ETAs are simulated.'}:overviewBeats[n]);
 let previousPhone=null,root,serial=0,animations=[],pending=new Set(),raf=null,driveResolve=null,samples=[],routeSamples=[],resizeObserver;
 const heads=[['',''],['',''],['COMMUTING.','MADE <em class="shine-text">CLEARER.</em>'],['KNOW WHAT TO','<em>RIDE.</em>'],['KNOW <em>WHEN</em>','IT ARRIVES.'],['KNOW <em>HOW</em>','TO GET THERE.'],['<em>DISCOVER</em>','WHAT’S AROUND YOU.'],['SEE YOUR RIDE.','<em class="shine-text">PLAN YOUR TRIP.</em>']];
 const p=data.points;
 function markup(){return `<section class="scene-02 scene-root" id="scene02" data-beat="0" aria-label="The LARGA Reveal">
 <div class="reveal-backdrop"></div><div class="reveal-seed"><img src="assets/branding/larga-logo.png" alt=""><span></span></div>
 <div class="reveal-brand"><img src="assets/branding/larga-wordmark.png" alt="LARGA"><p class="brand-meaning" aria-label="Live Area and Route Guide Access"><span><b>L</b>ive <b>A</b>rea and</span> <span><b>R</b>oute <b>G</b>uide <b>A</b>ccess</span></p><p class="brand-tagline"><span>YOUR <b>RIDE</b>,</span> <span>ON <b>TRACK</b>.</span></p></div>
 <h1 class="reveal-heading"><span></span><span></span></h1>
 <div class="product-phone"><svg class="product-phone-stroke" viewBox="0 0 390 780" preserveAspectRatio="none" aria-hidden="true"><rect x="2" y="2" width="386" height="776" rx="32" pathLength="1"/></svg><div class="product-screen"><iframe class="actual-app-frame" title="Actual LARGA app" src="assets/live-app/index.html" loading="eager" allow="geolocation"></iframe><div class="app-landing"><img src="assets/branding/larga-logo.png" alt="LARGA"></div></div><div class="product-speaker" aria-hidden="true"></div></div>
 <div class="reveal-map"><svg class="reveal-map-svg" viewBox="0 0 900 660" aria-hidden="true"><defs><pattern id="revealStreetGrid" width="90" height="70" patternUnits="userSpaceOnUse"><path d="M90 0H0V70" fill="none" stroke="#74a8ce" stroke-width="1" opacity=".13"/></pattern></defs><rect width="900" height="660" fill="url(#revealStreetGrid)"/>
 ${data.routes.map((r,i)=>`<path class="reveal-road ${i?'support-road':'selected-road'}" ${i?'':'id="revealRoute"'} d="${r.path}" pathLength="1"/>`).join('')}
 <g class="reveal-endpoint origin-point" transform="translate(${p[0][0]} ${p[0][1]})"><circle r="11"/><path class="rider-symbol" d="M0-19a7 7 0 1 0 0-14a7 7 0 1 0 0 14 M-12 9V0q0-15 12-15T12 0v9"/><text y="32">YOU</text></g><g class="reveal-endpoint destination-point" transform="translate(${p[2][0]} ${p[2][1]})"><circle r="11"/><text y="-24">DESTINATION</text></g>
 <g class="reveal-jeep" id="revealJeep"><g class="vehicle-eta-badge"><rect x="-43" y="-59" width="86" height="32" rx="8"/><text x="0" y="-38">3 MIN</text></g><rect x="-20" y="-11" width="36" height="22" rx="3" fill="#edf6fc"/><rect x="-16" y="-7" width="20" height="14" rx="2" fill="#aac3d3"/><path d="M9-9h12l7 6v6l-7 6H9Z" fill="#f56600"/><path d="M-15-13h7M6-13h7M-15 13h7M6 13h7" stroke="#021d36" stroke-width="5" stroke-linecap="round"/></g>
 <line class="live-dotted-link" id="revealLiveLink" x1="${p[0][0]}" y1="${p[0][1]}" x2="${p[1][0]}" y2="${p[1][1]}"/>
 <g class="discover-pins"><g class="discover-category" transform="translate(135 160)"><circle r="29"/><path d="M-8-10V2 M-4-10V2 M-6 2V12 M7-10V12 M3-10V0H7"/><text y="51">FOOD</text></g><g class="discover-category" transform="translate(330 125)"><circle r="29"/><path d="M-5-9L10 0L-5 9Z"/><text y="51">LEISURE</text></g><g class="discover-category" transform="translate(535 145)"><circle r="29"/><path d="M-12 12V-2L0-11L12-2V12Z M0-19V-9 M-5-15H5 M-3 12V3H3V12"/><text y="51">CHURCH</text></g><g class="discover-category" transform="translate(740 225)"><circle r="29"/><path d="M-14-5L0-13L14-5Z M-12 12H12 M-9-3V9 M0-3V9 M9-3V9"/><text y="51">LANDMARK</text></g><g class="discover-category" transform="translate(185 405)"><circle r="29"/><path d="M-12-6H12V13H-12Z M-5-6V-10A5 5 0 0 1 5-10V-6"/><text y="51">MALL</text></g><g class="discover-category" transform="translate(395 355)"><circle r="29"/><path d="M-4-3L-13 13 M3-13a9 12 35 1 0 1 1 M-3-11L7 1 M2-13L12-1 M-7-5L9-9 M-5 0L12-4"/><text y="51">SPORTS</text></g><g class="discover-category" transform="translate(595 460)"><circle r="29"/><path d="M-15 3H15L9 12H-9Z M0 3V-15L12-1H0 M-17 16Q-9 11-1 16Q7 11 17 16"/><text y="51">WATERFRONT</text></g><g class="discover-category" transform="translate(770 440)"><circle r="29"/><path d="M-13 8L-3-3L9 3 M1-10a4 4 0 1 0 1 0 M-17 15Q-9 10-1 15Q7 10 17 15"/><text y="51">SWIMMING</text></g></g>
 </svg><div class="reveal-route-caption"><small>SELECTED ROUTE</small><strong>${data.routes[0].name}</strong><span>${data.routes[0].short.replaceAll('•',' / ')}</span></div></div>

 <div class="reveal-eta"><span>JEEPNEY APPROACHING</span><strong>3 <small>MIN AWAY</small></strong></div>
 <div class="reveal-trip"><div><span>START</span><strong>Board the first route</strong></div><div><span>TRANSFER</span><strong>Follow the next ride</strong></div><div><span>DESTINATION</span><strong>Follow your ride instructions</strong></div></div>
 <div class="reveal-feature-orbit"><span>GUIDE</span><span>LIVE</span><span>TRIPS</span><span>DISCOVER</span><svg viewBox="0 0 1000 600" preserveAspectRatio="none"><path d="M340 220H470M660 220H530M340 390H470M660 390H530" pathLength="1"/></svg></div>
 <div class="reel-composition"></div><audio class="reel-narration" preload="auto" src="assets/audio/product-demo-fullscreen.mp3"></audio><div class="reel-copy"><span class="reel-feature"></span><h2><span></span><em></em></h2><p></p></div><div class="reveal-closing-line"></div>
 </section>`;}
 function stop(){++serial;const voice=root?.querySelector('.reel-narration');if(voice){voice.pause();voice.currentTime=0;}animations.forEach(a=>a.cancel());animations=[];pending.forEach(t=>{clearTimeout(t.id);t.resolve(false)});pending.clear();if(raf!==null)cancelAnimationFrame(raf);raf=null;driveResolve?.();driveResolve=null;root?.querySelectorAll('.reveal-bridge-ghost').forEach(el=>el.remove());root?.classList.remove('reveal-entering');}
 function wait(ms,token){return new Promise(resolve=>{const t={id:null,resolve};t.id=setTimeout(()=>{pending.delete(t);resolve(token===serial)},ms/(window.LargaMotionRate??1));pending.add(t)});}
 function move(el,keys,options={}){const a=el.animate(keys,{duration:1100,easing:ease,fill:'none',...options});a.playbackRate=window.LargaMotionRate??1;animations.push(a);return a.finished.catch(()=>{});}
 function shine(el){const fill='linear-gradient(105deg,#ff7919 35%,#ffd1a0 46%,#ffffff 50%,#ffd1a0 54%,#ff7919 65%)';return move(el,[{backgroundImage:fill,backgroundSize:'300% 100%',backgroundPosition:'150% 0',color:'transparent'},{backgroundImage:fill,backgroundSize:'300% 100%',backgroundPosition:'-150% 0',color:'transparent'}],{duration:1050,delay:550,fill:'none',easing:'ease-in-out'})}
 function measure(selector){return root.querySelector(selector).getBoundingClientRect();}
 function reframe(selector,before,duration=1200){const el=root.querySelector(selector),after=el.getBoundingClientRect();const dx=(before.left+before.width/2)-(after.left+after.width/2),dy=(before.top+before.height/2)-(after.top+after.height/2);return move(el,[{transform:`translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${before.width/Math.max(1,after.width)},${before.height/Math.max(1,after.height)})`},{transform:'translate(-50%,-50%) translate(0,0) scale(1)'}],{duration});}
 function updateSize(){const screen=root.querySelector('.product-screen'),phone=root.querySelector('.product-phone'),scale=Math.max(.001,screen.clientWidth/390);phone.style.setProperty('--preview-scale',String(scale));root.querySelector('iframe').style.height=(screen.clientHeight/scale)+'px';}
 function screen(n){const view=n===4?'live':n===5?'planner':n===6?'discover':n===7?'landing':'guide';root.dataset.appView=view;root.querySelector('.app-landing').hidden=view!=='landing';if(view!=='landing')root.querySelector('iframe').contentWindow?.postMessage({type:'larga-embedded-view',view},location.origin);}

 function positionVehicle(progress){if(!samples.length)return;const t=progress*256,index=Math.min(255,Math.floor(t)),a=samples[index],b=samples[index+1],f=t-index,x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f;root.querySelector('#revealJeep').setAttribute('transform',`translate(${x} ${y}) rotate(${Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI})`);root.querySelector('.vehicle-eta-badge').setAttribute('transform','rotate('+(-Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI)+')');root.querySelector('#revealLiveLink').setAttribute('x2',x);root.querySelector('#revealLiveLink').setAttribute('y2',y);}
 function drive(token){const start=performance.now();return new Promise(resolve=>{driveResolve=resolve;const tick=now=>{if(token!==serial){resolve();return;}const t=Math.min(1,(((now-start)*(window.LargaMotionRate??1)))/1450),e=t*t*(3-2*t);positionVehicle(.12+.3*e);if(t<1)raf=requestAnimationFrame(tick);else{raf=null;driveResolve=null;resolve()}};tick(start)});}
 function baseState(n){root.dataset.beat=String(n);const routeIndex=n===4?1:n===5?2:0;root.querySelector('#revealRoute').setAttribute('d',data.routes[routeIndex].path);if(routeSamples.length)samples=routeSamples[routeIndex];if(samples.length){const first=data.routes[0].path.match(/^M([\d.]+) ([\d.]+)/),origin=n===4?samples[0]:{x:+first[1],y:+first[2]};root.querySelector('.origin-point').setAttribute('transform',`translate(${origin.x} ${origin.y})`);root.querySelector('#revealLiveLink').setAttribute('x1',origin.x);root.querySelector('#revealLiveLink').setAttribute('y1',origin.y);}const heading=root.querySelector('.reveal-heading');heading.children[0].innerHTML=heads[n][0];heading.children[1].innerHTML=heads[n][1];updateSize();screen(n);if(n===4)positionVehicle(.42);}
 function mount(host){host.innerHTML=markup();root=host.querySelector('#scene02');const path=root.querySelector('#revealRoute');routeSamples=data.routes.map(r=>{path.setAttribute('d',r.path);const len=path.getTotalLength();return Array.from({length:257},(_,i)=>path.getPointAtLength(len*i/256))});samples=routeSamples[0];root.querySelector('iframe').addEventListener('load',()=>screen(Number(root.dataset.beat)));window.addEventListener('message',e=>{if(e.source!==root.querySelector('iframe').contentWindow||e.origin!==location.origin)return;if(e.data?.type==='larga-embedded-ready')screen(Number(root.dataset.beat));if(e.data?.type==='larga-embedded-key')document.dispatchEvent(new KeyboardEvent('keydown',{code:e.data.code,bubbles:true}));});baseState(0);resizeObserver=new ResizeObserver(updateSize);resizeObserver.observe(root.querySelector('.product-phone'));}
 function state(n){root.dataset.reel=String(n===reelBeat);root.dataset.demo='false';root.dataset.step=String(n);if(n===reelBeat){const host=root.querySelector('.reel-composition');host.dataset.mode='welcome';root.dataset.reelTitle='false';window.LargaCenteredReel.prepare(host);}else{baseState(order[n]);if(n===2)window.LargaCenteredReel.prepare(root.querySelector('.reel-composition'));}}
 function setBeat(n){stop();state(n);}
 async function baseTransition(n,from){
  stop();const token=serial,phoneBefore=previousPhone||measure('.product-phone'),brandBefore=measure('.reveal-brand'),mapBefore=measure('.reveal-map');previousPhone=null;baseState(n);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(n<from){await Promise.all([reframe('.product-phone',phoneBefore,850),reframe('.reveal-brand',brandBefore,850),reframe('.reveal-map',mapBefore,850)]);return;}
  const tasks=[];
  if(n===1){
    tasks.push(move(root.querySelector('.reveal-brand>img'),[{opacity:0},{opacity:1}],{duration:950,easing:out}));
    root.querySelectorAll('.reveal-brand .brand-meaning>span').forEach((el,i)=>tasks.push(move(el,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay:500+i*140,fill:'backwards',easing:out})));
  }else{
    tasks.push(reframe('.reveal-brand',brandBefore));
    if(n===2)tasks.push(move(root.querySelector('.product-phone'),[{transform:'translate(-50%,-50%) scale(.38)',opacity:0},{transform:'translate(-50%,-50%) scale(1)',opacity:1}],{duration:1350}));else tasks.push(reframe('.product-phone',phoneBefore));
    if(n!==7)tasks.push(move(root.querySelector('.reveal-heading'),[{opacity:0,transform:'translateY(18px)',clipPath:'inset(0 0 100% 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0% 0)'}],{duration:850,delay:200,fill:'backwards',easing:out}));
    if(n===2)tasks.push(shine(root.querySelector('.reveal-heading em')));
    if(n===3){tasks.push(move(root.querySelector('.reveal-map'),[{transform:'translate(-50%,-50%) scale(.78)',opacity:0},{transform:'translate(-50%,-50%) scale(1)',opacity:1}],{duration:1300}));tasks.push(move(root.querySelector('#revealRoute'),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1400,delay:200,fill:'backwards'}));}
    if(n===4){positionVehicle(.12);tasks.push(drive(token));tasks.push(move(root.querySelector('.reveal-eta'),[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:400,fill:'backwards',easing:out}));}
    if(n===5){tasks.push(reframe('.reveal-map',mapBefore));root.querySelectorAll('.reveal-trip>div').forEach((el,i)=>tasks.push(move(el,[{opacity:0,transform:'translateX(14px)'},{opacity:1,transform:'translateX(0)'}],{duration:750,delay:200+i*220,fill:'backwards',easing:out})));}
    if(n===6){tasks.push(reframe('.reveal-map',mapBefore));root.querySelectorAll('.discover-pins>g').forEach((el,i)=>tasks.push(move(el,[{opacity:0},{opacity:1}],{duration:650,delay:200+i*150,fill:'backwards'})));}
    if(n===7){tasks.push(shine(root.querySelector('.reveal-heading em')));tasks.push(move(root.querySelector('.reveal-heading'),[{opacity:0},{opacity:1}],{duration:850,delay:250,fill:'backwards'}));tasks.push(move(root.querySelector('.reveal-heading em'),[{transform:'translateY(4px) scale(.985)'},{transform:'translateY(-2px) scale(1.025)',offset:.55},{transform:'translateY(0) scale(1)'}],{duration:1100,delay:550,fill:'backwards'}));}
  }
  await Promise.all(tasks);if(token!==serial)return;
 }
 function showShot(index){
  const [view,feature,first,second,detail]=reelShots[index],copy=root.querySelector('.reel-copy');
  root.dataset.reelShot=String(index);
  copy.querySelector('.reel-feature').textContent=feature;
  copy.querySelector('h2 span').textContent=first;
  copy.querySelector('h2 em').textContent=second;
  copy.querySelector('p').textContent=detail;
  root.dataset.beat=String(view);
  window.LargaCenteredReel.command(root.querySelector('.reel-composition'),'show',index);
 }
 async function playReel(){
  setBeat(reelBeat);
  const token=serial,voice=root.querySelector('.reel-narration'),copy=root.querySelector('.reel-copy'),host=root.querySelector('.reel-composition');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,reel=window.LargaCenteredReel;
  const hold=ms=>wait(ms*(window.LargaMotionRate??1),token);
  for(let attempt=0;attempt<25&&!reel.ready(host);attempt++)if(!await hold(100))return;
  voice.muted=Boolean(window.LargaPresentation?.getState().muted);
  void voice.play().catch(()=>{});
  const started=performance.now();
  const at=ms=>hold(Math.max(0,ms-(performance.now()-started)));
  const animate=(node,frames,duration,options={})=>{if(!reduced)move(node,frames,{duration:duration*(window.LargaMotionRate??1),...options});};
  const splash=host.querySelector('.reel-splash'),cut=host.querySelector('.reel-cut');
  animate(splash,[{opacity:0,transform:'translate(-50%,-44%)'},{opacity:1,transform:'translate(-50%,-50%)'}],460);
  if(!await at(1300))return;
  host.dataset.mode='enter';
  showShot(0);
  animate(splash,[{opacity:1,transform:'translate(-50%,-50%) scale(1)'},{opacity:1,transform:'translate(-50%,-50%) scale(2.3)',offset:.68},{opacity:0,transform:'translate(-50%,-50%) scale(5.8)'}],2500,{fill:'forwards',easing:'cubic-bezier(.52,0,.22,1)'});
  animate(host.querySelector('.reel-app-screen'),[{opacity:0,clipPath:'inset(0 32% 0 32%)'},{opacity:1,clipPath:'inset(0)'}],950,{delay:1450/(window.LargaMotionRate??1),fill:'backwards'});
  const shots=[
   {start:3900,action:5550,finish:7600},
   {start:8000,action:9420,finish:11100},
   {start:11400,action:12500,finish:13420},
   {start:14700,action:15800,finish:16800}
  ];
  for(const [index,shot] of shots.entries()){
   if(!await at(shot.start))return;
   host.dataset.mode='feature';root.dataset.reelTitle='true';
   if(index!==0)showShot(index);
   animate(copy,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],420);
   if(index!==0)animate(cut,[{opacity:.9,clipPath:'inset(0 0 0 0)'},{opacity:0,clipPath:'inset(0 0 0 100%)'}],320,{easing:out});
   if(!await at(shot.action))return;
   reel.command(host,'feature',index);
   if(!await at(shot.finish))return;
   reel.command(host,'finish',index);
  }
  if(!await at(18800))return;
  root.dataset.reelTitle='false';host.dataset.mode='end';
  reel.command(host,'clear');
  const ending=host.querySelector('.reel-end');
  animate(ending.querySelector('i'),[{transform:'scaleX(.06)'},{transform:'scaleX(1)'}],750,{fill:'both',easing:out});
  animate(ending.querySelector('strong'),[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],650,{fill:'both',easing:out});
  await at(20000);
 }
 async function transitionTo(n,from){
  if(n===reelBeat){await playReel();return;}
  if(n===2)window.LargaCenteredReel.prepare(root.querySelector('.reel-composition'));
  previousPhone=measure('.product-phone');
  root.dataset.reel='false';root.dataset.demo='false';
  await baseTransition(order[n],order[from]);
  if(root.dataset.beat===String(order[n]))root.dataset.step=String(n);
 }
 async function enterFrom(research){
  stop();const token=serial;state(0);root.dataset.demo='false';
  const backdrop=research.querySelector('.research-background').cloneNode(true);backdrop.removeAttribute('id');root.querySelector('.reveal-backdrop').replaceChildren(backdrop);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){root.classList.remove('reveal-entering');return;}
  const source=research.querySelector('.research-phone'),a=source.getBoundingClientRect(),stage=root.getBoundingClientRect(),target=measure('.reveal-seed');
  const ghost=source.cloneNode(true);ghost.className='reveal-bridge-ghost';Object.assign(ghost.style,{left:(a.left-stage.left)+'px',top:(a.top-stage.top)+'px',width:a.width+'px',height:a.height+'px'});root.appendChild(ghost);
  await Promise.all([
   move(research.querySelector('.research-opportunity'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}],{duration:550,fill:'forwards'}),
   move(source,[{opacity:1},{opacity:0}],{duration:100,fill:'forwards'}),
   move(research.querySelector('.research-line'),[{opacity:.8},{opacity:0}],{duration:350,fill:'forwards'}),
   move(ghost,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${target.left-a.left+(target.width-a.width)/2}px,${target.top-a.top+(target.height-a.height)/2}px) scale(.45)`,opacity:.8,offset:.7},{transform:`translate(${target.left-a.left+(target.width-a.width)/2}px,${target.top-a.top+(target.height-a.height)/2}px) scale(.28)`,opacity:0}],{duration:1250,fill:'forwards'}),
   move(root.querySelector('.reveal-seed'),[{opacity:0,transform:'translate(-50%,-50%) scale(.85)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)'}],{duration:650,delay:800,fill:'backwards',easing:out})
  ]);
  if(token===serial){ghost.remove();root.classList.remove('reveal-entering');}
 }
 window.LargaScenes=window.LargaScenes||{};window.LargaScenes.scene02={id:'02',name:'THE LARGA REVEAL',beats,mount,setBeat,transitionTo,enterFrom,stop,isReel(n){return n===reelBeat},playReel};
})();


