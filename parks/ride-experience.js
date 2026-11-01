(()=>{'use strict';
const $=id=>document.getElementById(id),q=new URLSearchParams(location.search),park=q.get('park')||'kingdoms';
const config={kingdoms:{name:'KAEVORYN KINGDOMS',title:'DRAGON’S WRATH',intro:'Climb aboard and fly into the heart of a storm above the enchanted kingdom.',color:'#7eeaff',acts:[['THE GATES OPEN','The dragon launches from the Citadel. Hold on — your flight is beginning.'],['ABOVE THE KINGDOM','Soar past towering castles as the clouds race beneath your wings.'],['INTO THE STORM','Lightning splits the sky. The dragon banks through the swirling clouds.'],['THE FIRE FLIGHT','A wall of storm clouds blocks the way. The dragon unleashes a blazing path.'],['THE CITADEL REVEALED','The storm clears. The enchanted kingdom glows beneath you.']]},
beyond:{name:'KAEVORYN BEYOND',title:'PORTAL BREAKER',intro:'Fly through unstable gateways and discover a universe that changes around you.',color:'#c1a8ff',acts:[['PORTAL IGNITION','A gateway opens and pulls you into the unknown.'],['WORLDS IN FLIGHT','Strange worlds drift past as you race between dimensions.'],['THE FRACTURE','Reality bends. Hold steady as the portal storm surrounds you.'],['ENERGY SURGE','A burst of light tears open the final gateway.'],['A NEW HORIZON','You emerge above a world no one has seen before.']]},
afterdark:{name:'KAEVORYN AFTERDARK',title:'THE NIGHT FLIGHT',intro:'Take a suspenseful flight over a mysterious world after the lights go out.',color:'#ff7caa',acts:[['NIGHTFALL','A shadow crosses the moon. Something rises into the night.'],['OVER THE FORGOTTEN','Fly above silent towers and forests lost to time.'],['THE SHADOW STORM','Dark clouds close in. A strange light follows your flight.'],['THE ESCAPE','A burst of fire lights the way through the darkness.'],['DAWN RETURNS','The horizon brightens. You have escaped the unknown.']]}};
const p=config[park]||config.kingdoms;document.documentElement.style.setProperty('--accent',p.color);
$('ridePark').textContent=p.name+' · VIRTUAL ATTRACTION';$('rideName').textContent=p.title;$('rideIntro').textContent=p.intro;$('parkBack').href=park==='kingdoms'?'kingdoms.html':park+'.html';$('backToPark').href=$('parkBack').href;$('backToPark').textContent='Return to '+p.name.replace('KAEVORYN ','')+' ↗';document.title=p.title+' — Kaevoryn Studios';
const canvas=$('rideCanvas'),ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,active=false,finished=false,act=0,elapsed=0,last=0,raf=0,muted=true,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,audioCtx=null,audioMaster=null;
const duration=9500;
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw(0)}
function path(points,fill,stroke=null,lw=1){ctx.beginPath();points.forEach((pt,i)=>i?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function ellipse(x,y,rx,ry,rot,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}function audioReady(){if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)();audioMaster=audioCtx.createGain();audioMaster.gain.value=muted?0:.32;audioMaster.connect(audioCtx.destination)}if(audioCtx.state==='suspended')audioCtx.resume()}
function tone(freq,duration,type='sine',volume=.12,slide=0){if(muted)return;audioReady();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),audioCtx.currentTime+duration);g.gain.setValueAtTime(.001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(volume,audioCtx.currentTime+.04);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g).connect(audioMaster);o.start();o.stop(audioCtx.currentTime+duration+.03)}
function whoosh(){tone(180,.7,'sawtooth',.055,-120);tone(420,.45,'triangle',.035,-260)}
function roar(){tone(92,1.25,'sawtooth',.12,-45);tone(138,.9,'triangle',.07,-55);tone(48,1.1,'sine',.12,-15)}
function fireSound(){tone(220,.75,'sawtooth',.08,580);tone(740,.55,'triangle',.045,-380);tone(95,.8,'square',.035,-45)}

function dragon(t){
const scale=Math.min(w/760,h/440),cx=w*.53,cy=h*.52,flap=Math.sin(t*.008)*.48,breath=Math.sin(t*.004)*2,bank=Math.sin(t*.0015)*.10;
ctx.save();ctx.translate(cx,cy+Math.sin(t*.003)*7);ctx.rotate(bank);ctx.scale(scale,scale);
// Long, armored tail with jagged dorsal spines
const tail=ctx.createLinearGradient(-230,0,-45,0);tail.addColorStop(0,'#071b17');tail.addColorStop(.55,'#123a2b');tail.addColorStop(1,'#24613e');
ctx.strokeStyle=tail;ctx.lineWidth=20;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-62,15);ctx.bezierCurveTo(-120,39,-174,29,-220,5+Math.sin(t*.004)*12);ctx.stroke();
for(let i=0;i<7;i++){const x=-83-i*19;path([[x,5],[x-10,-12],[x+5,-5]],'#27312b','#111b18',1)}
path([[-220,5],[-247,-9],[-238,8],[-252,20],[-220,15]],'#123b2a','#111e22',2);
// Far wing: broad leathery membrane, scalloped trailing edge and visible finger bones
ctx.save();ctx.translate(-20,-17);ctx.scale(1,0.72+(Math.sin(t*.008+Math.PI)+1)*.22);ctx.rotate(-.08);
path([[0,0],[-37,-115],[-17,-202],[12,-166],[54,-222],[65,-150],[112,-196],[121,-126],[165,-147],[121,-74],[73,-25]],'#101f20','#466b50',3);
ctx.strokeStyle='#648b69';ctx.lineWidth=5;ctx.beginPath();[[0,0],[-17,-202],[54,-222],[112,-196],[165,-147]].forEach(pt=>{ctx.moveTo(0,0);ctx.lineTo(pt[0],pt[1])});ctx.stroke();
for(let i=0;i<4;i++){ctx.strokeStyle='#294d39';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-30+i*45,-70-i*8,[-17,54,112,165][i],[-202,-222,-196,-147][i]);ctx.stroke()}ctx.restore();
// Heavy torso with layered armor and shadowed underside
const body=ctx.createLinearGradient(-15,-30,22,57);body.addColorStop(0,'#3e7548');body.addColorStop(.38,'#174b32');body.addColorStop(1,'#071b17');
ellipse(-3,12,94,43,-.06,body);ellipse(28,27,56,25,-.1,'#0f3427');
const belly=ctx.createLinearGradient(0,20,0,58);belly.addColorStop(0,'#806e4d');belly.addColorStop(1,'#393c2e');ellipse(18,39,48,15,-.04,belly);
for(let i=0;i<6;i++){ctx.strokeStyle='#a4bd8b88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-23+i*15,32);ctx.quadraticCurveTo(-8+i*15,47,5+i*15,34);ctx.stroke()}
// Muscular hind and forelimbs, bent joints and hooked claws
function leg(x,y,forward){ctx.strokeStyle='#123b2a';ctx.lineWidth=21;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+(forward?8:-9),y+19,x+(forward?17:-19),y+38);ctx.lineTo(x+(forward?32:-29),y+49);ctx.stroke();ellipse(x+(forward?17:-19),y+37,12,13,0,'#28613d');for(let c=0;c<3;c++){const xx=x+(forward?32:-29)+c*6-6;path([[xx, y+47],[xx+4,y+57],[xx-2,y+53]],'#d8c5a0','#40372f',1)}}
leg(-48,26,false);leg(47,24,true);
// Near wing: huge, ragged, ribbed and leathery
ctx.save();ctx.translate(-4,-15);ctx.scale(1,0.72+(Math.sin(t*.008)+1)*.22);ctx.rotate(-.03);
const membrane=ctx.createLinearGradient(-20,-200,110,10);membrane.addColorStop(0,'#28553a');membrane.addColorStop(.45,'#153c2b');membrane.addColorStop(1,'#091e19');
path([[0,0],[-31,-121],[-19,-207],[9,-172],[47,-232],[62,-157],[111,-205],[119,-130],[168,-157],[132,-80],[82,-31],[37,15]],membrane,'#527b50',4);
ctx.strokeStyle='#8ba77a';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();const tips=[[-19,-207],[47,-232],[111,-205],[168,-157]];tips.forEach(pt=>{ctx.moveTo(0,0);ctx.lineTo(pt[0],pt[1])});ctx.stroke();
ctx.strokeStyle='#31563b';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(20+i*25,-75-i*9,tips[i][0],tips[i][1]);ctx.stroke()}
ctx.restore();
// Neck rises forward from shoulders; armored throat
const neck=ctx.createLinearGradient(45,-65,110,8);neck.addColorStop(0,'#3e7548');neck.addColorStop(.45,'#354a40');neck.addColorStop(1,'#17272a');
ctx.strokeStyle=neck;ctx.lineWidth=36;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(48,0);ctx.bezierCurveTo(77,-19,78,-54,112,-68);ctx.stroke();
for(let i=0;i<5;i++){path([[61+i*10,-17-i*7],[69+i*10,-33-i*7],[78+i*10,-18-i*7]],'#62764a','#14271d',1)}
// Massive angular skull and long crocodilian muzzle
const skull=ctx.createLinearGradient(94,-100,170,-39);skull.addColorStop(0,'#78a65b');skull.addColorStop(.35,'#326a3d');skull.addColorStop(1,'#10291d');
ellipse(125,-73,42,30,-.12,skull);
path([[137,-82],[191,-67],[183,-51],[148,-48],[126,-58]],'#244c30','#172326',2);
path([[143,-57],[190,-55],[180,-45],[148,-45]],'#151c20','#0c1318',1);
for(let i=0;i<5;i++){path([[151+i*7,-56],[155+i*7,-43],[159+i*7,-55]],'#e2d4b2','#534b40',1)}
// brow ridge, glowing predatory eye, slit pupil
path([[105,-82],[117,-96],[146,-91],[153,-80],[132,-83]],'#142e20','#111d20',2);
ellipse(132,-77,8,5,-.12,'#e64b22');ellipse(134,-77,2,5,-.1,'#100e0d');ellipse(132,-79,2,1,0,'#fff2bd');
for(let i=0;i<3;i++){ellipse(171+i*6,-67,2,1,0,'#101819')}
// Crown horns and cheek spikes
path([[111,-91],[91,-126],[120,-103]],'#c1b18b','#41453b',2);path([[133,-94],[145,-132],[149,-94]],'#c1b18b','#41453b',2);path([[102,-67],[75,-82],[91,-57]],'#477344','#26342e',2);
for(let i=0;i<5;i++){const x=66-i*15;path([[x, -8-i*3],[x-12,-25-i*4],[x+3,-17-i*3]],'#506b43','#29342e',1)}
// Scattered armor plates and scale highlights
for(let row=0;row<4;row++)for(let col=0;col<9;col++){const x=-55+col*17,y=-15+row*11+(col%2)*4;path([[x-4,y],[x,y-4],[x+5,y],[x+2,y+4]],row%2?'#75a65c':'#9abc70','#173b27',.7)}
// Ember-lit flame tail; layered tongues stream behind the creature
ctx.save();ctx.translate(-238,7+Math.sin(t*.004)*12);ctx.globalCompositeOperation='lighter';
for(let i=0;i<7;i++){const flick=Math.sin(t*.018+i*1.7)*10,len=42+i*9,grad=ctx.createLinearGradient(0,0,-len,0);grad.addColorStop(0,'#fff8c5');grad.addColorStop(.25,'#ffc34d');grad.addColorStop(.62,'#f65b20');grad.addColorStop(1,'#9f1712');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,(i-3)*3);ctx.bezierCurveTo(-len*.3,-20+flick,-len*.7,-9+flick,-len,flick);ctx.bezierCurveTo(-len*.7,19+flick,-len*.3,15+flick,0,(i-3)*3);ctx.fill()}
ctx.shadowColor='#ff6b24';ctx.shadowBlur=24;ellipse(-5,0,8,6,0,'#fff2a0');ctx.restore();
ctx.restore();
}
function draw(t){if(!w||!h)return;const storm=act===2,night=park==='afterdark',space=park==='beyond';const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,night?'#09091d':space?'#090d31':'#0b2948');sky.addColorStop(.6,night?'#40203d':space?'#29275e':'#24718a');sky.addColorStop(1,'#b0d9d4');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
if(!night&&!space){const sun=ctx.createRadialGradient(w*.75,h*.23,2,w*.75,h*.23,110);sun.addColorStop(0,'#fff8cf');sun.addColorStop(1,'#fff8cf00');ctx.fillStyle=sun;ctx.fillRect(0,0,w,h)}
// distant clouds and layered moving scenery
for(let layer=0;layer<3;layer++){const y=h*(.27+layer*.16);for(let i=0;i<6;i++){const speed=(layer+1)*.012,x=((i*225-t*speed)%(w+300)+w+300)%(w+300)-120,cy=y+Math.sin(i*2.4)*10,rx=62+layer*17,ry=19+layer*7;const cloud=ctx.createLinearGradient(0,cy-ry,0,cy+ry);cloud.addColorStop(0,layer===0?'#f5ffff55':layer===1?'#e2f3f477':'#f4ffffaa');cloud.addColorStop(1,layer===0?'#a9cbd044':layer===1?'#91b8c077':'#c3e2e2aa');ctx.fillStyle=cloud;ellipse(x,cy,rx,ry,0,cloud);ellipse(x-rx*.48,cy-ry*.35,rx*.48,ry*.8,0,cloud);ellipse(x+rx*.42,cy-ry*.25,rx*.53,ry*.88,0,cloud);ellipse(x+rx*.05,cy-ry*.55,rx*.42,ry*.72,0,cloud)}}
if(storm){for(let i=0;i<7;i++){const x=((i*185-t*.055)%(w+240)+w+240)%(w+240)-90,y=h*(.12+(i%3)*.07),r=55+(i%2)*22;const shade=ctx.createRadialGradient(x-r*.2,y-r*.25,4,x,y,r*1.5);shade.addColorStop(0,'#66758b');shade.addColorStop(.55,'#303d55');shade.addColorStop(1,'#17243ddd');ctx.fillStyle=shade;ellipse(x,y,r*1.35,r*.58,0,shade);ellipse(x-r*.55,y+8,r*.8,r*.48,0,shade);ellipse(x+r*.52,y+5,r*.88,r*.5,0,shade)}if(Math.sin(t*.007)>0.82){ctx.strokeStyle='#d9f5ff';ctx.lineWidth=4;ctx.shadowColor='#a8dfff';ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(w*.18,h*.02);ctx.lineTo(w*.23,h*.17);ctx.lineTo(w*.19,h*.25);ctx.stroke();ctx.shadowBlur=0}}
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
function frame(now){if(!active)return;const dt=Math.min(50,now-last||16);last=now;elapsed+=dt;if(!reduce)draw(now);if(elapsed>=duration){elapsed=0;if(act<4){act++;showAct();if(act===2)roar();if(act===3)fireSound();else whoosh()}else{active=false;finished=true;showAct();draw(now);return}}raf=requestAnimationFrame(frame)}
function start(){if(finished){act=0;finished=false;elapsed=0}audioReady();active=true;last=performance.now();showAct();roar();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
$('nextScene').onclick=()=>{if(active){active=false;cancelAnimationFrame(raf);$('nextScene').textContent='Resume flight';$('rideStatus').textContent='FLIGHT PAUSED';$('rideNote').textContent='Your flight is paused. Resume when you are ready.'}else start()};
$('restartRide').onclick=()=>{active=false;finished=false;act=0;elapsed=0;cancelAnimationFrame(raf);showAct();draw(0)};
$('soundToggle').onclick=()=>{muted=!muted;audioReady();audioMaster.gain.setTargetAtTime(muted?0:.32,audioCtx.currentTime,.08);$('soundToggle').textContent='Sound: '+(muted?'Off':'On');$('soundToggle').setAttribute('aria-pressed',String(!muted));$('rideNote').textContent=muted?'Sound effects are off.':'Dragon roars, wing-flight whooshes and fire effects are on.';if(!muted)whoosh()};
$('motionToggle').onclick=()=>{reduce=!reduce;$('motionToggle').textContent='Motion: '+(reduce?'Reduced':'On');$('motionToggle').setAttribute('aria-pressed',String(reduce));if(reduce)draw(0)};
$('choiceArea').hidden=true;$('motionToggle').textContent='Motion: '+(reduce?'Reduced':'On');$('motionToggle').setAttribute('aria-pressed',String(reduce));$('soundToggle').textContent='Sound: Off';window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden&&active){active=false;cancelAnimationFrame(raf);showAct()}});resize();showAct();draw(0);
})();