(function(){
 'use strict';
 const scenes=[window.LargaScenes.scene00,window.LargaScenes.scene01,window.LargaScenes.scene02,window.LargaScenes.scene04,window.LargaScenes.scene05,window.LargaScenes.scene06,window.LargaScenes.scene07,window.LargaScenes.scene08,window.LargaScenes.scene09,window.LargaScenes.scene10];
 const chapterStarts={'00':'00','04':'04','01':'01','02':'01','05':'05','06':'05','07':'07','08':'08','09':'09','10':'09'};
 const customHandoffs=new Set(['00:01','01:02','05:06','06:07','07:08','08:09','09:10']);
 const offsets=[];let total=0;scenes.forEach(s=>{offsets.push(total);total+=s.beats.length});
 let hosts=[],serial=0,boundaryMotion=null;
 const beats=scenes.flatMap(s=>s.beats.map((b,i)=>({...b,sceneId:s.id,chapterStart:chapterStarts[s.id],sceneName:s.name,localBeat:i})));
 function locate(n){let i=offsets.length-1;while(i>0&&n<offsets[i])i--;return {i,local:n-offsets[i]};}
 function show(n){const {i}=locate(n);hosts.forEach((h,j)=>{h.hidden=j!==i;h.setAttribute('aria-hidden',String(j!==i));scenes[j].setVisible?.(j===i)})}
 function mount(host){host.innerHTML=scenes.map((s,i)=>`<div class="scene-slot" id="sequenceSlot${i}" ${i?'hidden':''}></div>`).join('');hosts=scenes.map((s,i)=>{const h=host.querySelector('#sequenceSlot'+i);s.mount(h);return h});show(0)}
 function setBeat(n){++serial;boundaryMotion?.cancel();boundaryMotion=null;const target=locate(n);scenes.forEach((s,i)=>{s.stop?.();s.setBeat(i<target.i?s.beats.length-1:i===target.i?target.local:0)});show(n)}
 async function transitionTo(n,from){
  const token=++serial;boundaryMotion?.cancel();boundaryMotion=null;const a=locate(n),b=locate(from);
  if(a.i===b.i){show(n);await scenes[a.i].transitionTo(a.local,b.local);return}
  if(a.i===b.i+1&&a.local===0){scenes[b.i].stop?.();hosts[a.i].hidden=false;hosts[a.i].setAttribute('aria-hidden','false');if(customHandoffs.has(scenes[b.i].id+':'+scenes[a.i].id)){await scenes[a.i].enterFrom(hosts[b.i])}else{scenes[a.i].setBeat(0);scenes[a.i].setVisible?.(true);if(!matchMedia('(prefers-reduced-motion: reduce)').matches){boundaryMotion=hosts[a.i].animate([{opacity:0},{opacity:1}],{duration:600,easing:'cubic-bezier(.4,0,.2,1)'});await boundaryMotion.finished.catch(()=>{})}}if(token===serial){boundaryMotion=null;show(n);scenes[b.i].setBeat(scenes[b.i].beats.length-1)}return}
  if(a.i===b.i-1&&b.local===0){scenes[b.i].stop?.();scenes[a.i].setBeat(a.local);hosts[a.i].hidden=false;hosts[a.i].setAttribute('aria-hidden','false');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){boundaryMotion=hosts[b.i].animate([{opacity:1},{opacity:0}],{duration:510,easing:'cubic-bezier(.45,0,.2,1)'});await boundaryMotion.finished.catch(()=>{})}if(token===serial){boundaryMotion=null;show(n);scenes[b.i].setBeat(0)}return}
  setBeat(n)
 }
 window.LargaSequence={id:'00',name:'LARGA PRESENTATION',beats,mount,setBeat,transitionTo};
})();
