import MinimizeIcon from "@/assets/icons/minimize.svg?raw";
import MaximizeIcon from "@/assets/icons/maximize.svg?raw";
import CloseIcon from "@/assets/icons/close.svg?raw";

class TitleBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
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
    `;
  }

  connectedCallback() {
    this.icon = `icons/${this.getAttribute("icon")}.png`;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${TitleBar.styles}</style>
    <div class="container">
      <div class="icon"><img src="${this.icon}" alt="Icon"></div>
      <div class="title"><slot></slot></div>
      <div class="buttons">
        <button class="minimize">${MinimizeIcon}</button>
        <button class="maximize">${MaximizeIcon}</button>
        <button class="close">${CloseIcon}</button>
      </div>
    </div>`;
  }
}

customElements.define("title-bar", TitleBar);
