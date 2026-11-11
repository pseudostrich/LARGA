/* Scene 02 · trigger 18 product film support.
   Hosts the presentation-only copy of the archived LARGA app at true phone width (390 CSS px),
   scales it uniformly so the app keeps its portrait proportions, and provides a camera that
   frames real elements of the running app. */
(function(){
 'use strict';
 const APP_SRC='assets/product-app-archive/index.html?v=f5';
 function scene(host){return host.closest('.scene-02');}
 function prepare(host){
  const root=scene(host),screen=root.querySelector('.product-screen');
  const backdrop=root.querySelector('.reveal-backdrop');
  if(backdrop&&!backdrop.querySelector('.film-light')){const light=document.createElement('div');light.className='film-light';light.innerHTML='<i data-k="live"></i><i data-k="guide"></i><i data-k="trips"></i><i data-k="discover"></i><i data-k="end"></i>';backdrop.append(light);}
  let app=screen.querySelector('.reel-app-screen');
  if(app){const existing=app.querySelector('iframe');existing.__fit?.();return existing;}
  app=document.createElement('div');
  app.className='reel-app-screen';
  app.innerHTML='<iframe title="LARGA mobile app demo" tabindex="-1" src="'+APP_SRC+'"></iframe>';
  screen.prepend(app);
  host.innerHTML='<div class="film-kicker" aria-hidden="true"><i></i><span></span></div>'
   +'<div class="film-sim" aria-hidden="true"><b></b>Simulated positions &amp; ETA · prototype</div>'
;
  const frame=app.querySelector('iframe');
  const resize=()=>{
   const w=screen.clientWidth,h=screen.clientHeight;if(!w||!h)return;
   const k=w/390;
   frame.style.height=(h/k)+'px';
   frame.style.transform='scale('+k+')';
  };
  frame.__fit=resize;
  new ResizeObserver(resize).observe(screen);
  addEventListener('resize',resize);document.addEventListener('fullscreenchange',()=>setTimeout(resize,60));
  resize();
  return frame;
 }
 // All calls into the app go through postMessage, so the film also runs when index.html is opened as a file.
 let nextId=0;const waiting=new Map();
 addEventListener('message',event=>{
  const d=event.data;if(!d||d.type!=='larga-film-reply'||!waiting.has(d.id))return;
  const w=waiting.get(d.id);if(event.source!==w.target)return;
  waiting.delete(d.id);clearTimeout(w.timer);w.resolve(d.result);
 });
 function rpc(host,fn,...args){
  const target=prepare(host).contentWindow;
  if(!target)return Promise.resolve(null);
  return new Promise(resolve=>{
   const id=++nextId;
   const timer=setTimeout(()=>{waiting.delete(id);resolve(null);},1500);
   waiting.set(id,{resolve,timer,target});
   try{target.postMessage({type:'larga-film',id,fn,args},'*');}catch{clearTimeout(timer);waiting.delete(id);resolve(null);}
  });
 }
 function command(host,action){if(action==='splash')void rpc(host,'splash');}
 async function ready(host){return Boolean(await rpc(host,'ready'));}

 // Camera. The phone is laid out BASE times larger than it appears and is only ever scaled down, so the app's text
 // stays sharp at every zoom. Scales passed in and out are relative to the normal phone (1 = trigger 17's size).
 const BASE=1.5;
 function camera(root){
  const phone=root.querySelector('.product-phone'),screen=root.querySelector('.product-screen');
  let current={x:0,y:0,s:1},live=null,moving=null,dead=false;
  const pose=c=>'translate(-50%,-50%) translate('+c.x.toFixed(2)+'px,'+c.y.toFixed(2)+'px) scale('+(c.s/BASE).toFixed(5)+')';
  function measure(){
   const stage=root.getBoundingClientRect();
   return {W:stage.width,H:stage.height,pw:phone.offsetWidth,ph:phone.offsetHeight,
    sx:screen.offsetLeft+phone.clientLeft,sy:screen.offsetTop+phone.clientTop,k:screen.clientWidth/390};
  }
  // b: a box in app CSS px. The phone always stays centred left-to-right; the camera only travels up and down
  // to bring the box to the middle, and never shows past the top or bottom of the phone.
  function target(b,{level=1.6}={}){
   const m=measure();if(!b)return {...current};
   const s=level;
   const cy=m.sy+(b.y+b.h/2)*m.k-m.ph/2;
   const phoneH=s*(m.ph/BASE),room=Math.max(0,(phoneH-m.H)/2+m.H*.02);
   let y=-(s/BASE)*cy;y=Math.max(-room,Math.min(room,y));
   return {x:0,y,s};
  }
  function wide(s=1){return {x:0,y:0,s};}
  function fromRect(rect){
   const stage=root.getBoundingClientRect(),m=measure();
   return {x:rect.left+rect.width/2-(stage.left+stage.width/2),y:rect.top+rect.height/2-(stage.top+stage.height/2),s:rect.height/(m.ph/BASE)};
  }
  function computed(){const t=getComputedStyle(phone).transform;return(!t||t==='none')?pose(current):t;}
  function stopDrift(){if(live){const a=live;live=null;a.cancel();}}
  function stopMove(){if(moving){const a=moving;moving=null;a.cancel();}}
  function set(c){if(dead)return;stopDrift();stopMove();current={...c};phone.style.transform=pose(current);}
  function go(next,kind='cut',{duration,drift=0,hold=1800,easing}={}){
   if(dead)return Promise.resolve();
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const from=computed();stopDrift();stopMove();
   current={...next};phone.style.transform=pose(current);
   let done=Promise.resolve();
   const d=kind==='cut'?0:(duration??(kind==='pan'?750:kind==='push'?1000:1150));
   if(!reduced&&d){
    const e=easing??(kind==='glide'?'cubic-bezier(.16,1,.3,1)':'cubic-bezier(.4,0,.2,1)');
    const anim=phone.animate([{transform:from},{transform:pose(current)}],{duration:d,easing:e});moving=anim;
    done=anim.finished.then(()=>{if(moving===anim)moving=null;},()=>{});
   }
   if(!reduced&&drift){
    const end={...current,s:current.s*(1+drift)};
    const anim=phone.animate([{transform:pose(current)},{transform:pose(end)}],{duration:hold,delay:d,easing:'cubic-bezier(.3,0,.7,1)',fill:'forwards'});
    live=anim;
    anim.finished.then(()=>{if(live===anim){current=end;phone.style.transform=pose(end);live=null;anim.cancel();}},()=>{});
   }
   return done;
  }
  function reset(){stopDrift();stopMove();current={x:0,y:0,s:1};phone.style.removeProperty('transform');}
  function dispose(){reset();dead=true;}
  return {target,wide,fromRect,go,set,reset,dispose,pose,get current(){return {...current};},measure};
 }
 window.LargaCenteredReel={prepare,command,ready,rpc,camera};
})();
