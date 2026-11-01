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
function ellipse(x,y,rx,ry,rot,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}function audioReady(){if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)();audioMaster=audioCtx.createGain();audioMaster.gain.value=muted?0:.14;audioMaster.connect(audioCtx.destination)}if(audioCtx.state==='suspended')audioCtx.resume()}
let noiseBuffer=null;function tone(freq,duration,type='sine',volume=.12,slide=0){if(muted)return;audioReady();if(!noiseBuffer){const size=Math.ceil(audioCtx.sampleRate*2);noiseBuffer=audioCtx.createBuffer(1,size,audioCtx.sampleRate);const data=noiseBuffer.getChannelData(0);let smooth=0,peak=0;const raw=new Float32Array(size);for(let i=0;i<size;i++){smooth=smooth*.965+(Math.random()*2-1)*.035;raw[i]=smooth;peak=Math.max(peak,Math.abs(smooth))}const norm=peak?0.62/peak:1;for(let i=0;i<size;i++)data[i]=raw[i]*norm}const src=audioCtx.createBufferSource(),high=audioCtx.createBiquadFilter(),band=audioCtx.createBiquadFilter(),low=audioCtx.createBiquadFilter(),g=audioCtx.createGain(),now=audioCtx.currentTime;src.buffer=noiseBuffer;high.type='highpass';high.frequency.value=155;high.Q.value=.45;band.type='bandpass';band.frequency.setValueAtTime(Math.max(180,Math.min(900,freq*2)),now);band.Q.value=.42;if(slide)band.frequency.linearRampToValueAtTime(Math.max(180,Math.min(900,(freq+slide)*2)),now+duration);low.type='lowpass';low.frequency.value=1250;low.Q.value=.2;g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(volume*.82,now+.12);g.gain.setValueAtTime(volume*.82,now+Math.max(.13,duration*.55));g.gain.exponentialRampToValueAtTime(.0001,now+duration);src.connect(high).connect(band).connect(low).connect(g).connect(audioMaster);src.start(now);src.stop(now+duration+.02)}
function whoosh(){tone(150,.85,'sine',.035,-90);tone(290,.6,'sine',.022,-170)}
function roar(){tone(72,1.1,'sine',.085,-28);tone(112,.85,'sine',.025,-38);tone(48,1.15,'sine',.07,-12)}
function fireSound(){tone(135,.8,'sine',.07,360);tone(390,.55,'sine',.035,-210);tone(68,.95,'sine',.025,-28)}
function lightningSound(){tone(58,1.25,'sine',.095,-22);tone(92,.55,'sine',.02,-48);tone(43,1.5,'sine',.075,-12)}
function windSound(){tone(105,1.2,'sine',.025,-65);tone(185,.9,'sine',.016,-115)}

function dragon(t){
const scale=Math.min(w/760,h/440),cx=w*.53,cy=h*.52,flap=Math.sin(t*.009),breath=Math.sin(t*.004)*2,bank=Math.sin(t*.0015)*.10;
ctx.save();ctx.translate(cx,cy+Math.sin(t*.003)*7);ctx.rotate(bank);ctx.scale(scale,scale);
// Long, armored tail with jagged dorsal spines
const tail=ctx.createLinearGradient(-230,0,-45,0);tail.addColorStop(0,'#071b17');tail.addColorStop(.55,'#123a2b');tail.addColorStop(1,'#24613e');
ctx.strokeStyle=tail;ctx.lineWidth=20;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-62,15);ctx.bezierCurveTo(-120,39,-174,29,-220,5+Math.sin(t*.004)*12);ctx.stroke();
for(let i=0;i<7;i++){const x=-83-i*19;path([[x,5],[x-10,-12],[x+5,-5]],'#27312b','#111b18',1)}
path([[-220,5],[-247,-9],[-238,8],[-252,20],[-220,15]],'#123b2a','#111e22',2);
// Far wing: shoulder anchored; the whole outer span lifts and drops vertically
const wingBeat=flap;
const lift=(pts,amount)=>pts.map(([x,y])=>[x,y-wingBeat*amount*(Math.abs(y)/230)]);
ctx.save();ctx.translate(-20,-17);
const farOutline=lift([[0,0],[-37,-115],[-17,-202],[12,-166],[54,-222],[65,-150],[112,-196],[121,-126],[165,-147],[121,-74],[73,-25]],155);
path(farOutline,'#101f20','#466b50',3);
ctx.strokeStyle='#648b69';ctx.lineWidth=5;ctx.beginPath();
lift([[0,0],[-17,-202],[54,-222],[112,-196],[165,-147]],155).slice(1).forEach(pt=>{ctx.moveTo(0,0);ctx.lineTo(pt[0],pt[1])});ctx.stroke();
for(let i=0;i<4;i++){const tip=lift([[[-17,-202],[54,-222],[112,-196],[165,-147]][i]],155)[0];ctx.strokeStyle='#294d39';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-30+i*45,-70-i*8,tip[0],tip[1]);ctx.stroke()}ctx.restore();
// Heavy torso with layered armor and shadowed underside
const body=ctx.createLinearGradient(-15,-30,22,57);body.addColorStop(0,'#3e7548');body.addColorStop(.38,'#174b32');body.addColorStop(1,'#071b17');
ellipse(-3,12,94,43,-.06,body);ellipse(28,27,56,25,-.1,'#0f3427');
const belly=ctx.createLinearGradient(0,20,0,58);belly.addColorStop(0,'#806e4d');belly.addColorStop(1,'#393c2e');ellipse(18,39,48,15,-.04,belly);
for(let i=0;i<6;i++){ctx.strokeStyle='#a4bd8b88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-23+i*15,32);ctx.quadraticCurveTo(-8+i*15,47,5+i*15,34);ctx.stroke()}
// Muscular hind and forelimbs, bent joints and hooked claws
function leg(x,y,forward){ctx.strokeStyle='#123b2a';ctx.lineWidth=21;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+(forward?8:-9),y+19,x+(forward?17:-19),y+38);ctx.lineTo(x+(forward?32:-29),y+49);ctx.stroke();ellipse(x+(forward?17:-19),y+37,12,13,0,'#28613d');for(let c=0;c<3;c++){const xx=x+(forward?32:-29)+c*6-6;path([[xx, y+47],[xx+4,y+57],[xx-2,y+53]],'#d8c5a0','#40372f',1)}}
leg(-48,26,false);leg(47,24,true);
// Near wing: articulated vertical downstroke and upstroke, rooted firmly at the shoulder
ctx.save();ctx.translate(-4,-15);
const membrane=ctx.createLinearGradient(-20,-200,110,10);membrane.addColorStop(0,'#28553a');membrane.addColorStop(.45,'#153c2b');membrane.addColorStop(1,'#091e19');
const nearBase=[[0,0],[-31,-121],[-19,-207],[9,-172],[47,-232],[62,-157],[111,-205],[119,-130],[168,-157],[132,-80],[82,-31],[37,15]];
path(lift(nearBase,190),membrane,'#527b50',4);
const tips=lift([[-19,-207],[47,-232],[111,-205],[168,-157]],190);
ctx.strokeStyle='#8ba77a';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();tips.forEach(pt=>{ctx.moveTo(0,0);ctx.lineTo(pt[0],pt[1])});ctx.stroke();
ctx.strokeStyle='#31563b';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(20+i*25,-75-i*9,tips[i][0],tips[i][1]);ctx.stroke()}
ctx.restore();
// Strong shoulder joints anchor the wing strokes to the back
ellipse(-7,-14,15,13,-.2,'#376d43');ellipse(-21,-16,10,9,-.2,'#214d34');
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
// Fire breath originates at the dragon's jaws, following his head and flight motion
if(act===3&&active){
 const pulse=Math.sin(t*.035),length=155+Math.sin(t*.021)*28;
 ctx.save();ctx.translate(185,-53);ctx.globalCompositeOperation='lighter';
 const glow=ctx.createRadialGradient(5,0,2,35,0,75);glow.addColorStop(0,'#fff7c4');glow.addColorStop(.3,'#ffb52e');glow.addColorStop(1,'#ff4a16');ctx.fillStyle=glow;ctx.beginPath();ctx.ellipse(34,0,65,23,0,0,Math.PI*2);ctx.fill();
 for(let i=0;i<8;i++){const sway=Math.sin(t*.04+i*1.8)*13,spread=(i-3.5)*5;
  const g=ctx.createLinearGradient(0,0,length,0);g.addColorStop(0,'#fffbd0');g.addColorStop(.22,'#ffd34f');g.addColorStop(.58,'#ff7622');g.addColorStop(1,'#c51e13');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,spread);ctx.bezierCurveTo(38,spread-20+sway, length*.68,spread-27+sway,length,spread+sway);ctx.bezierCurveTo(length*.66,spread+23+sway,42,spread+19+sway,0,spread);ctx.fill();
 }
 ctx.shadowColor='#ff6b20';ctx.shadowBlur=28;ctx.fillStyle='#fff4b0';ctx.beginPath();ctx.ellipse(5,0,13,8,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
ctx.restore();
}
function draw(t){if(!w||!h)return;const storm=act===2,night=park==='afterdark',space=park==='beyond';const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,night?'#09091d':space?'#090d31':'#0b2948');sky.addColorStop(.6,night?'#40203d':space?'#29275e':'#24718a');sky.addColorStop(1,'#b0d9d4');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
if(!night&&!space){const sun=ctx.createRadialGradient(w*.75,h*.23,2,w*.75,h*.23,110);sun.addColorStop(0,'#fff8cf');sun.addColorStop(1,'#fff8cf00');ctx.fillStyle=sun;ctx.fillRect(0,0,w,h)}
// Layered cumulus clouds: bright upper lobes, soft shaded undersides and depth
function cloudBank(x,y,k,base,highlight){
 const puff=(dx,dy,rx,ry,alpha)=>{ctx.globalAlpha=alpha;const g=ctx.createLinearGradient(0,y+dy-ry,0,y+dy+ry);g.addColorStop(0,highlight);g.addColorStop(.52,base);g.addColorStop(1,'#42586a');ellipse(x+dx,y+dy,rx,ry,0,g)};
 puff(0,8,78*k,25*k,.94);puff(-48*k,-7,39*k,31*k,.98);puff(-12*k,-23,48*k,39*k,1);puff(35*k,-12,48*k,34*k,.98);puff(68*k,2,35*k,25*k,.9);ctx.globalAlpha=1;
}
for(let layer=0;layer<3;layer++){const y=h*(.29+layer*.17);for(let i=0;i<5;i++){const speed=(layer+1)*.009,x=((i*255-t*speed)%(w+340)+w+340)%(w+340)-140;cloudBank(x,y,layer===0?.72:layer===1?.9:1.12,layer===2?'#b6cbd2':'#d4e6e8',layer===2?'#f4fbf8':'#ffffff')}}
if(storm){
 for(let i=0;i<5;i++){
  const x=((i*235-t*.026)%(w+430)+w+430)%(w+430)-190,base=h*(.37+(i%3)*.045),k=.9+(i%3)*.19;
  const g=ctx.createLinearGradient(0,base-190*k,0,base+48*k);
  g.addColorStop(0,'#8290a4');g.addColorStop(.18,'#58677e');g.addColorStop(.48,'#354258');g.addColorStop(.78,'#202b40');g.addColorStop(1,'#111a2c');
  ctx.fillStyle=g;ellipse(x,base,142*k,61*k,0,g);ellipse(x-86*k,base-45*k,73*k,78*k,0,g);ellipse(x-24*k,base-105*k,81*k,104*k,0,g);ellipse(x+55*k,base-82*k,91*k,91*k,0,g);ellipse(x+120*k,base-27*k,67*k,58*k,0,g);
  ctx.fillStyle='#0b1426aa';ellipse(x+8*k,base+36*k,150*k,26*k,0,'#0b1426aa');
 }
 const pulse=(Math.sin(t*.0021)+1)*.5;
 if(pulse>.79){
  const flash=(pulse-.79)/.21;ctx.save();ctx.fillStyle='rgba(190,220,255,'+(flash*.13)+')';ctx.fillRect(0,0,w,h);
  const drawBolt=(x,y,seed,branch)=>{
   const pts=[[x,y]];let px=x,py=y;
   for(let j=1;j<=7;j++){px+=Math.sin(seed+j*2.17)*w*.018;py+=h*(.035+((j*13+seed*7)%9)*.004);pts.push([px,py])}
   ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
   for(let j=1;j<pts.length;j++){const p0=pts[j-1],p1=pts[j],mx=(p0[0]+p1[0])*.5+Math.sin(seed+j)*w*.006,my=(p0[1]+p1[1])*.5;ctx.quadraticCurveTo(mx,my,p1[0],p1[1])}ctx.stroke();
   if(branch){for(const j of [2,4,5]){const p=pts[j],dir=j%2?1:-1,ex=p[0]+dir*w*(.025+j*.003),ey=p[1]+h*(.045+j*.006);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(p[0]+dir*w*.012,p[1]+h*.018,ex,ey);ctx.stroke()}}
  };
  ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#b9dfff';ctx.shadowColor='#8bcaff';ctx.shadowBlur=26;ctx.lineWidth=7;drawBolt(w*.22,-h*.02,3,true);drawBolt(w*.76,h*.01,8,false);
  ctx.strokeStyle='#f5fbff';ctx.shadowBlur=10;ctx.lineWidth=2.2;drawBolt(w*.22,-h*.02,3,true);drawBolt(w*.76,h*.01,8,false);ctx.restore();
 }
}
if(!space){ // kingdom castle towers scrolling by
for(let i=0;i<5;i++){const x=((i*245-t*.045)%(w+220)+w+220)%(w+220)-100,base=h*.78,ht=65+(i%3)*32;ctx.fillStyle=night?'#171327':'#263c58';ctx.fillRect(x,base-ht,48,ht);path([[x-8,base-ht],[x+24,base-ht-36],[x+56,base-ht]],night?'#261832':'#45617c');ctx.fillStyle='#f5d99a';ctx.fillRect(x+19,base-ht+22,9,17)}}
else{for(let i=0;i<5;i++){const x=((i*210-t*.04)%(w+200)+w+200)%(w+200)-90,y=h*(.25+(i%3)*.15);ctx.strokeStyle='#c2b5ff';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y,28,58,0,0,Math.PI*2);ctx.stroke()}}
dragon(t);
// ride streaks create forward speed
for(let i=0;i<18;i++){const x=((i*91-t*.24)%(w+30)+w+30)%(w+30),y=(i*57)%(h*.7);ctx.strokeStyle='#d8faff55';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-24,y+3);ctx.stroke()}

if(finished){ctx.fillStyle='#f8e7b0';ctx.font='700 18px system-ui';ctx.textAlign='center';ctx.fillText('FLIGHT COMPLETE',w/2,h*.17)}
}
function showAct(){const a=p.acts[act];$('sceneCount').textContent='JOURNEY · '+String(act+1).padStart(2,'0')+' / 05';$('rideStatus').textContent=finished?'ARRIVAL COMPLETE':active?'IN FLIGHT':'AT THE STATION';$('sceneEyebrow').textContent=a[0];$('sceneTitle').textContent=a[0].replaceAll(' ',' ').toLowerCase().replace(/\b\w/g,x=>x.toUpperCase());$('sceneText').textContent=a[1];$('progressText').textContent=Math.round((act+(finished?1:0))/5*100)+'% complete';$('progressBar').style.width=(act+(finished?1:0))/5*100+'%';$('nextScene').textContent=finished?'Fly again':active?'Pause flight':'Start the ride';$('rideNote').textContent=finished?'Your flight is complete. Choose Fly again to ride once more.':active?'The dragon is flying. The five scenes advance automatically.':'Press Start the ride once. The flight and scenes will run automatically.'}
function frame(now){if(!active)return;const dt=Math.min(50,now-last||16),previous=elapsed;last=now;elapsed+=dt;if(!reduce)draw(now);if(act===2){if(previous<2400&&elapsed>=2400)lightningSound();if(previous<6800&&elapsed>=6800)lightningSound()}if(Math.floor(previous/3200)!==Math.floor(elapsed/3200))windSound();if(elapsed>=duration){elapsed=0;if(act<4){act++;showAct();if(act===2){roar();lightningSound()}if(act===3){fireSound();whoosh()}else whoosh()}else{active=false;finished=true;showAct();draw(now);return}}raf=requestAnimationFrame(frame)}
function start(){if(finished){act=0;finished=false;elapsed=0}audioReady();active=true;last=performance.now();showAct();roar();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
$('nextScene').onclick=()=>{if(active){active=false;cancelAnimationFrame(raf);$('nextScene').textContent='Resume flight';$('rideStatus').textContent='FLIGHT PAUSED';$('rideNote').textContent='Your flight is paused. Resume when you are ready.'}else start()};
$('restartRide').onclick=()=>{active=false;finished=false;act=0;elapsed=0;cancelAnimationFrame(raf);showAct();draw(0)};
$('soundToggle').onclick=()=>{muted=!muted;audioReady();audioMaster.gain.setTargetAtTime(muted?0:.14,audioCtx.currentTime,.08);$('soundToggle').textContent='Sound: '+(muted?'Off':'On');$('soundToggle').setAttribute('aria-pressed',String(!muted));$('rideNote').textContent=muted?'Sound effects are off.':'Dragon roars, wing-flight whooshes and fire effects are on.';if(!muted)whoosh()};
$('motionToggle').onclick=()=>{reduce=!reduce;$('motionToggle').textContent='Motion: '+(reduce?'Reduced':'On');$('motionToggle').setAttribute('aria-pressed',String(reduce));if(reduce)draw(0)};
$('choiceArea').hidden=true;$('motionToggle').textContent='Motion: '+(reduce?'Reduced':'On');$('motionToggle').setAttribute('aria-pressed',String(reduce));$('soundToggle').textContent='Sound: Off';window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden&&active){active=false;cancelAnimationFrame(raf);showAct()}});resize();showAct();draw(0);
})();