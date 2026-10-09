// Cache only the local application shell and already visited local assets.
// Google responses, Places data, and the map key are never cached here.
const CACHE='larga-shell-place-plan-v5';
const SHELL=['./index.html','./script.js','./style.css'];
const LOCAL_ASSETS=['./Assets/larga-logo.png','./Assets/larga-wordmark.png','./Assets/intro-tracking.png','./Assets/intro-eta.png','./Assets/intro-commute.png','./Assets/google-icon.svg','./Assets/apple-icon.svg','./Assets/Fonts/GeneralSans-Variable.woff2','./Assets/Fonts/Montserrat-VariableFont_wght.ttf'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{await cache.addAll(SHELL);await Promise.allSettled(LOCAL_ASSETS.map(path=>cache.add(path)));}).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('larga-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||/maps-demo-key\.txt$/i.test(url.pathname))return;
 const localAsset=/\/Assets\//i.test(url.pathname),shell=/\/(index\.html|script\.js|style\.css)$/.test(url.pathname),navigation=request.mode==='navigate';
 if(!localAsset&&!shell&&!navigation)return;
 event.respondWith(fetch(request).then(response=>{if(response.ok&&(localAsset||shell)){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;}).catch(async()=>{const stored=await caches.match(request);if(stored)return stored;if(navigation)return caches.match('./index.html');return Response.error();}));
});
