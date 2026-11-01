(()=>{'use strict';
const $=id=>document.getElementById(id),q=new URLSearchParams(location.search),park=q.get('park')||'kingdoms';
const config={kingdoms:{name:'KAEVORYN KINGDOMS',title:'DRAGON’S WRATH',intro:'Climb aboard and fly into the heart of a storm above the enchanted kingdom.',color:'#7eeaff',acts:[['THE GATES OPEN','The dragon launches from the Citadel. Hold on — your flight is beginning.'],['ABOVE THE KINGDOM','Soar past towering castles as the clouds race beneath your wings.'],['INTO THE STORM','Lightning splits the sky. The dragon banks through the swirling clouds.'],['THE FIRE FLIGHT','A wall of storm clouds blocks the way. The dragon unleashes a blazing path.'],['THE CITADEL REVEALED','The storm clears. The enchanted kingdom glows beneath you.']]},
beyond:{name:'KAEVORYN BEYOND',title:'PORTAL BREAKER',intro:'Fly through unstable gateways and discover a universe that changes around you.',color:'#c1a8ff',acts:[['PORTAL IGNITION','A gateway opens and pulls you into the unknown.'],['WORLDS IN FLIGHT','Strange worlds drift past as you race between dimensions.'],['THE FRACTURE','Reality bends. Hold steady as the portal storm surrounds you.'],['ENERGY SURGE','A burst of light tears open the final gateway.'],['A NEW HORIZON','You emerge above a world no one has seen before.']]},
afterdark:{name:'KAEVORYN AFTERDARK',title:'THE NIGHT FLIGHT',intro:'Take a suspenseful flight over a mysterious world after the lights go out.',color:'#ff7caa',acts:[['NIGHTFALL','A shadow crosses the moon. Something rises into the night.'],['OVER THE FORGOTTEN','Fly above silent towers and forests lost to time.'],['THE SHADOW STORM','Dark clouds close in. A strange light follows your flight.'],['THE ESCAPE','A burst of fire lights the way through the darkness.'],['DAWN RETURNS','The horizon brightens. You have escaped the unknown.']]}};
const p=config[park]||config.kingdoms;document.documentElement.style.setProperty('--accent',p.color);
$('ridePark').textContent=p.name+' · VIRTUAL ATTRACTION';$('rideName').textContent=p.title;$('rideIntro').textContent=p.intro;$('parkBack').href=park==='kingdoms'?'kingdoms.html':park+'.html';$('backToPark').href=$('parkBack').href;$('backToPark').textContent='Return to '+p.name.replace('KAEVORYN ','')+' ↗';document.title=p.title+' — Kaevoryn Studios';
const canvas=$('rideCanvas'),ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,active=false,finished=false,act=0,elapsed=0,last=0,raf=0,muted=true,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const duration=9500;
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw(0)}
function path(points,fill,stroke=null,lw=1){ctx.beginPath();points.forEach((pt,i)=>i?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function ellipse(x,y,rx,ry,rot,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function dragon(t){const scale=Math.min(w/760,h/440),cx=w*.53,cy=h*.52,flap=Math.sin(t*.008)*.55,bank=Math.sin(t*.0015)*.10;
ctx.save();ctx.translate(cx,cy+Math.sin(t*.003)*8);ctx.rotate(bank);ctx.scale(scale,scale);
// tail, clearly attached to body
ctx.strokeStyle='#174b50';ctx.lineWidth=19;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-75,15);ctx.quadraticCurveTo(-145,35,-205,2+Math.sin(t*.004)*15);ctx.stroke();path([[-205,2],[-229,-8],[-215,13]],'#72c9a7');
// rear wing on far side, flapping
ctx.save();ctx.translate(-25,-17);ctx.rotate(-.2-flap*.55);path([[0,0],[-45,-115],[-125,-155],[-99,-77],[-166,-105],[-119,-34],[-65,18]],'#276d70','#8ad6c2',3);ctx.restore();
// body
ellipse(-5,12,91,39, -.06,'#237a78');ellipse(25,25,52,24,-.1,'#399889');
// belly plates
for(let i=0;i<4;i++){ctx.strokeStyle='#a4dfb9';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-35+i*23,35);ctx.quadraticCurveTo(-10+i*22,47,8+i*22,35);ctx.stroke()}
// legs
ctx.strokeStyle='#1a5559';ctx.lineWidth=17;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-48,29);ctx.lineTo(-60,66);ctx.lineTo(-42,73);ctx.moveTo(47,29);ctx.lineTo(60,62);ctx.lineTo(78,66);ctx.stroke();
// near wing, articulated fan silhouette
ctx.save();ctx.translate(-2,-12);ctx.rotate(-.1+flap);path([[0,0],[-22,-118],[-10,-178],[20,-137],[52,-204],[62,-125],[111,-169],[96,-92],[139,-105],[82,-35],[34,13]],'#328f83','#a2e7ce',4);
ctx.strokeStyle='#a2e7ce';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-10,-178);ctx.moveTo(0,0);ctx.lineTo(52,-204);ctx.moveTo(0,0);ctx.lineTo(111,-169);ctx.moveTo(0,0);ctx.lineTo(139,-105);ctx.stroke();ctx.restore();
// neck and head
ctx.strokeStyle='#2b8880';ctx.lineWidth=30;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(52,2);ctx.quadraticCurveTo(91,-24,110,-56);ctx.stroke();ellipse(120,-62,36,24,-.18,'#4ab49a');path([[133,-70],[174,-62],[149,-49]],'#4ab49a');path([[110,-80],[100,-103],[124,-86]],'#b4e9bd');path([[134,-79],[139,-102],[150,-76]],'#b4e9bd');ellipse(132,-67,4,4,'#06131c');ellipse(133,-67,1.5,2,'#ffffff');
ctx.restore();
}
function draw(t){if(!w||!h)return;const storm=act>=2,night=park==='afterdark',space=park==='beyond';const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,night?'#09091d':space?'#090d31':'#0b2948');sky.addColorStop(.6,night?'#40203d':space?'#29275e':'#24718a');sky.addColorStop(1,'#b0d9d4');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
if(!night&&!space){const sun=ctx.createRadialGradient(w*.75,h*.23,2,w*.75,h*.23,110);sun.addColorStop(0,'#fff8cf');sun.addColorStop(1,'#fff8cf00');ctx.fillStyle=sun;ctx.fillRect(0,0,w,h)}
// distant clouds and layered moving scenery
for(let layer=0;layer<3;layer++){const y=h*(.28+layer*.15);for(let i=0;i<7;i++){const speed=(layer+1)*.012, x=((i*190-t*speed)%(w+260)+w+260)%(w+260)-100;ctx.fillStyle=layer===0?'#d9f3f233':layer===1?'#c5e9e755':'#effbfa99';ellipse(x,y+Math.sin(i*3)*12,55+layer*20,15+layer*5,0,ctx.fillStyle)}}
if(storm){ctx.fillStyle='#17243d88';for(let i=0;i<8;i++){const x=((i*170-t*.08)%(w+200)+w+200)%(w+200)-80;ellipse(x,h*.2+(i%3)*22,70,30,0,'#18243d99')}if(Math.sin(t*.007)>0.92){ctx.strokeStyle='#c5edff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(w*.18,h*.05);ctx.lineTo(w*.24,h*.25);ctx.lineTo(w*.2,h*.33);ctx.stroke()}}
if(!space){ // kingdom castle towers scrolling by
for(let i=0;i<5;i++){const x=((i*245-t*.045)%(w+220)+w+220)%(w+220)-100,base=h*.78,ht=65+(i%3)*32;ctx.fillStyle=night?'#171327':'#263c58';ctx.fillRect(x,base-ht,48,ht);path([[x-8,base-ht],[x+24,base-ht-36],[x+56,base-ht]],night?'#261832':'#45617c');ctx.fillStyle='#f5d99a';ctx.fillRect(x+19,base-ht+22,9,17)}}
else{for(let i=0;i<5;i++){const x=((i*210-t*.04)%(w+200)+w+200)%(w+200)-90,y=h*(.25+(i%3)*.15);ctx.strokeStyle='#c2b5ff';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y,28,58,0,0,Math.PI*2);ctx.stroke()}}
dragon(t);
// ride streaks create forward speed
for(let i=0;i<18;i++){const x=((i*91-t*.24)%(w+30)+w+30)%(w+30),y=(i*57)%(h*.7);ctx.strokeStyle='#d8faff55';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-24,y+3);ctx.stroke()}
// forward flame from dragon's mouth in act 4: flame extends to right, flickers outward
if(act===3&&active){const fx=w*.53+Math.min(w/760,h/440)*170,fy=h*.52-Math.min(w/760,h/440)*62;ctx.save();ctx.translate(fx,fy);ctx.rotate(-.08);for(let i=0;i<4;i++){ctx.fillStyle=['#ffef9b','#ffb33e','#ff6b32','#fff5c4'][i];ctx.beginPath();ctx.moveTo(0,(i-1.5)*7);ctx.quadraticCurveTo(55+i*18,-30+i*9,125+i*19,Math.sin(t*.03+i)*11);ctx.quadraticCurveTo(75+i*10,28-i*8,0,(i-1.5)*7);ctx.fill()}ctx.restore()}
if(finished){ctx.fillStyle='#f8e7b0';ctx.font='700 18px system-ui';ctx.textAlign='center';ctx.fillText('FLIGHT COMPLETE',w/2,h*.17)}
}
function showAct(){const a=p.acts[act];$('sceneCount').textContent='JOURNEY · '+String(act+1).padStart(2,'0')+' / 05';$('rideStatus').textContent=finished?'ARRIVAL COMPLETE':active?'IN FLIGHT':'AT THE STATION';$('sceneEyebrow').textContent=a[0];$('sceneTitle').textContent=a[0].replaceAll(' ',' ').toLowerCase().replace(/\b\w/g,x=>x.toUpperCase());$('sceneText').textContent=a[1];$('progressText').textContent=Math.round((act+(finished?1:0))/5*100)+'% complete';$('progressBar').style.width=(act+(finished?1:0))/5*100+'%';$('nextScene').textContent=finished?'Fly again':active?'Pause flight':'Start the ride';$('rideNote').textContent=finished?'Your flight is complete. Choose Fly again to ride once more.':active?'The dragon is flying. The five scenes advance automatically.':'Press Start the ride once. The flight and scenes will run automatically.'}
function frame(now){if(!active)return;const dt=Math.min(50,now-last||16);last=now;elapsed+=dt;if(!reduce)draw(now);if(elapsed>=duration){elapsed=0;if(act<4){act++;showAct()}else{active=false;finished=true;showAct();draw(now);return}}raf=requestAnimationFrame(frame)}
function start(){if(finished){act=0;finished=false;elapsed=0}active=true;last=performance.now();showAct();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
$('nextScene').onclick=()=>{if(active){active=false;cancelAnimationFrame(raf);$('nextScene').textContent='Resume flight';$('rideStatus').textContent='FLIGHT PAUSED';$('rideNote').textContent='Your flight is paused. Resume when you are ready.'}else start()};
$('restartRide').onclick=()=>{active=false;finished=false;act=0;elapsed=0;cancelAnimationFrame(raf);showAct();draw(0)};
$('soundToggle').onclick=()=>{$('soundToggle').textContent='Sound: '+(muted?'Off':'Off');$('soundToggle').setAttribute('aria-pressed','false');$('rideNote').textContent='Sound is currently off. The animated flight works without audio.'};
$('motionToggle').onclick=()=>{reduce=!reduce;$('motionToggle').textContent='Motion: '+(reduce?'Reduced':'On');$('motionToggle').setAttribute('aria-pressed',String(reduce));if(reduce)draw(0)};
$('choiceArea').hidden=true;$('motionToggle').textContent='Motion: '+(reduce?'Reduced':'On');$('motionToggle').setAttribute('aria-pressed',String(reduce));$('soundToggle').textContent='Sound: Off';window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden&&active){active=false;cancelAnimationFrame(raf);showAct()}});resize();showAct();draw(0);
})();