/* Scene 01. Display copy and values are centralized in scene-01-data.js. */
(function(){
  'use strict';
  const data=window.LargaResearchData;
  const beats=[
    {label:'01.0 · WE ASKED',line:'We wanted to understand whether other commuters experienced the same uncertainty.',note:'Research introduction. One emphasis at a time; let the statement settle.'},
    {label:'01.1 · RESPONDENTS',line:`We gathered responses from ${data.commuters} commuters and ${data.drivers} public utility jeepney drivers.`,note:'The two respondent groups. Numbers count once; labels stay visible.'},
    {label:'01.2 · WAITING',line:data.waitingNarration,note:'Long waiting times. This display value was changed at the user’s request; consult RESEARCH-NOTES.md before using it as evidence.'},
    {label:'01.3 · FINDING A JEEPNEY',line:'Difficulty finding a jeepney for the destination is another commuting concern.',note:'Second finding, full size and centered. Hold until the next manual trigger.'},
    {label:'01.4 · CHOOSING A ROUTE',line:'Commuters also face uncertainty about which route to take.',note:'Third finding, full size and centered. Hold until the next manual trigger.'},
    {label:'01.5 · WHAT THIS SUGGESTS',line:'These findings point to a need for clearer, more accessible commuting information.',note:'An interpretation of the problem, not a claim that information alone explains every transport delay.'},
    {label:'01.6 · THE OPPORTUNITY',line:'That is the opportunity we identified. What if the answers were already in your hands?',note:'The underline becomes the base of a phone outline. Hold on the question. Scene 02 remains planned.',audio:'Optional narration; audio is not required.'}
  ];
  let root,serial=0,animations=[],timers=new Set(),frame=null;
  const ease='cubic-bezier(.45,0,.2,1)',out='cubic-bezier(.22,1,.36,1)';
  function markup(){return `<section class="scene-01 scene-root" id="scene01" data-beat="0" aria-label="The Problem We Discovered">
    <div class="research-background"></div>
    <div class="research-line" style="--waiting:${data.metrics[0].value/100}" aria-hidden="true"><span></span></div>
    <div class="research-intro" data-panel="0"><h1>WE <em>ASKED.</em></h1><h2>COMMUTERS <em>ANSWERED.</em></h2></div>
    <div class="respondents" data-panel="1"><div class="respondent commuter-count"><svg class="respondent-icon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="18" r="10"/><path d="M12 54v-9c0-24 40-24 40 0v9Z"/></svg><strong data-count="commuters">${data.commuters}</strong><span>COMMUTERS</span></div><div class="respondent driver-count"><svg class="respondent-icon jeepney-icon" viewBox="0 0 76 64" aria-hidden="true"><path d="M10 24h43l6 8h9v18H8V30Z"/><path d="M16 19h34" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M17 29h12v10H17Zm18 0h13v10H35Z" fill="#07509d"/><circle cx="20" cy="51" r="6" fill="#052c56" stroke="currentColor" stroke-width="3"/><circle cx="55" cy="51" r="6" fill="#052c56" stroke="currentColor" stroke-width="3"/></svg><strong data-count="drivers">${data.drivers}</strong><span>PUJ DRIVERS</span></div><p class="research-source">LARGA market research · Respondent groups</p></div>
    <div class="research-metrics" aria-label="Commuting findings">
      <div class="research-metric metric-waiting" data-panel="2"><p class="metric-context">${data.waitingHeadline}</p><strong class="metric-number"><span data-count="waiting">${data.metrics[0].value.toFixed(1)}</span><small>%</small></strong><h2 class="metric-label"><span class="single-label">REPORTED LONG WAITING TIMES</span><span class="pattern-label">Long waiting times</span></h2><div class="metric-track" aria-hidden="true"><span style="--value:${data.metrics[0].value/100}"></span></div></div>
      <div class="research-metric metric-finding" data-panel="3"><p class="metric-context">ABOUT THREE IN FIVE</p><strong class="metric-number"><span data-count="finding">${data.metrics[1].value.toFixed(1)}</span><small>%</small></strong><h2 class="metric-label">DIFFICULTY FINDING A JEEPNEY</h2><div class="metric-track" aria-hidden="true"><span style="--value:${data.metrics[1].value/100}"></span></div></div>
      <div class="research-metric metric-route" data-panel="4"><p class="metric-context">JUST OVER ONE IN TWO</p><strong class="metric-number"><span data-count="route">${data.metrics[2].value.toFixed(1)}</span><small>%</small></strong><h2 class="metric-label">UNCERTAIN WHICH ROUTE TO TAKE</h2><div class="metric-track" aria-hidden="true"><span style="--value:${data.metrics[2].value/100}"></span></div></div>
    </div>
    <div class="research-interpretation" data-panel="5"><h1>A NEED FOR CLEARER<br><em>COMMUTING INFORMATION</em></h1></div>
    <div class="research-opportunity" data-panel="6"><h1>WHAT IF THE ANSWERS WERE<br><em>ALREADY IN YOUR HANDS?</em></h1></div>
    <div class="waiting-track" aria-hidden="true"><div class="waiting-ticks"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="waiting-cursor" style="--position:${data.metrics[0].value}%"></span></div>
    <div class="research-phone" aria-hidden="true"><svg viewBox="0 0 160 290"><path class="phone-outline" d="M80 280H30Q10 280 10 260V30Q10 10 30 10H130Q150 10 150 30V260Q150 280 130 280H80" pathLength="1"/><path class="phone-speaker" d="M64 25h32"/><path class="phone-home" d="M60 265h40"/></svg><span class="phone-screen-glow"></span></div>
  </section>`;}
  function stop(){
    ++serial;animations.forEach(a=>a.cancel());animations=[];
    timers.forEach(t=>{clearTimeout(t.id);t.resolve(false)});timers.clear();
    if(frame!==null)cancelAnimationFrame(frame);frame=null;
    root?.classList.remove('is-bridging');
  }
  function wait(ms,token){return new Promise(resolve=>{const t={resolve,id:null};t.id=setTimeout(()=>{timers.delete(t);resolve(token===serial)},ms/(window.LargaMotionRate??1));timers.add(t)});}
  function animate(el,keys,options){const a=el.animate(keys,{easing:ease,fill:'none',...options});a.playbackRate=window.LargaMotionRate??1;animations.push(a);return a.finished.catch(()=>{});}
  function completedNumbers(){
    const values={commuters:data.commuters,drivers:data.drivers,waiting:data.metrics[0].value,finding:data.metrics[1].value,route:data.metrics[2].value};
    root.querySelectorAll('[data-count]').forEach(el=>{const key=el.dataset.count;el.textContent=key==='commuters'||key==='drivers'?String(values[key]):values[key].toFixed(1)});
  }
  function count(items,token){
    const started=performance.now();
    const tick=now=>{
      if(token!==serial)return;
      let done=true;
      items.forEach(({key,to,delay=0,decimals=0})=>{const t=Math.min(1,Math.max(0,(((now-started)*(window.LargaMotionRate??1))-delay)/800));const v=to*(1-Math.pow(1-t,3));root.querySelector(`[data-count="${key}"]`).textContent=v.toFixed(decimals);if(t<1)done=false});
      if(!done)frame=requestAnimationFrame(tick);else frame=null;
    };
    tick(started);
  }
  function state(n){
    root.dataset.beat=String(n);
    if(n>=2&&n<=4){root.style.setProperty('--active-value',String(data.metrics[n-2].value/100));root.querySelector('.waiting-cursor').style.left=data.metrics[n-2].value+'%';}
    completedNumbers();
  }
  function mount(host){host.innerHTML=markup();root=host.querySelector('#scene01');state(0);}
  function setBeat(n){stop();state(n);}
  async function transitionTo(n,from){
    stop();const token=serial;
    state(n);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(n<from){
      const panel=root.querySelector(`[data-panel="${n}"]`)||root.querySelector('.research-metrics');
      await animate(panel,[{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:out});return;
    }
    if(n===1){
      count([{key:'commuters',to:data.commuters},{key:'drivers',to:data.drivers}],token);
      await Promise.all([
        animate(root.querySelector('.commuter-count'),[{opacity:0,transform:'translateX(-52px)'},{opacity:1,transform:'translateX(0)'}],{duration:1000,easing:out}),
        animate(root.querySelector('.driver-count'),[{opacity:0,transform:'translateX(52px)'},{opacity:1,transform:'translateX(0)'}],{duration:1000,delay:100,fill:'backwards',easing:out})
      ]);
    }else if(n>=2&&n<=4){
      const metric=data.metrics[n-2],selector=['.metric-waiting','.metric-finding','.metric-route'][n-2];
      count([{key:metric.key,to:metric.value,delay:250,decimals:1}],token);
      await Promise.all([
        animate(root.querySelector(selector),[{opacity:0,transform:'translateX(-50%) translateY(18px)'},{opacity:1,transform:'translateX(-50%) translateY(0)'}],{duration:850,delay:200,fill:'backwards',easing:out}),
        animate(root.querySelector('.waiting-cursor'),[{transform:'translateX(-50%) scale(.5)',left:'0%',opacity:0},{transform:'translateX(-50%) scale(1)',left:metric.value+'%',opacity:1}],{duration:950,delay:300,fill:'both',easing:ease})
      ]);
    }else if(n===5){
      await animate(root.querySelector('.research-interpretation'),[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:200,fill:'backwards',easing:out});
    }else if(n===6){
      await Promise.all([
        animate(root.querySelector('.phone-outline'),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1050,delay:150,fill:'backwards'}),
        animate(root.querySelector('.research-phone'),[{opacity:0,transform:'translate(-50%,-50%) scale(.92)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)'}],{duration:950,delay:200,fill:'backwards'}),
        animate(root.querySelector('.research-opportunity'),[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:250,fill:'backwards',easing:out})
      ]);
    }else await wait(1250,token);
    if(token===serial)completedNumbers();
  }
  async function enterFrom(opening){
    stop();const token=serial;state(0);root.classList.add('is-bridging');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){root.classList.remove('is-bridging');return;}
    // Copy only the completed backdrop layers, not the opening's live scene objects.
    // This keeps the exact final blue field through the scene boundary.
    const background=root.querySelector('.research-background');
    const copies=['.scene00-background','.scene00-light-field','.scene00-radial-vignette'].map(selector=>{
      const source=opening.querySelector(selector),copy=source.cloneNode(false);
      copy.removeAttribute('id');copy.style.opacity=getComputedStyle(source).opacity;copy.style.transition='none';return copy;
    });
    background.replaceChildren(...copies);background.style.background='none';
    const first=opening.querySelector('.final-word-one'),middle=opening.querySelector('.final-word-two'),last=opening.querySelector('.final-word-three');
    await Promise.all([
      animate(first,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}],{duration:350,fill:'forwards'}),
      animate(last,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(12px)'}],{duration:350,fill:'forwards'}),
      animate(middle,[{opacity:1,transform:'scale(1)',offset:0},{opacity:1,transform:'scale(.9)',offset:.35},{opacity:0,transform:'scale(.82)',offset:1}],{duration:700,fill:'forwards'}),
      animate(root.querySelector('.research-line'),[{top:'60%',transform:'translate(-50%,-50%) scaleX(0)',offset:0},{top:'60%',transform:'translate(-50%,-50%) scaleX(.65)',offset:.55},{top:'50%',transform:'translate(-50%,-50%) scaleX(1)',offset:1}],{duration:850,delay:200,fill:'backwards'}),
      animate(root.querySelector('.research-intro'),[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:550,fill:'backwards',easing:out}),
      animate(root.querySelector('.research-intro h1 em'),[{color:'#f56600'},{color:'#ffffff'}],{duration:400,delay:850,fill:'backwards'}),
      animate(root.querySelector('.research-intro h2 em'),[{color:'#ffffff'},{color:'#f56600'}],{duration:300,delay:1100,fill:'backwards'})
    ]);
    if(token===serial)root.classList.remove('is-bridging');
  }
  window.LargaScenes=window.LargaScenes||{};
  window.LargaScenes.scene01={id:'01',name:'THE PROBLEM WE DISCOVERED',beats,mount,setBeat,transitionTo,enterFrom,stop};
})();

