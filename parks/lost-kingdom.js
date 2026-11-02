(()=>{'use strict';
const canvas=document.getElementById('lostCanvas'),ctx=canvas.getContext('2d');
const title=document.getElementById('sceneTitle'),copy=document.getElementById('sceneCopy'),count=document.getElementById('sceneCount'),progress=document.getElementById('progressFill'),next=document.getElementById('nextScene'),status=document.getElementById('rideStatus');
const scenes=[
['THE FORGOTTEN ENTRANCE','Your Kingdom Explorer waits beneath an ancient gateway. The gullwing doors rise. Beyond them, the Lost Kingdom is calling.'],
['THE LOST CITY','The Explorer rolls through the mist. An entire forgotten city emerges—towers, bridges, and waterfalls hidden for centuries.'],
['THE TEMPLE OF SECRETS','Symbols awaken along the temple walls. Your dashboard maps a path deeper into the ruins.'],
['THE GUARDIAN','A colossal guardian stirs beneath the temple. The ground trembles. Blue lights flare across your Explorer.'],
['THE GREAT ESCAPE','Stone bridges collapse behind you. The Explorer races through the ancient passage as the kingdom shakes awake.'],
['THE DISCOVERY','At the heart of the ruins, a hidden chamber reveals the kingdom’s greatest secret. Your adventure has only just begun.']
];
let w=0,h=0,dpr=1,scene=0,started=false,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,raf=0,startTime=0,last=0;
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now())}
function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function ellipse(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function rounded(x,y,ww,hh,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,ww,hh,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function drawGateway(t){const cx=w*.5,base=h*.76,scale=Math.min(w/760,h/430);ctx.save();ctx.translate(cx,base);ctx.scale(scale,scale);for(let side of [-1,1]){poly([[side*210,0],[side*205,-205],[side*155,-245],[side*105,-205],[side*105,0]],'#263d4c','#8b9e9c');for(let i=0;i<4;i++)rounded(side*165-12,-190+i*45,24,5,2,'#e5bd70')}poly([[-225,-205],[-185,-260],[0,-290],[185,-260],[225,-205]],'#304b58','#d5b47b');poly([[-210,-205],[0,-275],[210,-205]],'#172b39','#c8b17d');rounded(-96,-125,192,126,5,'#081b29','#78b8c2');ctx.restore()}
function drawRuins(t){const base=h*.77;for(let i=0;i<7;i++){let x=((i*170-t*(scene===4?-.13:.025))%(w+200)+w+200)%(w+200)-100,ht=h*(.19+(i%3)*.075);ctx.fillStyle=i%2?'#1b3942':'#24444a';ctx.fillRect(x,base-ht,75,ht);poly([[x-10,base-ht],[x+37,base-ht-40],[x+85,base-ht]],'#355b5c','#71918a');for(let j=0;j<3;j++)rounded(x+15,base-ht+25+j*36,10,20,4,'#f0c979')}for(let i=0;i<5;i++){const x=w*(i/4),y=h*(.28+(i%2)*.08);ctx.strokeStyle='#7beaff44';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-18,y+55);ctx.lineTo(x+9,y+88);ctx.stroke()}}
function drawCar(t){const scale=Math.min(w/760,h/430),travel=scene===0?0:Math.sin(t*.0012)*12+(scene===4?Math.sin(t*.012)*8:0),x=w*.5+travel,y=h*.79+Math.sin(t*.009)*2;ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.shadowColor='#00cfff66';ctx.shadowBlur=28;ellipse(0,8,190,24,'#020711aa');ctx.shadowBlur=0;
// wheels
for(const wx of [-112,112]){ellipse(wx,0,38,38,'#080d14');ellipse(wx,0,23,23,'#647783');ellipse(wx,0,11,11,'#172b37');for(let a=0;a<8;a++){ctx.save();ctx.translate(wx,0);ctx.rotate(a*Math.PI/4);rounded(-2,-21,4,10,1,'#b3c7cd');ctx.restore()}}
// lower chassis and rugged body
poly([[-168,-45],[-142,-79],[-92,-94],[96,-94],[148,-68],[176,-35],[164,-7],[-165,-7]],'#142b36','#8ab3bb');
const body=ctx.createLinearGradient(-130,-100,130,0);body.addColorStop(0,'#9db4b5');body.addColorStop(.3,'#375967');body.addColorStop(.72,'#173747');body.addColorStop(1,'#0c202d');
poly([[-156,-53],[-125,-100],[-74,-126],[72,-126],[124,-93],[157,-48],[144,-23],[-150,-23]],body,'#9cecff');
poly([[-104,-103],[-70,-145],[69,-145],[111,-99]],'#102d3c','#7ceaff');
poly([[-88,-111],[-63,-137],[-4,-137],[-4,-111]],'#69c5d4aa','#b5f5ff');poly([[5,-137],[64,-137],[94,-111],[5,-111]],'#6ac9d8aa','#b5f5ff');
// gullwing doors raised in loading scene
if(scene===0){for(let side of [-1,1]){ctx.save();ctx.translate(side*52,-137);ctx.rotate(side*-.47);poly([[0,0],[side*6,-105],[side*78,-126],[side*87,-15]],'#264e5d','#8deeff');poly([[side*15,-13],[side*18,-89],[side*68,-103],[side*75,-19]],'#79d9e5aa','#d2fbff');ctx.restore()}}
// Rear-facing details: the Explorer is viewed from behind as it heads into the kingdom.
poly([[-152,-54],[-174,-42],[-166,-23],[-139,-27]],'#a92f3d','#ff8c87');poly([[143,-55],[169,-42],[161,-22],[137,-27]],'#a92f3d','#ff8c87');
rounded(-48,-53,96,29,6,'#102936','#7ceaff');rounded(-25,-45,50,12,3,'#071722','#4f8492');
ctx.fillStyle='#d8e9e8';ctx.font='bold 8px system-ui';ctx.textAlign='center';ctx.fillText('KAEVORYN',0,-36);
rounded(-22,-89,44,18,5,'#0b1824','#7ceaff');ctx.fillStyle='#7eeaff';ctx.font='bold 9px system-ui';ctx.fillText('EXPLORER',0,-77);
ctx.restore()}
function draw(t){if(!w||!h)return;const sky=ctx.createLinearGradient(0,0,0,h);const colors=scene===3?['#070d1b','#233849','#59616a']:scene===4?['#090d1a','#4c332b','#a45e36']:['#071624','#245260','#9bb8a8'];sky.addColorStop(0,colors[0]);sky.addColorStop(.62,colors[1]);sky.addColorStop(1,colors[2]);ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
const glow=ctx.createRadialGradient(w*.5,h*.36,4,w*.5,h*.36,h*.58);glow.addColorStop(0,scene===5?'#ffd98a66':'#80eaff33');glow.addColorStop(1,'#00101a00');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
drawRuins(t);if(scene===0)drawGateway(t);if(scene===3){ctx.fillStyle='#111923';ctx.beginPath();ctx.ellipse(w*.78,h*.57,w*.12,h*.2,0,0,Math.PI*2);ctx.fill();ellipse(w*.75,h*.51,7,7,'#a8f5ff');ellipse(w*.81,h*.51,7,7,'#a8f5ff')}
if(scene===4){for(let i=0;i<16;i++){const x=(i*83+t*.22)%(w+20),y=(i*47+t*.16)%(h*.7);ellipse(x,y,2+(i%3),2+(i%3),'#ffca7766')}}
drawCar(t);if(scene===5){ctx.fillStyle='#fff0c2';ctx.font='700 17px system-ui';ctx.textAlign='center';ctx.fillText('THE SECRET IS YOURS TO DISCOVER',w/2,h*.16)}
}
function show(){const s=scenes[scene];title.textContent=s[0];copy.textContent=s[1];count.textContent='JOURNEY · '+String(scene+1).padStart(2,'0')+' / 06';progress.style.width=((scene+1)/6*100)+'%';status.textContent=scene===0?'AT THE STATION':scene===5?'DISCOVERY COMPLETE':'EXPLORING THE LOST KINGDOM';next.textContent=scene===5?'Restart adventure':started?'Continue journey':'Begin adventure'}
function frame(now){if(!started)return;const dt=Math.min(50,now-last||16);last=now;if(!reduce)draw(now);if(now-startTime>=5200){startTime=now;if(scene<5){scene++;show()}else{started=false;show();return}}raf=requestAnimationFrame(frame)}
next.addEventListener('click',()=>{if(scene===5){scene=0;started=false;show();draw(performance.now());return}if(!started){started=true;startTime=performance.now();last=startTime;show();raf=requestAnimationFrame(frame)}else{scene=Math.min(5,scene+1);startTime=performance.now();show();draw(performance.now())}});
document.getElementById('motionToggle').addEventListener('click',e=>{reduce=!reduce;e.currentTarget.textContent='Motion: '+(reduce?'Reduced':'On');if(!reduce)draw(performance.now())});
document.getElementById('restartRide').addEventListener('click',()=>{cancelAnimationFrame(raf);scene=0;started=false;show();draw(performance.now())});
window.addEventListener('resize',resize);show();resize();})();
