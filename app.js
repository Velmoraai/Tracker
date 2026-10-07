
const KEY="jeeAscensionAdaptiveV1";
const base={
  xp:0, quests:[
    {id:1,title:"Maths — Algebra",detail:"Revise + solve doable questions from covered topics",xp:30,type:"Main",done:false},
    {id:2,title:"Physics — Mechanics",detail:"Practice covered mechanics topics; prioritize unfamiliar questions",xp:30,type:"Main",done:false},
    {id:3,title:"Chemistry — Periodic Table",detail:"NCERT reading + targeted questions",xp:25,type:"Test",done:false}
  ],
  sessions:[],tests:[],stats:{concept:0,application:0,unfamiliar:0,speed:0,accuracy:0},available:null,
  challenge:null,timer:{running:false,mode:"productive",started:0,elapsed:0}
};
let s=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(base);
const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(s));}
function fmtH(x){return x==null?"—":x.toFixed(1)+"h"}
function demonstrated(){if(!s.sessions.length)return 0;let a=s.sessions.map(x=>x.minutes/60);let recent=a.slice(-7);return recent.reduce((a,b)=>a+b,0)/recent.length}
function target(){return demonstrated()*.82}
function reality(){
 const avail=Number(s.available||0), cap=demonstrated(), t=target();
 let cls="good",label="REALISTIC",msg="Your target leaves room for difficulty, variance and challenges.";
 if(!cap){cls="warn";label="CALIBRATE";msg="No demonstrated capacity yet. Log productive sessions before trusting aggressive targets."}
 else if(avail>cap*1.15){cls="bad";label="UNREALISTIC";msg="No. This plan asks for more than your recent demonstrated capacity. Reduce the workload or extend the timeline."}
 else if(avail>cap*.90){cls="warn";label="AGGRESSIVE";msg="Possible, but it leaves little room for hard questions, mistakes or fatigue."}
 else if(avail<cap*.55){cls="warn";label="UNDER-PLANNED";msg="You appear capable of more. Keep the core work, then add a challenge instead of padding the plan with easy work."}
 return {cls,label,msg,avail,cap,t};
}
function renderReality(){
 const r=reality();$("realityBadge").textContent=r.label;$("realityBadge").className="badge "+r.cls;
 $("realityText").textContent=r.msg;$("availableOut").textContent=fmtH(r.avail);$("capacityOut").textContent=fmtH(r.cap);$("targetOut").textContent=fmtH(r.t);
 $("capacityMeter").style.width=Math.min(100,r.cap/12*100)+"%";
 $("capacityNote").textContent=r.cap?`Recent demonstrated capacity: ${r.cap.toFixed(1)} h/day. Campaign target: ${r.t.toFixed(1)} h.`:"Log productive minutes to build a real baseline.";
}
function renderQuests(){
 $("questList").innerHTML=s.quests.map(q=>`<div class="quest ${q.done?"done":""}">
 <div><div class="tag">${q.type} • ${q.xp} XP</div><div class="quest-title">${q.title}</div><div class="muted">${q.detail}</div></div>
 <button class="${q.done?"secondary":"primary"}" onclick="toggleQuest(${q.id})">${q.done?"Undo":"Complete"}</button></div>`).join("");
}
window.toggleQuest=id=>{let q=s.quests.find(x=>x.id===id);if(!q)return;if(q.done){q.done=false;s.xp=Math.max(0,s.xp-q.xp)}else{q.done=true;s.xp+=q.xp;updateStat("application",1)}save();render()};
function addQuest(){
 const title=prompt("Quest name"); if(!title)return;
 const detail=prompt("What does success look like?")||"Complete the task with focused effort.";
 s.quests.push({id:Date.now(),title,detail,xp:20,type:"Side",done:false});save();render();
}
const challenges=[
 ["Speed Challenge","Solve 10 familiar questions with strict time control.", "speed"],
 ["Unfamiliar Enemy","Attempt 3 genuinely unfamiliar JEE-level questions. Focus on approach, not perfection.","unfamiliar"],
 ["Accuracy Hunt","Do 15 questions and aim for zero avoidable errors.","accuracy"],
 ["Chemistry Blitz","20-minute NCERT + targeted recall sprint.","concept"],
 ["Anti-Overthinking","When stuck, give a question one clean attempt, mark it, and move on.","speed"],
 ["Recovery Challenge","After a lost block, restart with a 25-minute focused sprint.","application"]
];
function newChallenge(){
 const r=reality();let pool=challenges;
 if(r.label==="UNREALISTIC")pool=challenges.filter(x=>x[2]!=="speed");
 const c=pool[Math.floor(Math.random()*pool.length)];
 s.challenge={title:c[0],detail:c[1],stat:c[2],xp:40,claimed:false};save();renderChallenge();
}
function renderChallenge(){
 if(!s.challenge){$("challengeBox").innerHTML='<div class="muted">No challenge selected. Generate one after the Reality Check.</div>';return}
 const c=s.challenge;
 $("challengeBox").innerHTML=`<div class="challenge"><div class="tag">+${c.xp} XP • ${c.stat}</div><h4>${c.title}</h4><p>${c.detail}</p><button class="${c.claimed?"secondary":"primary"}" onclick="claimChallenge()">${c.claimed?"Undo Claim":"Claim Challenge"}</button></div>`;
}
window.claimChallenge=()=>{let c=s.challenge;if(!c)return;if(c.claimed){c.claimed=false;s.xp=Math.max(0,s.xp-c.xp)}else{c.claimed=true;s.xp+=c.xp;updateStat(c.stat,2)}save();render()};
function updateStat(k,n){s.stats[k]=(s.stats[k]||0)+n}
function renderStats(){
 const names={concept:"Conceptual Understanding",application:"Application",unfamiliar:"Unfamiliar Problems",speed:"Speed",accuracy:"Accuracy"};
 $("statsBox").innerHTML=`<div class="statline"><b>XP</b><div class="bar"><i style="width:${Math.min(100,s.xp/5)}%"></i></div><b>${s.xp}</b></div>`+
 Object.entries(names).map(([k,n])=>`<div class="statline"><span>${n}</span><div class="bar"><i style="width:${Math.min(100,(s.stats[k]||0)*5)}%"></i></div><b>${s.stats[k]||0}</b></div>`).join("");
}
function renderTests(){
 $("testHistory").innerHTML=s.tests.slice().reverse().map(t=>`<div class="test"><b>${t.name}</b> — ${t.score}/${t.max} (${Math.round(t.score/t.max*100)}%)<div class="muted">Weakness: ${t.weakness||"—"}</div></div>`).join("");
}
function recordTest(){
 const name=$("testName").value||"Test Raid",score=Number($("score").value),max=Number($("maxScore").value),weak=$("weakness").value||"Accuracy/selection";
 if(!max||score<0)return alert("Enter a valid score and maximum score.");
 s.tests.push({name,score,max,weakness:weak,date:new Date().toISOString()});
 s.xp+=75;
 s.quests.push({id:Date.now(),title:"Weakness Quest — "+weak,detail:"Review mistakes, redo representative questions, then retest.",xp:30,type:"Post-Raid",done:false});
 updateStat("accuracy",score/max>=.8?3:1); save();
 ["testName","score","maxScore","weakness"].forEach(x=>$(x).value="");render();
}
let tick=null;
function renderTimer(){let e=s.timer.elapsed;if(s.timer.running)e+=Date.now()-s.timer.started;let sec=Math.floor(e/1000);let h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),ss=sec%60;$("timer").textContent=[h,m,ss].map(x=>String(x).padStart(2,"0")).join(":")}
function startTimer(){if(s.timer.running)return;s.timer.running=true;s.timer.started=Date.now();save();clearInterval(tick);tick=setInterval(renderTimer,500)}
function stopTimer(){if(!s.timer.running)return;s.timer.elapsed+=Date.now()-s.timer.started;s.timer.running=false;s.timer.started=0;clearInterval(tick);
 let mins=Math.round(s.timer.elapsed/60000);if(mins>=1){s.sessions.push({mode:s.timer.mode,minutes:mins,date:new Date().toISOString()});if(s.timer.mode==="productive")s.xp+=Math.floor(mins/10)*2}
 s.timer.elapsed=0;save();render();renderTimer()}
function setMode(m){if(s.timer.running)stopTimer();s.timer.mode=m;document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));save()}
function campaign(){
 const r=reality(); $("campaignTitle").textContent=r.label==="UNREALISTIC"?"Reduce the load. Protect the campaign.":r.label==="UNDER-PLANNED"?"You have spare capacity. Enter the challenge.":"Lock in. Execute the core.";
 $("campaignSummary").textContent=r.msg;
 if(!s.challenge)newChallenge();
 document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===s.timer.mode));
}
function render(){renderReality();renderQuests();renderChallenge();renderStats();renderTests();renderTimer();document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===s.timer.mode))}
$("calibrateBtn").onclick=()=>{s.available=Number($("available").value)||0;save();renderReality()};
$("available").value=s.available??"";
$("campaignBtn").onclick=campaign;$("addQuestBtn").onclick=addQuest;$("newChallengeBtn").onclick=newChallenge;$("recordTest").onclick=recordTest;$("startTimer").onclick=startTimer;$("stopTimer").onclick=stopTimer;
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$("resetBtn").onclick=()=>{if(confirm("Reset all JEE Ascension data?")){localStorage.removeItem(KEY);location.reload()}};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="jee-ascension-save.json";a.click();URL.revokeObjectURL(a.href)};
render();
