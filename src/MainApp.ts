import GameLive from "./GameLive";

export function disableButton(button: HTMLButtonElement) {
  // eslint-disable-next-line no-param-reassign
  button.disabled = true;
}

export function enableButton(button: HTMLButtonElement) {
  // eslint-disable-next-line no-param-reassign
  button.disabled = false;
}

export default class MainApp {
  readonly appTemplate = `
    <div class="settings-block">
    <input class="mark-check" type="checkbox" name="mark-check" />
    <label for="mark-check">
      Указывать какие клетки изменятся на следующем тике
    </label>
  </div>
  <div class="settings-block">
    <label>Рзамер сетки :</label>
    <input class="width-input" placeholder="Width" type="number" pattern="[0-9]+" required />
    X
    <input class="height-input" placeholder="Height" type="number" pattern="[0-9]+" required />
    <button class="createGrid" type="button">Создать новую сетку</button>
  </div>
  <div class="settings-block">
    <label>Скорость :</label>
    <input class="speed-input" type="range" min="0" value="10" max="45" step="5" />
  </div>
  <div class="settings-block">
    <button class="nextTic" type="button">Следующий тик</button>
    <button class="start" type="button">Старт</button>
  </div>
  <div class="settings-block legend">
    <label>Легенда:</label>
    <cell class="cell-legend dead" title="Мёртвая клетка"></cell>
    <cell class="cell-legend alive" title="Живая клетка"></cell>
    <cell class="cell-legend mark-for-dead invisible" title="Умрёт на следующем тике"></cell>
    <cell class="cell-legend mark-for-alive invisible" title="Оживёт на следующем тике"></cell>
  </div>
  <div class="live-game-container"></div>`;

  readonly container: HTMLElement;

  widthInput: HTMLInputElement;

  heightInput: HTMLInputElement;

  speedElement: HTMLInputElement;

  markCheckbox: HTMLInputElement;

  startButton: HTMLButtonElement;

  gridButton: HTMLButtonElement;

  nextTicButton: HTMLButtonElement;

  legendBlock: HTMLElement;

  startFlag = false;

  timerId!: NodeJS.Timeout | undefined;

  gameLive!: GameLive;

  constructor(root: HTMLElement) {
    this.container = root;
    this.container.innerHTML = this.appTemplate;

    // class fields init
    this.widthInput = this.container.querySelector(
      ".width-input",
    ) as HTMLInputElement;
    this.heightInput = this.container.querySelector(
      ".height-input",
    ) as HTMLInputElement;
    this.speedElement = this.container.querySelector(
      ".speed-input",
    ) as HTMLInputElement;
    this.markCheckbox = this.container.querySelector(
      ".mark-check",
    ) as HTMLInputElement;
    this.startButton = this.container.querySelector(
      ".start",
    ) as HTMLButtonElement;
    this.gridButton = this.container.querySelector(
      ".createGrid",
    ) as HTMLButtonElement;
    this.nextTicButton = this.container.querySelector(
      ".nextTic",
    ) as HTMLButtonElement;
    this.legendBlock = this.container.querySelector(".legend") as HTMLElement;

    this.widthInput.value = getComputedStyle(this.container).getPropertyValue(
      "--field-width",
    );
    this.heightInput.value = getComputedStyle(this.container).getPropertyValue(
      "--field-height",
    );

    disableButton(this.nextTicButton);
    disableButton(this.startButton);
    disableButton(this.gridButton);

    // listeners init
    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "Space":
          event.preventDefault();
          this.startButtonClick();
          break;
        case "ArrowUp":
          this.speedElement.stepUp();
          this.speedElement.dispatchEvent(new Event("change"));
          break;
        case "ArrowDown":
          this.speedElement.stepDown();
          this.speedElement.dispatchEvent(new Event("change"));
          break;
        case "ArrowRight":
          this.nextTicButton.click();
          break;
        default:
      }
    });

    this.markCheckbox.addEventListener("change", () => {
      this.legendBlock
        .querySelector(".mark-for-dead")
        ?.classList.toggle("invisible");
      this.legendBlock
        .querySelector(".mark-for-alive")
        ?.classList.toggle("invisible");
    });
  }

  start() {
    this.gameLive = new GameLive(
      this.container.querySelector(".live-game-container") as HTMLElement,
      Number(this.widthInput.value),
      Number(this.heightInput.value),
      this.markCheckbox.checked,
    );

    enableButton(this.nextTicButton);
    enableButton(this.startButton);
    enableButton(this.gridButton);

    this.widthInput.addEventListener("change", () => {
      this.container.style.setProperty("--field-width", this.widthInput.value);
      this.gameLive.resizeWidth(Number(this.widthInput.value));
    });

    this.heightInput.addEventListener("change", () => {
      this.container.style.setProperty(
        "--field-height",
        this.heightInput.value,
      );
      this.gameLive.resizeHeight(Number(this.heightInput.value));
    });

    this.nextTicButton.addEventListener("click", () => {
      this.gameLive.nextTic();
    });

    this.startButton.addEventListener("click", () => {
      this.startButtonClick();
    });

    this.markCheckbox.addEventListener("change", () => {
      this.gameLive.markable = this.markCheckbox.checked;
    });

    this.gridButton.addEventListener("click", () => {
      this.container.style.setProperty("--field-width", this.widthInput.value);
      this.container.style.setProperty(
        "--field-height",
        this.heightInput.value,
      );

      this.gameLive.getGrid(
        Number(this.widthInput.value),
        Number(this.heightInput.value),
      );
    });

    this.speedElement.addEventListener("change", () => {
      if (this.startFlag) {
        this.gameStop();
        this.gameStart();
      }
    });
  }

  startButtonClick() {
    if (!this.startFlag) {
      this.gameStart();
      this.startFlag = true;
      this.startButton.innerText = "Стоп";
      disableButton(this.nextTicButton);
      disableButton(this.gridButton);
      this.container.classList.toggle("run");
    } else {
      this.gameStop();
      this.startFlag = false;
      this.startButton.innerText = "Старт";
      enableButton(this.nextTicButton);
      enableButton(this.gridButton);
      this.container.classList.toggle("run");
    }
  }

  gameStart() {
    this.timerId = setInterval(
      this.gameStartFunction(),
      1000 / (Number(this.speedElement.value) + 5),
    );
  }

  gameStartFunction() {
    return () => {
      if (this.gameLive.nextTic()) {
        this.startButtonClick();
      }
    };
  }

  gameStop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
}
