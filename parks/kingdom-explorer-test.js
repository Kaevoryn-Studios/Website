(()=>{'use strict';
const canvas=document.getElementById('drive'),ctx=canvas.getContext('2d'),pause=document.getElementById('motion'),restart=document.getElementById('restart'),speed=document.getElementById('speed');
const tag=document.getElementById('chapterTag'),count=document.getElementById('chapterCount'),title=document.getElementById('chapterTitle'),story=document.getElementById('chapterText'),prompt=document.getElementById('choicePrompt'),choices=document.getElementById('choices');
const chapters=[
{tag:'THE CALL',title:'The Call of the Unknown',text:'A blue signal flickers beyond the mountains. The Explorer locks onto it. Your expedition begins.',prompt:'The trail divides ahead. Which way will you take?',options:[['ridge','Take the high ridge'],['forest','Follow the forest trail']],scene:0},
{tag:'THE WILD PASS',title:'The Wild Pass',text:'Ancient trees tower over the trail. Their leaves shimmer as the Explorer passes. Something enormous moves between the trunks.',prompt:'A fallen tree blocks the trail. How will you get around it?',options:[['stones','Cross the old stone path'],['grove','Take the narrow glowing grove']],scene:1},
{tag:'THE SUNKEN BRIDGE',title:'The Sunken Bridge',text:'The forest opens onto a deep ravine. Broken stone arches vanish into mist, and a forgotten bridge lies below.',prompt:'The Explorer reaches two possible crossings. Choose carefully.',options:[['bridge','Attempt the ancient bridge'],['tunnel','Search for a passage beneath']],scene:2},
{tag:'THE FORGOTTEN CITY',title:'The Forgotten City',text:'Beyond the ravine, towers rise from the vines. Lanterns ignite one by one. The lost kingdom is real—and it knows you are here.',prompt:'A sealed gate bears two symbols. Which will you awaken?',options:[['sun','Touch the sun emblem'],['moon','Touch the moon emblem']],scene:3},
{tag:'THE HEART TEMPLE',title:'The Heart of the Kingdom',text:'Inside the mountain, a crystal heart pulses with the same blue light that called you here. Its power is fading.',prompt:'The heart responds to your presence. What will you offer?',options:[['courage','Offer your courage'],['wonder','Offer your sense of wonder']],scene:4},
{tag:'THE KINGDOM AWAKENS',title:'The Kingdom Awakens',text:'The crystal heart shines. Rivers of light race through the city, the towers awaken, and the kingdom glows beneath the stars. Your expedition becomes part of its legend.',prompt:'Your journey is complete. What would you like to do?',options:[['again','Ride the adventure again'],['return','Return to Kingdoms']],scene:5}
];
let chapter=0,history=[],choiceTrail=[],w=0,h=0,dpr=1,offset=0,last=0,running=true,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function update(){const c=chapters[chapter];tag.textContent='CHAPTER '+String(chapter+1).padStart(2,'0')+' · '+c.tag;count.textContent='CHAPTER '+(chapter+1)+' OF 6';title.textContent=c.title;story.textContent=c.text;prompt.textContent=c.prompt;choices.replaceChildren();c.options.forEach(([value,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>select(value));choices.append(b)});speed.textContent=chapter===5?'KINGDOM RESTORED':running?'EXPLORING':'PAUSED';}
function select(v){if(v==='return'){location.href='kingdoms.html';return}if(v==='again'){chapter=0;history=[];choiceTrail=[];offset=0;running=true;pause.textContent='Pause journey';update();return}history.push(chapter);choiceTrail.push(v);if(chapter<5)chapter++;update()}
function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function oval(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function rr(x,y,a,b,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,a,b,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function tree(x,y,s,glow){ctx.fillStyle='#182b2b';ctx.fillRect(x-4*s,y-26*s,8*s,35*s);oval(x,y-35*s,19*s,27*s,glow?'#285c50':'#1e493e');if(glow){oval(x-5*s,y-39*s,5*s,7*s,'#82f5d088');}}
function drawWorld(){const cx=w/2,hor=h*.37,scene=chapters[chapter].scene;
 const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,scene===5?'#111b42':'#071827');sky.addColorStop(.55,scene===4?'#25465d':'#31576a');sky.addColorStop(1,'#101c22');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 // moon / distant signal
 oval(w*.78,h*.13,Math.max(13,w*.025),Math.max(13,w*.025),scene===5?'#d9f7ff':'#b9eaff');oval(w*.78,h*.13,Math.max(19,w*.035),Math.max(19,w*.035),'#9feaff22');
 if(scene===3||scene===5){for(let i=0;i<5;i++){const x=w*(.12+i*.19),y=hor-30-(i%2)*28;rr(x-17,y-60,34,100,3,'#314d5a','#a7c3b6');rr(x-8,y-42,16,23,2,scene===5?'#b8f8ff':'#e7c77c');}}
 if(scene===4){poly([[cx-w*.33,hor+15],[cx-w*.2,hor-100],[cx,hor-155],[cx+w*.2,hor-100],[cx+w*.33,hor+15]],'#304a5a','#b6d9d7');oval(cx,hor-45,28,28,'#78eaff');oval(cx,hor-45,48,48,'#72dfff33')}
 if(scene===2){poly([[0,hor+40],[w*.25,hor-30],[w*.42,h*.72],[0,h*.72]],'#263a40');poly([[w,hor+40],[w*.75,hor-30],[w*.58,h*.72],[w,h*.72]],'#263a40');}
 if(scene===1||scene===0){for(let i=0;i<10;i++){const x=w*(i/10),s=.7+(i%4)*.25;tree(x,hor+15+(i%3)*12,s,scene===1)}}
 if(scene===3||scene===5){for(let i=0;i<8;i++){const x=w*(i/8),s=.5+(i%3)*.25;tree(x,hor+25,s,true)}}
 // path / track with perspective
 const road=scene===2?'#3c4544':scene===3?'#4a4940':'#27343a';
 poly([[cx-w*.08,hor],[cx+w*.08,hor],[w*.99,h],[w*.01,h]],road);
 poly([[0,hor],[cx-w*.08,hor],[w*.01,h],[0,h]],scene===1?'#1c493b':'#183b35');poly([[cx+w*.08,hor],[w,hor],[w,h],[w*.99,h]],scene===1?'#1c493b':'#183b35');
 ctx.strokeStyle='#e1d2a177';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-w*.08,hor);ctx.lineTo(w*.01,h);ctx.moveTo(cx+w*.08,hor);ctx.lineTo(w*.99,h);ctx.stroke();
 for(let i=0;i<11;i++){const z=((i/11+offset)%1),y=hor+Math.pow(z,1.65)*(h-hor),lw=1+z*3;ctx.fillStyle=scene===5?'#9cecff':'#d8c99a';ctx.fillRect(cx-lw/2,y,lw,Math.max(2,z*17))}
 if(scene===2){poly([[cx-w*.18,h*.61],[cx+w*.18,h*.61],[cx+w*.24,h*.67],[cx-w*.24,h*.67]],'#897b61','#c4b28d');}
 if(scene===5){for(let i=0;i<18;i++){const x=(i*73+offset*200)%w,y=(i*37)%Math.max(1,h*.55);oval(x,y,2,2,'#a8f7ff')}}
}
function drawVehicle(){const cx=w/2,base=h*.92,s=Math.min(w/760,h/430)*.95;ctx.save();ctx.translate(cx,base);ctx.scale(s,s);oval(0,5,150,19,'#02070bcc');
 for(const x of [-119,119]){rr(x-22,-55,44,88,12,'#080d14','#6c8994');rr(x-12,-39,24,55,8,'#263a45','#91a9ad')}
 const paint=ctx.createLinearGradient(0,-170,0,0);paint.addColorStop(0,'#527987');paint.addColorStop(.48,'#244858');paint.addColorStop(1,'#102b39');
 poly([[-91,-177],[91,-177],[120,-121],[132,-28],[-132,-28],[-120,-121]],paint,'#a8f3ff');poly([[-70,-166],[70,-166],[94,-116],[-94,-116]],'#071b29','#8deeff');poly([[-59,-158],[59,-158],[78,-121],[-78,-121]],'#397b89','#a8efff');
 poly([[-116,-110],[116,-110],[132,-28],[-132,-28]],'#193744','#729daa');rr(-118,-100,22,43,7,'#c13d47','#ffaaa0');rr(96,-100,22,43,7,'#c13d47','#ffaaa0');rr(-112,-94,10,30,4,'#ff6b65');rr(102,-94,10,30,4,'#ff6b65');rr(-52,-72,104,35,7,'#102936','#7ceaff');ctx.fillStyle='#dffaff';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('K A E V O R Y N',0,-50);rr(-62,-15,124,12,4,'#91aeb7','#d7faff');rr(-32,-35,64,11,4,'#071722','#7ceaff');for(const x of [-119,119])oval(x,-12,9,13,'#76eaff');ctx.restore()}
function draw(){ctx.clearRect(0,0,w,h);drawWorld();drawVehicle()}
function frame(now){const dt=Math.min(50,now-last||16);last=now;if(running&&!reduce)offset=(offset+dt*.0002)%1;draw();requestAnimationFrame(frame)}
pause.addEventListener('click',()=>{running=!running;pause.textContent=running?'Pause journey':'Resume journey';speed.textContent=running?'EXPLORING':'PAUSED'});
restart.addEventListener('click',()=>{chapter=0;history=[];choiceTrail=[];offset=0;running=true;pause.textContent='Pause journey';update()});
new ResizeObserver(resize).observe(canvas);update();resize();if(!reduce)requestAnimationFrame(frame);else draw();
})();