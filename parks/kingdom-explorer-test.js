(()=>{'use strict';
const canvas=document.getElementById('drive'),ctx=canvas.getContext('2d'),pause=document.getElementById('motion'),restart=document.getElementById('restart'),speed=document.getElementById('speed');
const tag=document.getElementById('chapterTag'),count=document.getElementById('chapterCount'),title=document.getElementById('chapterTitle'),story=document.getElementById('chapterText'),prompt=document.getElementById('choicePrompt'),choices=document.getElementById('choices'),progressFill=document.getElementById('progressFill'),progressLabel=document.getElementById('progressLabel'),routeLog=document.getElementById('routeLog');
const chapters=[
{tag:'THE CALL',title:'The Call of the Unknown',text:'A blue signal flickers beyond the mountains. The Explorer locks onto it. Your expedition begins.',prompt:'The trail divides ahead. Which way will you take?',options:[['ridge','Take the high ridge'],['forest','Follow the forest trail']],scene:0},
{tag:'THE WILD PASS',title:'The Wild Pass',text:'Ancient trees tower over the trail. Their leaves shimmer as the Explorer passes. Something enormous moves between the trunks.',prompt:'A fallen tree blocks the trail. How will you get around it?',options:[['stones','Cross the old stone path'],['grove','Take the narrow glowing grove']],scene:1},
{tag:'THE SUNKEN BRIDGE',title:'The Sunken Bridge',text:'The forest opens onto a deep ravine. Broken stone arches vanish into mist, and a forgotten bridge lies below.',prompt:'The Explorer reaches two possible crossings. Choose carefully.',options:[['bridge','Attempt the ancient bridge'],['tunnel','Search for a passage beneath']],scene:2},
{tag:'THE FORGOTTEN CITY',title:'The Forgotten City',text:'Beyond the ravine, towers rise from the vines. Lanterns ignite one by one. The lost kingdom is real—and it knows you are here.',prompt:'A sealed gate bears two symbols. Which will you awaken?',options:[['sun','Touch the sun emblem'],['moon','Touch the moon emblem']],scene:3},
{tag:'THE HEART TEMPLE',title:'The Heart of the Kingdom',text:'Inside the mountain, a crystal heart pulses with the same blue light that called you here. Its power is fading.',prompt:'The heart responds to your presence. What will you offer?',options:[['courage','Offer your courage'],['wonder','Offer your sense of wonder']],scene:4},
{tag:'THE KINGDOM AWAKENS',title:'The Kingdom Awakens',text:'The crystal heart shines. Rivers of light race through the city, the towers awaken, and the kingdom glows beneath the stars. Your expedition becomes part of its legend.',prompt:'Your journey is complete. What would you like to do?',options:[['again','Ride the adventure again'],['return','Return to Kingdoms']],scene:5}
];
let chapter=0,history=[],choiceTrail=[],w=0,h=0,dpr=1,offset=0,last=0,running=true,transition=0,startup=0,viewMode='outside',reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function update(){const c=chapters[chapter];tag.textContent='CHAPTER '+String(chapter+1).padStart(2,'0')+' · '+c.tag;count.textContent='CHAPTER '+(chapter+1)+' OF 6';title.textContent=c.title;
 const consequences=[
 {ridge:'The high ridge gives you a clear view of the valley. You spot the ancient road before the mist closes in.',forest:'The deep forest answers your signal. Tiny blue lights gather along the trail, guiding the Explorer onward.'},
 {stones:'The old stone path holds firm. Its carved markings reveal that the kingdom once guarded this route.',grove:'The glowing grove parts around the vehicle. The leaves shimmer and leave a trail of light behind you.'},
 {bridge:'You cross the ancient bridge above the roaring depths. Far below, something huge stirs in the water.',tunnel:'The hidden passage leads beneath the ravine. You emerge beside a forgotten aqueduct, avoiding the dangerous crossing.'},
 {sun:'The sun emblem blazes gold. The city gates open, and warm light awakens the towers.',moon:'The moon emblem glows silver-violet. A quiet energy unlocks a secret entrance through the old city.'},
 {courage:'You offer your courage. The crystal heart answers with a brilliant blue pulse.',wonder:'You offer your wonder. The crystal heart blooms with violet and silver light.'}
 ];
 const detail=chapter>0&&chapter<5?consequences[chapter-1]?.[choiceTrail[chapter-1]]:'';
 const finale=chapter===5?choiceTrail.map((v,i)=>consequences[i]?.[v]).filter(Boolean).join(' '):'';
 story.textContent=c.text+(detail?' '+detail:'')+(finale?' '+finale:'');
 prompt.textContent=c.prompt;progressFill.style.width=(choiceTrail.length/5*100)+'%';progressLabel.textContent=choiceTrail.length+' OF 5 CHOICES';const routeNames={ridge:'High Ridge',forest:'Deep Forest',stones:'Old Stone Path',grove:'Glowing Grove',bridge:'Ancient Bridge',tunnel:'Hidden Tunnel',sun:'Sun Gate',moon:'Moon Gate',courage:'Courage',wonder:'Wonder'};routeLog.textContent=choiceTrail.length?choiceTrail.map((v,i)=>(i+1)+'. '+routeNames[v]).join('  ·  '):'Your route will be recorded as you make discoveries.';choices.replaceChildren();c.options.forEach(([value,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>select(value));choices.append(b)});speed.textContent=chapter===5?'KINGDOM RESTORED':running?'EXPLORING':'PAUSED';}
function select(v){if(v==='return'){location.href='kingdoms.html';return}if(v==='again'){chapter=0;history=[];choiceTrail=[];offset=0;running=true;pause.textContent='Pause journey';update();return}history.push(chapter);choiceTrail.push(v);if(chapter<5)chapter++;transition=reduce?0:1;update()}
function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function oval(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function rr(x,y,a,b,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,a,b,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function tree(x,y,s,glow){ctx.fillStyle='#182b2b';ctx.fillRect(x-4*s,y-26*s,8*s,35*s);oval(x,y-35*s,19*s,27*s,glow?'#285c50':'#1e493e');if(glow){oval(x-5*s,y-39*s,5*s,7*s,'#82f5d088');}}
function drawWorld(){const cx=w/2,hor=h*.37,scene=chapters[chapter].scene,route=choiceTrail[0]||'';
 const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,scene===5?'#111b42':'#071827');sky.addColorStop(.55,scene===4?'#25465d':'#31576a');sky.addColorStop(1,'#101c22');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 // moon / distant signal
 oval(w*.78,h*.13,Math.max(13,w*.025),Math.max(13,w*.025),scene===5?'#d9f7ff':'#b9eaff');oval(w*.78,h*.13,Math.max(19,w*.035),Math.max(19,w*.035),'#9feaff22');
 if(scene===3||scene===5){for(let i=0;i<5;i++){const x=w*(.12+i*.19),y=hor-30-(i%2)*28;rr(x-17,y-60,34,100,3,'#314d5a','#a7c3b6');rr(x-8,y-42,16,23,2,scene===5?'#b8f8ff':'#e7c77c');}if(scene===3&&choiceTrail[3]==='moon'){ctx.fillStyle='#c69aff';ctx.font='bold 25px Georgia';ctx.textAlign='center';ctx.fillText('☾',w/2,hor-65)}else if(scene===3&&choiceTrail[3]==='sun'){ctx.fillStyle='#ffd477';ctx.font='bold 25px Georgia';ctx.textAlign='center';ctx.fillText('☼',w/2,hor-65)}}
 if(scene===4){poly([[cx-w*.33,hor+15],[cx-w*.2,hor-100],[cx,hor-155],[cx+w*.2,hor-100],[cx+w*.33,hor+15]],'#304a5a','#b6d9d7');const heart=choiceTrail[3]==='moon'?'#c69aff':choiceTrail[3]==='sun'?'#ffd477':'#78eaff';oval(cx,hor-45,28,28,heart);oval(cx,hor-45,48,48,heart+'44')}
 if(scene===2){poly([[0,hor+40],[w*.25,hor-30],[w*.42,h*.72],[0,h*.72]],'#263a40');poly([[w,hor+40],[w*.75,hor-30],[w*.58,h*.72],[w,h*.72]],'#263a40');}
 if(scene===1||scene===0){for(let i=0;i<10;i++){const z=((i/10+offset*.24)%1),depth=Math.pow(z,1.5),x=w*(i/10),s=(.38+z*.92)*(.7+(i%4)*.18);tree(x,hor+12+depth*h*.3,s,scene===1||route==='forest')}if(route==='ridge'){poly([[0,hor+35],[w*.18,hor-45],[w*.34,hor+25]],'#53616a','#9fb9c1');poly([[w,hor+30],[w*.82,hor-50],[w*.66,hor+25]],'#53616a','#9fb9c1')}}
 if(scene===3||scene===5){for(let i=0;i<8;i++){const z=((i/8+offset*.2)%1),depth=Math.pow(z,1.45),x=w*(i/8),s=(.3+z*.7)*(.5+(i%3)*.18);tree(x,hor+20+depth*h*.25,s,true)}}
 // waterfalls spilling into the ravine
 if(scene===2){for(const side of [-1,1]){const x=cx+side*w*.34;const water=ctx.createLinearGradient(x,hor-35,x+side*8,h*.78);water.addColorStop(0,'#b6f5ff');water.addColorStop(.45,'#39bce0');water.addColorStop(1,'#155c85');ctx.fillStyle=water;ctx.beginPath();ctx.moveTo(x-side*13,hor-28);ctx.lineTo(x+side*13,hor-28);ctx.lineTo(x+side*34,h*.76);ctx.lineTo(x-side*22,h*.76);ctx.closePath();ctx.fill();for(let k=0;k<5;k++){const yy=hor+((k*31+offset*240)%(h*.38));ctx.fillStyle='#c7f7ff99';ctx.fillRect(x-5+(k%2)*8,yy,2,12)}}}
 // Moving atmosphere: drifting ravine mist, waterfall spray and windblown leaves
 if(scene===2){
  for(let i=0;i<9;i++){
   const x=((i*113+offset*34)%(w+100))-50,y=hor+55+(i%4)*h*.095;
   ctx.globalAlpha=.09+(i%3)*.035;oval(x,y,24+(i%4)*12,5+(i%3)*3,'#c9f3f4');
  }
  ctx.globalAlpha=.45;
  for(let side of [-1,1]){const x=cx+side*w*.34;for(let i=0;i<8;i++){const y=hor+((i*23+offset*180)%(h*.38));oval(x+Math.sin(i+offset*2)*8,y,1.5+i%3,2.5+i%2,'#c8f7ff')}}
 }
 if(scene===0||scene===1){
  for(let i=0;i<18;i++){
   const z=((i/18+offset*.32)%1),x=(i*79+Math.sin(offset*2+i)*18)%w,y=hor+25+z*h*.28;
   ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(offset*3+i)*.55);
   ctx.globalAlpha=.35+z*.5;ctx.fillStyle=i%3===0?'#b5f1a1':i%3===1?'#6fe0c0':'#d6c78e';
   ctx.beginPath();ctx.ellipse(0,0,2+z*3,1+z*1.5,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }
 }
 if(scene===5){
  ctx.save();ctx.globalAlpha=.17;
  for(let band=0;band<3;band++){
   ctx.strokeStyle=band%2?'#c69aff':'#7eeaff';ctx.lineWidth=8+band*4;
   ctx.beginPath();for(let x=0;x<=w;x+=w/18){const y=hor*.42+band*15+Math.sin(x/w*Math.PI*2+offset*.8+band)*13;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
  }ctx.restore();
 }
 ctx.globalAlpha=1;
 // glowing wildlife: fireflies and distant eyes in the forest
 if(scene===1||scene===0){for(let i=0;i<16;i++){const x=(i*67+Math.sin(offset*7+i)*12)%w,y=hor+25+(i*29)%(h*.36);oval(x,y,2.2,2.2,i%3===0?'#ffe58c':'#8effd5');}if(scene===1){for(const x of [w*.22,w*.76]){oval(x,hor+40,3,2,'#f6e6a8');oval(x+9,hor+40,3,2,'#f6e6a8')}}}
 // monumental kingdom skyline and dramatic finale aurora
 if(scene===5){const crownY=hor-115;poly([[cx-w*.34,hor+28],[cx-w*.28,crownY+35],[cx-w*.19,crownY+55],[cx-w*.12,crownY-15],[cx-w*.04,crownY+42],[cx,crownY-75],[cx+w*.04,crownY+42],[cx+w*.12,crownY-15],[cx+w*.19,crownY+55],[cx+w*.28,crownY+35],[cx+w*.34,hor+28]],'#263d59','#b9eaff');const aura=ctx.createRadialGradient(cx,crownY-35,8,cx,crownY-35,w*.42);aura.addColorStop(0,choiceTrail[4]==='wonder'?'#c79aff66':'#75eaff66');aura.addColorStop(1,'#75eaff00');ctx.fillStyle=aura;ctx.fillRect(0,0,w,h*.72);for(let i=0;i<7;i++){const x=w*(.08+i*.14);rr(x-3,hor-15,6,34,2,'#ffd987');oval(x,hor-18,7,7,'#fff0b4')}}

 // Fast roadside rush: layered streaks slide toward the Explorer with depth
 const rush=offset*1.0;
 for(let side of [-1,1]){
  for(let i=0;i<22;i++){
   const z=((i/22+rush)%1),y=hor+Math.pow(z,1.55)*(h-hor);
   const edge=cx+side*(w*.085+Math.pow(z,1.25)*w*.43);
   const length=5+z*24,width=1+z*2;
   ctx.globalAlpha=.16+z*.42;ctx.strokeStyle=(i%4===0)?'#a8edff':'#b5d6a0';
   ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(edge,y);ctx.lineTo(edge-side*length*.22,y+length);ctx.stroke();
   if(i%3===0){ctx.globalAlpha=.28+z*.35;oval(edge-side*length*.35,y+length,1+z*2,1+z*2,i%2?'#8deaff':'#d7c78e')}
  }
 }
 ctx.globalAlpha=1;
 // winding expedition road with a gentle changing bend
 const road=scene===2?'#3c4544':scene===3?'#4a4940':'#27343a';
 // Keep the roadway straight and symmetrical so the center dashes stay on its true centerline.
 const roadCenter=z=>cx;
 const edgeAt=(z,side)=>roadCenter(z)+side*w*(.08+.41*Math.pow(z,1.2));
 ctx.beginPath();ctx.moveTo(edgeAt(0,-1),hor);ctx.lineTo(edgeAt(0,1),hor);ctx.lineTo(edgeAt(1,1),h);ctx.lineTo(edgeAt(1,-1),h);ctx.closePath();ctx.fillStyle=road;ctx.fill();
 ctx.beginPath();ctx.moveTo(0,hor);ctx.lineTo(edgeAt(0,-1),hor);ctx.lineTo(edgeAt(1,-1),h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=scene===1?'#1c493b':'#183b35';ctx.fill();
 ctx.beginPath();ctx.moveTo(edgeAt(0,1),hor);ctx.lineTo(w,hor);ctx.lineTo(w,h);ctx.lineTo(edgeAt(1,1),h);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#e1d2a177';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(edgeAt(0,-1),hor);ctx.lineTo(edgeAt(1,-1),h);ctx.moveTo(edgeAt(0,1),hor);ctx.lineTo(edgeAt(1,1),h);ctx.stroke();
// Foreground roadside trees: full, recognizable conifers rather than glowing oval crowns.
 if(scene===0||scene===1||scene===3||scene===5){
  for(const side of [-1,1]){
   for(let i=0;i<6;i++){
    const z=((i/6+offset*.72+(side===1?.11:0))%1),depth=Math.pow(z,1.45);
    const y=hor+depth*(h-hor),x=edgeAt(depth,side)+side*(30+depth*48);
    const s=.28+depth*1.35,treeH=76*s;
    ctx.save();ctx.globalAlpha=.68+depth*.32;
    ctx.fillStyle='#503b2b';ctx.fillRect(x-2.6*s,y-22*s,5.2*s,22*s);
    ctx.fillStyle=scene===5?'#315b68':scene===3?'#344b43':'#1d4938';
    const tiers=[{tip:.98,base:.58,half:.22},{tip:.77,base:.37,half:.32},{tip:.55,base:.12,half:.43}];
    for(const t of tiers){ctx.beginPath();ctx.moveTo(x,y-treeH*t.tip);ctx.lineTo(x-treeH*t.half,y-treeH*t.base);ctx.lineTo(x+treeH*t.half,y-treeH*t.base);ctx.closePath();ctx.fill();}
    ctx.strokeStyle='#6c9b86';ctx.lineWidth=Math.max(1,.9*s);
    ctx.beginPath();ctx.moveTo(x,y-treeH*.98);ctx.lineTo(x-treeH*.22,y-treeH*.58);ctx.stroke();
    ctx.restore();
   }
  }
 }
 for(let i=0;i<11;i++){const z=((i/11+offset*.82)%1),depth=Math.pow(z,1.65),y=hor+depth*(h-hor),markX=roadCenter(depth),lw=1+z*3;ctx.fillStyle=scene===5?'#9cecff':'#d8c99a';ctx.fillRect(markX-lw/2,y,lw,Math.max(2,z*17))}
 // Perspective roadside landmarks: old stone posts and boulders stay outside the driving lane
 for(const side of [-1,1]){
  for(let i=0;i<7;i++){
   const z=((i/7+offset*.3)%1),depth=Math.pow(z,1.55),y=hor+depth*(h-hor);
   const x=edgeAt(depth,side)+side*(9+z*16),size=3+z*13;
   ctx.save();ctx.globalAlpha=.42+z*.58;
   if(scene===3||scene===5){
    ctx.fillStyle=scene===5?'#557f91':'#716b59';ctx.strokeStyle=scene===5?'#a8f5ff':'#c6b58b';ctx.lineWidth=Math.max(1,z*1.5);
    ctx.fillRect(x-size*.42,y-size*2.2,size*.84,size*2.2);ctx.strokeRect(x-size*.42,y-size*2.2,size*.84,size*2.2);
    ctx.fillStyle=scene===5?'#8deeff':'#e7d39b';ctx.fillRect(x-size*.18,y-size*1.65,size*.36,size*.28);
   }else{
    // Distinct ancient rune-stones instead of plain round roadside shapes
    const stone=scene===2?'#53636a':'#294c40',rune=scene===2?'#9ceeff':'#78f5d5';
    ctx.fillStyle=stone;ctx.strokeStyle=scene===2?'#9ab8c1':'#6e9b79';ctx.lineWidth=Math.max(1,z*1.4);
    ctx.beginPath();ctx.moveTo(x-size*.72,y);ctx.lineTo(x-size*.58,y-size*.88);ctx.lineTo(x-size*.12,y-size*1.45);ctx.lineTo(x+size*.5,y-size*1.28);ctx.lineTo(x+size*.8,y-size*.42);ctx.lineTo(x+size*.48,y+size*.08);ctx.closePath();ctx.fill();ctx.stroke();
    // A carved glowing rune gives each marker a magical identity
    ctx.save();ctx.globalAlpha=(.28+z*.62);ctx.strokeStyle=rune;ctx.shadowColor=rune;ctx.shadowBlur=2+z*7;ctx.lineWidth=Math.max(1,z*1.8);
    ctx.beginPath();ctx.moveTo(x,y-size*1.05);ctx.lineTo(x-size*.22,y-size*.62);ctx.lineTo(x+size*.2,y-size*.43);ctx.lineTo(x-size*.08,y-size*.18);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+size*.12,y-size*.72);ctx.lineTo(x+size*.28,y-size*.48);ctx.lineTo(x+size*.05,y-size*.29);ctx.stroke();ctx.restore();
   }
   ctx.restore();
  }
 }
 // Glowing crystal clusters and ancient path lanterns add depth without entering the road
 if(scene===1||scene===4||scene===5){
  for(const side of [-1,1]){
   for(let i=0;i<4;i++){
    const z=((i/4+offset*.28+(side===1?.13:0))%1),depth=Math.pow(z,1.58),y=hor+depth*(h-hor);
    const x=edgeAt(depth,side)+side*(9+z*17),size=2+z*9;
    ctx.save();ctx.globalAlpha=.35+z*.65;
    const crystal=scene===5?'#a9f5ff':scene===4?'#b99aff':'#65eaff';
    ctx.shadowColor=crystal;ctx.shadowBlur=3+z*10;ctx.fillStyle=crystal;ctx.strokeStyle='#e4fbff';
    ctx.beginPath();ctx.moveTo(x,y-size*2.2);ctx.lineTo(x+size*.42,y-size*.72);ctx.lineTo(x+size*.2,y);ctx.lineTo(x-size*.38,y);ctx.lineTo(x-size*.5,y-size*.8);ctx.closePath();ctx.fill();ctx.stroke();
    if(i%2===0){ctx.shadowBlur=0;ctx.fillStyle='#f4d78c';ctx.fillRect(x+side*size*1.3,y-size*2.4,size*.34,size*1.4);oval(x+side*size*1.47,y-size*2.55,size*.8,size*.8,'#ffe4a0')}
    ctx.restore();
   }
  }
 }
 if(scene===2){if(choiceTrail[2]==='tunnel'){ctx.strokeStyle='#a7d8e5';ctx.lineWidth=10;ctx.beginPath();ctx.arc(cx,h*.66,w*.15,Math.PI,0);ctx.stroke();ctx.fillStyle='#07131d';ctx.fillRect(cx-w*.145,h*.66,w*.29,h*.2)}else{poly([[cx-w*.22,h*.61],[cx+w*.22,h*.61],[cx+w*.27,h*.68],[cx-w*.27,h*.68]],'#897b61','#c4b28d');for(let i=0;i<5;i++)rr(cx-w*.17+i*w*.085,h*.62,3,22,1,'#c5b48d')}}
 if(scene===5){for(let i=0;i<18;i++){const x=(i*73+offset*200)%w,y=(i*37)%Math.max(1,h*.55);oval(x,y,2,2,'#a8f7ff')}const glow=choiceTrail[4]==='wonder'?'#c69aff':'#7eeaff';oval(cx,h*.28,34,34,glow);oval(cx,h*.28,54,54,glow+'33')}
 // Continuous, non-repeating expedition scenery: each world segment has its own stable landmarks.
 // Unlike the decorative loops above, this stream never wraps back to its first segment.
 const worldTravel=offset*1.65,firstSegment=Math.floor(worldTravel),segmentCount=14;
 const worldRand=(n,salt)=>{const v=Math.sin(n*127.1+salt*311.7)*43758.5453;return v-Math.floor(v)};
 for(let n=firstSegment;n<firstSegment+segmentCount;n++){
  const progress=worldTravel-n;
  if(progress<-.1||progress>segmentCount)continue;
  const z=1-progress/segmentCount,depth=Math.pow(Math.max(0,Math.min(1,z)),1.55);
  if(depth<.015)continue;
  const scale=.22+depth*1.18,y=hor+depth*(h-hor);
  for(const side of [-1,1]){
   const seed=worldRand(n,side+7),x=edgeAt(depth,side)+side*(24+seed*48+depth*22);
   ctx.save();ctx.globalAlpha=.42+depth*.58;
   if(seed<.58){
    // Strong, unmistakable pine silhouette with broad, overlapping triangular boughs.
    const treeH=(68+seed*38)*scale, trunkW=4.5*scale;
    const foliage=scene===5?'#477d79':scene===4?'#354e58':seed<.28?'#285c50':'#244b3d';
    ctx.fillStyle='#59432f';
    ctx.fillRect(x-trunkW/2,y-treeH*.28,trunkW,treeH*.28);
    ctx.fillStyle=foliage;
    const tiers=[
     {tip:.98,base:.57,half:.19},
     {tip:.76,base:.34,half:.29},
     {tip:.53,base:.10,half:.39}
    ];
    for(const t of tiers){
     ctx.beginPath();
     ctx.moveTo(x,y-treeH*t.tip);
     ctx.lineTo(x-treeH*t.half,y-treeH*t.base);
     ctx.lineTo(x+treeH*t.half,y-treeH*t.base);
     ctx.closePath();ctx.fill();
    }
    // Dark side bough gives the tree depth rather than a glowing round crown.
    ctx.fillStyle='#142d27';
    ctx.beginPath();ctx.moveTo(x,y-treeH*.78);ctx.lineTo(x-treeH*.25,y-treeH*.38);ctx.lineTo(x-treeH*.03,y-treeH*.43);ctx.closePath();ctx.fill();
   }else{
    const stoneW=(9+seed*8)*scale,stoneH=(22+seed*24)*scale;
    ctx.fillStyle=scene===2?'#53636a':scene>=3?'#59666a':'#40564b';
    ctx.strokeStyle=scene===5?'#a8f5ff':'#8eb9a7';ctx.lineWidth=Math.max(1,scale);
    ctx.beginPath();ctx.moveTo(x-stoneW*.55,y);ctx.lineTo(x-stoneW*.45,y-stoneH*.72);ctx.lineTo(x,y-stoneH);ctx.lineTo(x+stoneW*.5,y-stoneH*.8);ctx.lineTo(x+stoneW*.62,y-stoneH*.12);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=scene===5?'#b8f7ff':'#8affd4';ctx.beginPath();ctx.moveTo(x,y-stoneH*.78);ctx.lineTo(x-stoneW*.18,y-stoneH*.48);ctx.lineTo(x+stoneW*.2,y-stoneH*.28);ctx.stroke();
   }
   ctx.restore();
  }
 }
 // expedition route label
 if(route){const labels={ridge:'ROUTE · HIGH RIDGE',forest:'ROUTE · DEEP FOREST'};ctx.fillStyle='#061522bb';ctx.fillRect(12,h-38,Math.min(w-24,205),25);ctx.fillStyle='#a8f5ff';ctx.font='bold 10px system-ui';ctx.textAlign='left';ctx.fillText(labels[route]||'EXPEDITION · '+route.toUpperCase(),22,h-21)}
}
function drawVehicle(){
 const cx=w/2,s=Math.min(w/760,h/430)*.95,base=h-36*s,phase=offset*Math.PI*2,pulse=.5+.5*Math.sin(phase*1.8);
 ctx.save();ctx.translate(cx,base);ctx.scale(s,s);
 oval(0,38,174,15,'#02070dcc');
 // Four rugged wheel faces and reinforced fender arches.
 for(const x of [-126,126]){
  rr(x-28,-66,56,104,15,'#05090f','#536b79');
  for(let i=0;i<6;i++){
   ctx.save();ctx.translate(x,-16);ctx.rotate(i*Math.PI/3);
   ctx.fillStyle='#7d929c';ctx.fillRect(-2,-48,4,13);ctx.restore();
  }
  oval(x,-14,19,21,'#142536','#829eaa');
  oval(x,-14,12,14,'#263f55','#7eeaff');
  oval(x,-14,4,5,'#d8fbff');
  ctx.strokeStyle='#8ba6b3';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(x,-35,31,Math.PI,Math.PI*2);ctx.stroke();
 }
 // Broad, raised expedition chassis with protective lower armor.
 const paint=ctx.createLinearGradient(-160,-190,160,-8);
 paint.addColorStop(0,'#183b70');paint.addColorStop(.3,'#087f9d');
 paint.addColorStop(.62,'#30266e');paint.addColorStop(1,'#071a35');
 poly([[-104,-178],[104,-178],[139,-126],[151,-43],[132,-25],[-132,-25],[-151,-43],[-139,-126]],paint,'#a8f3ff');
 // Gullwing doors are raised on both sides, with visible hinges and glass.
 poly([[-82,-137],[-112,-207],[-177,-222],[-158,-151],[-111,-112]],'#123b58','#a8f3ff');
 poly([[82,-137],[112,-207],[177,-222],[158,-151],[111,-112]],'#34265f','#d8b5ff');
 poly([[-111,-190],[-166,-207],[-151,-157],[-119,-133]],'#061b2b','#71eaff');
 poly([[111,-190],[166,-207],[151,-157],[119,-133]],'#15162f','#c69aff');
 ctx.strokeStyle='#d9faff';ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(-82,-137);ctx.lineTo(-112,-207);ctx.lineTo(-177,-222);
 ctx.moveTo(82,-137);ctx.lineTo(112,-207);ctx.lineTo(177,-222);ctx.stroke();
 rr(-91,-145,18,10,4,'#b5eaff','#efffff');rr(73,-145,18,10,4,'#b5eaff','#efffff');
 // Panoramic roof glass and reinforced roof rails.
 poly([[-75,-169],[75,-169],[101,-122],[-101,-122]],'#061421','#8deeff');
 poly([[-62,-161],[62,-161],[82,-127],[-82,-127]],'#24516c','#a8efff');
 ctx.strokeStyle='#9df4ff';ctx.lineWidth=4;
 ctx.beginPath();ctx.moveTo(-91,-173);ctx.lineTo(91,-173);ctx.stroke();
 // Hood and sculpted front fascia.
 poly([[-121,-112],[121,-112],[139,-45],[-139,-45]],'#102a50','#729daa');
 poly([[-91,-108],[91,-108],[105,-64],[-105,-64]],'#123d5b','#6deaff');
 ctx.strokeStyle='#72f4ff';ctx.lineWidth=2;ctx.shadowColor='#20dfff';ctx.shadowBlur=10;
 ctx.beginPath();ctx.moveTo(-83,-99);ctx.lineTo(-52,-83);ctx.lineTo(-69,-67);ctx.lineTo(-25,-59);
 ctx.moveTo(83,-99);ctx.lineTo(52,-83);ctx.lineTo(69,-67);ctx.lineTo(25,-59);ctx.stroke();ctx.shadowBlur=0;
 // Rugged grille, bumper and underbody skid plate.
 rr(-39,-55,78,26,6,'#071522','#77dff2');
 for(let i=0;i<5;i++)rr(-28+i*14,-49,5,14,2,'#5c91a3');
 rr(-145,-39,290,16,5,'#182b38','#91b9c8');
 rr(-103,-31,206,10,4,'#778d98','#d7faff');
 // Animated adaptive headlights: soft breathing glow without harsh flashing.
 ctx.save();
 ctx.globalAlpha=.72+pulse*.28;
 ctx.shadowColor='#9cefff';ctx.shadowBlur=12+pulse*24;
 rr(-130,-104,25,22,6,'#b8f7ff','#efffff');
 ctx.shadowColor='#caa7ff';ctx.shadowBlur=12+pulse*24;
 rr(105,-104,25,22,6,'#c7a6ff','#fff0ff');
 ctx.restore();
 rr(-119,-94,9,30,4,'#ff536e');rr(110,-94,9,30,4,'#ff536e');
 for(const x of [-119,119])oval(x,-12,10,14,'#76eaff');
 // Signature crown and Kaevoryn identity.
 ctx.save();ctx.shadowColor='#ffc95d';ctx.shadowBlur=18;ctx.fillStyle='#ffd36a';
 ctx.font='bold 32px Georgia';ctx.textAlign='center';ctx.fillText('♛',0,-91);ctx.restore();
 rr(-57,-78,114,23,7,'#07182d','#9a75ff');
 ctx.fillStyle='#e8fbff';ctx.font='bold 10px system-ui';ctx.textAlign='center';
 ctx.fillText('K A E V O R Y N',0,-63);
 // Animated energy channels sweep along both armored flanks.
 ctx.save();
 const sweep=(phase*34)%46;
 ctx.shadowColor='#20dfff';ctx.shadowBlur=12+pulse*12;
 ctx.strokeStyle='#72f4ff';ctx.lineWidth=3;
 ctx.globalAlpha=.55+pulse*.4;
 ctx.beginPath();ctx.moveTo(-143,-77);ctx.lineTo(-126,-67);ctx.lineTo(-137,-52);
 ctx.moveTo(143,-77);ctx.lineTo(126,-67);ctx.lineTo(137,-52);ctx.stroke();
 for(const side of [-1,1]){
  ctx.fillStyle='#b8fbff';ctx.globalAlpha=.35+pulse*.55;
  rr(side*(119+sweep)-3,-65,6,4,2,'#b8fbff');
 }
 // Low-profile engine vents pulse beneath the rear armor.
 ctx.globalAlpha=.35+pulse*.6;
 ctx.shadowColor='#26dfff';ctx.shadowBlur=10+pulse*15;
 for(let i=0;i<5;i++)rr(-26+i*13,-23,7,4,2,'#72eaff');
 // A few drifting ion sparks give the power system a subtle active feel.
 ctx.globalAlpha=.2+pulse*.45;
 for(let i=0;i<4;i++){
  const drift=(phase*18+i*19)%42;
  oval(-42+i*28,-4+drift*.18,1.8,2.8,'#a8f7ff');
 }
 ctx.restore();
 ctx.restore();
}
function drawEffects(){
 const scene=chapters[chapter].scene,cx=w/2,phase=offset*Math.PI*2;
 ctx.save();
 // Chapter-entry portal: expanding concentric gates and a brief cinematic flare
 if(transition>0){
  const p=1-transition,alpha=Math.sin(p*Math.PI);
  const radius=Math.max(w,h)*(.08+p*.48),portalColor=scene===3&&choiceTrail[3]==='sun'?'#ffd77a':scene===3&&choiceTrail[3]==='moon'?'#c69aff':scene>=4?'#a98aff':'#78eaff';
  ctx.save();ctx.translate(w/2,h*.43);ctx.globalAlpha=alpha*.82;ctx.strokeStyle=portalColor;ctx.shadowColor=portalColor;ctx.shadowBlur=28;ctx.lineWidth=4;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,radius*(.72+i*.15),radius*(.42+i*.09),p*.8+i*.35,0,Math.PI*2);ctx.stroke()}
  ctx.globalAlpha=alpha*.18;ctx.fillStyle=portalColor;ctx.fillRect(-w/2,-h*.43,w,h);ctx.restore();
 }
 // Floating motes and drifting magical dust across every chapter
 for(let i=0;i<44;i++){
  const x=(i*97+Math.sin(phase*1.7+i)*18+w)%w;
  const y=(i*53+phase*22)%(h*.78);
  const r=1+(i%3)*.65;
  ctx.globalAlpha=.22+((Math.sin(phase*2+i)+1)*.24);
  ctx.fillStyle=i%4===0?'#ffe5a0':i%3===0?'#c49aff':'#8ceeff';
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;
 // A distant guardian dragon sweeps over the Wild Pass
 if(scene===1){
  const swoop=Math.max(0,Math.sin(phase*.72-.7));
  const dx=w*(.5+Math.sin(phase*.42)*(.22-swoop*.06));
  const dy=h*(.22+swoop*.16)+Math.sin(phase*.8)*9;
  const dragonScale=.72+swoop*.62;
  // The guardian announces its arrival with a sweeping halo and wind wake
  ctx.save();
  const entrancePulse=.5+.5*Math.sin(phase*.72-.7);
  ctx.globalAlpha=.12+entrancePulse*.12;
  const wake=ctx.createRadialGradient(dx,dy,8,dx,dy,105+dragonScale*45);
  wake.addColorStop(0,'#9ceeff88');wake.addColorStop(.55,'#55c9e855');wake.addColorStop(1,'#55c9e800');
  ctx.fillStyle=wake;ctx.beginPath();ctx.arc(dx,dy,105+dragonScale*45,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=.22+entrancePulse*.18;ctx.strokeStyle='#a5edff';ctx.lineWidth=2;
  for(let i=0;i<5;i++){
   const spread=28+i*17,reach=38+i*22;
   ctx.beginPath();ctx.moveTo(dx-spread-reach,dy+12+i*5);ctx.quadraticCurveTo(dx-spread,dy+3+i*5,dx-18,dy+8+i*3);ctx.stroke();
   ctx.beginPath();ctx.moveTo(dx+spread+reach,dy+12+i*5);ctx.quadraticCurveTo(dx+spread,dy+3+i*5,dx+18,dy+8+i*3);ctx.stroke();
  }
  // A moving shadow connects the airborne dragon to the forest floor
  ctx.globalAlpha=.13+swoop*.12;ctx.fillStyle='#020a12';
  ctx.beginPath();ctx.ellipse(dx,h*.68,34+dragonScale*34,5+dragonScale*5,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
  ctx.save();ctx.translate(dx,dy);ctx.scale(dragonScale,dragonScale);ctx.fillStyle='#101a30';ctx.strokeStyle='#8deaff';ctx.lineWidth=1.5;ctx.shadowColor='#58dfff';ctx.shadowBlur=13;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-17,-5);ctx.lineTo(-68,-34-Math.sin(phase*1.5)*12);ctx.lineTo(-48,4);ctx.lineTo(-82,17);ctx.lineTo(-29,15);ctx.lineTo(-10,9);ctx.lineTo(0,16);ctx.lineTo(12,9);ctx.lineTo(31,15);ctx.lineTo(82,17);ctx.lineTo(48,4);ctx.lineTo(68,-34-Math.sin(phase*1.5)*12);ctx.lineTo(17,-5);ctx.closePath();ctx.fill();ctx.stroke();
  // Wing membranes flex independently to give the guardian a readable flying silhouette
  const flap=Math.sin(phase*2.25)*13;
  ctx.save();ctx.lineWidth=1.8;ctx.strokeStyle='#78dff5';ctx.fillStyle='#19334a';ctx.globalAlpha=.88;
  for(const side of [-1,1]){
   ctx.beginPath();ctx.moveTo(side*12,-4);
   ctx.quadraticCurveTo(side*37,-27-flap,side*68,-34-flap);
   ctx.lineTo(side*51,3-flap*.25);ctx.lineTo(side*82,17);
   ctx.lineTo(side*29,15);ctx.lineTo(side*10,8);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.moveTo(side*13,2);ctx.lineTo(side*68,-34-flap);
   ctx.moveTo(side*19,6);ctx.lineTo(side*51,3-flap*.25);
   ctx.moveTo(side*27,11);ctx.lineTo(side*82,17);ctx.stroke();
  }
  ctx.restore();
  ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(-5,23);ctx.lineTo(5,23);ctx.stroke();
  // Crown-like horns, bright eyes and fine scale highlights make the guardian feel alive
  ctx.save();ctx.shadowColor='#9cf4ff';ctx.shadowBlur=12;
  ctx.strokeStyle='#b6f5ff';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-7,-4);ctx.lineTo(-13,-17);ctx.lineTo(-17,-20);
  ctx.moveTo(7,-4);ctx.lineTo(13,-17);ctx.lineTo(17,-20);ctx.stroke();
  oval(-8,-2,2.5,2,'#fff2a0');oval(8,-2,2.5,2,'#fff2a0');
  ctx.strokeStyle='#75d9ec';ctx.lineWidth=1;
  for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-5+i*3,5+i);ctx.lineTo(-2+i*3,7+i);ctx.stroke()}
  ctx.restore();
  // A glowing rush ring emphasizes the close swoop toward the Explorer
  if(swoop>.72){ctx.globalAlpha=(swoop-.72)*2.8;ctx.strokeStyle='#a8f5ff';ctx.lineWidth=2;ctx.shadowColor='#70eaff';ctx.shadowBlur=20;ctx.beginPath();ctx.ellipse(0,7,105,38,Math.sin(phase)*.2,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1}
  // The dragon turns and breathes a pulsing stream of fire toward the valley
  const breath=Math.max(0,Math.sin(phase*1.25+.8)),flameLength=42+breath*72;
  if(breath>.12){
   const fire=ctx.createLinearGradient(22,7,22+flameLength,17);
   fire.addColorStop(0,'#fff4a1');fire.addColorStop(.28,'#ffbd54');fire.addColorStop(.68,'#ff633e');fire.addColorStop(1,'#d52c68');
   ctx.shadowColor='#ff7a39';ctx.shadowBlur=22;ctx.fillStyle=fire;
   ctx.beginPath();ctx.moveTo(18,5);ctx.quadraticCurveTo(38,breath*15,22+flameLength,8+Math.sin(phase*5)*7);ctx.quadraticCurveTo(42,25,18,12);ctx.closePath();ctx.fill();
   for(let i=0;i<12;i++){const t=(i*17+phase*38)%(flameLength+15);ctx.globalAlpha=.35+breath*.45;oval(25+t,8+Math.sin(phase*4+i)*7,1.5+(i%3),1.5+(i%2),'#ffd78a')}
   ctx.globalAlpha=1;ctx.shadowBlur=0;
  }
  ctx.restore();
  // Tiny ember trail hints at the guardian's passage
  for(let i=0;i<10;i++){const drift=(i*19+phase*34)%(w*.18);ctx.globalAlpha=.25+Math.abs(Math.sin(phase+i))*.45;oval((dx-drift+w)%w,dy+12+i*3,2+(i%2),2,'#ffbd79')}ctx.globalAlpha=1;
 }
 // The Forgotten City's monumental gate parts around the chosen emblem
 if(scene===3){
  const open=.5+.5*Math.sin(phase*.7),gap=w*.13*open;
  ctx.save();ctx.shadowColor=choiceTrail[3]==='moon'?'#c69aff':'#ffd77a';ctx.shadowBlur=18;
  rr(cx-w*.22-gap, h*.31, w*.12, h*.31, 8,'#263c53','#a9eaff');
  rr(cx+w*.10+gap, h*.31, w*.12, h*.31, 8,'#263c53','#a9eaff');
  ctx.strokeStyle=choiceTrail[3]==='moon'?'#c69aff':'#ffd77a';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(cx,h*.47,w*.11,Math.PI,Math.PI*2);ctx.stroke();
  ctx.restore();
 }
 // The crystal heart releases a visible pulse when it awakens
 if(scene===4||scene===5){
  const power=.5+.5*Math.sin(phase*1.3),color=choiceTrail[4]==='wonder'?'#c69aff':'#7eeaff';
  ctx.save();ctx.translate(cx,h*(scene===4?.48:.3));ctx.globalAlpha=.25+power*.35;ctx.strokeStyle=color;ctx.lineWidth=2+power*3;ctx.shadowColor=color;ctx.shadowBlur=28;
  for(let i=0;i<4;i++){const radius=24+i*24+power*16;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke()}
  ctx.globalAlpha=.5+power*.4;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(19,-5);ctx.lineTo(12,22);ctx.lineTo(0,31);ctx.lineTo(-12,22);ctx.lineTo(-19,-5);ctx.closePath();ctx.fill();
  ctx.restore();
 }
 // Choice-reactive energy trails and elemental effects
 if(scene===0&&choiceTrail[0]==='ridge'){
  ctx.strokeStyle='#a8efff';ctx.lineWidth=2;ctx.shadowColor='#66dcff';ctx.shadowBlur=15;
  for(let i=0;i<3;i++){const x=w*(.18+i*.31);ctx.beginPath();ctx.moveTo(x, h*.16);ctx.lineTo(x+Math.sin(phase+i)*18,h*.28);ctx.lineTo(x-12,h*.34);ctx.stroke()}
 }
 if(scene===1&&choiceTrail[1]==='grove'){
  ctx.strokeStyle='#8affd4';ctx.lineWidth=2;ctx.shadowColor='#53ffd0';ctx.shadowBlur=18;
  for(let i=0;i<7;i++){const x=(i*139+phase*30)%w,y=h*(.42+(i%3)*.1);ctx.beginPath();ctx.moveTo(x,y+20);ctx.quadraticCurveTo(x+Math.sin(phase+i)*28,y-15,x+18,y-35);ctx.stroke()}
 }
 if(scene===2){
  // Mist rolls across the ravine; bridge route receives brief electric arcs
  for(let i=0;i<6;i++){const x=(i*131+phase*9)%w,y=h*(.48+(i%3)*.09);ctx.globalAlpha=.12;oval(x,y,34,8,'#d9faff');}
  ctx.globalAlpha=1;
  if(choiceTrail[2]==='bridge'){ctx.strokeStyle='#c9f8ff';ctx.lineWidth=2;ctx.shadowColor='#83eaff';ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(w*.28,h*.52);ctx.lineTo(w*.34,h*.48);ctx.lineTo(w*.39,h*.54);ctx.lineTo(w*.44,h*.49);ctx.stroke()}
 }
 if(scene===3){
  const sun=choiceTrail[3]==='sun',moon=choiceTrail[3]==='moon',color=sun?'#ffd77a':'#c9a7ff';
  if(sun||moon){ctx.translate(cx,h*.25);ctx.rotate(phase*.08);ctx.strokeStyle=color;ctx.globalAlpha=.55;ctx.lineWidth=2;ctx.shadowColor=color;ctx.shadowBlur=20;for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(0,-(sun?65:52));ctx.stroke()}ctx.globalAlpha=1}
 }
 if(scene===4||scene===5){
  const color=choiceTrail[4]==='wonder'?'#c69aff':'#7eeaff';
  const y=scene===4?h*.48:h*.3;ctx.strokeStyle=color;ctx.lineWidth=3;ctx.globalAlpha=.7;ctx.shadowColor=color;ctx.shadowBlur=22;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(cx,y,45+i*25,13+i*10,phase*.12+i*.5,0,Math.PI*2);ctx.stroke()}
  ctx.globalAlpha=1;
 }
 if(scene===5){
  // Slow celebratory starbursts over the awakened kingdom
  for(let i=0;i<5;i++){const x=w*(.12+i*.19),y=h*(.13+(i%2)*.12),p=(phase*.35+i*1.7)%(Math.PI*2),radius=8+Math.abs(Math.sin(p))*18;ctx.strokeStyle=i%2?'#c69aff':'#ffe08a';ctx.lineWidth=2;ctx.globalAlpha=.65;ctx.beginPath();for(let k=0;k<8;k++){const a=k*Math.PI/4;ctx.moveTo(x+Math.cos(a)*4,y+Math.sin(a)*4);ctx.lineTo(x+Math.cos(a)*radius,y+Math.sin(a)*radius)}ctx.stroke();ctx.globalAlpha=1}
 }
 ctx.restore();
}
function drawCabin(){
 // Keep the moving kingdom visible through the cabin's front and side glass.
 const roof=ctx.createLinearGradient(0,0,0,h*.12);
 roof.addColorStop(0,'#020811');roof.addColorStop(1,'#142a3a');
 ctx.fillStyle=roof;ctx.fillRect(0,0,w,h*.105);
 ctx.fillStyle='#07131dcc';ctx.fillRect(0,h*.105,w*.105,h*.39);ctx.fillRect(w*.895,h*.105,w*.105,h*.39);
 ctx.fillStyle='#58b9d522';ctx.fillRect(w*.105,h*.105,w*.79,h*.39);
 ctx.strokeStyle='#8cecff';ctx.lineWidth=Math.max(3,w*.004);
 ctx.beginPath();ctx.moveTo(w*.105,h*.105);ctx.lineTo(w*.105,h*.49);ctx.moveTo(w*.895,h*.105);ctx.lineTo(w*.895,h*.49);ctx.moveTo(w*.105,h*.105);ctx.lineTo(w*.895,h*.105);ctx.stroke();
 ctx.fillStyle='#101f2ddd';ctx.fillRect(w*.105,h*.105,w*.018,h*.39);ctx.fillRect(w*.877,h*.105,w*.018,h*.39);
 ctx.fillStyle='#071522e8';ctx.fillRect(w*.24,h*.018,w*.52,h*.065);
 ctx.strokeStyle='#73e8ff';ctx.lineWidth=1.5;ctx.strokeRect(w*.24,h*.018,w*.52,h*.065);
 ctx.fillStyle='#e1fbff';ctx.font='bold '+Math.max(11,w*.022)+'px system-ui';ctx.textAlign='center';
 ctx.fillText('PASSENGER CABIN · SIX SEATS',w*.5,h*.061);
 // Six individual bucket-style passenger seats with headrests, shoulder bolsters,
 // stitched panels, seat cushions and visible safety belts.
 const rows=[.52,.67,.82],cols=[.29,.71];
 const colors=['#17647a','#59447c','#286b5a','#84603d','#315c91','#754b72'];
 const seams=['#80eaff','#d4b8ff','#9cf2c5','#ffd39a','#a9d9ff','#f0b5df'];
 let index=0;
 rows.forEach((yy,row)=>cols.forEach((xx,col)=>{
  const x=w*xx,y=h*yy,sw=Math.min(w*.25,148),sh=Math.min(h*.13,88);
  ctx.save();ctx.translate(x,y);
  const seat=colors[index],stitch=seams[index];
  // Ground shadow and lower seat pedestal.
  oval(0,sh*.48,sw*.62,sh*.18,'#02070c99');
  rr(-sw*.12,sh*.25,sw*.24,sh*.32,4,'#182b38','#64899a');
  // Tall contoured seat back with curved shoulders and side bolsters.
  ctx.shadowColor='#35dff5';ctx.shadowBlur=6;
  ctx.beginPath();
  ctx.moveTo(-sw*.43,sh*.30);ctx.lineTo(-sw*.47,-sh*.18);
  ctx.quadraticCurveTo(-sw*.49,-sh*.39,-sw*.28,-sh*.54);
  ctx.lineTo(sw*.28,-sh*.54);
  ctx.quadraticCurveTo(sw*.49,-sh*.39,sw*.47,-sh*.18);
  ctx.lineTo(sw*.43,sh*.30);ctx.quadraticCurveTo(0,sh*.43,-sw*.43,sh*.30);
  ctx.closePath();ctx.fillStyle=seat;ctx.fill();ctx.strokeStyle='#8deeff';ctx.lineWidth=1.4;ctx.stroke();
  ctx.shadowBlur=0;
  // Distinct padded center panel and raised side bolsters.
  rr(-sw*.29,-sh*.43,sw*.58,sh*.62,sw*.10,'#ffffff12',stitch);
  ctx.strokeStyle=stitch;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(-sw*.20,-sh*.35);ctx.quadraticCurveTo(-sw*.25,-sh*.04,-sw*.19,sh*.18);
  ctx.moveTo(sw*.20,-sh*.35);ctx.quadraticCurveTo(sw*.25,-sh*.04,sw*.19,sh*.18);ctx.stroke();
  // Separate padded headrest.
  rr(-sw*.22,-sh*.69,sw*.44,sh*.23,sw*.10,'#24485b',stitch);
  rr(-sw*.13,-sh*.66,sw*.26,sh*.15,sw*.07,seat);
  // Seat base projects forward, with a rounded front edge.
  ctx.beginPath();ctx.moveTo(-sw*.43,sh*.20);ctx.quadraticCurveTo(-sw*.48,sh*.34,-sw*.35,sh*.39);
  ctx.lineTo(sw*.35,sh*.39);ctx.quadraticCurveTo(sw*.48,sh*.34,sw*.43,sh*.20);
  ctx.closePath();ctx.fillStyle='#203e50';ctx.fill();ctx.strokeStyle='#77dff2';ctx.stroke();
  // Cushion seam and front piping.
  ctx.strokeStyle=stitch;ctx.lineWidth=1.2;ctx.beginPath();
  ctx.moveTo(-sw*.29,sh*.30);ctx.quadraticCurveTo(0,sh*.39,sw*.29,sh*.30);ctx.stroke();
  // Armrests on both sides.
  rr(-sw*.55,sh*.05,sw*.14,sh*.30,4,'#31566a','#80eaff');
  rr(sw*.41,sh*.05,sw*.14,sh*.30,4,'#31566a','#80eaff');
  // A diagonal shoulder belt makes the seats read as vehicle seats.
  ctx.strokeStyle='#d5dce2';ctx.lineWidth=Math.max(1.4,sw*.025);
  ctx.beginPath();ctx.moveTo(-sw*.31,-sh*.39);ctx.lineTo(sw*.25,sh*.35);ctx.stroke();
  rr(sw*.15,sh*.22,sw*.12,sh*.09,2,'#b5c6cf','#f1fbff');
  // Seat number label at the front edge.
  ctx.fillStyle='#effcff';ctx.font='bold '+Math.max(8,w*.013)+'px system-ui';ctx.textAlign='center';
  ctx.fillText('SEAT '+(index+1),0,sh*.63);
  ctx.restore();index++;
 }));
 // Raised cockpit console gives the cabin a clear, substantial dashboard.
 const dash=ctx.createLinearGradient(0,h*.76,0,h);dash.addColorStop(0,'#42677a');dash.addColorStop(.16,'#172e40');dash.addColorStop(.55,'#0b1724');dash.addColorStop(1,'#02060b');
 ctx.fillStyle=dash;ctx.beginPath();ctx.moveTo(0,h*.79);ctx.quadraticCurveTo(w*.5,h*.70,w,h*.79);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#7eeaff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,h*.79);ctx.quadraticCurveTo(w*.5,h*.70,w,h*.79);ctx.stroke();
 rr(w*.37,h*.82,w*.26,h*.105,8,'#071522','#5ddff4');
 ctx.fillStyle='#9df2ff';ctx.font='bold '+Math.max(9,w*.016)+'px system-ui';ctx.textAlign='center';ctx.fillText('K A E V O R Y N',w*.5,h*.865);
 ctx.fillStyle='#a8f5ff';ctx.font='bold 9px system-ui';ctx.textAlign='left';ctx.fillText('EXPLORER CONTROL SYSTEM · 6 SEATS',12,h*.97);
}
function drawStartup(){
 if(startup<=0)return;
 const progress=1-startup/3.2,fade=Math.min(1,(1-progress)*5,progress*7);
 const cx=w/2,cy=h*.56,radius=Math.max(w,h)*(.08+progress*.48);
 ctx.save();
 // A soft ignition bloom spreads across the windshield and cabin.
 const glow=ctx.createRadialGradient(cx,cy,4,cx,cy,radius);
 glow.addColorStop(0,'rgba(126,234,255,'+(.2*fade)+')');
 glow.addColorStop(.55,'rgba(75,190,255,'+(.09*fade)+')');
 glow.addColorStop(1,'rgba(75,190,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 // Power rings rise from the center console.
 ctx.translate(cx,h*.79);
 ctx.globalAlpha=fade*(1-progress*.45);
 ctx.strokeStyle='#8cefff';ctx.shadowColor='#42dfff';ctx.shadowBlur=24;
 ctx.lineWidth=2+fade*2;
 for(let i=0;i<3;i++){
  const radius=16+progress*90+i*22;
  ctx.beginPath();ctx.ellipse(0,0,radius,radius*.3,0,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
 // Short cinematic system boot message.
 if(progress>.16&&progress<.94){
  ctx.save();ctx.globalAlpha=fade;ctx.textAlign='center';
  ctx.fillStyle='#dffaff';ctx.shadowColor='#43dcff';ctx.shadowBlur=18;
  ctx.font='bold '+Math.max(12,Math.min(18,w*.025))+'px system-ui';
  ctx.fillText(progress<.48?'EXPEDITION CORE · IGNITION':'SYSTEMS ONLINE · READY TO EXPLORE',cx,h*.19);
  ctx.restore();
 }
}
function draw(){ctx.clearRect(0,0,w,h);drawWorld();drawEffects();if(viewMode==='cabin')drawCabin();else drawVehicle();const cockpitEl=document.getElementById('cockpitConsole');if(cockpitEl)cockpitEl.classList.toggle('active',viewMode==='cabin');drawStartup()}
function frame(now){const dt=Math.min(50,now-last||16);last=now;if(running){offset+=dt*(reduce?.00022:.00055);startup=Math.max(0,startup-dt/1000)}if(transition>0)transition=Math.max(0,transition-dt/1100);draw();requestAnimationFrame(frame)}

/* Kaevoryn Explorer dashboard */
const dashboardStyle=document.createElement('style');
dashboardStyle.textContent=`
#kingdomDashboardToggle{border:1px solid #73eaff!important;background:linear-gradient(135deg,#123b55,#241d49)!important;color:#e9fbff!important}
#kingdomDashboard{position:fixed;inset:0;z-index:50;display:none;place-items:center;padding:20px;background:rgba(2,8,18,.82);backdrop-filter:blur(12px)}
#kingdomDashboard.open{display:grid}
#kingdomDashboard .dash-panel{width:min(680px,100%);max-height:90vh;overflow:auto;padding:clamp(20px,4vw,34px);border:1px solid #62dff4;border-radius:22px;background:linear-gradient(145deg,#0b2133f5,#17142ff7);box-shadow:0 0 55px #27c9f455;color:#eafaff}
#kingdomDashboard .dash-kicker{margin:0 0 8px;color:#8cefff;font:700 11px system-ui;letter-spacing:.2em}
#kingdomDashboard h2{margin:0 0 8px;font:800 clamp(25px,5vw,38px) system-ui;letter-spacing:.04em}
#kingdomDashboard .dash-sub{margin:0 0 24px;color:#b5cbd8;line-height:1.55}
#kingdomDashboard .dash-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
#kingdomDashboard button{min-height:68px;padding:14px;border:1px solid #42677e;border-radius:13px;background:linear-gradient(135deg,#142e43,#211e3d);color:#effcff;text-align:left;font:700 14px system-ui;cursor:pointer}
#kingdomDashboard button span{display:block;margin-top:5px;color:#a9c5d3;font:400 12px system-ui}
#kingdomDashboard button:hover,#kingdomDashboard button:focus-visible{border-color:#9af1ff;box-shadow:0 0 18px #54dcf455;outline:none}
#kingdomDashboard .dash-footer{display:flex;justify-content:space-between;gap:10px;margin-top:18px}
#kingdomDashboard .dash-footer button{min-height:44px;text-align:center}
#kingdomDashboard .map-art{height:190px;margin:18px 0;padding:14px;border:1px solid #3c7184;border-radius:14px;background:radial-gradient(ellipse at 50% 50%,#28607988,transparent 55%),linear-gradient(135deg,#102c35,#10182e);display:grid;place-items:center;color:#a9efff;text-align:center;letter-spacing:.12em;font:700 12px system-ui}
@media(max-width:460px){#kingdomDashboard .dash-grid{grid-template-columns:1fr}#kingdomDashboard .dash-panel{padding:19px}}
`;
document.head.append(dashboardStyle);
const dashboard=document.createElement('section');
dashboard.id='kingdomDashboard';dashboard.setAttribute('aria-label','Explorer dashboard');dashboard.setAttribute('aria-modal','true');dashboard.setAttribute('role','dialog');
dashboard.innerHTML=`<div class="dash-panel"><p class="dash-kicker">KAEVORYN STUDIOS · LOST KINGDOM</p><h2>EXPLORER DASHBOARD</h2><p class="dash-sub">Your expedition hub. Choose where to go next.</p><div class="dash-grid">
<button type="button" data-dash="explore">✦ &nbsp; Continue Exploring<span>Return to the kingdom journey</span></button>
<button type="button" data-dash="vehicle">▰ &nbsp; Explorer Vehicle<span>Board or exit the six-seat cabin</span></button>
<button type="button" data-dash="map">⌖ &nbsp; Kingdom Map<span>View your expedition route</span></button>
<button type="button" data-dash="missions">◇ &nbsp; Missions & Discoveries<span>Review your chapter and choices</span></button>
<button type="button" data-dash="settings">⚙ &nbsp; Journey Settings<span>Pause or resume the world</span></button>
<button type="button" data-dash="home">⌂ &nbsp; Kingdoms Home<span>Leave this expedition</span></button>
</div><div class="dash-footer"><button type="button" data-dash="close">CLOSE DASHBOARD</button><button type="button" data-dash="map">VIEW MAP</button></div><div id="kingdomDashDetail" aria-live="polite"></div></div>`;
document.body.append(dashboard);

/* Visible in-cabin dashboard controls */
const cockpit=document.createElement('div');cockpit.id='cockpitConsole';
cockpit.innerHTML='<div class="cockpit-readout" id="cockpitReadout">SYSTEMS READY · SIGNAL LINKED</div><div class="cockpit-buttons"><button type="button" data-cockpit="map">MAP</button><button type="button" data-cockpit="scan">SCAN</button><button type="button" data-cockpit="lights">LIGHTS</button><button type="button" data-cockpit="comms">COMMS</button></div>';
document.querySelector('.stage')?.append(cockpit);
const cockpitStyle=document.createElement('style');
cockpitStyle.textContent=`
#cockpitConsole{display:none;position:absolute;z-index:4;left:7%;right:7%;bottom:9px;padding:8px 10px 9px;border:1px solid #72eaff;border-radius:13px;background:linear-gradient(180deg,#102b3eeF,#050d19f5);box-shadow:0 0 22px #35dfff44}
#cockpitConsole.active{display:block}
#cockpitConsole .cockpit-readout{margin:0 0 7px;color:#9ff3ff;text-align:center;font:700 9px system-ui;letter-spacing:.12em;text-shadow:0 0 8px #36dfff}
#cockpitConsole .cockpit-buttons{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
#cockpitConsole button{min-height:34px;padding:6px 3px;border:1px solid #6bcce0;border-radius:7px;background:linear-gradient(135deg,#183d52,#242044);color:#effcff;font:800 10px system-ui;letter-spacing:.08em}
#cockpitConsole button:active{background:#23627a;transform:scale(.97)}
@media(max-width:460px){#cockpitConsole{left:3%;right:3%;bottom:7px;padding:7px}#cockpitConsole .cockpit-buttons{gap:4px}#cockpitConsole button{font-size:9px;min-height:32px}}
`;
document.head.append(cockpitStyle);
cockpit.addEventListener('click',e=>{
 const b=e.target.closest('[data-cockpit]');if(!b)return;
 const readout=document.getElementById('cockpitReadout');
 const messages={map:'NAVIGATION MAP · ROUTE DISPLAY READY',scan:'SCANNING · ANCIENT SIGNAL DETECTED',lights:'CABIN LIGHTS · '+(b.dataset.on==='1'?'DIMMED':'ILLUMINATED'),comms:'COMMS LINK · KINGDOM CONTROL ONLINE'};
 if(b.dataset.cockpit==='lights'){b.dataset.on=b.dataset.on==='1'?'0':'1';}
 readout.textContent=messages[b.dataset.cockpit];
});

const dashButton=document.createElement('button');dashButton.type='button';dashButton.id='kingdomDashboardToggle';dashButton.textContent='Explorer Dashboard';dashButton.setAttribute('aria-haspopup','dialog');document.querySelector('.controls')?.prepend(dashButton);
function showDashboard(){dashboard.classList.add('open');dashboard.querySelector('button')?.focus()}
function hideDashboard(){dashboard.classList.remove('open');dashButton.focus()}
dashButton.addEventListener('click',showDashboard);
dashboard.addEventListener('click',e=>{
 if(e.target===dashboard){hideDashboard();return}
 const button=e.target.closest('[data-dash]');if(!button)return;
 const action=button.dataset.dash,detail=document.getElementById('kingdomDashDetail');
 if(action==='close'||action==='explore'){hideDashboard();return}
 if(action==='vehicle'){const boarding=viewMode!=='cabin';viewMode=boarding?'cabin':'outside';if(boarding)startup=reduce?1.4:3.2;const b=document.getElementById('boardRide');if(b)b.textContent=viewMode==='cabin'?'Return to outside view':'Board the Explorer';hideDashboard();return}
 if(action==='map'){detail.innerHTML='<div class="map-art">✧ &nbsp; HIGH RIDGE &nbsp; · &nbsp; WILD PASS &nbsp; · &nbsp; SUNKEN BRIDGE<br><br>FORGOTTEN CITY &nbsp; · &nbsp; HEART TEMPLE<br><br><small>YOUR ROUTE IS MARKED IN THE EXPEDITION LOG</small></div>';return}
 if(action==='missions'){hideDashboard();document.querySelector('.story')?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});return}
 if(action==='settings'){running=!running;pause.textContent=running?'Pause journey':'Resume journey';speed.textContent=running?'EXPLORING':'PAUSED';detail.textContent=running?'Journey resumed.':'Journey paused.';return}
 if(action==='home'){location.href='kingdoms.html'}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dashboard.classList.contains('open'))hideDashboard()});

const board=document.getElementById('boardRide');if(board)board.addEventListener('click',()=>{const boarding=viewMode!=='cabin';viewMode=boarding?'cabin':'outside';if(boarding)startup=reduce?1.4:3.2;board.textContent=viewMode==='cabin'?'Return to outside view':'Board the Explorer';});
pause.addEventListener('click',()=>{running=!running;pause.textContent=running?'Pause journey':'Resume journey';speed.textContent=running?'EXPLORING':'PAUSED'});
restart.addEventListener('click',()=>{chapter=0;history=[];choiceTrail=[];offset=0;running=true;pause.textContent='Pause journey';update()});
new ResizeObserver(resize).observe(canvas);update();resize();requestAnimationFrame(frame);
})();