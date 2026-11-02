(()=>{'use strict';
const canvas=document.getElementById('drive'),ctx=canvas.getContext('2d'),pause=document.getElementById('motion'),restart=document.getElementById('restart'),speed=document.getElementById('speed');
let w=0,h=0,dpr=1,running=true,offset=0,last=0,raf=0,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw(0)}
function path(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function rounded(x,y,a,b,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,a,b,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function drawRoad(){const horizon=h*.36,cx=w/2;const sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#071827');sky.addColorStop(1,'#31576a');ctx.fillStyle=sky;ctx.fillRect(0,0,w,horizon);
 // distant mountains and gateway
 path([[0,horizon+15],[w*.16,horizon-35],[w*.29,horizon+8],[w*.43,horizon-48],[w*.58,horizon+7],[w*.77,horizon-42],[w,horizon+15],[w,horizon+90],[0,horizon+90]],'#172f3b');
 const gx=cx,gw=w*.24;ctx.strokeStyle='#b6a77b';ctx.lineWidth=Math.max(5,w*.009);ctx.beginPath();ctx.moveTo(gx-gw,horizon+80);ctx.lineTo(gx-gw,horizon-8);ctx.lineTo(gx,horizon-48);ctx.lineTo(gx+gw,horizon-8);ctx.lineTo(gx+gw,horizon+80);ctx.stroke();
 // road perspective
 path([[cx-w*.075,horizon+12],[cx+w*.075,horizon+12],[w*.98,h],[w*.02,h]],'#27343a');
 path([[0,horizon+12],[cx-w*.075,horizon+12],[w*.02,h],[0,h]],'#183b35');path([[cx+w*.075,horizon+12],[w,horizon+12],[w,h],[w*.98,h]],'#183b35');
 // lane edges
 ctx.strokeStyle='#d8c99a88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-w*.075,horizon+12);ctx.lineTo(w*.02,h);ctx.moveTo(cx+w*.075,horizon+12);ctx.lineTo(w*.98,h);ctx.stroke();
 for(let i=0;i<9;i++){const z=((i/9+offset)%1),y=horizon+Math.pow(z,1.65)*(h-horizon),half=(w*.075)+(w*.40)*Math.pow(z,1.65),lw=1+z*3;ctx.fillStyle='#f0e5bf';ctx.fillRect(cx-lw/2,y,lw,Math.max(2,z*20))}
 // trees at edges, grow toward viewer
 for(let i=0;i<13;i++){const z=((i/13+offset*.7)%1),y=horizon+Math.pow(z,1.5)*(h-horizon),scale=.2+z*1.5;for(const side of [-1,1]){const x=cx+side*(w*.13+z*w*.46);ctx.fillStyle='#142b2d';ctx.fillRect(x-3*scale,y-25*scale,6*scale,30*scale);ellipse(x,y-30*scale,15*scale,23*scale,'#1e493e')}}
}
function drawVehicle(){const cx=w/2,base=h*.91,s=Math.min(w/760,h/430)*.95;ctx.save();ctx.translate(cx,base);ctx.scale(s,s);
 // shadow and tires: wide rear track makes vehicle orientation unmistakably forward
 ellipse(0,5,150,19,'#02070bcc');
 for(const x of [-119,119]){rounded(x-22,-55,44,88,12,'#080d14','#6c8994');rounded(x-12,-39,24,55,8,'#263a45','#91a9ad');}
 // body shell, roof toward vanishing point, rear closest to camera
 path([[-91,-177],[91,-177],[120,-121],[145,-24],[132,0],[-132,0],[-145,-24],[-120,-121]],'#244858','#9cecff');
 const paint=ctx.createLinearGradient(0,-170,0,0);paint.addColorStop(0,'#527987');paint.addColorStop(.48,'#244858');paint.addColorStop(1,'#102b39');
 path([[-91,-177],[91,-177],[120,-121],[132,-28],[-132,-28],[-120,-121]],paint,'#a8f3ff');
 // roof / rear glass
 path([[-70,-166],[70,-166],[94,-116],[-94,-116]],'#071b29','#8deeff');
 path([[-59,-158],[59,-158],[78,-121],[-78,-121]],'#397b89','#a8efff');
 // tailgate and bumper
 path([[-116,-110],[116,-110],[132,-28],[-132,-28]],'#193744','#729daa');
 rounded(-118,-100,22,43,7,'#c13d47','#ffaaa0');rounded(96,-100,22,43,7,'#c13d47','#ffaaa0');rounded(-112,-94,10,30,4,'#ff6b65');rounded(102,-94,10,30,4,'#ff6b65');
 rounded(-52,-72,104,35,7,'#102936','#7ceaff');ctx.fillStyle='#dffaff';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('K A E V O R Y N',0,-50);
 rounded(-62,-15,124,12,4,'#91aeb7','#d7faff');rounded(-32,-35,64,11,4,'#071722','#7ceaff');
 // wheels and blue wheel hubs
 for(const x of [-119,119])ellipse(x,-12,9,13,'#76eaff');
 ctx.restore();
}
function draw(dt){ctx.clearRect(0,0,w,h);drawRoad();drawVehicle()}
function frame(now){const dt=Math.min(50,now-last||16);last=now;if(running&&!reduce)offset=(offset+dt*.00022)%1;draw(dt);raf=requestAnimationFrame(frame)}
pause.addEventListener('click',()=>{running=!running;pause.textContent=running?'Pause motion':'Resume motion';speed.textContent=running?'CRUISING':'PAUSED'});
restart.addEventListener('click',()=>{offset=0;running=true;pause.textContent='Pause motion';speed.textContent='CRUISING'});
new ResizeObserver(resize).observe(canvas);resize();if(!reduce)raf=requestAnimationFrame(frame);else draw(0);
})();