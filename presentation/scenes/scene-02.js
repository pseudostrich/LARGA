/* Scene 02: official branding and local, source-derived LARGA product demo. */
(function(){
 'use strict';
 const data=window.LargaRevealData,ease='cubic-bezier(.45,0,.2,1)',out='cubic-bezier(.22,1,.36,1)';
 const overviewBeats=[
  {label:'02.0 · A CLEARER DIRECTION',line:'What if the answers were already in your hands?',note:'The approved phone outline contracts into the official LARGA symbol. Same background; no return to the removed route graphic.'},
  {label:'02.1 · LARGA',line:'LARGA: Live Area and Route Guide Access.',note:'Official wordmark and a short masked tagline reveal.'},
  {label:'02.2 · THE APP',line:'Commuting, made clearer.',note:'The phone embeds the actual supplied app with its original UI, data and behavior. Maps and Places require the existing online setup.'},
  {label:'02.3 · GUIDE',line:'In Guide, check which jeepney serves your destination and where to board.',note:'Guide styling and stored route geometry from the supplied app. Map backdrop is schematic; boarding and destination points illustrate the interaction, not verified stops.'},
  {label:'02.4 · LIVE',line:'Live shows the vehicle moving and updates the estimated wait.',note:'Live opens the actual app Live tab. Its generated-position/feed behavior is unchanged; no production feed has been added.'},
  {label:'02.5 · TRIPS',line:'Plan from your starting point to your destination. Check the boarding steps and transfers, then save the trip for later.',note:'Guide > Plan a Trip, below Browse Routes. Demonstrate FROM/TO, Plan My Trip, expandable ride instructions, Save Trip and View in Live. Use the actual form and route planner interactively; no endpoints are prefilled by the presentation.'},
  {label:'02.6 · DISCOVER',line:"In Discover, find nearby places and go straight from a place listing to planning your ride.",note:'Local landmark preview and trip-planning interaction. No ratings, reviews, paid partnerships or walking accessibility claims are invented.'},
  {label:'02.7 · VALUE PROPOSITION',line:'See where your jeepney is, know when to head to your stop, and plan the rest of your trip in one app.',note:'Show how live vehicle location, arrival estimates and trip guidance work together.'}
 ];
 const order=[0,1,2,4,7],reelBeat=3;
 const beats=order.map((n,i)=>i===reelBeat?{label:'02 · APP DEMO',line:'Live, Guide, Trips and Discover.',note:'One automatic 30-second sequence.'}:overviewBeats[n]);
 let previousPhone=null,filmCamera=null,root,serial=0,animations=[],pending=new Set(),raf=null,driveResolve=null,samples=[],routeSamples=[],resizeObserver;
 const heads=[['',''],['',''],['COMMUTING','MADE <em class="shine-text">CLEARER.</em>'],['KNOW WHAT TO','<em>RIDE.</em>'],['KNOW <em>WHEN</em>','IT ARRIVES.'],['KNOW <em>HOW</em>','TO GET THERE.'],['<em>DISCOVER</em>','WHAT’S AROUND YOU.'],['SEE YOUR RIDE.','<em class="shine-text">PLAN YOUR TRIP.</em>']];
 const p=data.points;
 function markup(){return `<section class="scene-02 scene-root" id="scene02" data-beat="0" aria-label="The LARGA Reveal">
 <div class="reveal-backdrop"></div><div class="reveal-seed"><img src="assets/branding/larga-logo.png" alt=""><span></span></div>
 <div class="reveal-brand"><img src="assets/branding/larga-wordmark.png" alt="LARGA"><p class="brand-meaning" aria-label="Live Area and Route Guide Access"><span><b>L</b>ive <b>A</b>rea and</span> <span><b>R</b>oute <b>G</b>uide <b>A</b>ccess</span></p><p class="brand-tagline"><span>YOUR <b>RIDE</b>,</span> <span>ON <b>TRACK</b>.</span></p></div>
 <h1 class="reveal-heading"><span></span><span></span></h1>
 <div class="product-phone"><svg class="product-phone-stroke" viewBox="0 0 390 780" preserveAspectRatio="none" aria-hidden="true"><rect x="2" y="2" width="386" height="776" rx="32" pathLength="1"/></svg><div class="product-screen"><iframe class="actual-app-frame" title="Actual LARGA app" src="assets/live-app/index.html" loading="eager" allow="geolocation"></iframe><div class="app-landing"><img class="reveal-end-mark" src="assets/branding/larga-logo.png" alt="LARGA"></div></div><div class="product-speaker" aria-hidden="true"></div></div>
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
 <div class="reel-composition"></div><audio class="reel-narration" preload="auto" src="assets/audio/product-demo-film.mp3"></audio><div class="reel-copy"><span class="reel-feature"></span><h2><span></span><em></em></h2><p></p></div><div class="reveal-closing-line"></div>
 </section>`;}
 function stop(){++serial;const voice=root?.querySelector('.reel-narration');if(voice){voice.pause();voice.currentTime=0;}animations.forEach(a=>a.cancel());animations=[];pending.forEach(t=>{clearTimeout(t.id);t.resolve(false)});pending.clear();if(raf!==null)cancelAnimationFrame(raf);raf=null;driveResolve?.();driveResolve=null;root?.querySelector('.reveal-brand>img')?.style.removeProperty('visibility');root?.querySelectorAll('.reveal-bridge-ghost,.reveal-mark-morph').forEach(el=>el.remove());root?.classList.remove('reveal-entering','reveal-morphing');if(root){delete root.dataset.reelBridge;delete root.dataset.filmSection;delete root.dataset.filmLight;delete root.dataset.outro;filmCamera?.dispose();filmCamera=null;root.querySelector('.product-phone').style.removeProperty('transform');try{root.querySelector('.reel-app-screen iframe')?.contentWindow?.postMessage({type:'larga-film',id:0,fn:'stop'},'*');}catch{}}}
 function wait(ms,token){return new Promise(resolve=>{const t={id:null,resolve};t.id=setTimeout(()=>{pending.delete(t);resolve(token===serial)},ms/(window.LargaMotionRate??1));pending.add(t)});}
 function move(el,keys,options={}){const a=el.animate(keys,{duration:1100,easing:ease,fill:'none',...options});a.playbackRate=window.LargaMotionRate??1;animations.push(a);return a.finished.catch(()=>{});}
 const markPoints=['I9Ae1BzWItYc2CPYHNoi2hjcINwS3hreIt4S4BjgIOAO4hTiHOIj4g7kFuQe5AnmDuYW5h7mI+YM6BToHOgi6AnqEOoW6h7qA+wL7BDsGOwg7AHuCe4Q7hbuHu4B8AnwDvAW8B7wI/AH8g7yFvIc8iPyB/QM9BT0HPQi9Af2DvYW9hz2B/gO+BT4HPgM+hT6Gvoi+iD8NcI1xDPGLcg1yC3KNcopzDHMJc4rzjPOJ9Av0DXQKdIx0jfSK9Qz1CXWLdY11inYL9g32CvaMdol3C3cNdwn3i/eN94p4DHgJeIt4jPiJ+Qv5DXkKeYx5jfmK+gz6CfqLeo16insL+w37CvuM+4l8C3wNfAn8i/yN/Ip9DH0I/Yr9jH2I/gr+DH4I/or+jP6I/wr/DP8RLZGuES6PrxGvD6+Rr48wETAPMJCwjrEQsQ6xkDGOchAyEbIPspGyjzMRMw8zkTOOtBC0DrSQNI51EDUOdY+1kbWPthE2DzaRNo83ELcOt5C3jngQOA54j7iRuI+5EbkPOZE5jzoQug66kLqOuxA7DnuQO5G7j7wRvA88kTyPPRE9Dr2QvY6+ED4OfpA+jn8Pvw6/kL+UaxTrlGwTLJTsk60SLZOtki4ULhIulC6SrxRvEq+Ub5MwFHATMJTwkzEU8ROxkjITshIylDKSMxQzErOUc5K0FHQTNJR0kzUU9RO1lPWTthI2k7aSNxQ3EjeUN5K4FHgSuJR4kzkUeRM5lPmTuhT6E7qSOxO7EjuUO5I8FDwTPJI9E70SvZR9kz4RvpO+kj8TvxI/lD+X6JfpF+mW6hXql+qW6xVrl2uWbBfsFuyV7RftFm2VbhduFe6X7pbvFW+Xb5ZwFXCW8JXxF/EWcZVyF3IWcpfylvMV85dzlnQVdJd0lfUX9Rb1lXYXdhZ2l/aW9xX3l/eWeBV4l3iV+Rf5FvmV+hd6FnqVexb7FfuX+5X8F/wWfJT9Fn0U/Zb9lP4W/hV+l36Vfxd/Fn+bI5qlGyWaphlnGOeap5noGWiYaRnpGOmaqZnqGGqaKplrGqsZ65jsGiwZbJhtGi0Y7Zqtme4YbpoumW8Yb5nvmPAasBlwmHEaMRlxmrGZ8hjymjKZcxhzmfOY9Bq0GfSYdRo1GXWatZn2GPaatpl3GHeaN5j4GrgZ+Jh5GjkZeZh6GfoY+pq6mXsYe5o7mXwYfJh9GP2dBt0I3IvcjVyPXJFck1yUXJVcllwXXBhcGVwaXJrcm9yc3B3cHtugG6CcIRyhm6KboxwjnKQcpJulm6YbppsnGyebKByoHKicqRypnCocKpwrG6ubrBusmy0bLZsuGy6crpyvHK+cMBwwnDEcMZuyG7KbsxszmzQbNJy0nLUctZy2HDacNxw3m7gbuJu5G7mbOhs6m7seAV2C3YPeBF4FXgZeB12IXYldil2K3gtdDF2M3Y1eDd0O3Q9dj94QXhDdEd2SXhLeE10UXZTdlV4V3Rbdl12X3hhdGV0Z3ZpeGt0b3RxdnN4dXh3dHt2fXaAeIJ0hnaIdop4jHSQdJJ2lHSYdJx2nnaidqZ0qnSudLJ2tHa4drx2wHTEdMh0zHbOdtJ21nbadN504nTmfAF+A3oHegl8C34NehF6E3wVfhd6G3ofeiN6J3wpfC18MXo1ejl6PXw/fEN8R3xLek96U3pXfFl8XXxhfGV6aXptenF8c3x3fHt8gHqEeoh6jHyOfJJ6lnqYfJp4nnqgeqJ8pHioeKp6rHyueLJ4tHq2fLh8uni+esB6wnzEeMh6ynrMfM540njUetZ82HjceN564HzigQOBB4ELgA+AE4AXgRmBG34fgCGAI4ElfimAK4AtgS9+M341gDeBOYE7fj+AQYFDgUV+SYBLgE2BT35TgFWAV4FZfl1+X4BhgWN+Z35pgGuBbYFvfnOAdYB3gXl+fYCAgIJ+hn6KgIyAkICUgJh+nH6gfqSApoCqgK5+sn62frp+voDAgMSAyH7MftB+1H7YgNqA3n7+gweHCYMNgw+FEYUVhRmDHYMhgyWFJ4UrhS+FM4M3gzuDP4VBhUWFSYNNg1GDVYNZhVuFX4Vjg2eDa4Nvg3OFdYV5hX2DgoWEgYiDioOMhY6BkoGUg5aFmIWagZ6DoIWihaSBqIOqg6yFroGyg7SDtoW4gbyBvoPAhcKFxIHIg8qFzIXOgdKD1IPWhdiB3IP2g/iF+oH+iQ2HEYkTixWLF4cbiR2JH4shhyWJJ4kpiyuHL4cxiTOLNYc5hzuJPYs/i0GHRYlHi0mLS4dPiVGLU4tVh1mJW4ldi1+HY4lliWeLaYdth2+JcYtzh3eHeYl7i32LgIeEiYaLiIeMh5CHlIeYiZqJnomih6aHqoeuh7KJtIm4ibyHwIfEh8iHzInOidKJ1ofah/SH+If8jRORFY0ZjRuPHZEfjSONJY8nkSmRK40vjzGNNY83jzuPP41DjUeNS49Nj1GPVY9ZjV2NYY1lj2ePa49vj3ONd417jYCPgo+GjYqPjI+Oi5KNlI2Wj5iLnIuejaCPooumi6iNqo+sj66Lso20j7aPuIu8jb6NwI/Ci8aLyI3Kj8yL0IvSjdSL2I/si/CN8o/0j/aL+o38kxuTH5MjlSWVKZUtlTGVM5E3kzmTO5U9kUGTQ5NFlUeRS5FNk0+VUZVTkVeTWZVblV2RYZNjk2WVZ5Frk22Tb5VxkXWRd5N5lXuRgJGCk4SVhpWIkYyTjpOQlZKRlpOYk5qVnJGgkaKTpJWmkaqRrJOulbCVspG2k7iTupW8k8CTxJHIkcyR0JPSk+iT7JPwkfSR+JH8lyGXJZgnmCmaK5cvmDGYM5o1lzmXO5g9mj+XQ5dFmEeaSZpLl0+YUZhTmlWXWZhbmF2aX5djl2WYZ5ppl22Xb5hxmnOadZd5mHuafZqAl4SYhpiImIyYkJeUl5iXnJegmKKYppiql66Xspe2l7qYvJXAl8KXxJjGlcqVzJfOmNCV5JXml+iY6pjslfCX8pj0mPaV+pf8nCmeLaAvoDGcNZ43oDmgO5w/nkGeQ6BFnEmeS55NoE+cU5xVnlegWaBbnF+eYaBjoGWcaZxtnm+ec553nnucgJyEmoiaipyMno6akpqUnJaemJ6amp6coJyinqSaqJyqnKyerpqymrSctp64mryavpzAnsKexJrInMqczJ7OnuCa5JrmnOie6p7smvCc8p70nvaa+pz8ojOiN6Q5pDumPaJBpEOkRaZHokuiTaRPplGiVaJXpFmmW6ZdomGkY6Rlommka6BvoHGic6R1pHege6J9pICkgqCGooiiiqSMoJCikqKUpJagmqCcop6koKSioKaiqKSqpKygsKKyorSktqC6oryivqTAoMSgxqLIpMqk2qDeouCk4qTkoOii6qLspO6g8qL0ovak+KD8qD2oQapDqkWsR6hLqk2qT6xRqFWoV6pZrFuoX6hhqmOqZahnqGmoa6Ztpm+mcaZzrHOsdax3qnmqe6p9qoCogqiEqIamiKaKpoymjqyOrJCskqqUqpaqmKiaqJyonqigpqKopKqmqqimrKiuqrCqsqa2qLiouqq8psCmwqjEqsamyqjaqtym4KbiqOSq5qbqpuyo7qbyrkeuS69Nrk+uUa5TrlWzVbNXs1mxW7FdsV+xYa9jr2WvZ65prmuubbNts2+zcbNzsXWxd7F5r3uvfa+Ar4KuhK6GroiziLOKs4yzjrGQsZKxlK+WsZiunK6er6Cvoq+krqauqK6qrKysrqywrLKxsrG0sbavuK+6r7yuvq7ArsKuxKzGsdax2K/ar9yv3q/gruKu5KzotVO3V7lZuVu5Xblft2G9YbtjuWW1Z71nu2m5a7VtvW27b7dxtXO9c7l1t3e1eb15uXu3fbWAu4C5greEtYa7hrmIt4q9iruMuY63kL2Qu5K7lLeWtZizmrmat5y1nrOguaC3orWku6S5preotaq7qrmst66zsLuwubK1tLO2u7a5uLW6s7y7vLe+tcCz1rfYs9qz3LXev2PBZ79rxWvFbcVvw3G/c8Zzw3XIdcV3wXnIecN7v33GfcGAyIDFgr+ExoTDhr+IxYjBisiKw4y/jsaOw5DIkMOSvZTDlL2WxZa/mMWYv5rGmr+cxpzBnsaewaDIoMOiyKLDpL2mw6a9qMWov6rFqr+sxqzBrr2wxbC/ssayw7TBtr+4vbzDzL/Oxs7D0Mb0w/jF+sX8ynfMe8qAyoLKhNKE0IbMiNSI0IrKjNKMzI7UjsqQ0pDMktKSzJTUlMyW1JbQmMya0prOnMye0p7QoNCizqTMpsyo1qrKrNau1rDYsti01LrUvNK+0MDQwszEysbKyMrKyszY3tTi0uTQ5tjm1OjM6tTqzOzS7Mru0u7I8NDwyPLQ8tbyzvTW9Mz21PbM+NT4yvrS+sr82pjanNqg2qLhpOOm5ajjquWs567lsOWy5bTltuO447rjvOm86b7pwOfC5cTjxuHI58jlyuPM6czlzuHQ3dLj0t/U59Tf1ufW4dja2t/a59rf3OXc3d7l3tzg4+Dc4uPi2uTh5Nrm3+bn5t/o5+jd6uXq3ezj7Nru4e7n7t3w5fDc8uHy2PTf9OX03Pbj9tr43/jn+N3667TtuOu87b7rwOvC88LvxO3G9MbxyOvK88rtzPPM7c70zuvQ8dD40O/S9NLr1PPU+tTt1vTW6djx2PbY6drx2vba6dzx3Pjc6d7x3vje/t7v4Pbg/uDt4vTi/OLr5PPk+uTr5vHm+Obp6PHo9uj+6O/q9Or86u3s9Oz67Ovu8+747uvw8/D68Ovy8/L68u309PTt9un4','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'];
 function morphWordmark(sourceBox,token,light){
  const mark=root.querySelector('.reveal-seed img'),word=root.querySelector('.reveal-brand>img');
  const rect=root.getBoundingClientRect(),dest=word.getBoundingClientRect();
  const canvas=document.createElement('canvas');
  canvas.className='reveal-mark-morph';canvas.setAttribute('aria-hidden','true');
  const paint=canvas.getContext('2d');
  if(!paint||!mark.naturalWidth||!word.naturalWidth||!sourceBox.width||!dest.width)return null;
  const ratio=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);
  paint.setTransform(ratio,0,0,ratio,0,0);
  const start=[sourceBox.left-rect.left,sourceBox.top-rect.top,sourceBox.width,sourceBox.height];
  const end=[dest.left-rect.left,dest.top-rect.top,dest.width,dest.height];
  const from=atob(markPoints[0]),to=atob(markPoints[1]),count=from.length/2;
  const points=new Float32Array(count*6);
  for(let i=0;i<count;i++){
   const a=i*2,j=i*6;
   const tx=to.charCodeAt(a)/255;
   const x=start[0]+from.charCodeAt(a)/255*start[2],y=start[1]+from.charCodeAt(a+1)/255*start[3];
   points[j]=x;points[j+1]=y;
   points[j+2]=end[0]+tx*end[2]-x;points[j+3]=end[1]+to.charCodeAt(a+1)/255*end[3]-y;
   points[j+4]=(tx-.5)*.11;points[j+5]=Math.sin(i*2.39996)*rect.height*.015;
  }
  const duration=2460,began=performance.now(),rate=window.LargaMotionRate??1;
  const smooth=t=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);};
  const px=rect.width/1280;
  root.style.setProperty('--morph-light-opacity',light.opacity);
  root.style.setProperty('--morph-light-transform',light.transform);
  root.style.setProperty('--morph-light-time',duration/rate+'ms');
  root.classList.add('reveal-morphing');
  root.append(canvas);word.style.visibility='hidden';
  return new Promise(resolve=>{
   driveResolve=resolve;
   const tick=now=>{
    if(token!==serial){resolve();return;}
    const t=Math.min(1,(now-began)*rate/duration);
    const sourceAlpha=1-smooth((t-.04)/.29),wordAlpha=smooth((t-.66)/.34);
    paint.clearRect(0,0,rect.width,rect.height);
    if(sourceAlpha>0){paint.globalAlpha=sourceAlpha;paint.drawImage(mark,...start);}
    paint.globalAlpha=smooth(t/.24)*(1-wordAlpha);
    paint.fillStyle='#e85e00';
    const arc=Math.sin(t*Math.PI),size=px*(.85+.63*smooth(t));
    for(let j=0;j<points.length;j+=6){
     const u=smooth((t-.07-points[j+4])/.84);
     paint.fillRect(points[j]+points[j+2]*u-size,points[j+1]+points[j+3]*u+arc*points[j+5]-size,size*2,size*2);
    }
    if(wordAlpha>0){paint.globalAlpha=wordAlpha;paint.drawImage(word,...end);}
    if(t<1){raf=requestAnimationFrame(tick);return;}
    word.style.removeProperty('visibility');canvas.remove();
    root.classList.remove('reveal-morphing');raf=null;driveResolve=null;resolve();
   };
   tick(began);
  });
 }

 function shine(el){const fill='linear-gradient(105deg,#ff7919 35%,#ffd1a0 46%,#ffffff 50%,#ffd1a0 54%,#ff7919 65%)';return move(el,[{backgroundImage:fill,backgroundSize:'300% 100%',backgroundPosition:'150% 0',color:'transparent'},{backgroundImage:fill,backgroundSize:'300% 100%',backgroundPosition:'-150% 0',color:'transparent'}],{duration:1050,delay:550,fill:'none',easing:'ease-in-out'})}
 function measure(selector){return root.querySelector(selector).getBoundingClientRect();}
 function reframe(selector,before,duration=1200){const el=root.querySelector(selector),after=el.getBoundingClientRect();const dx=(before.left+before.width/2)-(after.left+after.width/2),dy=(before.top+before.height/2)-(after.top+after.height/2);return move(el,[{transform:`translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${before.width/Math.max(1,after.width)},${before.height/Math.max(1,after.height)})`},{transform:'translate(-50%,-50%) translate(0,0) scale(1)'}],{duration});}
 function updateSize(){const screen=root.querySelector('.product-screen'),phone=root.querySelector('.product-phone'),scale=Math.max(.001,screen.clientWidth/390);phone.style.setProperty('--preview-scale',String(scale));root.querySelector('.actual-app-frame').style.height=(screen.clientHeight/scale)+'px';}
 function screen(n){const view=n===4?'live':n===5?'planner':n===6?'discover':(n===2||n===7)?'landing':'guide';root.dataset.appView=view;root.querySelector('.app-landing').hidden=view!=='landing'||n===2||root.dataset.reel==='true';if(view!=='landing')root.querySelector('.actual-app-frame').contentWindow?.postMessage({type:'larga-embedded-view',view},location.origin);}

 function positionVehicle(progress){if(!samples.length)return;const t=progress*256,index=Math.min(255,Math.floor(t)),a=samples[index],b=samples[index+1],f=t-index,x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f;root.querySelector('#revealJeep').setAttribute('transform',`translate(${x} ${y}) rotate(${Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI})`);root.querySelector('.vehicle-eta-badge').setAttribute('transform','rotate('+(-Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI)+')');root.querySelector('#revealLiveLink').setAttribute('x2',x);root.querySelector('#revealLiveLink').setAttribute('y2',y);}
 function drive(token){const start=performance.now();return new Promise(resolve=>{driveResolve=resolve;const tick=now=>{if(token!==serial){resolve();return;}const t=Math.min(1,(((now-start)*(window.LargaMotionRate??1)))/1450),e=t*t*(3-2*t);positionVehicle(.12+.3*e);if(t<1)raf=requestAnimationFrame(tick);else{raf=null;driveResolve=null;resolve()}};tick(start)});}
 function baseState(n){root.dataset.beat=String(n);const routeIndex=n===4?1:n===5?2:0;root.querySelector('#revealRoute').setAttribute('d',data.routes[routeIndex].path);if(routeSamples.length)samples=routeSamples[routeIndex];if(samples.length){const first=data.routes[0].path.match(/^M([\d.]+) ([\d.]+)/),origin=n===4?samples[0]:{x:+first[1],y:+first[2]};root.querySelector('.origin-point').setAttribute('transform',`translate(${origin.x} ${origin.y})`);root.querySelector('#revealLiveLink').setAttribute('x1',origin.x);root.querySelector('#revealLiveLink').setAttribute('y1',origin.y);}const heading=root.querySelector('.reveal-heading');heading.children[0].innerHTML=heads[n][0];heading.children[1].innerHTML=heads[n][1];updateSize();screen(n);if(n===2)window.LargaCenteredReel.command(root.querySelector('.reel-composition'),'splash');if(n===4)positionVehicle(.42);}
 function mount(host){host.innerHTML=markup();root=host.querySelector('#scene02');const path=root.querySelector('#revealRoute');routeSamples=data.routes.map(r=>{path.setAttribute('d',r.path);const len=path.getTotalLength();return Array.from({length:257},(_,i)=>path.getPointAtLength(len*i/256))});samples=routeSamples[0];root.querySelector('.actual-app-frame').addEventListener('load',()=>screen(Number(root.dataset.beat)));window.addEventListener('message',e=>{if(e.source!==root.querySelector('.actual-app-frame').contentWindow||e.origin!==location.origin)return;if(e.data?.type==='larga-embedded-ready')screen(Number(root.dataset.beat));if(e.data?.type==='larga-embedded-key')document.dispatchEvent(new KeyboardEvent('keydown',{code:e.data.code,bubbles:true}));});baseState(0);window.LargaCenteredReel.prepare(root.querySelector('.reel-composition'));resizeObserver=new ResizeObserver(updateSize);resizeObserver.observe(root.querySelector('.product-phone'));}
 function state(n){root.dataset.reel=String(n===reelBeat);root.dataset.demo='false';root.dataset.step=String(n);if(n===reelBeat){const host=root.querySelector('.reel-composition');host.dataset.mode='welcome';delete host.dataset.kicker;delete host.dataset.sim;root.querySelector('.app-landing').hidden=true;window.LargaCenteredReel.prepare(host);}else baseState(order[n]);}
 function setBeat(n){stop();state(n);}
 async function baseTransition(n,from){
  stop();const token=serial,phoneBefore=previousPhone||measure('.product-phone'),brandBefore=measure('.reveal-brand'),mapBefore=measure('.reveal-map'),markBefore=measure('.reveal-seed img');
  const lightStyle=getComputedStyle(root.querySelector('.reveal-backdrop'),'::before');
  const light={opacity:lightStyle.opacity,transform:lightStyle.transform};
  previousPhone=null;baseState(n);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(n<from){await Promise.all([reframe('.product-phone',phoneBefore,850),reframe('.reveal-brand',brandBefore,850),reframe('.reveal-map',mapBefore,850)]);return;}
  const tasks=[];
  if(n===1){
    const morph=from===0?morphWordmark(markBefore,token,light):null;
    tasks.push(morph||move(root.querySelector('.reveal-brand>img'),[{opacity:0},{opacity:1}],{duration:900,fill:'both',easing:out}));
    root.querySelectorAll('.reveal-brand .brand-meaning>span').forEach((el,i)=>tasks.push(move(el,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:(morph?2120:550)+i*130,fill:'backwards',easing:out})));
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
 // Trigger 18: one automatic 29.6 s product film. Timing lives in film/timeline.py (picture steps and sound cues from one
 // table); the narration, music and sound effects are pre-mixed into assets/audio/product-demo-film.mp3 on the same clock.
 const FILM_END=29.6;
 const FILM_STEPS=[[0.093,"call","prewarm"],[1.067,"cam","wide:1.08","push",{"duration":2500,"easing":"cubic-bezier(.35,0,.3,1)"}],[3.45,"call","cover",null],[3.71,"goto","open"],[3.727,"cam","wide:1","cut"],[3.753,"call","uncover"],[3.823,"sec","live"],[3.866,"cam","tab-0","push",{"level":1.42,"duration":1250,"easing":"cubic-bezier(.45,0,.25,1)"}],[4.959,"call","press","tab-0"],[4.978,"kick","LIVE"],[5.051,"goto","tab:0"],[5.088,"cam","live-card","push",{"level":1.42,"duration":800,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[6.467,"call","press","live-select"],[6.522,"call","step","live-select"],[6.577,"goto","live-map"],[6.614,"cam","live-map","push",{"level":1.65,"duration":1000,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[6.885,"sim",true],[8.544,"call","lift","live-eta",6],[8.553,"cam","live-eta","push",{"level":1.9,"duration":1000,"easing":"cubic-bezier(.65,0,.35,1)"}],[9.65,"call","unlift"],[9.65,"sim",false],[9.697,"cam","tab-1","pan",{"level":1.42,"duration":1000,"easing":"cubic-bezier(.65,0,.35,1)"}],[10.778,"call","press","tab-1"],[10.797,"sec","guide"],[10.797,"kick","GUIDE"],[10.872,"goto","tab:1"],[10.91,"cam","guide-card","push",{"level":1.42,"duration":850,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[11.953,"cam","guide-card","push",{"level":1.5,"duration":500,"easing":"cubic-bezier(.65,0,.35,1)"}],[12.556,"call","press","guide-more"],[12.612,"call","step","guide-more"],[13.128,"cam","guide-landmark","push",{"level":1.9,"duration":1100,"easing":"cubic-bezier(.65,0,.35,1)"}],[13.598,"call","lift","guide-landmark",5],[14.35,"call","unlift"],[14.4,"cam","tab-2","pan",{"level":1.42,"duration":950,"easing":"cubic-bezier(.65,0,.35,1)"}],[15.45,"call","press","tab-2"],[15.47,"sec","trips"],[15.47,"kick","TRIPS"],[15.55,"goto","trips"],[15.59,"cam","trips-intro","push",{"level":1.42,"duration":700,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[16.65,"call","press","new-trip"],[16.75,"goto","new-trip"],[16.79,"cam","form","push",{"level":1.65,"duration":700,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[17.3,"call","step","type-from"],[18.1,"call","step","type-to"],[19.35,"call","press","plan"],[19.42,"goto","plan"],[19.456,"cam","getoff","push",{"level":1.65,"duration":900,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[19.966,"call","lift","getoff",6],[20.538,"call","unlift"],[20.556,"cam","save","pan",{"level":1.65,"duration":600,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[21.172,"call","press","save"],[21.224,"call","step","save"],[21.26,"cam","save-submit","pan",{"level":1.65,"duration":550,"easing":"cubic-bezier(.65,0,.35,1)"}],[21.911,"call","press","save-submit"],[21.999,"goto","saved"],[22.034,"cam","saved-dest","push",{"level":1.9,"duration":700,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[22.342,"call","lift","saved-dest",8],[22.65,"call","unlift"],[22.669,"cam","tab-3","pan",{"level":1.42,"duration":650,"easing":"cubic-bezier(.65,0,.35,1)"}],[23.393,"call","press","tab-3"],[23.412,"sec","discover"],[23.412,"kick","DISCOVER"],[23.487,"goto","tab:3"],[23.524,"cam","discover-input","push",{"level":1.65,"duration":550,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[23.864,"call","step","type-search"],[24.892,"cam","discover-card","pan",{"level":1.65,"duration":650,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[25.358,"call","lift","discover-name",8],[25.685,"call","unlift"],[25.685,"cam","discover-plan","pan",{"level":1.65,"duration":350,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[26.059,"call","press","discover-plan"],[26.115,"call","step","discover-plan"],[26.152,"cam","choose-start","pan",{"level":1.65,"duration":300,"easing":"cubic-bezier(.65,0,.35,1)"}],[26.45,"call","press","choose-start"],[26.525,"goto","choose-start"],[26.562,"cam","to","push",{"level":1.9,"duration":650,"scroll":true,"easing":"cubic-bezier(.65,0,.35,1)"}],[27.086,"call","lift","to",8],[27.78,"call","unlift"],[27.78,"kick",null],[27.78,"sec",null],[27.8,"cam","wide:1","push",{"duration":1600,"easing":"cubic-bezier(.45,0,.2,1)"}],[27.9,"mode","end"],[28.6,"outro",true]];
 async function playReel(from){
  const phone=root.querySelector('.product-phone');
  const previous=from===2?phone.getBoundingClientRect():null;
  setBeat(reelBeat);
  const token=serial,voice=root.querySelector('.reel-narration'),host=root.querySelector('.reel-composition');
  const reel=window.LargaCenteredReel,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cam=reel.camera(root);filmCamera=cam;
  const alive=()=>token===serial;
  const call=(fn,...args)=>reel.rpc(host,fn,...args);
  const set=(k,v)=>{if(v===undefined||v===false||v===null)delete host.dataset[k];else host.dataset[k]=String(v);};
  // First frame: exactly trigger 17's phone (same size, place and splash), then glide to centre.
  const start=previous?.width?cam.fromRect(previous):cam.wide(1);
  cam.set(start);
  delete root.dataset.filmSection;delete root.dataset.filmLight;set('kicker');set('sim');set('mode','welcome');
  if(previous?.width&&!reduced){
   root.dataset.reelBridge='true';
   move(root.querySelector('.reveal-heading'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-1.2cqh)'}],{duration:700,fill:'forwards',easing:out});
  }
  cam.go(cam.wide(1),'glide',{duration:1150});
  const started=performance.now();
  const clock=()=>(!voice.paused&&voice.currentTime>0)?voice.currentTime*1000:performance.now()-started;
  const at=ms=>new Promise(resolve=>{
   const check=()=>{if(!alive())return resolve(false);const left=ms-clock();if(left<=6)return resolve(true);
    const t={id:setTimeout(()=>{pending.delete(t);check();},Math.min(left,16)),resolve};pending.add(t);};
   check();
  });
  for(let attempt=0;attempt<40&&!(await reel.ready(host));attempt++){if(!alive()||!await wait(120,token))return;}
  if(!alive())return;
  call('splash');
  voice.currentTime=0;
  voice.muted=Boolean(window.LargaPresentation?.getState().muted);
  void voice.play().catch(()=>{});
  async function frameBox(name){
   for(let i=0;i<8;i++){const b=await call('box',name);if(b||!alive())return b;await wait(80,token);}
   return null;
  }
  async function shot(spec,kind,opts={}){
   let next;
   if(spec.startsWith('wide:'))next=cam.wide(+spec.slice(5));
   else{
    let b;
    if(opts.scroll){b=await call('frame',spec,'center',opts.duration||800,opts.easing||null);}
    if(!b)b=await frameBox(spec);
    if(!alive()||!b)return;next=cam.target(b,opts);
   }
   window.__filmShot={spec,kind,at:clock()};
   cam.go(next,kind,opts);
  }
  for(const [t,op,...args] of FILM_STEPS){
   if(!await at(t*1000))return;
   if(t>1.3)delete root.dataset.reelBridge;
   switch(op){
    case 'cam':await shot(args[0],args[1],args[2]||{});break;
    case 'call':call(...args);break;
    case 'goto':await call('go',args[0]);break;
    case 'sec':if(args[0]){root.dataset.filmSection=args[0];root.dataset.filmLight=args[0];}else{delete root.dataset.filmSection;root.dataset.filmLight='end';}break;
    case 'kick':if(args[0]){host.querySelector('.film-kicker span').textContent=args[0];set('kicker',true);const label=args[0];setTimeout(()=>{if(alive()&&host.querySelector('.film-kicker span').textContent===label)set('kicker');},1700);}else set('kicker');break;
    case 'sim':set('sim',args[0]);break;
    case 'mode':set('mode',args[0]);break;
    case 'outro':{
     root.dataset.outro='true';
     const land=root.querySelector('.app-landing');land.hidden=false;
     if(!reduced)move(land,[{opacity:0},{opacity:1}],{duration:900,easing:'ease-in-out',fill:'backwards'});
     break;}
   }
   if(!alive())return;
  }
  await at(FILM_END*1000);
 }

 async function transitionTo(n,from){
  if(n===reelBeat){await playReel(from);return;}
  if(n===2)window.LargaCenteredReel.command(root.querySelector('.reel-composition'),'splash');
  if(from===reelBeat){
   // Exit into trigger 19: the settled phone glides into its closing position while the app gives way to the mark.
   const phone=root.querySelector('.product-phone'),screenApp=root.querySelector('.reel-app-screen iframe');
   const token=serial,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const before=phone.getBoundingClientRect();
   if(!reduced)await move(screenApp,[{opacity:1},{opacity:0}],{duration:300,easing:out,fill:'forwards'});
   if(token!==serial)return;
   setBeat(n);
   screenApp.getAnimations().forEach(a=>a.cancel());
   if(!reduced)await Promise.all([reframe('.product-phone',before,950),move(root.querySelector('.reveal-heading'),[{opacity:0,transform:'translateY(1.5cqh)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:620,fill:'backwards',easing:out})]);
   return;
  }

  previousPhone=measure('.product-phone');
  root.dataset.reel='false';root.dataset.demo='false';
  await baseTransition(order[n],order[from]);
  if(root.dataset.beat===String(order[n]))root.dataset.step=String(n);
 }
 async function enterFrom(research){
  stop();state(0);
  const token=serial;
  const backdrop=research.querySelector('.research-background');
  if(backdrop){const copy=backdrop.cloneNode(true);copy.removeAttribute('id');root.querySelector('.reveal-backdrop').replaceChildren(copy);}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  // let the research slide show through while the reveal backdrop fades in (no dark dip)
  const scene=root;scene.style.background='transparent';
  const symbol=root.querySelector('.reveal-seed');
  await Promise.all([
   move(research.querySelector('.research-interpretation'),[{opacity:1},{opacity:0}],{duration:1250,easing:'ease-in-out',fill:'forwards'}),
   move(root.querySelector('.reveal-backdrop'),[{opacity:0},{opacity:1}],{duration:1690,easing:'ease-in-out',fill:'both'}),
   move(symbol,[{opacity:0,transform:'translate(-50%,-50%) scale(.84)'},{opacity:.88,transform:'translate(-50%,-50%) scale(.98)',offset:.7},{opacity:1,transform:'translate(-50%,-50%) scale(1)'}],{duration:1630,delay:410,fill:'both',easing:'cubic-bezier(.32,0,.22,1)'})
  ]);
  scene.style.removeProperty('background');
  if(token===serial)root.classList.remove('reveal-entering');
 }
 window.LargaScenes=window.LargaScenes||{};window.LargaScenes.scene02={id:'02',name:'THE LARGA REVEAL',beats,mount,setBeat,transitionTo,enterFrom,stop,isReel(n){return n===reelBeat},playReel};
})();


