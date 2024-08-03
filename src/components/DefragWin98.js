import "./TitleBar.js";
import "./DiskBlock.js";
import "./BarProgress.js";

const TOTAL_BLOCKS = 1003;
const GROUPSIZE = 3;
const MAX_TIME_PER_CLUSTER = 1250;

const STATES = {
  0: "empty",
  1: "used",
  2: "full",
  3: "writing"
};

const PROBSTATES = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2];

// 0 - IDLE - No ha empezado a defragmentar
// 1 - FULL_STAGE - Está defragmentando bloques completos
// 2 - USED_STAGE - Está defragmentando bloques usados
// 3 - PAUSED - Está pausado
// 4 - FINISHED - Ha terminado

class DefragWin98 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.stage = 0;
    this.group = 0;
  }

  static get styles() {
    return /* css */`
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
    `;
  }

  connectedCallback() {
    this.render();
    const startButton = this.shadowRoot.querySelector("button");
    this.bar = this.shadowRoot.querySelector("bar-progress");
    startButton.addEventListener("click", () => this.startDefrag());
  }

  renderBlocks() {
    const blocks = [];
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      const value = PROBSTATES[Math.floor(Math.random() * PROBSTATES.length)];
      const state = STATES[value];
      blocks.push(`<disk-block ${state}></disk-block>`);
    }
    return blocks.join("");
  }

  async startDefrag() {
    this.stage = 1;

    await this.defragFullBlocks();
    await this.defragUsedBlocks();
  }

  async checkDefragBlocks() {
    return new Promise((resolve, reject) => {
      const blocks = [...this.shadowRoot.querySelectorAll("disk-block")];
      const freeBlocks = [...this.shadowRoot.querySelectorAll("disk-block[empty]")].length;

      let completed = 0;

      const checkBlock = (completed) => {
        if (this.stage === 1) return blocks[completed].isFull();
        if (this.stage === 2) return blocks[completed].isFull() || blocks[completed].isUsed();
      };

      while (checkBlock(completed)) {
        completed++;
      }

      for (let i = 0; i < completed; i++) {
        blocks[i].setCompleted();
      }

      const completedPercentage = Math.ceil((completed * 100) / (TOTAL_BLOCKS - freeBlocks));
      console.log({ completedPercentage });
      this.bar.setAttribute("value", completedPercentage);

      resolve();
    });
  }

  async defragUsedBlocks() {
    if (this.stage === 4) {
      return;
    }

    await this.checkDefragBlocks();

    await new Promise((resolve, reject) => {
      const blocks = [...this.shadowRoot.querySelectorAll("disk-block:not([completed])")];
      const lastUsed = blocks.findLast(block => block.isUsed());
      const firstEmpty = blocks.find(block => block.isEmpty());
      const isSecondStageCompleted = blocks.filter(block => block.isEmpty()).length === blocks.length;

      console.log({ isSecondStageCompleted, stage: this.stage });

      if (isSecondStageCompleted) {
        this.stage = 4;
        resolve();
      }

      if (lastUsed && firstEmpty) {
        lastUsed.setEmpty();
        firstEmpty.setUsed();
        firstEmpty.setCompleted();
      }

      resolve();
    });

    if (this.stage === 4) {
      return;
    }

    const time = this.group < GROUPSIZE ? 250 : Math.floor(Math.random() * (MAX_TIME_PER_CLUSTER / 2));
    await this.markAsCompleted(time);

    await this.defragUsedBlocks();
  }

  async defragFullBlocks() {
    if (this.stage === 4) {
      return;
    }

    await this.checkDefragBlocks();

    await new Promise((resolve, reject) => {
      const blocks = [...this.shadowRoot.querySelectorAll("disk-block:not([completed])")];
      const firstEmpty = blocks.find(block => block.isEmpty());
      const fullBlocks = blocks.filter(block => block.isFull());
      const randomFullIndex = Math.floor(Math.random() * fullBlocks.length);
      const randomFullBlock = fullBlocks[randomFullIndex];
      const isFirstStageCompleted = fullBlocks.filter(block => !block.isCompleted()).length === 0;

      console.log({ isFirstStageCompleted, stage: this.stage });

      if (isFirstStageCompleted) {
        this.stage = 2;
        resolve();
      }

      if (randomFullBlock && firstEmpty) {
        firstEmpty.setWriting();
        firstEmpty.setFull();
        randomFullBlock.setEmpty();
      }

      const emptyBlocks = blocks.filter(block => block.isEmpty());
      const randomEmptyIndex = Math.floor(Math.random() * emptyBlocks.length);
      const randomEmptyBlock = emptyBlocks[randomEmptyIndex];
      const firstUsed = blocks.find(block => block.isUsed());

      if (randomEmptyBlock && firstUsed) {
        randomEmptyBlock.setUsed();
        firstUsed.setEmpty();
      }

      resolve();
    });

    const time = this.group < GROUPSIZE ? 250 : Math.floor(Math.random() * MAX_TIME_PER_CLUSTER);
    await this.markAsCompleted(time);

    if (this.stage === 1) await this.defragFullBlocks();
    if (this.stage === 2) await this.defragUsedBlocks();
  }

  async markAsCompleted(time) {
    return new Promise((resolve, reject) => {
      this.group++;

      setTimeout(() => {
        console.log(this.group);
        if (this.group > GROUPSIZE) {
          this.group--;
        }
        resolve();
      }, time);
    });
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${DefragWin98.styles}</style>
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
    </div>`;
  }
}

customElements.define("defrag-win98", DefragWin98);
