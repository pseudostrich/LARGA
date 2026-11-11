/* LARGA FINAL PRESENTATION | scene controller v0.2
   Native animation timeline in scene-00.js. All assets local, no installation needed. */
(function () {
  'use strict';
  const scene=window.LargaSequence;
  if(!scene){document.body.textContent='Presentation failed to load. Check scenes/scene-00.js.';return;}
  const byId=id=>document.getElementById(id);
  const root=byId('presentation'),stage=byId('stage'),host=byId('sceneHost');
  const previousButton=byId('previousButton'),nextButton=byId('nextButton');
  const controlStatus=byId('controlStatus'),stageBeatLabel=byId('stageBeatLabel'),stageBeatCount=byId('stageBeatCount');
  const progressFill=byId('stageProgressFill');
  const narrator=byId('narratorAudio'),music=byId('musicAudio'),soundButton=byId('soundButton');
  const fullscreenButton=byId('fullscreenButton');
  let activeBeat=0,muted=false,animating=false,cursorTimeout=null,musicLoaded=false,audioToken=0,navigationGeneration=0;
  const requests=[]; // Compatibility state: navigation inputs are never buffered.
  const audioSlots={0:'assets/audio/vo-01-opening.mp3',14:'assets/audio/vo-02-transition.mp3'};
  const musicPath='assets/audio/pitch-underscore.mp3';
  scene.mount(host);root.dataset.scene=scene.id;

  async function fileAvailable(path){try{const response=await fetch(path,{method:'HEAD',cache:'no-store'});return response.ok;}catch{return false;}}
  async function musicStart(){
    if(muted||musicLoaded)return;
    if(!await fileAvailable(musicPath))return;
    music.src=musicPath;music.volume=.16;musicLoaded=true;
    try{await music.play();}catch{/* Requires a user gesture in many browsers. */}
  }
  function stopVoice(){audioToken++;narrator.pause();try{narrator.currentTime=0;}catch{}music.volume=.16;}
  async function voiceForBeat(index){
    stopVoice();
    if(muted||!audioSlots[index])return;
    const token=audioToken,path=audioSlots[index];
    if(!await fileAvailable(path))return;
    if(token!==audioToken||activeBeat!==index)return;
    narrator.src=path;narrator.volume=.96;
    music.volume=.045;
    narrator.onended=()=>{music.volume=.16;};
    try{await narrator.play();}catch{music.volume=.16;}
  }
  const triggerForm=byId('triggerJumpForm'),triggerInput=byId('triggerJumpInput');
  triggerInput.max=String(scene.beats.length);
  triggerForm.addEventListener('submit',event=>{event.preventDefault();const number=Number(triggerInput.value);if(!Number.isInteger(number)||number<1||number>scene.beats.length){triggerInput.reportValidity();return;}triggerInput.blur();jump(number-1);stage.focus({preventScroll:true});});
  const topicButtons=Array.from(document.querySelectorAll?.('[data-topic-scene]')||[]);
  topicButtons.forEach(button=>{const sceneId=button.getAttribute('data-topic-scene'),index=scene.beats.findIndex(beat=>beat.chapterStart===sceneId);button.title=button.textContent+' · Trigger '+(index+1);button.addEventListener('click',()=>{if(animating||index<0)return;window.LargaReview?.close?.();jump(index);stage.focus({preventScroll:true})})});
  function controls(){
    const b=scene.beats[activeBeat];
    topicButtons.forEach(button=>{const selected=button.getAttribute('data-topic-scene')===b.chapterStart;button.setAttribute('aria-current',selected?'location':'false');button.disabled=animating});
    root.dataset.scene=b.sceneId;root.dataset.finalFrame=String(b.sceneId==='10'&&!animating);
    if(document.activeElement!==triggerInput)triggerInput.value=String(activeBeat+1);
    byId('hudScene').textContent=b.sceneId+' — '+b.sceneName;
    stageBeatLabel.textContent=b.label;
    stageBeatCount.textContent=`${String(activeBeat+1).padStart(2,'0')} / ${String(scene.beats.length).padStart(2,'0')}`;
    controlStatus.textContent=`${String(activeBeat+1).padStart(2,'0')} / ${String(scene.beats.length).padStart(2,'0')}`;
    progressFill.style.width=`${(activeBeat+1)/scene.beats.length*100}%`;
    previousButton.disabled=activeBeat===0;
    nextButton.disabled=animating||activeBeat===scene.beats.length-1;triggerInput.disabled=animating;const goButton=triggerForm.querySelector?.('button');if(goButton)goButton.disabled=animating;stage.setAttribute('aria-busy',String(animating));
  }
  function enqueue(direction){
    if(window.LargaReview?.isOpen?.())return;
    const from=activeBeat,to=from+direction;if(to<0||to>=scene.beats.length)return;
    if(animating){
      if(direction>0)return;
      ++navigationGeneration;
      activeBeat=to;
      stopVoice();
      scene.setBeat(to);
      animating=false;
      controls();
      stage.focus({preventScroll:true});
      return;
    }
    const generation=++navigationGeneration;animating=true;activeBeat=to;stopVoice();controls();if(direction>0)keepBrowserBackLocal();
    void (async()=>{try{await scene.transitionTo(to,from);if(generation===navigationGeneration&&!window.LargaReview?.isOpen?.()&&!window.LargaScenes?.scene02?.isInteractive?.())stage.focus({preventScroll:true});}finally{if(generation===navigationGeneration){animating=false;controls();}}})();
  }
  function next(){enqueue(1);}
  function previous(){enqueue(-1);}
  previousButton.addEventListener('click',previous);
  nextButton.addEventListener('click',next);
  function syncMute(){
    music.muted=muted;narrator.muted=muted;window.LargaScenes?.scene10?.setMuted?.(muted);
    const apply=doc=>{doc.querySelectorAll?.('audio,video').forEach(media=>{media.muted=muted});doc.querySelectorAll?.('iframe').forEach(frame=>{try{if(frame.contentDocument)apply(frame.contentDocument)}catch{}})};apply(document);
    soundButton.setAttribute('aria-pressed',String(muted));soundButton.setAttribute('aria-label',muted?'Unmute all audio':'Mute all audio');soundButton.title=muted?'Unmute all audio (M)':'Mute all audio (M)';root.dataset.muted=String(muted);
  }
  function toggleMute(){muted=!muted;syncMute();if(!muted)void musicStart();}
  syncMute();
  document.addEventListener('play',event=>{if(event.target&&('muted' in event.target))event.target.muted=muted;},true);
  soundButton.addEventListener('click',toggleMute);
  async function toggleFullscreen(){
    try{if(document.fullscreenElement)await document.exitFullscreen();else await root.requestFullscreen();}
    catch{const alert=byId('onstageAlert');alert.textContent='Click the presentation, then press F for fullscreen.';alert.classList.add('is-visible');setTimeout(()=>alert.classList.remove('is-visible'),2200);}
  }
  fullscreenButton.addEventListener('click',toggleFullscreen);
  function cursorWake(){
    root.classList.remove('cursor-hidden');
    clearTimeout(cursorTimeout);
    if(document.fullscreenElement)cursorTimeout=setTimeout(()=>root.classList.add('cursor-hidden'),2400);
  }
  root.addEventListener('mousemove',cursorWake);
  document.addEventListener('fullscreenchange',()=>{
    const on=!!document.fullscreenElement;
    fullscreenButton.setAttribute('aria-pressed',String(on));
    root.classList.remove('cursor-hidden');
    clearTimeout(cursorTimeout);
    if(on)cursorTimeout=setTimeout(()=>root.classList.add('cursor-hidden'),2400);
  });
  function handleKey(event){
    if(window.LargaReview?.handleShortcut?.(event))return true;
    if(window.LargaReview?.isOpen?.())return false;
    if(event.repeat||event.ctrlKey||event.metaKey)return;
    const browserBack=event.key==='BrowserBack'||event.code==='BrowserBack'||(event.altKey&&event.key==='ArrowLeft');
    if(browserBack){event.preventDefault();sideAction(3);return true;}
    if(event.altKey)return;
    if(event.target?.matches?.('input,textarea,select,[contenteditable="true"]'))return;
    const code=event.code||({ArrowRight:'ArrowRight',ArrowLeft:'ArrowLeft',Home:'Home',' ':'Space',f:'KeyF',F:'KeyF',m:'KeyM',M:'KeyM',v:'KeyV',V:'KeyV'}[event.key]);
    switch(code){
      case 'BrowserForward':case 'ArrowRight':case 'Space':event.preventDefault();next();break;
      case 'BrowserBack':case 'ArrowLeft':event.preventDefault();previous();break;
      case 'Home':event.preventDefault();jump(0);break;
      case 'KeyM':event.preventDefault();toggleMute();break;
      case 'KeyF':event.preventDefault();void toggleFullscreen();break;
      case 'KeyV':event.preventDefault();void voiceForBeat(activeBeat);void musicStart();break;
      default:return false;
    }
    return true;
  }
  document.addEventListener('keydown',handleKey,true);
  // A side button can arrive as a pointer, mouse, or browser history event.
  const sidePresses=new Map();
  const sideDocuments=new WeakSet();
  const historyKey='largaPresenterBackGuard';
  let lastBackInput=-Infinity;
  function armBrowserBack(){
    if(activeBeat===0||window.LargaReview?.isOpen?.()||history.state?.[historyKey])return;
    try{history.pushState({...history.state,[historyKey]:true},'',location.href);}catch{}
  }
  let browserGuard=false;
  function keepBrowserBackLocal(){
    armBrowserBack();
    browserGuard=Boolean(history.state?.[historyKey]);
  }
  window.addEventListener('popstate',event=>{
    if(event.state?.[historyKey]){browserGuard=true;return;}
    if(!browserGuard)return;
    browserGuard=false;
    if(activeBeat===0||window.LargaReview?.isOpen?.())return;
    if(performance.now()-lastBackInput>280)previous();
    keepBrowserBackLocal();
  });
  function sideAction(button){
    if(button===3)lastBackInput=performance.now();
    enqueue(button===3?-1:1);
  }
  function sideEvent(event){
    const button=event.button;
    if(button!==3&&button!==4)return;
    event.preventDefault();event.stopPropagation();
    const now=performance.now(),press=sidePresses.get(button);
    const down=event.type==='pointerdown'||event.type==='mousedown';
    if(down){
      if(event.type==='mousedown'&&press?.type==='pointerdown'&&now-press.time<80)return;
      sidePresses.set(button,{type:event.type,time:now});
    }else{
      if(press){
        const recent=now-press.time<120;
        sidePresses.set(button,{type:'release',time:now});
        if(press.type!=='release'||recent)return;
      }else sidePresses.set(button,{type:'release',time:now});
    }
    sideAction(button);
  }
  function bindSideButtons(doc){
    if(!doc||sideDocuments.has(doc))return;
    sideDocuments.add(doc);
    ['pointerdown','mousedown','pointerup','mouseup','auxclick'].forEach(type=>doc.addEventListener(type,sideEvent,true));
    doc.addEventListener('pointercancel',()=>sidePresses.clear(),true);
    doc.addEventListener('load',event=>{if(event.target?.tagName==='IFRAME')bindSideFrame(event.target);},true);
    doc.querySelectorAll('iframe').forEach(bindSideFrame);
  }
  function bindSideFrame(frame){
    try{bindSideButtons(frame.contentDocument);}catch{}
  }
  bindSideButtons(document);
  window.addEventListener('blur',()=>sidePresses.clear());

  controls();stage.focus({preventScroll:true});
  function jump(index){
    if(animating||window.LargaReview?.isOpen?.())return;
    const value=Math.round(Number(index));if(!Number.isFinite(value)||value<0||value>=scene.beats.length)return;
    const generation=++navigationGeneration;requests.length=0;animating=false;scene.setBeat(value);activeBeat=value;controls();stopVoice();keepBrowserBackLocal();
    const closing=window.LargaScenes?.scene10;
    const selected=scene.beats[value],product=window.LargaScenes?.scene02;
    const replay=selected.sceneId==='10'?closing?.replay:selected.sceneId==='02'&&product?.isReel(selected.localBeat)?product.playReel:selected.sceneId==='08'&&selected.localBeat===0?window.LargaScenes.scene08.replayOffers:selected.sceneId==='09'&&selected.localBeat===4?window.LargaScenes.scene09.playRisks:null;
    if(replay){animating=true;controls();void replay().finally(()=>{if(generation===navigationGeneration){animating=false;controls();}});}
  }
  window.LargaPresentation=Object.freeze({next,previous,handleKey,toggleFullscreen,goToBeat:jump,
    goToScene(id,localBeat=0){const index=scene.beats.findIndex(b=>b.sceneId===String(id).padStart(2,'0')&&b.localBeat===Number(localBeat));if(index>=0)jump(index);},
    settleForReview(){if(animating){navigationGeneration++;requests.length=0;scene.setBeat(activeBeat);animating=false;controls();}stopVoice();return activeBeat;},
    getState(){const b=scene.beats[activeBeat];return {scene:b.sceneId,beat:b.localBeat,globalBeat:activeBeat,total:scene.beats.length,muted,animating,queued:requests.length};}
  });
})();
