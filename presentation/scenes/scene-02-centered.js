(function(){
 'use strict';
 function prepare(host){
  let frame=host.querySelector('iframe');
  if(frame)return frame;
  host.innerHTML='<div class="reel-camera"><iframe title="Updated LARGA app demonstration" tabindex="-1" src="assets/product-app/index.html"></iframe></div><div class="reel-cut"></div><div class="reel-handoff"></div>';
  frame=host.querySelector('iframe');
  const camera=host.querySelector('.reel-camera');
  const resize=()=>{
   const width=camera.clientWidth;
   if(!width)return;
   const scale=width/390;
   frame.style.transform='scale('+scale+')';
   frame.style.height=(camera.clientHeight/scale)+'px';
  };
  new ResizeObserver(resize).observe(camera);
  resize();
  return frame;
 }
 function command(host,action,index){
  const frame=prepare(host);
  try{frame.contentWindow?.LargaPitchDemo?.[action]?.(index);}catch(error){console.warn('LARGA demo shot:',error.message);}
 }
 function ready(host){return Boolean(prepare(host).contentWindow?.LargaPitchDemo);}
 window.LargaCenteredReel={prepare,command,ready};
})();
