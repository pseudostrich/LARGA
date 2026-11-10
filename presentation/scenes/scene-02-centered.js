(function(){
 'use strict';
 function prepare(host){
  let frame=host.querySelector('iframe');
  if(frame)return frame;
  host.innerHTML='<div class="reel-app-screen"><iframe title="Full-screen LARGA features" tabindex="-1" src="assets/product-app/index.html"></iframe></div>'+
   '<div class="reel-splash"><img src="assets/product-app/Assets/larga-logo.png" alt=""><img src="assets/product-app/Assets/larga-wordmark.png" alt="LARGA"><span>Your Ride, On Track</span></div>'+
   '<div class="reel-cut"></div><div class="reel-end"><strong>See your ride.<br><em>Plan your trip.</em></strong><i></i></div>';
  frame=host.querySelector('iframe');
  const resize=()=>{
   if(!host.clientWidth)return;
   const scale=host.clientWidth/1280;
   frame.style.transform='scale('+scale+')';
   frame.style.height=(host.clientHeight/scale)+'px';
  };
  new ResizeObserver(resize).observe(host);
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
