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
  function apply(){
    const season=seasonChoice&&seasonChoice.value!=="auto"?seasonChoice.value:localSeason();
    const time=timeChoice&&timeChoice.value!=="auto"?timeChoice.value:localTime();
    document.body.dataset.season=season;
    document.body.dataset.time=time;
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