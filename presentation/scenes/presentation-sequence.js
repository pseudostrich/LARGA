(function(){
 'use strict';
 const scenes=[window.LargaScenes.scene00,window.LargaScenes.scene01,window.LargaScenes.scene02,window.LargaScenes.scene04,window.LargaScenes.scene05,window.LargaScenes.scene06,window.LargaScenes.scene07,window.LargaScenes.scene08,window.LargaScenes.scene09,window.LargaScenes.scene10];
 const chapterStarts={'00':'00','04':'04','01':'01','02':'01','05':'05','06':'05','07':'07','08':'08','09':'09','10':'09'};
 const customHandoffs=new Set(['00:01','01:02','05:06','06:07','07:08','08:09','09:10']);
 let hosts=[],serial=0,boundaryMotion=null;
 const beats=scenes.flatMap(s=>s.beats.flatMap((b,i)=>
  (s.id==='01'&&i===6)||(s.id==='02'&&i===4)||(s.id==='05'&&i===3)||(s.id==='07'&&[2,3,4].includes(i))||(s.id==='08'&&[1,2,3,4,5,7,8,9,10].includes(i))||(s.id==='09'&&(i<4||(i>=5&&i<=11)))?[]:[{...b,sceneId:s.id,chapterStart:chapterStarts[s.id],sceneName:s.name,localBeat:i}]
 ));
 function locate(n){const beat=beats[n];return {i:scenes.findIndex(scene=>scene.id===beat.sceneId),local:beat.localBeat};}
 function show(n){const {i}=locate(n);hosts.forEach((h,j)=>{h.hidden=j!==i;h.setAttribute('aria-hidden',String(j!==i));scenes[j].setVisible?.(j===i)})}
 function mount(host){host.innerHTML=scenes.map((s,i)=>`<div class="scene-slot" id="sequenceSlot${i}" ${i?'hidden':''}></div>`).join('');hosts=scenes.map((s,i)=>{const h=host.querySelector('#sequenceSlot'+i);s.mount(h);return h});show(0)}
 function setBeat(n){++serial;boundaryMotion?.cancel();boundaryMotion=null;const target=locate(n);scenes.forEach((s,i)=>{s.stop?.();s.setBeat(i<target.i?s.beats.length-1:i===target.i?target.local:0)});show(n)}
 async function reverseTo(n,a,b,token){
  const target=hosts[a.i],outgoing=hosts[b.i];
  const apply=()=>{if(token!==serial)return;scenes[a.i].setBeat(a.local);show(n);};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){apply();if(a.i!==b.i)scenes[b.i].stop?.();return;}
  if(a.i===b.i&&document.startViewTransition){
   const stage=target.parentElement;
   stage.classList.add('scene-reversing');
   const view=document.startViewTransition(apply);
   boundaryMotion={cancel(){view.skipTransition();}};
   try{await view.finished;}finally{stage.classList.remove('scene-reversing');}
  }else if(a.i===b.i){
   apply();
   boundaryMotion=target.animate([{opacity:.84},{opacity:1}],{duration:120,easing:'ease-out'});
   await boundaryMotion.finished.catch(()=>{});
  }else{
   scenes[a.i].setBeat(a.local);
   target.hidden=false;
   target.setAttribute('aria-hidden','false');
   scenes[a.i].setVisible?.(true);
   outgoing.style.zIndex='1';
   boundaryMotion=outgoing.animate([{opacity:1},{opacity:0}],{duration:150,easing:'ease-out',fill:'forwards'});
   await boundaryMotion.finished.catch(()=>{});
   outgoing.style.removeProperty('z-index');
   if(token===serial){show(n);boundaryMotion.cancel();scenes[b.i].stop?.();}
  }
  if(token===serial)boundaryMotion=null;
 }

 async function transitionTo(n,from){
  const token=++serial;boundaryMotion?.cancel();boundaryMotion=null;const a=locate(n),b=locate(from);
  if(n<from){await reverseTo(n,a,b,token);return}
  if(a.i===b.i){show(n);await scenes[a.i].transitionTo(a.local,b.local);return}
  if(a.i!==b.i){if(!scenes[b.i].isReel?.(b.local))scenes[b.i].stop?.();hosts[a.i].hidden=false;hosts[a.i].setAttribute('aria-hidden','false');if(scenes[a.i].id==='07'&&a.local===3){const entering=hosts[a.i];entering.style.zIndex='1';try{await scenes[a.i].enterExpansion()}finally{entering.style.removeProperty('z-index')}}else if(scenes[a.i].id==='09'&&a.local===4){scenes[a.i].setVisible?.(true);await scenes[a.i].playRisks()}else if(a.local===0&&((scenes[b.i].id==='01'&&scenes[a.i].id==='02')||(scenes[b.i].id==='02'&&scenes[a.i].id==='04')||(b.local===scenes[b.i].beats.length-1&&customHandoffs.has(scenes[b.i].id+':'+scenes[a.i].id)))){await scenes[a.i].enterFrom(hosts[b.i])}else{scenes[a.i].setBeat(a.local);scenes[a.i].setVisible?.(true);if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const entering=hosts[a.i];if(a.i<b.i)entering.style.zIndex='1';boundaryMotion=entering.animate([{opacity:0},{opacity:1}],{duration:600/(window.LargaMotionRate??1),easing:'cubic-bezier(.4,0,.2,1)'});await boundaryMotion.finished.catch(()=>{});entering.style.removeProperty('z-index')}}if(token===serial){boundaryMotion=null;show(n);scenes[b.i].setBeat(scenes[b.i].beats.length-1)}return}
  setBeat(n)
 }
 window.LargaSequence={id:'00',name:'LARGA PRESENTATION',beats,mount,setBeat,transitionTo};
})();
