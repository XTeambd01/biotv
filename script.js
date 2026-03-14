const urls = [
  "https://raw.githubusercontent.com/munim-sah75/Cofs_TV/refs/heads/main/fancode.m3u",
    "https://raw.githubusercontent.com/biostartvworld/playlist/refs/heads/main/playlist.m3u",
    "https://raw.githubusercontent.com/sm-monirulislam/RoarZone-Auto-Update-playlist/refs/heads/main/RoarZone.m3u"
];

let channels = [];
let activeCat = "All";
let currentChannel = null;
let hls = null;
let levels = [];
let currentLevel = -1;

const video = document.getElementById("video");
const list = document.getElementById("list");
const category = document.getElementById("category");
const left = document.getElementById("left");
const backBtn = document.getElementById("backBtn");
const currentLogo = document.getElementById("currentLogo");
const currentName = document.getElementById("currentName");
const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const wrap = video.parentElement;

const oldControls = document.getElementById("controls");
if(oldControls) oldControls.remove();

const controls = document.createElement("div");
Object.assign(controls.style, {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    height: "45px",
    background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    zIndex: "100",
    transition: "opacity 0.3s",
    opacity: "0",
    pointerEvents: "none"
});

const leftGroup = document.createElement("div");
leftGroup.style.display = "flex";
leftGroup.style.alignItems = "center";
leftGroup.style.gap = "15px";

const btnPlay = document.createElement("div");
btnPlay.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#FFA500"><path d="M8 5v14l11-7z"/></svg>';
btnPlay.style.cursor = "pointer";

const liveBadge = document.createElement("div");
liveBadge.innerHTML = '<span style="color:white; font-size:15px; font-weight:bold; display:flex; align-items:center; letter-spacing: 1px;"><span style="width:6px; height:6px; background:red; border-radius:50%; margin-right:6px; box-shadow: 0 0 4px red;"></span>LIVE</span>';

leftGroup.append(btnPlay, liveBadge);

const rightGroup = document.createElement("div");
rightGroup.style.display = "flex";
rightGroup.style.alignItems = "center";
rightGroup.style.gap = "15px";

const soundGroup = document.createElement("div");
soundGroup.style.display = "flex";
soundGroup.style.alignItems = "center";
soundGroup.style.gap = "8px";

const btnMute = document.createElement("div");
btnMute.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
btnMute.style.cursor = "pointer";

const volSlider = document.createElement("input");
volSlider.type = "range";
volSlider.min = "0";
volSlider.max = "1";
volSlider.step = "0.1";
volSlider.value = "1";
Object.assign(volSlider.style, {
    width: "50px",
    height: "3px",
    cursor: "pointer",
    accentColor: "#fff"
});

soundGroup.append(btnMute, volSlider);

const btnShare = document.createElement("div");
const shareIconSvg = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>';
btnShare.innerHTML = shareIconSvg;
btnShare.style.color = "white"; 
btnShare.style.cursor = "pointer";

const btnHd = document.createElement("div");
btnHd.innerText = "HD";
btnHd.style.color = "#fcd707"; 
btnHd.style.fontSize = "15px";
btnHd.style.fontWeight = "900";
btnHd.style.cursor = "pointer";
btnHd.style.display = "flex";
btnHd.style.alignItems = "center";


const btnFull = document.createElement("div");
btnFull.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFA500" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6"/></svg>';
btnFull.style.cursor = "pointer";

rightGroup.append(soundGroup, btnShare, btnHd, btnFull);
controls.append(leftGroup, rightGroup);
wrap.appendChild(controls);

btnPlay.onclick = (e) => {
    e.stopPropagation();
    if(video.paused){
        video.play();
        btnPlay.innerHTML = '<svg viewBox="0 0 24 24" width="25" height="25" fill="#FFA500"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    } else {
        video.pause();
        btnPlay.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#FFA500"><path d="M8 5v14l11-7z"/></svg>';
    }
};

btnMute.onclick = (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if(video.muted) volSlider.value = 0;
    else volSlider.value = video.volume;
    updateMuteIcon();
};

volSlider.oninput = (e) => {
    e.stopPropagation();
    video.volume = e.target.value;
    video.muted = (video.volume === 0);
    updateMuteIcon();
};

function updateMuteIcon() {
    if(video.muted || video.volume === 0) {
        btnMute.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.51.4-1.09.71-1.75.88v2.03c1.21-.23 2.3-.77 3.22-1.51L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
    } else {
        btnMute.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
    }
}

btnShare.onclick = (e) => {
    e.stopPropagation();
    if(currentChannel){
        const link = location.origin + "/?id=" + currentChannel.id;
        navigator.clipboard.writeText(link).then(() => {
           btnShare.style.color = "#f8a712";
           setTimeout(() => {
               btnShare.style.color = "white";
           }, 2000);
        });
    }
};

btnFull.onclick = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
        wrap.requestFullscreen().catch(err => {});
    } else {
        document.exitFullscreen();
    }
};

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        btnFull.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a46c04" stroke-width="2"><path d="M5 16h3v3M8 8H5v3M16 5h3v3M19 16h-3v3"/></svg>';
    } else {
        btnFull.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#986505" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6"/></svg>';
    }
});

btnHd.onclick = (e) => {
    e.stopPropagation();
    if (!hls || !levels.length) return;
    currentLevel++;
    if (currentLevel >= levels.length) { 
        hls.currentLevel = -1; 
        btnHd.innerText = "HD";
        btnHd.style.color = "#FFD700";
        currentLevel = -1; 
    } else { 
        hls.currentLevel = levels[currentLevel].index; 
        btnHd.innerText = levels[currentLevel].height + "p";
        btnHd.style.color = "white";
    }
};

let controlTimer;
function showControls() {
    if (spinner.style.display === "block") return;
    controls.style.opacity = "1";
    controls.style.pointerEvents = "auto";
    clearTimeout(controlTimer);
    controlTimer = setTimeout(() => {
        controls.style.opacity = "0";
        controls.style.pointerEvents = "none";
    }, 3000);
}

wrap.addEventListener("mousemove", showControls);
wrap.addEventListener("touchstart", showControls);
wrap.addEventListener("click", showControls);

function slug(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"-");}
function parseM3U(txt){txt.split(/\r?\n/).forEach((l,i,a)=>{if(l.startsWith("#EXTINF")){const name=l.split(",").pop().trim();const logo=(l.match(/tvg-logo="(.*?)"/)||[])[1]||"";const cat=(l.match(/group-title="(.*?)"/)||[])[1]||"Others";const stream=(a[i+1]||"").trim();const id=slug(name);if(stream.startsWith("http")&&!channels.find(x=>x.id===id)) channels.push({id,name,logo,cat,stream});}});}
function renderCategory(){const cats=["All",...new Set(channels.map(c=>c.cat))];category.innerHTML="";cats.forEach(c=>{const d=document.createElement("div");d.className="catBtn"+(c===activeCat?" active":"");d.innerText=c;d.onclick=()=>{activeCat=c;renderCategory();renderList(c==="All"?channels:channels.filter(x=>x.cat===c));};category.appendChild(d);});}
function renderList(arr){list.innerHTML="";arr.forEach(c=>{const d=document.createElement("div");d.className="channelItem"+(currentChannel&&currentChannel.id===c.id?" active":"");d.innerHTML=`<img src="${c.logo}">`;d.onclick=()=>playChannel(c);list.appendChild(d);});}
function destroy(){if(hls){hls.destroy();hls=null;}video.pause();video.removeAttribute("src");video.load();}

const spinner = document.createElement("div");
Object.assign(spinner.style,{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",border:"5px solid rgba(255,255,255,0.3)",borderTop:"5px solid #fff",borderRadius:"50%",width:"50px",height:"50px",animation:"spin 1s linear infinite",zIndex:"9999",display:"none"});
wrap.appendChild(spinner);
const style = document.createElement("style");
style.innerHTML=`@keyframes spin {0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}`;
document.head.appendChild(style);

const watermark = document.createElement("div");
watermark.innerHTML = `<img src="https://thebengalee.com/wp-content/uploads/2025/12/Biostar_TV-removebg-preview-1.webp" style="width:70px;height:70px;">`;
Object.assign(watermark.style,{position:"absolute",right:"1px",bottom:"1px",zIndex:"9",opacity:"0.9",filter:"drop-shadow(0 6px 12px rgba(0,0,0,.8))",pointerEvents:"none"});
wrap.appendChild(watermark);

function playChannel(c){
  currentChannel=c;
  left.style.display="flex";
  currentLogo.src=c.logo;
  currentName.innerText=c.name;
  destroy();
  spinner.style.display="block";
  controls.style.opacity = "0";
  controls.style.pointerEvents = "none";
  btnPlay.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#FFA500"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  if(video.canPlayType("application/vnd.apple.mpegurl")){
    video.src=c.stream;
    video.play().catch(()=>{});
    video.oncanplay = ()=>{
        spinner.style.display="none";
        showControls();
    };
  } else if(Hls.isSupported()){
    hls = new Hls();
    hls.loadSource(c.stream);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,()=>{
        levels=hls.levels.map((l,i)=>({height:l.height,index:i})).filter(l=>l.height);
        hls.currentLevel=-1;
        btnHd.innerText="HD";
        btnHd.style.color = "#fbd708";
        video.play().catch(()=>{});
    });
    hls.on(Hls.Events.LEVEL_SWITCHED,()=>{
        spinner.style.display="none";
        showControls();
    });
    hls.on(Hls.Events.FRAG_BUFFERED,()=>{
        if(spinner.style.display !== "none") {
            spinner.style.display="none";
            showControls();
        }
    });
  }
  renderList(activeCat==="All"?channels:channels.filter(x=>x.cat===activeCat));
}

backBtn.onclick=()=>{destroy();left.style.display="none";backBtn.style.display="none";};
searchBtn.onclick=()=>{searchBox.style.display=searchBox.style.display==="block"?"none":"block";searchInput.focus();};
searchInput.onkeyup=()=>{const q=searchInput.value.toLowerCase();const base=activeCat==="All"?channels:channels.filter(c=>c.cat===activeCat);renderList(base.filter(c=>c.name.toLowerCase().includes(q)));};

const timeBox=document.createElement("div");
Object.assign(timeBox.style,{position:"absolute",top:"1px",right:"1px",background:"rgba(0,0,0,0.5)",color:"#fff",padding:"5px 9px",borderRadius:"10px",fontFamily:"Arial,sans-serif",fontSize:"7px",fontWeight:"bold",zIndex:"9999",whiteSpace:"nowrap",textAlign:"center"});
wrap.appendChild(timeBox);
setInterval(()=>{
  const now=new Date();
  let hours=now.getHours();const minutes=now.getMinutes().toString().padStart(2,'0');const seconds=now.getSeconds().toString().padStart(2,'0');
  const ampm=hours>=12?'PM':'AM';hours=hours%12||12;
  const timeStr=`${hours.toString().padStart(2,'0')}:${minutes}:${seconds} ${ampm}`;
  const day=now.toLocaleDateString('en-US',{weekday:'long'});
  const date=now.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
  timeBox.innerText=`${timeStr} | ${day} | ${date}`;
},1000);

const tg=document.createElement("a");
tg.href="https://t.me/biostartvworld";tg.target="_blank";
tg.innerHTML=`<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M9.04 15.84 8.7 19.6c.49 0 .7-.21.96-.46l2.3-2.2 4.77 3.49c.87.48 1.49.23 1.7-.8l3.08-14.44h0c.26-1.22-.44-1.7-1.28-1.39L1.62 9.2c-1.18.46-1.16 1.12-.2 1.42l4.7 1.47L17.4 5.9c.55-.36 1.06-.16.64.2"/></svg>`;
Object.assign(tg.style,{position:"fixed",bottom:"20px",right:"20px",width:"52px",height:"52px",background:"#229ED9",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,.3)",zIndex:"99999",textDecoration:"none"});
document.body.appendChild(tg);

Promise.all(urls.map(u=>fetch(u).then(r=>r.text()))).then(r=>{
  r.forEach(parseM3U);
  renderCategory();
  renderList(channels);
  const cid=new URLSearchParams(window.location.search).get("id");
  if(cid){
    const ch=channels.find(x=>x.id===cid);
    if(ch){
      document.querySelectorAll("body>*").forEach(e=>{if(!e.contains(video)) e.style.display="none";});
      Object.assign(wrap.style,{position:"fixed",inset:"0",width:"100%",height:"100%",background:"#000"});
      document.getElementById("list").style.display="none";
      document.getElementById("category").style.display="none";
      backBtn.style.display="none";
      video.muted=false;
      video.autoplay=true;
      playChannel(ch);
    }
  }

});

