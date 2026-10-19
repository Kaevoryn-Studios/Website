/* KAEVORYN LIVING WORLD — shared automatic season and local-time engine */
(function(){
  "use strict";
  const seasonChoice=document.getElementById("seasonChoice");
  const timeChoice=document.getElementById("timeChoice");
  const status=document.getElementById("livingWorldStatus");
  const seasonNames={spring:"Spring",summer:"Summer",autumn:"Autumn",winter:"Winter"};
  const timeNames={morning:"Morning",day:"Daytime",evening:"Evening",dusk:"Dusk",night:"Night"};
  function localSeason(){
    const month=new Date().getMonth();
    if(month>=2&&month<=4)return "spring";
    if(month>=5&&month<=7)return "summer";
    if(month>=8&&month<=10)return "autumn";
    return "winter";
  }
  function localTime(){
    const hour=new Date().getHours();
    if(hour>=5&&hour<10)return "morning";
    if(hour>=10&&hour<17)return "day";
    if(hour>=17&&hour<19)return "evening";
    if(hour>=19&&hour<21)return "dusk";
    return "night";
  }
  function blendClockColor(){
    const now=new Date();
    const hour=now.getHours()+now.getMinutes()/60;
    const stops=[
      {at:0,c:[13,20,61]},{at:5,c:[255,176,118]},{at:8,c:[255,205,151]},
      {at:11,c:[88,192,255]},{at:16,c:[102,192,255]},{at:18,c:[255,139,104]},
      {at:20,c:[151,112,255]},{at:22,c:[40,52,137]},{at:24,c:[13,20,61]}
    ];
    let left=stops[0],right=stops[stops.length-1];
    for(let i=0;i<stops.length-1;i++){
      if(hour>=stops[i].at&&hour<=stops[i+1].at){left=stops[i];right=stops[i+1];break;}
    }
    const amount=(hour-left.at)/(right.at-left.at||1);
    const rgb=left.c.map((v,i)=>Math.round(v+(right.c[i]-v)*amount));
    document.documentElement.style.setProperty("--world-clock-glow",rgb.join(","));
  }
  function apply(){
    const season=seasonChoice&&seasonChoice.value!=="auto"?seasonChoice.value:localSeason();
    const time=timeChoice&&timeChoice.value!=="auto"?timeChoice.value:localTime();
    document.body.dataset.season=season;
    document.body.dataset.time=time;
    blendClockColor();
    if(status){
      const automatic=(!seasonChoice||seasonChoice.value==="auto")&&(!timeChoice||timeChoice.value==="auto");
      status.textContent=seasonNames[season]+" · "+timeNames[time]+" — "+(automatic?"automatically following your local calendar and clock.":"your chosen atmosphere is active.");
    }
  }
  if(seasonChoice)seasonChoice.addEventListener("change",apply);
  if(timeChoice)timeChoice.addEventListener("change",apply);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)apply();});
  apply();
  window.setInterval(apply,60000);
})();