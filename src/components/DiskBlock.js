class DiskBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
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
    `;
  }

  connectedCallback() {
    this.render();
  }

  isFull() { return this.hasAttribute("full"); }
  isEmpty() { return this.hasAttribute("empty"); }
  isUsed() { return this.hasAttribute("used"); }
  isCompleted() { return this.hasAttribute("completed"); }

  reset() {
    this.removeAttribute("full");
    this.removeAttribute("empty");
    this.removeAttribute("used");
  }

  setFull() { this.reset(); this.setAttribute("full", ""); }
  setEmpty() { this.reset(); this.setAttribute("empty", ""); }
  setUsed() { this.reset(); this.setAttribute("used", ""); }
  setCompleted() { this.setAttribute("completed", ""); }
  setWriting() {
    this.setAttribute("writing", "");
    setTimeout(() => this.removeAttribute("writing"), 1500);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${DiskBlock.styles}</style>
    <div class="block">
    </div>`;
  }
}

customElements.define("disk-block", DiskBlock);
