class BarProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(name, old, now) {
    name === "value" && old !== null && this.updateValue(now);
  }

  static get styles() {
    return /* css */`
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
    `;
  }

  updateValue(value) {
    this.shadowRoot.querySelector("p").textContent = "Defragmenting file system...";
    this.style.setProperty("--value", `${value}%`);
    this.shadowRoot.querySelector(".value").textContent = value;
  }

  connectedCallback() {
    this.value = this.getAttribute("value");
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${BarProgress.styles}</style>
    <div class="container">
      <p></p>
      <div class="bar"></div>
      <p><span class="value">0</span>% complete</p>
    </div>`;
  }
}

customElements.define("bar-progress", BarProgress);
