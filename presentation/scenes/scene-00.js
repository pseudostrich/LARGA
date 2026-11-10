/* LARGA | Scene 00: THE WAIT | v0.2
   Native Web Animations API + CSS easing. No network needed.
   Road network is cinematic and stylized; not a verified GIS basemap. */
(function () {
  'use strict';

  // Keep the original artwork states and skip the former clock state.
  const visualBeats=[0,2,3,4,5,6,7];
  const beats = [
    {label:'01 · SIGNAL', line:'AI voice (optional): “Every journey begins somewhere.”', note:'Scene opens directly on a pulsing orange beacon. Let its outward ripples breathe. No on-screen prompt.', audio:'Optional: assets/audio/vo-01-opening.mp3'},
    {label:'02 · THE CITY', line:'“A commuter stands beside a busy road in Davao City.”', note:'Reveal the stylized Davao-inspired blue road network. The graphic is illustrative.'},
    {label:'03 · THE WAIT', line:'“There’s somewhere they need to be. Jeepneys pass. Cars move. The city is already awake. But the commuter is still standing there.”', note:'Focus on the motionless commuter as jeepney indicators move along the roads.'},
    {label:'04 · QUESTION ONE', line:'“Unsa akong sakyan?”', note:'UNSA appears in LARGA orange, with AKONG SAKYAN? in white.'},
    {label:'05 · QUESTION TWO', line:'“Asa ko maghulat?”', note:'The first question recedes upward as ASA KO MAGHULAT? takes focus. ASA is orange.'},
    {label:'06 · QUESTION THREE', line:'“Kanus-a moabot?”', note:'All three questions share the frame. KANUS-A is orange.'},
    {label:'07 · UNCERTAINTY', line:'“Three questions that thousands of commuting decisions begin with. And yet, getting the right answers can be the hardest part of the journey.”', note:'The questions converge. THE → UNCERTAINTY → OF COMMUTING. reveal sequentially, with a centered zoom and pullback. Use a quick centered zoom and a short closing pause.'}
  ];

  const roads = [
    'M -160 640 C 190 675, 330 586, 548 526 S 1040 360, 1740 213',
    'M -100 340 C 280 355, 480 403, 670 438 S 1130 486, 1700 550',
    'M 164 950 C 250 710, 380 538, 520 390 S 815 130, 965 -125',
    'M 1310 990 C 1200 730, 1145 566, 1098 412 S 1125 150, 1280 -110',
    'M -100 160 C 280 240, 540 210, 760 267 S 1160 285, 1710 110',
    'M 15 940 C 230 789, 470 738, 660 682 S 1160 629, 1670 698',
    'M 342 990 C 372 770, 520 600, 714 536 S 1170 455, 1570 350',
    'M 620 -120 C 622 100, 560 265, 600 435 S 670 720, 795 985',
    'M 1560 -100 C 1438 150, 1400 340, 1450 493 S 1604 719, 1755 935',
    'M -80 485 C 190 520, 335 470, 510 480 S 960 585, 1200 700',
    'M 75 -95 C 270 115, 370 242, 510 336 S 832 494, 1060 850',
    'M 1022 -90 C 918 110, 884 264, 912 412 S 940 732, 1056 970'
  ];
  const minorStreets = Array.from({length:19},(_,i)=>{
    const x=90+i*80;
    return `<path d="M${x} -100 C${x-68} 270 ${x+70} 470 ${x-20} 1000" class="map-minor"/>`;
  }).concat(Array.from({length:14},(_,i)=>{
    const y=55+i*70;
    return `<path d="M-100 ${y} C420 ${y-45} 1030 ${y+60} 1720 ${y-18}" class="map-minor"/>`;
  })).join('');

  const arteries=roads.map((d,i)=>`<g class="map-road map-road-${i}"><path class="road-shadow" d="${d}"/><path class="road-base" id="drivePath${i}" d="${d}"/><path class="road-trace ${i===0?'road-trace--hot':''}" d="${d}" pathLength="100" style="--road-delay:${(i%6)*.1}s"/></g>`).join('');

  function markup() { return `<section id="scene00" class="scene-00 scene-root" data-beat="0" aria-label="Scene zero: The Wait">
    <div class="scene00-background"></div>
    <div class="scene00-light-field"></div>
    <div class="scene00-radial-vignette"></div>
    <div class="scene00-map-wrap" id="mapCamera">
      <svg class="scene00-network" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="routeBlue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#075dbc" stop-opacity=".65"/><stop offset=".5" stop-color="#70c3fa" stop-opacity=".8"/><stop offset="1" stop-color="#064a96" stop-opacity=".6"/></linearGradient>
          <linearGradient id="routeOrange" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f56600" stop-opacity=".4"/><stop offset=".48" stop-color="#ff9a43"/><stop offset="1" stop-color="#f56600" stop-opacity=".5"/></linearGradient>
          <pattern id="microgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 L0 0 0 40" fill="none" stroke="#326695" stroke-width=".6" opacity=".25"/></pattern>
        </defs>
        <rect x="0" y="0" width="1600" height="900" fill="url(#microgrid)"/>
        <path d="M1290 -80 C1280 138 1320 264 1438 384 C1459 453 1502 555 1527 653 C1536 750 1590 860 1690 980" stroke="#4ba2d9" stroke-width="2" opacity=".3" fill="none"/>
        <g class="map-streets">${minorStreets}</g><g class="map-highways">${arteries}</g>
        <g class="map-neighborhoods">${Array.from({length:45},(_,i)=>{
          const x=95+((i*229)%1430),y=80+((i*133)%755);
          return `<rect x="${x}" y="${y}" width="${12+(i%4)*11}" height="${8+(i%5)*7}" rx="2" fill="#1b6595" opacity="${.08+(i%4)*.025}" transform="rotate(${(i%4-2)*9} ${x} ${y})"/>`;
        }).join('')}</g>
        <g id="vehicleLayer"></g>
        <g id="commuterSymbol" class="commuter-symbol" transform="translate(825 480)">
          <circle class="commuter-halo" cx="0" cy="5" r="64" fill="none" stroke="#ff8b29" stroke-width="2"/>
          <circle class="commuter-halo commuter-halo--delay" cx="0" cy="5" r="64" fill="none" stroke="#ff8b29" stroke-width="2"/>
          <circle cx="0" cy="5" r="47" fill="#08283e" fill-opacity=".8" stroke="#427fa9" stroke-width="1.4"/>
          <circle cx="0" cy="-18" r="12" fill="#f3f8fd"/>
          <path d="M-17 21 Q-16 -5 0 -3 Q16 -5 17 21 L17 32 L-17 32Z" fill="#f3f8fd"/>
          <path d="M-26 42 L26 42" stroke="#f56600" stroke-width="3" stroke-linecap="round"/>
          <circle cx="37" cy="-32" r="6" fill="#f56600"/>
        </g>
      </svg>
      <div class="map-location"><svg class="location-pin" viewBox="0 0 64 80" aria-hidden="true"><path d="M32 3C16 3 5 15 5 30c0 20 27 46 27 46s27-26 27-46C59 15 48 3 32 3ZM42 29a10 10 0 1 0-20 0a10 10 0 1 0 20 0Z" fill="#f56600" fill-rule="evenodd"/></svg><span>DAVAO CITY</span></div><div class="map-city-chip"><span class="city-chip-dot"></span>DAVAO CITY <small>ILLUSTRATIVE DIGITAL NETWORK</small></div>
    </div>
    <div class="scene00-pulse" id="signalPulse" aria-hidden="true">
      <div class="signal-waves"><div class="signal-aura"></div><span class="signal-ring ring-one"></span><span class="signal-ring ring-two"></span><span class="signal-ring ring-three"></span></div><svg class="location-pin" viewBox="0 0 64 80" aria-hidden="true"><path d="M32 3C16 3 5 15 5 30c0 20 27 46 27 46s27-26 27-46C59 15 48 3 32 3ZM42 29a10 10 0 1 0-20 0a10 10 0 1 0 20 0Z" fill="#f56600" fill-rule="evenodd"/></svg>
    </div>
    <div class="scene00-wait-glow"></div>
    <div class="scene00-question-veil"></div>
    <div class="scene00-questions" aria-hidden="true">
      <div class="question question-one"><strong><em>UNSA</em> AKONG SAKYAN?</strong></div>
      <div class="question question-two"><strong><em>ASA</em> KO MAGHULAT?</strong></div>
      <div class="question question-three"><strong><em>KANUS-A</em> MOABOT?</strong></div>
    </div>
    <div class="scene00-fusion" aria-hidden="true"></div>
    <div class="scene00-conclusion" aria-label="The uncertainty of commuting">
      <div class="final-camera" id="finalCamera"><span class="final-word final-word-one">THE</span><span class="final-word final-word-two">UNCERTAINTY</span><span class="final-word final-word-three">OF COMMUTING.</span></div>
    </div>
    <div class="scene00-user" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#073261" stroke="#78b8e8" stroke-width="1.5"/><circle cx="50" cy="34" r="13" fill="#fff"/><path d="M25 77V69C25 44 75 44 75 69V77Z" fill="#fff"/><path d="M34 85H66" stroke="#f56600" stroke-width="4" stroke-linecap="round"/></svg><div class="live-user-marker"><span></span></div></div><div class="motion-edges" aria-hidden="true"></div>
  </section>`; }

  let root,carPaths=[],cars=[],running=false,lastT=null,carTime=0,currentBeat=0,finalAnimation=null,finalTimeouts=[],transitionToken=0;
  function setupVehicles() {
    carPaths=roads.map((_,i)=>{const el=root.querySelector('#drivePath'+i);const len=el.getTotalLength();return {len,points:Array.from({length:513},(_,j)=>el.getPointAtLength(len*j/512))};});
    const layer=root.querySelector('#vehicleLayer');
    for(let i=0;i<7;i++) {
      const e=document.createElementNS('http://www.w3.org/2000/svg','g');
      e.setAttribute('class',`moving-jeep moving-jeep--${i%4}`);
      const color=['#f56600','#72caff','#e9f0f7','#ffc45c'][i%4];
      e.innerHTML=`<g stroke="#041c31" stroke-width="1.2"><rect x="-21" y="-12" width="9" height="5" rx="2" fill="#071522"/><rect x="11" y="-12" width="8" height="5" rx="2" fill="#071522"/><rect x="-21" y="7" width="9" height="5" rx="2" fill="#071522"/><rect x="11" y="7" width="8" height="5" rx="2" fill="#071522"/><path d="M-27-8H10L13-6H23L28-3V3L23 6H13L10 8H-27Z" fill="${color}"/><rect x="-24" y="-6" width="28" height="12" rx="2" fill="#d9e6ec"/><path d="M-21-4H0M-21 0H0M-21 4H0" stroke="#819aaa" stroke-width="1"/><path d="M6-6H12V6H6Z" fill="#073651"/><rect x="17" y="-4" width="7" height="8" rx="1" fill="${color}"/><path d="M-29-9V9M28-5V5" stroke="#f7faff" stroke-width="2"/><path d="M25-4V-2M25 2V4" stroke="#fff4bc" stroke-width="2"/></g>`;

      layer.appendChild(e);
      cars.push({e,path:carPaths[[0,0,1,2,3,5,6][i]],phase:(i*.157)%1,speed:.027+(i%5)*.008,reverse:i%4===0});
    }
    positionVehicles();
  }
  function positionVehicles() {
    for(const c of cars) {
      let t=(c.phase+carTime*c.speed)%1;
      if(c.reverse)t=1-t;
      const sample=t*512,index=Math.min(511,Math.floor(sample)),mix=sample-index;
      const a=c.path.points[index],b=c.path.points[index+1];
      const x=a.x+(b.x-a.x)*mix,y=a.y+(b.y-a.y)*mix;
      const angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+(c.reverse?180:0);
      c.e.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)})`);
      c.e.firstElementChild?.setAttribute('opacity',String(Math.min(1,t/.04,(1-t)/.04)));
    }
  }
  function frame(ts) {
    if(!running)return;
    const moving=currentBeat>=2&&currentBeat<=6&&!document.hidden;
    if(moving&&lastT!==null)carTime+=Math.min(.06,Math.max(0,(ts-lastT)/1000));
    lastT=ts;
    if(moving)positionVehicles();
    requestAnimationFrame(frame);
  }
  function cleanupFinal() {
    for(const timeout of finalTimeouts)clearTimeout(timeout);
    finalTimeouts=[];
    if(finalAnimation){finalAnimation.cancel();finalAnimation=null;}
    root.classList.remove('final-words-visible','final-word-1','final-word-2','final-word-3');
  }
  function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
  async function transitionTo(index,previous) {
    const n=visualBeats[index],from=visualBeats[previous];
    const token=++transitionToken;
    cleanupFinal();
    root.classList.toggle('vehicles-ready',n>=2&&n<=6);
    currentBeat=n;
    root.dataset.beat=String(n);
    root.classList.toggle('is-rewinding',n<from);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.remove('is-moving');
    if(!reduced){void root.offsetWidth;root.classList.add('is-moving');}
    if(n===7) {
      if(reduced){root.classList.add('final-words-visible','final-word-1','final-word-2','final-word-3');return;}
      await wait(200);if(token!==transitionToken)return;
      root.classList.add('final-words-visible','final-word-1');
      await wait(250);if(token!==transitionToken)return;
      root.classList.add('final-word-2');
      const camera=root.querySelector('#finalCamera');
      const word=root.querySelector('.final-word-two');
      // A centered push-in and pullback, with no horizontal sweep.
      const magnify=Math.min(1.48,root.clientWidth*.86/Math.max(1,word.offsetWidth));
      const centerY=word.offsetTop+word.offsetHeight/2-camera.offsetHeight/2;
      finalAnimation=camera.animate([
        {transform:'translate3d(0,0,0) scale(1)',offset:0,easing:'cubic-bezier(.42,0,.58,1)'},
        {transform:`translate3d(0,${-centerY*magnify}px,0) scale(${magnify})`,offset:.40,easing:'cubic-bezier(.42,0,.58,1)'},
        {transform:`translate3d(0,${-centerY*magnify}px,0) scale(${magnify})`,offset:.44,easing:'cubic-bezier(.42,0,.58,1)'},
        {transform:'translate3d(0,0,0) scale(1)',offset:.94},
        {transform:'translate3d(0,0,0) scale(1)',offset:1}
      ],{duration:2100,easing:'linear',fill:'none'});
      finalTimeouts.push(setTimeout(()=>{if(token===transitionToken)root.classList.add('final-word-3');},800));
      try{await finalAnimation.finished;}catch{}
      if(token===transitionToken){finalAnimation=null;root.classList.remove('is-moving');await wait(350);}
      return;
    }
    // Let eased CSS transitions settle before accepting the next queued beat.
    // Map zoom/blur transitions can take up to 2 seconds in either direction.
    const durations={0:1850,2:2150,3:1450,4:1500,5:1500,6:1500};
    await wait(reduced?25:durations[n]||1500);
    if(token===transitionToken)root.classList.remove('is-moving');
  }
  function mount(host) {
    host.innerHTML=markup();
    root=host.querySelector('#scene00');
    root.dataset.beat='0';
    setupVehicles();
    running=true;
    requestAnimationFrame(frame);
  }
  function setBeat(index) {
    const n=visualBeats[index];
    ++transitionToken;
    cleanupFinal();
    currentBeat=n;
    root.dataset.beat=String(n);
    root.classList.remove('is-moving');
    root.classList.toggle('vehicles-ready',n>=2&&n<=6);
    if(n===7)root.classList.add('final-words-visible','final-word-1','final-word-2','final-word-3');
  }
  window.LargaScenes=window.LargaScenes||{};
  window.LargaScenes.scene00={id:'00',name:'THE WAIT',beats,mount,transitionTo,setBeat};
})();
