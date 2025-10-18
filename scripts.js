// scripts.js - backgrounds and CT Assist voice-like hologram
(function(){
  function $id(id){return document.getElementById(id)}
  function initHome(){
    const c = $id('scene-home'); if(!c) return;
    const ctx = c.getContext('2d'); let W = c.width = innerWidth; let H = c.height = innerHeight;
    const pts=[]; const N = Math.floor((W*H)/90000)+40;
    function rand(a,b){return Math.random()*(b-a)+a}
    for(let i=0;i<N;i++) pts.push({x:rand(0,W),y:rand(0,H),vx:rand(-0.3,0.3),vy:rand(-0.25,0.25),r:rand(0.6,2.2)});
    window.addEventListener('resize', ()=>{W=c.width=innerWidth; H=c.height=innerHeight});
    function frame(){
      ctx.clearRect(0,0,W,H);
      const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#020617'); g.addColorStop(1,'#001827'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      for(let i=0;i<pts.length;i++){ const a=pts[i]; a.x+=a.vx; a.y+=a.vy; if(a.x<0)a.x=W; if(a.x>W)a.x=0; if(a.y<0)a.y=H; if(a.y>H)a.y=0;
        const glow=ctx.createRadialGradient(a.x,a.y,0,a.x,a.y,a.r*8); glow.addColorStop(0,'rgba(0,234,255,0.9)'); glow.addColorStop(0.25,'rgba(0,234,255,0.35)'); glow.addColorStop(1,'rgba(0,234,255,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2); ctx.fill();
        for(let j=i+1;j<pts.length;j++){ const b=pts[j]; const dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy); if(d<140){ ctx.strokeStyle='rgba(0,234,255,'+(0.08*(1-d/140))+')'; ctx.lineWidth=0.6*(1-d/140); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } }
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  // CT Assist: voice via Web Speech API (female-ish)
  function initCT(){
    const orb = $id('ct-orb'); const panel = $id('ct-panel'); const messages = $id('ct-messages'); const form = $id('ct-form'); const input = $id('ct-input');
    if(!orb||!panel) return;
    function speak(text){
      if(!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      // prefer female-style voices
      let v = voices.find(v=>/female|female/i.test(v.name)) || voices.find(v=>/woman|samantha|kathy|zira|microsoft|google/i.test(v.name)) || voices.find(v=>v.lang && v.lang.startsWith('en')) || voices[0];
      if(v) u.voice = v;
      u.rate = 1; u.pitch = 1.05;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    }
    function push(msg, who='bot'){ const el=document.createElement('div'); el.className='ct-msg '+(who==='user'?'user':'bot'); el.textContent=msg; messages.appendChild(el); messages.scrollTop = messages.scrollHeight; }
    const canned = { hello: "Hello! I'm CT Assist — CollinsTech's holographic assistant. How can I help?", pricing: "Small sites start around $200. For complex apps I'll send a project estimate after scoping.", availability: "I'm available for new projects — share your timeline and requirements.", hire: "Thanks! Clicking Hire Me will open a WhatsApp chat with Collins to get started." };
    orb.addEventListener('mouseenter', ()=>{ speak("Hello, Collins."); });
    orb.addEventListener('click', ()=>{ if(panel.classList.contains('hidden')){ panel.classList.remove('hidden'); panel.setAttribute('aria-hidden','false'); push(canned.hello); speak(canned.hello);} else { panel.classList.add('hidden'); panel.setAttribute('aria-hidden','true'); } });
    document.addEventListener('click', (e)=>{ if(!panel.contains(e.target) && !orb.contains(e.target) && !panel.classList.contains('hidden')){ panel.classList.add('hidden'); panel.setAttribute('aria-hidden','true'); } });
    if(form){ form.addEventListener('submit',(e)=>{ e.preventDefault(); const q = input.value.trim(); if(!q) return; push(q,'user'); input.value=''; const lq=q.toLowerCase(); if(lq.includes('price')||lq.includes('cost')||lq.includes('quote')){ push(canned.pricing); speak(canned.pricing); } else if(lq.includes('avail')||lq.includes('when')||lq.includes('start')){ push(canned.availability); speak(canned.availability); } else if(lq.includes('hire')||lq.includes('work')){ push(canned.hire); speak(canned.hire); } else { const reply="Thanks — I'll pass this on. For detailed discussions please use the contact form or tap Hire Me."; push(reply); speak(reply);} }); }
  }

  window.addEventListener('load', ()=>{ if(document.querySelector('.page-home')) initHome(); initCT(); });
})();


const hamburger = document.createElement("div");
  hamburger.classList.add("hamburger");
  hamburger.innerHTML = "&#9776;";
  document.querySelector("nav .nav-container").appendChild(hamburger);

  const mobileMenu = document.createElement("div");
  mobileMenu.classList.add("mobile-menu");
  mobileMenu.innerHTML = `
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="services.html">Services</a>
    <a href="projects.html">Projects</a>
    <a href="contact.html">Contact</a>
  `;
  document.body.appendChild(mobileMenu);

  hamburger.onclick = () => {
    mobileMenu.classList.toggle("active");
  };