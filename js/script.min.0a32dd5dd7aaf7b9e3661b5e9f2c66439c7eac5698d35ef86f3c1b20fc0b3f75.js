document.addEventListener("DOMContentLoaded",()=>{const e=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#888" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`,t=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#4caf50" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>`,n=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#f44336" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;function s(s){const o=document.createElement("button");o.className="highlight-copy-btn",o.innerHTML=e,o.addEventListener("click",()=>{navigator.clipboard.writeText(s.innerText).then(()=>{o.innerHTML=t}).catch(e=>{console.error(e),o.innerHTML=n}),setTimeout(()=>o.innerHTML=e,1500)}),s.style.position="relative",s.appendChild(o)}document.querySelectorAll(".highlight").forEach(s)})