(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function r(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(t){if(t.ep)return;t.ep=!0;const e=r(t);fetch(t.href,e)}})();const k=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="currentColor" d="M6 21v-2h12v2z" />
</svg>
`,A=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
</svg>
`,L=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="currentColor"
    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
</svg>
`;class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get styles(){return`
      :host {

      }

      .container {
        background-color: var(--fgcolor);
        width: 100%;
        height: 22px;
        display: flex;
        gap: 0 8px;
        align-items: center;

        & .icon {
          --size: 18px;

          width: var(--size);
          height: var(--size);

          & img {
            --size: 18px;

            max-width: var(--size);
            max-height: var(--size);
            padding: 0 3px;
          }
        }

        & .title {
          font-family: var(--msfont);
          font-size: 0.96rem;
          color: #fff;
        }

        & .buttons {
          display: flex;
          align-items: center;
          gap: 2px;
          width: max-content;
          margin-left: auto;
          padding: 0 4px;

          & button {
            --size: 17px;

            width: var(--size);
            height: 15px;
            appearance: none;
            border: 0;
            border: 1px outset #fff;
            background: #aaa;
            display: grid;
            padding: 0;
            place-items: center;
            box-shadow: 2px 2px 0px #0005;
            color: #000;

            &:nth-child(3) {
              margin-left: 2px;
            }

            &:active {
              border-style: inset;
            }
          }
        }
      }
    `}connectedCallback(){this.icon=`icons/${this.getAttribute("icon")}.png`,this.render()}render(){this.shadowRoot.innerHTML=`
    <style>${c.styles}</style>
    <div class="container">
      <div class="icon"><img src="${this.icon}" alt="Icon"></div>
      <div class="title"><slot></slot></div>
      <div class="buttons">
        <button class="minimize">${k}</button>
        <button class="maximize">${A}</button>
        <button class="close">${L}</button>
      </div>
    </div>`}}customElements.define("title-bar",c);class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get styles(){return`
      :host {
        display: block;
        width: 7px;
        height: 9px;
        background: radial-gradient(#fff4 12% 13%, transparent 14%);
      }

      :host([empty]) {
      }

      :host([full]) {
        border: 1px solid #000;
        background-color: #00ffff;
        background-image:
          repeating-linear-gradient(
            125deg,
            #163f46dd 0 1px,
            transparent 1px 2px
          ),
          repeating-linear-gradient(
            -285deg,
            transparent 0 1px,
            #163f4622 1px 2px
          )
      }

      :host([completed][full]) {
        border: 1px solid #000;
        background-color: #00ffff;
        background-image:
          repeating-linear-gradient(
            125deg,
            #000bfacc 0 1px,
            transparent 1px 2px
          ),
          repeating-linear-gradient(
            -285deg,
            transparent 0 1px,
            #000bfa22 1px 2px
          )
      }

      :host([used]) {
        border: 1px solid #000;
        background: #00ffff;
      }

      :host([writing]) {
        border: 1px solid #000;
        background: #ff0000;
      }
    `}connectedCallback(){this.render()}isFull(){return this.hasAttribute("full")}isEmpty(){return this.hasAttribute("empty")}isUsed(){return this.hasAttribute("used")}isCompleted(){return this.hasAttribute("completed")}reset(){this.removeAttribute("full"),this.removeAttribute("empty"),this.removeAttribute("used")}setFull(){this.reset(),this.setAttribute("full","")}setEmpty(){this.reset(),this.setAttribute("empty","")}setUsed(){this.reset(),this.setAttribute("used","")}setCompleted(){this.setAttribute("completed","")}setWriting(){this.setAttribute("writing",""),setTimeout(()=>this.removeAttribute("writing"),1500)}render(){this.shadowRoot.innerHTML=`
    <style>${p.styles}</style>
    <div class="block">
    </div>`}}customElements.define("disk-block",p);class h extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return["value"]}attributeChangedCallback(s,r,i){s==="value"&&r!==null&&this.updateValue(i)}static get styles(){return`
      :host {
      }

      .container {
        font-family: var(--msfont);
        font-size: 15px;
      }

      p {
        margin: 6px 0;
        height: 15px;
      }

      .bar {
        border: 1px solid #888;
        border-bottom-color: #fff;
        border-right-color: #fff;
        height: 18px;
        position: relative;

        &::after {
          --block: 10px;
          --gap: 2px;
          --step: calc(var(--block) + var(--gap));

          content: "";
          position: absolute;
          top: 1px;
          left: 1px;
          width: calc(var(--value) - 2px);
          height: calc(100% - 2px);
          background:
            repeating-linear-gradient(
              to right,
              var(--fgcolor) 0 var(--block),
              transparent var(--block) var(--step)
            );
          background-repeat: no-repeat;
          background-size: round(down, 100%, var(--step));
        }
      }
    `}updateValue(s){this.shadowRoot.querySelector("p").textContent="Defragmenting file system...",this.style.setProperty("--value",`${s}%`),this.shadowRoot.querySelector(".value").textContent=s}connectedCallback(){this.value=this.getAttribute("value"),this.render()}render(){this.shadowRoot.innerHTML=`
    <style>${h.styles}</style>
    <div class="container">
      <p></p>
      <div class="bar"></div>
      <p><span class="value">0</span>% complete</p>
    </div>`}}customElements.define("bar-progress",h);const x=1003,d=3,v=1250,E={0:"empty",1:"used",2:"full",3:"writing"},w=[0,0,0,0,0,0,1,1,2,2];class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.stage=0,this.group=0}static get styles(){return`
      :host {
        --bgcolor: #bfbfbf;
        --fgcolor: #00007f;
        --msfont: "W95FA", monospace;
        --width: 594px;
        --height: 326px;
        --surface-height: 225px;

        font-size: 18px;
        font-weight: 500;
      }

      .container {
        width: var(--width);
        background: var(--bgcolor);
        padding: 2px;
        border: 2px outset #fff;
        box-shadow: 2px 2px 1px #0004;
        display: grid;
        grid-template-rows: 22px var(--surface-height) 75px;
        gap: 2px;
      }

      .surface {
        width: 100%;
        background: #fff;
        border-top: 1px solid #000;
        border-right: 2px solid #fff;
        border-left: 1px solid #666;
        border-bottom: 2px solid #fff;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(59, 8px);
        justify-content: center;
        gap: 2px;
        padding: 2px;
      }

      .status-bar {
        display: grid;
        grid-template-columns: 360px 1fr;
        padding-left: 1rem;
        align-items: center;

        & .buttons-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 9px;
          padding: 8px 6px;

          & button {
            height: 26px;
            background: var(--bgcolor);
            border: 1px outset #fff;
            box-shadow: -1px -1px 2px #000 inset;
            font-family: var(--msfont);
            font-size: 14px;

            &:not([disabled]):active {
              border: 1px inset #fff;
              border-top: 1px solid #000;
              border-left: 1px solid #000;
              box-shadow: none;
              background: #8887;
            }
          }
        }
      }
    `}connectedCallback(){this.render();const s=this.shadowRoot.querySelector("button");this.bar=this.shadowRoot.querySelector("bar-progress"),s.addEventListener("click",()=>this.startDefrag())}renderBlocks(){const s=[];for(let r=0;r<x;r++){const i=w[Math.floor(Math.random()*w.length)],t=E[i];s.push(`<disk-block ${t}></disk-block>`)}return s.join("")}async startDefrag(){this.stage=1,await this.defragFullBlocks(),await this.defragUsedBlocks()}async checkDefragBlocks(){return new Promise((s,r)=>{const i=[...this.shadowRoot.querySelectorAll("disk-block")],t=[...this.shadowRoot.querySelectorAll("disk-block[empty]")].length;let e=0;const n=o=>{if(this.stage===1)return i[o].isFull();if(this.stage===2)return i[o].isFull()||i[o].isUsed()};for(;n(e);)e++;for(let o=0;o<e;o++)i[o].setCompleted();const l=Math.ceil(e*100/(x-t));console.log({completedPercentage:l}),this.bar.setAttribute("value",l),s()})}async defragUsedBlocks(){if(this.stage===4||(await this.checkDefragBlocks(),await new Promise((r,i)=>{const t=[...this.shadowRoot.querySelectorAll("disk-block:not([completed])")],e=t.findLast(o=>o.isUsed()),n=t.find(o=>o.isEmpty()),l=t.filter(o=>o.isEmpty()).length===t.length;console.log({isSecondStageCompleted:l,stage:this.stage}),l&&(this.stage=4,r()),e&&n&&(e.setEmpty(),n.setUsed(),n.setCompleted()),r()}),this.stage===4))return;const s=this.group<d?250:Math.floor(Math.random()*(v/2));await this.markAsCompleted(s),await this.defragUsedBlocks()}async defragFullBlocks(){if(this.stage===4)return;await this.checkDefragBlocks(),await new Promise((r,i)=>{const t=[...this.shadowRoot.querySelectorAll("disk-block:not([completed])")],e=t.find(a=>a.isEmpty()),n=t.filter(a=>a.isFull()),l=Math.floor(Math.random()*n.length),o=n[l],g=n.filter(a=>!a.isCompleted()).length===0;console.log({isFirstStageCompleted:g,stage:this.stage}),g&&(this.stage=2,r()),o&&e&&(e.setWriting(),e.setFull(),o.setEmpty());const f=t.filter(a=>a.isEmpty()),y=Math.floor(Math.random()*f.length),m=f[y],b=t.find(a=>a.isUsed());m&&b&&(m.setUsed(),b.setEmpty()),r()});const s=this.group<d?250:Math.floor(Math.random()*v);await this.markAsCompleted(s),this.stage===1&&await this.defragFullBlocks(),this.stage===2&&await this.defragUsedBlocks()}async markAsCompleted(s){return new Promise((r,i)=>{this.group++,setTimeout(()=>{console.log(this.group),this.group>d&&this.group--,r()},s)})}render(){this.shadowRoot.innerHTML=`
    <style>${u.styles}</style>
    <div class="container">
      <title-bar icon="defrag">Defragmenting Drive C</title-bar>
      <div class="surface">
        ${this.renderBlocks()}
      </div>
      <div class="status-bar">
        <bar-progress value="20"></bar-progress>
        <div class="buttons-container">
          <button><span>S</span>tart</button>
          <button disabled><span>P</span>ause</button>
          <button disabled><span>L</span>egend</button>
          <button disabled>Hide <span>D</span>etails</button>
        </div>
      </div>
    </div>`}}customElements.define("defrag-win98",u);
