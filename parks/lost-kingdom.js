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
function drawRuins(t){const base=h*.77,forward=reduce?0:(t*.045)%90;for(let i=0;i<7;i++){const x=((i*170+35)%(w+100))-50,ht=h*(.19+(i%3)*.075),y=base-ht+forward;ctx.fillStyle=i%2?'#1b3942':'#24444a';ctx.fillRect(x,y,75,ht);poly([[x-10,y],[x+37,y-40],[x+85,y]],'#355b5c','#71918a');for(let j=0;j<3;j++)rounded(x+15,y+25+j*36,10,20,4,'#f0c979')}for(let i=0;i<5;i++){const x=w*(i/4),y=h*(.28+(i%2)*.08)+forward*.45;ctx.strokeStyle='#7beaff44';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-18,y+55);ctx.lineTo(x+9,y+88);ctx.stroke()}}
function drawCar(t){
const scale=Math.min(w/760,h/430)*.9,x=w*.5,y=h*.80+(reduce?0:Math.sin(t*.009)*2);
ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
ctx.shadowColor='#00cfff66';ctx.shadowBlur=28;ellipse(0,12,145,20,'#020711aa');ctx.shadowBlur=0;
// Rear wheels, visible outside the body
for(const wx of [-116,116]){rounded(wx-22,-42,44,82,13,'#080d14','#526b76');ellipse(wx,0,18,27,'#647783');ellipse(wx,0,8,15,'#172b37')}
// Rugged rear body: wide bumper nearest the viewer, roof narrowing toward the horizon
poly([[-112,-151],[112,-151],[137,-92],[158,-12],[145,16],[-145,16],[-158,-12],[-137,-92]],'#173747','#9cecff');
const body=ctx.createLinearGradient(-150,-120,150,15);body.addColorStop(0,'#426b78');body.addColorStop(.55,'#203f4d');body.addColorStop(1,'#0c202d');
poly([[-112,-151],[112,-151],[137,-92],[145,-18],[-145,-18],[-137,-92]],body,'#9cecff');
// Rear window and roof
poly([[-78,-143],[78,-143],[105,-91],[-105,-91]],'#071c2a','#8deeff');
poly([[-63,-135],[63,-135],[83,-99],[-83,-99]],'#65c4d4aa','#b5f5ff');
// Rear hatch panel
poly([[-121,-83],[121,-83],[133,-26],[-133,-26]],'#193744','#6e9eaa');
rounded(-55,-72,110,36,7,'#102936','#7ceaff');
rounded(-42,-63,84,18,4,'#071722','#4f8492');
ctx.fillStyle='#d8e9e8';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText('KAEVORYN',0,-50);
// Red rear lamps and center brake strip
rounded(-137,-78,22,48,7,'#a92f3d','#ff8c87');rounded(115,-78,22,48,7,'#a92f3d','#ff8c87');
rounded(-54,0,108,12,4,'#9db4b5','#d7faff');
rounded(-28,-20,56,12,3,'#0b1824','#7ceaff');
ctx.fillStyle='#7eeaff';ctx.font='bold 8px system-ui';ctx.fillText('EXPLORER',0,-11);
// Gullwing doors open at the station, seen from behind
if(scene===0){
poly([[-112,-139],[-183,-198],[-222,-182],[-160,-93]],'#264e5d','#8deeff');
poly([[-125,-135],[-181,-184],[-199,-175],[-154,-112]],'#79d9e5aa','#d2fbff');
poly([[112,-139],[183,-198],[222,-182],[160,-93]],'#264e5d','#8deeff');
poly([[125,-135],[181,-184],[199,-175],[154,-112]],'#79d9e5aa','#d2fbff');
}
ctx.restore();
}
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
