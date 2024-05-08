"use strict";
(self["webpackChunkhomework_lesson20"] = self["webpackChunkhomework_lesson20"] || []).push([["main"],{

/***/ "./src/Cell.ts":
/*!*********************!*\
  !*** ./src/Cell.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CellType: () => (/* binding */ CellType),
/* harmony export */   MarkCellType: () => (/* binding */ MarkCellType),
/* harmony export */   "default": () => (/* binding */ Cell)
/* harmony export */ });
/* eslint-disable default-case */
// eslint-disable-next-line no-shadow
let CellType = /*#__PURE__*/function (CellType) {
  CellType["dead"] = "dead";
  CellType["alive"] = "alive";
  return CellType;
}({});

// eslint-disable-next-line no-shadow
let MarkCellType = /*#__PURE__*/function (MarkCellType) {
  MarkCellType["markForDead"] = "mark-for-dead";
  MarkCellType["markForAlive"] = "mark-for-alive";
  MarkCellType["markForDeadInvisible"] = "mark-for-dead-invisible";
  MarkCellType["markForAliveInvisible"] = "mark-for-alive-invisible";
  return MarkCellType;
}({});
class Cell {
  typeNextTic = undefined;
  marked = false;
  constructor(coorX, coorY, type) {
    this.coorX = coorX;
    this.coorY = coorY;
    this.type = type ?? CellType.dead;
    this.cellElement = document.createElement("cell");
    this.cellElement.classList.add("cell");
    this.cellElement.classList.add(this.type);
    this.cellElement.setAttribute("coor-x", `${this.coorX}`);
    this.cellElement.setAttribute("coor-y", `${this.coorY}`);
    this.cellElement.title = `Cell(${this.coorX},${this.coorY})`;
  }
  onClick() {
    switch (this.type) {
      case CellType.alive:
        this.setType(CellType.dead);
        break;
      case CellType.dead:
        this.setType(CellType.alive);
        break;
    }
  }
  setType(type) {
    this.type = type;
    this.cellElement.classList.remove(...this.cellElement.classList);
    this.cellElement.classList.add("cell");
    this.cellElement.classList.add(this.type);
  }
  mark(type) {
    this.marked = true;
    this.typeNextTic = type;
    this.cellElement.classList.add(type);
  }
  processMark() {
    switch (this.typeNextTic) {
      case MarkCellType.markForAlive:
      case MarkCellType.markForAliveInvisible:
        this.setType(CellType.alive);
        break;
      case MarkCellType.markForDead:
      case MarkCellType.markForDeadInvisible:
        this.setType(CellType.dead);
        break;
    }
    this.markClear();
  }
  markClear() {
    this.marked = false;
    this.typeNextTic = undefined;
    this.cellElement.classList.remove(MarkCellType.markForAlive);
    this.cellElement.classList.remove(MarkCellType.markForAliveInvisible);
    this.cellElement.classList.remove(MarkCellType.markForDead);
    this.cellElement.classList.remove(MarkCellType.markForDeadInvisible);
  }
}

/***/ }),

/***/ "./src/GameLive.ts":
/*!*************************!*\
  !*** ./src/GameLive.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameLive)
/* harmony export */ });
/* harmony import */ var _Cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cell */ "./src/Cell.ts");
/* eslint-disable no-nested-ternary */

class GameLive {
  cellToMark = new Set();
  cellToChangeNextTic = new Set();
  grid = [];
  constructor(container, width, height, markable) {
    this.container = container;
    this.width = width;
    this.height = height;
    this.markable = markable ?? false;
    this.getGrid();
    this.container.addEventListener("click", event => {
      if (event.target instanceof HTMLElement && !this.currentHoverCell) {
        const element = event.target;
        const cell = this.getCell(Number(element.getAttribute("coor-x")), Number(element.getAttribute("coor-y")));
        cell.onClick();
        this.cellUpdateCheck(cell);
        this.markGrid();
      }
    });
  }
  getGrid(width, height) {
    this.cellToMark.clear();
    this.cellToChangeNextTic.clear();
    this.grid = [];
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    for (let y = 0; y < this.height; y += 1) {
      this.grid[y] = [];
      for (let x = 0; x < this.width; x += 1) {
        this.grid[y][x] = new _Cell__WEBPACK_IMPORTED_MODULE_0__["default"](x, y);
      }
    }
    this.showGrid();
  }
  resizeWidth(width) {
    if (this.width !== width) {
      if (this.width > width) {
        this.grid.forEach(row => row.splice(width, this.width - width));
      } else {
        this.grid.forEach((row, y) => {
          for (let x = this.width; x < width; x += 1) {
            row.push(new _Cell__WEBPACK_IMPORTED_MODULE_0__["default"](x, y));
          }
        });
      }
      this.width = width;
      this.showGrid();
    }
  }
  resizeHeight(height) {
    if (this.height !== height) {
      if (this.height > height) {
        this.grid.splice(height, this.height - height);
      } else {
        for (let y = this.height; y < height; y += 1) {
          this.grid[y] = [];
          for (let x = 0; x < this.width; x += 1) {
            this.grid[y][x] = new _Cell__WEBPACK_IMPORTED_MODULE_0__["default"](x, y);
          }
        }
      }
      this.height = height;
      this.showGrid();
    }
  }
  showGrid() {
    this.container.innerHTML = "";
    this.grid.forEach(row => {
      row.forEach(cell => this.container.appendChild(cell.cellElement));
    });
  }
  markGrid() {
    this.cellToChangeNextTic.clear();
    const cells = new Set();
    [...this.cellToMark].forEach(cell => {
      cells.add(cell);
      this.getCellNeighbours(cell).forEach(cells.add, cells);
    });
    cells.forEach(cell => {
      cell.markClear();
      const aliveCellNeighbours = this.getCellNeighbours(cell).reduce((result, el) => el.type === _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.alive ? result + 1 : result, 0);
      if (cell.type === _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.alive && (aliveCellNeighbours < 2 || aliveCellNeighbours > 3)) {
        if (this.markable) cell.mark(_Cell__WEBPACK_IMPORTED_MODULE_0__.MarkCellType.markForDead);else cell.mark(_Cell__WEBPACK_IMPORTED_MODULE_0__.MarkCellType.markForDeadInvisible);
        this.cellToChangeNextTic.add(cell);
      }
      if (cell.type === _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.dead && aliveCellNeighbours === 3) {
        if (this.markable) cell.mark(_Cell__WEBPACK_IMPORTED_MODULE_0__.MarkCellType.markForAlive);else cell.mark(_Cell__WEBPACK_IMPORTED_MODULE_0__.MarkCellType.markForAliveInvisible);
        this.cellToChangeNextTic.add(cell);
      }
    });
  }
  cellUpdateCheck(cell) {
    if (cell.type === _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.alive) {
      this.cellToMark.add(cell);
    } else {
      this.cellToMark.delete(cell);
    }
  }
  getCellNeighbours(cell) {
    return [this.getCell(cell.coorX - 1, cell.coorY - 1), this.getCell(cell.coorX, cell.coorY - 1), this.getCell(cell.coorX + 1, cell.coorY - 1), this.getCell(cell.coorX - 1, cell.coorY), this.getCell(cell.coorX + 1, cell.coorY), this.getCell(cell.coorX - 1, cell.coorY + 1), this.getCell(cell.coorX, cell.coorY + 1), this.getCell(cell.coorX + 1, cell.coorY + 1)];
  }
  nextTic() {
    this.cellToChangeNextTic.forEach(cell => {
      cell.processMark();
      this.cellUpdateCheck(cell);
    });
    this.markGrid();
    return this.cellToChangeNextTic.size === 0;
  }
  getCell(coorX, coorY) {
    let x = coorX;
    if (!(x >= 0 && x < this.width)) {
      if (x < 0) x = this.width - -x % this.width;else x %= this.width;
    }
    let y = coorY;
    if (!(y >= 0 && y < this.height)) {
      if (y < 0) y = this.height - -y % this.height;else y %= this.height;
    }
    return this.grid[y][x];
  }
  insertFigure(startCell, figureCoor) {
    figureCoor.split(";").forEach(coorPair => {
      const [x, y] = coorPair.split(",");
      const cell = this.getCell(Number(x) + startCell.coorX, Number(y) + startCell.coorY);
      cell.setType(_Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.alive);
      this.cellUpdateCheck(cell);
    });
  }
  deleteFigure(startCell, figureCoor) {
    figureCoor.split(";").forEach(coorPair => {
      const [x, y] = coorPair.split(",");
      const cell = this.getCell(Number(x) + startCell.coorX, Number(y) + startCell.coorY);
      cell.setType(_Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.dead);
      this.cellUpdateCheck(cell);
    });
  }
}

/***/ }),

/***/ "./src/MainApp.ts":
/*!************************!*\
  !*** ./src/MainApp.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainApp),
/* harmony export */   disableButton: () => (/* binding */ disableButton),
/* harmony export */   enableButton: () => (/* binding */ enableButton)
/* harmony export */ });
/* harmony import */ var _GameLive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameLive */ "./src/GameLive.ts");

function disableButton(button) {
  // eslint-disable-next-line no-param-reassign
  button.disabled = true;
}
function enableButton(button) {
  // eslint-disable-next-line no-param-reassign
  button.disabled = false;
}
class MainApp {
  appTemplate = `
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
  startFlag = false;
  constructor(root) {
    this.container = root;
    this.container.innerHTML = this.appTemplate;

    // class fields init
    this.widthInput = this.container.querySelector(".width-input");
    this.heightInput = this.container.querySelector(".height-input");
    this.speedElement = this.container.querySelector(".speed-input");
    this.markCheckbox = this.container.querySelector(".mark-check");
    this.startButton = this.container.querySelector(".start");
    this.gridButton = this.container.querySelector(".createGrid");
    this.nextTicButton = this.container.querySelector(".nextTic");
    this.legendBlock = this.container.querySelector(".legend");
    this.widthInput.value = getComputedStyle(this.container).getPropertyValue("--field-width");
    this.heightInput.value = getComputedStyle(this.container).getPropertyValue("--field-height");
    disableButton(this.nextTicButton);
    disableButton(this.startButton);
    disableButton(this.gridButton);

    // listeners init
    window.addEventListener("keyup", event => {
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
      this.legendBlock.querySelector(".mark-for-dead")?.classList.toggle("invisible");
      this.legendBlock.querySelector(".mark-for-alive")?.classList.toggle("invisible");
    });
  }
  start() {
    this.gameLive = new _GameLive__WEBPACK_IMPORTED_MODULE_0__["default"](this.container.querySelector(".live-game-container"), Number(this.widthInput.value), Number(this.heightInput.value), this.markCheckbox.checked);
    enableButton(this.nextTicButton);
    enableButton(this.startButton);
    enableButton(this.gridButton);
    this.widthInput.addEventListener("change", () => {
      this.container.style.setProperty("--field-width", this.widthInput.value);
      this.gameLive.resizeWidth(Number(this.widthInput.value));
    });
    this.heightInput.addEventListener("change", () => {
      this.container.style.setProperty("--field-height", this.heightInput.value);
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
      this.container.style.setProperty("--field-height", this.heightInput.value);
      this.gameLive.getGrid(Number(this.widthInput.value), Number(this.heightInput.value));
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
    this.timerId = setInterval(this.gameStartFunction(), 1000 / (Number(this.speedElement.value) + 5));
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

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MainApp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MainApp */ "./src/MainApp.ts");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");


const application = new _MainApp__WEBPACK_IMPORTED_MODULE_0__["default"](document.querySelector(".main"));
application.start();

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --cell-size: 20px;
  --field-width: 40;
  --field-height: 25;
}

.main {
  overflow: auto;
  margin: 0 auto;
  padding: 2rem 2rem;
  border: 3px solid #333333;
  border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
}

.run {
  background-color: #696969;
}

.settings-block {
  padding: 4px 4px;
}

.cell-legend {
  display: inline-block;
  width: var(--cell-size);
  height: var(--cell-size);
  border: 1px solid #333333;
  border-radius: 10% 10% 10% 10%;
}

.live-game-container {
  width: fit-content;
  overflow: auto;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(var(--field-width), auto);
  grid-template-rows: repeat(var(--field-height), auto);
  gap: 0;
}

.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  border: 1px solid #333333;
}

.cell:hover {
  width: var(--cell-size);
  height: var(--cell-size);
  border: 1px solid #333333;
  border-radius: 10% 10% 10% 10%;
  background-color: aqua;
}

.dead {
  background-color: aliceblue;
}

.alive {
  background-color: black;
}

.mark-for-dead {
  background-color: grey;
}

.mark-for-alive {
  background-color: blue;
}

.invisible {
  display: none;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,yBAAyB;EACzB,wCAAwC;AAC1C;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;EACrB,uBAAuB;EACvB,wBAAwB;EACxB,yBAAyB;EACzB,8BAA8B;AAChC;;AAEA;EACE,kBAAkB;EAClB,cAAc;EACd,cAAc;EACd,aAAa;EACb,uDAAuD;EACvD,qDAAqD;EACrD,MAAM;AACR;;AAEA;EACE,uBAAuB;EACvB,wBAAwB;EACxB,yBAAyB;AAC3B;;AAEA;EACE,uBAAuB;EACvB,wBAAwB;EACxB,yBAAyB;EACzB,8BAA8B;EAC9B,sBAAsB;AACxB;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,aAAa;AACf","sourcesContent":[":root {\n  --cell-size: 20px;\n  --field-width: 40;\n  --field-height: 25;\n}\n\n.main {\n  overflow: auto;\n  margin: 0 auto;\n  padding: 2rem 2rem;\n  border: 3px solid #333333;\n  border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;\n}\n\n.run {\n  background-color: #696969;\n}\n\n.settings-block {\n  padding: 4px 4px;\n}\n\n.cell-legend {\n  display: inline-block;\n  width: var(--cell-size);\n  height: var(--cell-size);\n  border: 1px solid #333333;\n  border-radius: 10% 10% 10% 10%;\n}\n\n.live-game-container {\n  width: fit-content;\n  overflow: auto;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: repeat(var(--field-width), auto);\n  grid-template-rows: repeat(var(--field-height), auto);\n  gap: 0;\n}\n\n.cell {\n  width: var(--cell-size);\n  height: var(--cell-size);\n  border: 1px solid #333333;\n}\n\n.cell:hover {\n  width: var(--cell-size);\n  height: var(--cell-size);\n  border: 1px solid #333333;\n  border-radius: 10% 10% 10% 10%;\n  background-color: aqua;\n}\n\n.dead {\n  background-color: aliceblue;\n}\n\n.alive {\n  background-color: black;\n}\n\n.mark-for-dead {\n  background-color: grey;\n}\n\n.mark-for-alive {\n  background-color: blue;\n}\n\n.invisible {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.ts"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNPLElBQUtBLFFBQVEsMEJBQVJBLFFBQVE7RUFBUkEsUUFBUTtFQUFSQSxRQUFRO0VBQUEsT0FBUkEsUUFBUTtBQUFBOztBQUtwQjtBQUNPLElBQUtDLFlBQVksMEJBQVpBLFlBQVk7RUFBWkEsWUFBWTtFQUFaQSxZQUFZO0VBQVpBLFlBQVk7RUFBWkEsWUFBWTtFQUFBLE9BQVpBLFlBQVk7QUFBQTtBQU9ULE1BQU1DLElBQUksQ0FBQztFQVN4QkMsV0FBVyxHQUE2QkMsU0FBUztFQUVqREMsTUFBTSxHQUFHLEtBQUs7RUFFZEMsV0FBV0EsQ0FBQ0MsS0FBYSxFQUFFQyxLQUFhLEVBQUVDLElBQWUsRUFBRTtJQUN6RCxJQUFJLENBQUNGLEtBQUssR0FBR0EsS0FBSztJQUNsQixJQUFJLENBQUNDLEtBQUssR0FBR0EsS0FBSztJQUNsQixJQUFJLENBQUNDLElBQUksR0FBR0EsSUFBSSxJQUFJVCxRQUFRLENBQUNVLElBQUk7SUFFakMsSUFBSSxDQUFDQyxXQUFXLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUVqRCxJQUFJLENBQUNGLFdBQVcsQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3RDLElBQUksQ0FBQ0osV0FBVyxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUNOLElBQUksQ0FBQztJQUN6QyxJQUFJLENBQUNFLFdBQVcsQ0FBQ0ssWUFBWSxDQUFDLFFBQVEsRUFBRyxHQUFFLElBQUksQ0FBQ1QsS0FBTSxFQUFDLENBQUM7SUFDeEQsSUFBSSxDQUFDSSxXQUFXLENBQUNLLFlBQVksQ0FBQyxRQUFRLEVBQUcsR0FBRSxJQUFJLENBQUNSLEtBQU0sRUFBQyxDQUFDO0lBQ3hELElBQUksQ0FBQ0csV0FBVyxDQUFDTSxLQUFLLEdBQUksUUFBTyxJQUFJLENBQUNWLEtBQU0sSUFBRyxJQUFJLENBQUNDLEtBQU0sR0FBRTtFQUM5RDtFQUVBVSxPQUFPQSxDQUFBLEVBQUc7SUFDUixRQUFRLElBQUksQ0FBQ1QsSUFBSTtNQUNmLEtBQUtULFFBQVEsQ0FBQ21CLEtBQUs7UUFDakIsSUFBSSxDQUFDQyxPQUFPLENBQUNwQixRQUFRLENBQUNVLElBQUksQ0FBQztRQUMzQjtNQUNGLEtBQUtWLFFBQVEsQ0FBQ1UsSUFBSTtRQUNoQixJQUFJLENBQUNVLE9BQU8sQ0FBQ3BCLFFBQVEsQ0FBQ21CLEtBQUssQ0FBQztRQUM1QjtJQUNKO0VBQ0Y7RUFFQUMsT0FBT0EsQ0FBQ1gsSUFBYyxFQUFFO0lBQ3RCLElBQUksQ0FBQ0EsSUFBSSxHQUFHQSxJQUFJO0lBQ2hCLElBQUksQ0FBQ0UsV0FBVyxDQUFDRyxTQUFTLENBQUNPLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQ1YsV0FBVyxDQUFDRyxTQUFTLENBQUM7SUFDaEUsSUFBSSxDQUFDSCxXQUFXLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxJQUFJLENBQUNKLFdBQVcsQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDTixJQUFJLENBQUM7RUFDM0M7RUFFQWEsSUFBSUEsQ0FBQ2IsSUFBa0IsRUFBRTtJQUN2QixJQUFJLENBQUNKLE1BQU0sR0FBRyxJQUFJO0lBQ2xCLElBQUksQ0FBQ0YsV0FBVyxHQUFHTSxJQUFJO0lBQ3ZCLElBQUksQ0FBQ0UsV0FBVyxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQ04sSUFBSSxDQUFDO0VBQ3RDO0VBRUFjLFdBQVdBLENBQUEsRUFBRztJQUNaLFFBQVEsSUFBSSxDQUFDcEIsV0FBVztNQUN0QixLQUFLRixZQUFZLENBQUN1QixZQUFZO01BQzlCLEtBQUt2QixZQUFZLENBQUN3QixxQkFBcUI7UUFDckMsSUFBSSxDQUFDTCxPQUFPLENBQUNwQixRQUFRLENBQUNtQixLQUFLLENBQUM7UUFDNUI7TUFDRixLQUFLbEIsWUFBWSxDQUFDeUIsV0FBVztNQUM3QixLQUFLekIsWUFBWSxDQUFDMEIsb0JBQW9CO1FBQ3BDLElBQUksQ0FBQ1AsT0FBTyxDQUFDcEIsUUFBUSxDQUFDVSxJQUFJLENBQUM7UUFDM0I7SUFDSjtJQUNBLElBQUksQ0FBQ2tCLFNBQVMsQ0FBQyxDQUFDO0VBQ2xCO0VBRUFBLFNBQVNBLENBQUEsRUFBRztJQUNWLElBQUksQ0FBQ3ZCLE1BQU0sR0FBRyxLQUFLO0lBQ25CLElBQUksQ0FBQ0YsV0FBVyxHQUFHQyxTQUFTO0lBQzVCLElBQUksQ0FBQ08sV0FBVyxDQUFDRyxTQUFTLENBQUNPLE1BQU0sQ0FBQ3BCLFlBQVksQ0FBQ3VCLFlBQVksQ0FBQztJQUM1RCxJQUFJLENBQUNiLFdBQVcsQ0FBQ0csU0FBUyxDQUFDTyxNQUFNLENBQUNwQixZQUFZLENBQUN3QixxQkFBcUIsQ0FBQztJQUNyRSxJQUFJLENBQUNkLFdBQVcsQ0FBQ0csU0FBUyxDQUFDTyxNQUFNLENBQUNwQixZQUFZLENBQUN5QixXQUFXLENBQUM7SUFDM0QsSUFBSSxDQUFDZixXQUFXLENBQUNHLFNBQVMsQ0FBQ08sTUFBTSxDQUFDcEIsWUFBWSxDQUFDMEIsb0JBQW9CLENBQUM7RUFDdEU7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0FDeEZBO0FBQ3NEO0FBRXZDLE1BQU1FLFFBQVEsQ0FBQztFQUduQkMsVUFBVSxHQUFjLElBQUlDLEdBQUcsQ0FBQyxDQUFDO0VBRWpDQyxtQkFBbUIsR0FBYyxJQUFJRCxHQUFHLENBQUMsQ0FBQztFQUVuREUsSUFBSSxHQUF1QixFQUFFO0VBVTdCM0IsV0FBV0EsQ0FDVDRCLFNBQXNCLEVBQ3RCQyxLQUFhLEVBQ2JDLE1BQWMsRUFDZEMsUUFBa0IsRUFDbEI7SUFDQSxJQUFJLENBQUNILFNBQVMsR0FBR0EsU0FBUztJQUMxQixJQUFJLENBQUNDLEtBQUssR0FBR0EsS0FBSztJQUNsQixJQUFJLENBQUNDLE1BQU0sR0FBR0EsTUFBTTtJQUNwQixJQUFJLENBQUNDLFFBQVEsR0FBR0EsUUFBUSxJQUFJLEtBQUs7SUFFakMsSUFBSSxDQUFDQyxPQUFPLENBQUMsQ0FBQztJQUVkLElBQUksQ0FBQ0osU0FBUyxDQUFDSyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUdDLEtBQUssSUFBSztNQUNsRCxJQUFJQSxLQUFLLENBQUNDLE1BQU0sWUFBWUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDQyxnQkFBZ0IsRUFBRTtRQUNqRSxNQUFNQyxPQUFPLEdBQUdKLEtBQUssQ0FBQ0MsTUFBcUI7UUFDM0MsTUFBTUksSUFBSSxHQUFHLElBQUksQ0FBQ0MsT0FBTyxDQUN2QkMsTUFBTSxDQUFDSCxPQUFPLENBQUNJLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUN0Q0QsTUFBTSxDQUFDSCxPQUFPLENBQUNJLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FDdkMsQ0FBQztRQUNESCxJQUFJLENBQUMzQixPQUFPLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQytCLGVBQWUsQ0FBQ0osSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQ0ssUUFBUSxDQUFDLENBQUM7TUFDakI7SUFDRixDQUFDLENBQUM7RUFDSjtFQUVBWixPQUFPQSxDQUFDSCxLQUFjLEVBQUVDLE1BQWUsRUFBRTtJQUN2QyxJQUFJLENBQUNOLFVBQVUsQ0FBQ3FCLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLElBQUksQ0FBQ25CLG1CQUFtQixDQUFDbUIsS0FBSyxDQUFDLENBQUM7SUFDaEMsSUFBSSxDQUFDbEIsSUFBSSxHQUFHLEVBQUU7SUFFZCxJQUFJLENBQUNFLEtBQUssR0FBR0EsS0FBSyxJQUFJLElBQUksQ0FBQ0EsS0FBSztJQUNoQyxJQUFJLENBQUNDLE1BQU0sR0FBR0EsTUFBTSxJQUFJLElBQUksQ0FBQ0EsTUFBTTtJQUVuQyxLQUFLLElBQUlnQixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDaEIsTUFBTSxFQUFFZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUN2QyxJQUFJLENBQUNuQixJQUFJLENBQUNtQixDQUFDLENBQUMsR0FBRyxFQUFFO01BQ2pCLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLElBQUksQ0FBQ2xCLEtBQUssRUFBRWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDdEMsSUFBSSxDQUFDcEIsSUFBSSxDQUFDbUIsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxHQUFHLElBQUluRCw2Q0FBSSxDQUFDbUQsQ0FBQyxFQUFFRCxDQUFDLENBQUM7TUFDbEM7SUFDRjtJQUVBLElBQUksQ0FBQ0UsUUFBUSxDQUFDLENBQUM7RUFDakI7RUFFQUMsV0FBV0EsQ0FBQ3BCLEtBQWEsRUFBRTtJQUN6QixJQUFJLElBQUksQ0FBQ0EsS0FBSyxLQUFLQSxLQUFLLEVBQUU7TUFDeEIsSUFBSSxJQUFJLENBQUNBLEtBQUssR0FBR0EsS0FBSyxFQUFFO1FBQ3RCLElBQUksQ0FBQ0YsSUFBSSxDQUFDdUIsT0FBTyxDQUFFQyxHQUFHLElBQUtBLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQ0EsS0FBSyxHQUFHQSxLQUFLLENBQUMsQ0FBQztNQUNuRSxDQUFDLE1BQU07UUFDTCxJQUFJLENBQUNGLElBQUksQ0FBQ3VCLE9BQU8sQ0FBQyxDQUFDQyxHQUFHLEVBQUVMLENBQUMsS0FBSztVQUM1QixLQUFLLElBQUlDLENBQUMsR0FBRyxJQUFJLENBQUNsQixLQUFLLEVBQUVrQixDQUFDLEdBQUdsQixLQUFLLEVBQUVrQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFDSSxHQUFHLENBQUNFLElBQUksQ0FBQyxJQUFJekQsNkNBQUksQ0FBQ21ELENBQUMsRUFBRUQsQ0FBQyxDQUFDLENBQUM7VUFDMUI7UUFDRixDQUFDLENBQUM7TUFDSjtNQUNBLElBQUksQ0FBQ2pCLEtBQUssR0FBR0EsS0FBSztNQUNsQixJQUFJLENBQUNtQixRQUFRLENBQUMsQ0FBQztJQUNqQjtFQUNGO0VBRUFNLFlBQVlBLENBQUN4QixNQUFjLEVBQUU7SUFDM0IsSUFBSSxJQUFJLENBQUNBLE1BQU0sS0FBS0EsTUFBTSxFQUFFO01BQzFCLElBQUksSUFBSSxDQUFDQSxNQUFNLEdBQUdBLE1BQU0sRUFBRTtRQUN4QixJQUFJLENBQUNILElBQUksQ0FBQ3lCLE1BQU0sQ0FBQ3RCLE1BQU0sRUFBRSxJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTSxDQUFDO01BQ2hELENBQUMsTUFBTTtRQUNMLEtBQUssSUFBSWdCLENBQUMsR0FBRyxJQUFJLENBQUNoQixNQUFNLEVBQUVnQixDQUFDLEdBQUdoQixNQUFNLEVBQUVnQixDQUFDLElBQUksQ0FBQyxFQUFFO1VBQzVDLElBQUksQ0FBQ25CLElBQUksQ0FBQ21CLENBQUMsQ0FBQyxHQUFHLEVBQUU7VUFDakIsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDbEIsS0FBSyxFQUFFa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUNwQixJQUFJLENBQUNtQixDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEdBQUcsSUFBSW5ELDZDQUFJLENBQUNtRCxDQUFDLEVBQUVELENBQUMsQ0FBQztVQUNsQztRQUNGO01BQ0Y7TUFDQSxJQUFJLENBQUNoQixNQUFNLEdBQUdBLE1BQU07TUFDcEIsSUFBSSxDQUFDa0IsUUFBUSxDQUFDLENBQUM7SUFDakI7RUFDRjtFQUVBQSxRQUFRQSxDQUFBLEVBQUc7SUFDVCxJQUFJLENBQUNwQixTQUFTLENBQUMyQixTQUFTLEdBQUcsRUFBRTtJQUM3QixJQUFJLENBQUM1QixJQUFJLENBQUN1QixPQUFPLENBQUVDLEdBQUcsSUFBSztNQUN6QkEsR0FBRyxDQUFDRCxPQUFPLENBQUVYLElBQUksSUFBSyxJQUFJLENBQUNYLFNBQVMsQ0FBQzRCLFdBQVcsQ0FBQ2pCLElBQUksQ0FBQ2xDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsQ0FBQztFQUNKO0VBRUF1QyxRQUFRQSxDQUFBLEVBQUc7SUFDVCxJQUFJLENBQUNsQixtQkFBbUIsQ0FBQ21CLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU1ZLEtBQWdCLEdBQUcsSUFBSWhDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsR0FBRyxJQUFJLENBQUNELFVBQVUsQ0FBQyxDQUFDMEIsT0FBTyxDQUFFWCxJQUFJLElBQUs7TUFDckNrQixLQUFLLENBQUNoRCxHQUFHLENBQUM4QixJQUFJLENBQUM7TUFDZixJQUFJLENBQUNtQixpQkFBaUIsQ0FBQ25CLElBQUksQ0FBQyxDQUFDVyxPQUFPLENBQUNPLEtBQUssQ0FBQ2hELEdBQUcsRUFBRWdELEtBQUssQ0FBQztJQUN4RCxDQUFDLENBQUM7SUFFRkEsS0FBSyxDQUFDUCxPQUFPLENBQUVYLElBQUksSUFBSztNQUN0QkEsSUFBSSxDQUFDakIsU0FBUyxDQUFDLENBQUM7TUFDaEIsTUFBTXFDLG1CQUFtQixHQUFHLElBQUksQ0FBQ0QsaUJBQWlCLENBQUNuQixJQUFJLENBQUMsQ0FBQ3FCLE1BQU0sQ0FDN0QsQ0FBQ0MsTUFBTSxFQUFFQyxFQUFRLEtBQ2ZBLEVBQUUsQ0FBQzNELElBQUksS0FBS1QsMkNBQVEsQ0FBQ21CLEtBQUssR0FBR2dELE1BQU0sR0FBRyxDQUFDLEdBQUdBLE1BQU0sRUFDbEQsQ0FDRixDQUFDO01BQ0QsSUFDRXRCLElBQUksQ0FBQ3BDLElBQUksS0FBS1QsMkNBQVEsQ0FBQ21CLEtBQUssS0FDM0I4QyxtQkFBbUIsR0FBRyxDQUFDLElBQUlBLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxFQUNwRDtRQUNBLElBQUksSUFBSSxDQUFDNUIsUUFBUSxFQUFFUSxJQUFJLENBQUN2QixJQUFJLENBQUNyQiwrQ0FBWSxDQUFDeUIsV0FBVyxDQUFDLENBQUMsS0FDbERtQixJQUFJLENBQUN2QixJQUFJLENBQUNyQiwrQ0FBWSxDQUFDMEIsb0JBQW9CLENBQUM7UUFDakQsSUFBSSxDQUFDSyxtQkFBbUIsQ0FBQ2pCLEdBQUcsQ0FBQzhCLElBQUksQ0FBQztNQUNwQztNQUNBLElBQUlBLElBQUksQ0FBQ3BDLElBQUksS0FBS1QsMkNBQVEsQ0FBQ1UsSUFBSSxJQUFJdUQsbUJBQW1CLEtBQUssQ0FBQyxFQUFFO1FBQzVELElBQUksSUFBSSxDQUFDNUIsUUFBUSxFQUFFUSxJQUFJLENBQUN2QixJQUFJLENBQUNyQiwrQ0FBWSxDQUFDdUIsWUFBWSxDQUFDLENBQUMsS0FDbkRxQixJQUFJLENBQUN2QixJQUFJLENBQUNyQiwrQ0FBWSxDQUFDd0IscUJBQXFCLENBQUM7UUFDbEQsSUFBSSxDQUFDTyxtQkFBbUIsQ0FBQ2pCLEdBQUcsQ0FBQzhCLElBQUksQ0FBQztNQUNwQztJQUNGLENBQUMsQ0FBQztFQUNKO0VBRUFJLGVBQWVBLENBQUNKLElBQVUsRUFBRTtJQUMxQixJQUFJQSxJQUFJLENBQUNwQyxJQUFJLEtBQUtULDJDQUFRLENBQUNtQixLQUFLLEVBQUU7TUFDaEMsSUFBSSxDQUFDVyxVQUFVLENBQUNmLEdBQUcsQ0FBQzhCLElBQUksQ0FBQztJQUMzQixDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNmLFVBQVUsQ0FBQ3VDLE1BQU0sQ0FBQ3hCLElBQUksQ0FBQztJQUM5QjtFQUNGO0VBRUFtQixpQkFBaUJBLENBQUNuQixJQUFVLEVBQUU7SUFDNUIsT0FBTyxDQUNMLElBQUksQ0FBQ0MsT0FBTyxDQUFDRCxJQUFJLENBQUN0QyxLQUFLLEdBQUcsQ0FBQyxFQUFFc0MsSUFBSSxDQUFDckMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUM1QyxJQUFJLENBQUNzQyxPQUFPLENBQUNELElBQUksQ0FBQ3RDLEtBQUssRUFBRXNDLElBQUksQ0FBQ3JDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFDeEMsSUFBSSxDQUFDc0MsT0FBTyxDQUFDRCxJQUFJLENBQUN0QyxLQUFLLEdBQUcsQ0FBQyxFQUFFc0MsSUFBSSxDQUFDckMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUM1QyxJQUFJLENBQUNzQyxPQUFPLENBQUNELElBQUksQ0FBQ3RDLEtBQUssR0FBRyxDQUFDLEVBQUVzQyxJQUFJLENBQUNyQyxLQUFLLENBQUMsRUFDeEMsSUFBSSxDQUFDc0MsT0FBTyxDQUFDRCxJQUFJLENBQUN0QyxLQUFLLEdBQUcsQ0FBQyxFQUFFc0MsSUFBSSxDQUFDckMsS0FBSyxDQUFDLEVBQ3hDLElBQUksQ0FBQ3NDLE9BQU8sQ0FBQ0QsSUFBSSxDQUFDdEMsS0FBSyxHQUFHLENBQUMsRUFBRXNDLElBQUksQ0FBQ3JDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFDNUMsSUFBSSxDQUFDc0MsT0FBTyxDQUFDRCxJQUFJLENBQUN0QyxLQUFLLEVBQUVzQyxJQUFJLENBQUNyQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQ3hDLElBQUksQ0FBQ3NDLE9BQU8sQ0FBQ0QsSUFBSSxDQUFDdEMsS0FBSyxHQUFHLENBQUMsRUFBRXNDLElBQUksQ0FBQ3JDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FDN0M7RUFDSDtFQUVBOEQsT0FBT0EsQ0FBQSxFQUFZO0lBQ2pCLElBQUksQ0FBQ3RDLG1CQUFtQixDQUFDd0IsT0FBTyxDQUFFWCxJQUFJLElBQUs7TUFDekNBLElBQUksQ0FBQ3RCLFdBQVcsQ0FBQyxDQUFDO01BQ2xCLElBQUksQ0FBQzBCLGVBQWUsQ0FBQ0osSUFBSSxDQUFDO0lBQzVCLENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQ0ssUUFBUSxDQUFDLENBQUM7SUFFZixPQUFPLElBQUksQ0FBQ2xCLG1CQUFtQixDQUFDdUMsSUFBSSxLQUFLLENBQUM7RUFDNUM7RUFFQXpCLE9BQU9BLENBQUN2QyxLQUFhLEVBQUVDLEtBQWEsRUFBUTtJQUMxQyxJQUFJNkMsQ0FBQyxHQUFHOUMsS0FBSztJQUNiLElBQUksRUFBRThDLENBQUMsSUFBSSxDQUFDLElBQUlBLENBQUMsR0FBRyxJQUFJLENBQUNsQixLQUFLLENBQUMsRUFBRTtNQUMvQixJQUFJa0IsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLElBQUksQ0FBQ2xCLEtBQUssR0FBSSxDQUFDa0IsQ0FBQyxHQUFHLElBQUksQ0FBQ2xCLEtBQU0sQ0FBQyxLQUN6Q2tCLENBQUMsSUFBSSxJQUFJLENBQUNsQixLQUFLO0lBQ3RCO0lBQ0EsSUFBSWlCLENBQUMsR0FBRzVDLEtBQUs7SUFDYixJQUFJLEVBQUU0QyxDQUFDLElBQUksQ0FBQyxJQUFJQSxDQUFDLEdBQUcsSUFBSSxDQUFDaEIsTUFBTSxDQUFDLEVBQUU7TUFDaEMsSUFBSWdCLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRyxJQUFJLENBQUNoQixNQUFNLEdBQUksQ0FBQ2dCLENBQUMsR0FBRyxJQUFJLENBQUNoQixNQUFPLENBQUMsS0FDM0NnQixDQUFDLElBQUksSUFBSSxDQUFDaEIsTUFBTTtJQUN2QjtJQUNBLE9BQU8sSUFBSSxDQUFDSCxJQUFJLENBQUNtQixDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDO0VBQ3hCO0VBRUFtQixZQUFZQSxDQUFDQyxTQUFlLEVBQUVDLFVBQWtCLEVBQUU7SUFDaERBLFVBQVUsQ0FBQ0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDbkIsT0FBTyxDQUFFb0IsUUFBUSxJQUFLO01BQzFDLE1BQU0sQ0FBQ3ZCLENBQUMsRUFBRUQsQ0FBQyxDQUFDLEdBQUd3QixRQUFRLENBQUNELEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDbEMsTUFBTTlCLElBQUksR0FBRyxJQUFJLENBQUNDLE9BQU8sQ0FDdkJDLE1BQU0sQ0FBQ00sQ0FBQyxDQUFDLEdBQUdvQixTQUFTLENBQUNsRSxLQUFLLEVBQzNCd0MsTUFBTSxDQUFDSyxDQUFDLENBQUMsR0FBR3FCLFNBQVMsQ0FBQ2pFLEtBQ3hCLENBQUM7TUFDRHFDLElBQUksQ0FBQ3pCLE9BQU8sQ0FBQ3BCLDJDQUFRLENBQUNtQixLQUFLLENBQUM7TUFDNUIsSUFBSSxDQUFDOEIsZUFBZSxDQUFDSixJQUFJLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0VBQ0o7RUFFQWdDLFlBQVlBLENBQUNKLFNBQWUsRUFBRUMsVUFBa0IsRUFBRTtJQUNoREEsVUFBVSxDQUFDQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUNuQixPQUFPLENBQUVvQixRQUFRLElBQUs7TUFDMUMsTUFBTSxDQUFDdkIsQ0FBQyxFQUFFRCxDQUFDLENBQUMsR0FBR3dCLFFBQVEsQ0FBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQztNQUNsQyxNQUFNOUIsSUFBSSxHQUFHLElBQUksQ0FBQ0MsT0FBTyxDQUN2QkMsTUFBTSxDQUFDTSxDQUFDLENBQUMsR0FBR29CLFNBQVMsQ0FBQ2xFLEtBQUssRUFDM0J3QyxNQUFNLENBQUNLLENBQUMsQ0FBQyxHQUFHcUIsU0FBUyxDQUFDakUsS0FDeEIsQ0FBQztNQUNEcUMsSUFBSSxDQUFDekIsT0FBTyxDQUFDcEIsMkNBQVEsQ0FBQ1UsSUFBSSxDQUFDO01BQzNCLElBQUksQ0FBQ3VDLGVBQWUsQ0FBQ0osSUFBSSxDQUFDO0lBQzVCLENBQUMsQ0FBQztFQUNKO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOU1rQztBQUUzQixTQUFTaUMsYUFBYUEsQ0FBQ0MsTUFBeUIsRUFBRTtFQUN2RDtFQUNBQSxNQUFNLENBQUNDLFFBQVEsR0FBRyxJQUFJO0FBQ3hCO0FBRU8sU0FBU0MsWUFBWUEsQ0FBQ0YsTUFBeUIsRUFBRTtFQUN0RDtFQUNBQSxNQUFNLENBQUNDLFFBQVEsR0FBRyxLQUFLO0FBQ3pCO0FBRWUsTUFBTUUsT0FBTyxDQUFDO0VBQ2xCQyxXQUFXLEdBQUk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7RUFvQnhDQyxTQUFTLEdBQUcsS0FBSztFQU1qQjlFLFdBQVdBLENBQUMrRSxJQUFpQixFQUFFO0lBQzdCLElBQUksQ0FBQ25ELFNBQVMsR0FBR21ELElBQUk7SUFDckIsSUFBSSxDQUFDbkQsU0FBUyxDQUFDMkIsU0FBUyxHQUFHLElBQUksQ0FBQ3NCLFdBQVc7O0lBRTNDO0lBQ0EsSUFBSSxDQUFDRyxVQUFVLEdBQUcsSUFBSSxDQUFDcEQsU0FBUyxDQUFDcUQsYUFBYSxDQUM1QyxjQUNGLENBQXFCO0lBQ3JCLElBQUksQ0FBQ0MsV0FBVyxHQUFHLElBQUksQ0FBQ3RELFNBQVMsQ0FBQ3FELGFBQWEsQ0FDN0MsZUFDRixDQUFxQjtJQUNyQixJQUFJLENBQUNFLFlBQVksR0FBRyxJQUFJLENBQUN2RCxTQUFTLENBQUNxRCxhQUFhLENBQzlDLGNBQ0YsQ0FBcUI7SUFDckIsSUFBSSxDQUFDRyxZQUFZLEdBQUcsSUFBSSxDQUFDeEQsU0FBUyxDQUFDcUQsYUFBYSxDQUM5QyxhQUNGLENBQXFCO0lBQ3JCLElBQUksQ0FBQ0ksV0FBVyxHQUFHLElBQUksQ0FBQ3pELFNBQVMsQ0FBQ3FELGFBQWEsQ0FDN0MsUUFDRixDQUFzQjtJQUN0QixJQUFJLENBQUNLLFVBQVUsR0FBRyxJQUFJLENBQUMxRCxTQUFTLENBQUNxRCxhQUFhLENBQzVDLGFBQ0YsQ0FBc0I7SUFDdEIsSUFBSSxDQUFDTSxhQUFhLEdBQUcsSUFBSSxDQUFDM0QsU0FBUyxDQUFDcUQsYUFBYSxDQUMvQyxVQUNGLENBQXNCO0lBQ3RCLElBQUksQ0FBQ08sV0FBVyxHQUFHLElBQUksQ0FBQzVELFNBQVMsQ0FBQ3FELGFBQWEsQ0FBQyxTQUFTLENBQWdCO0lBRXpFLElBQUksQ0FBQ0QsVUFBVSxDQUFDUyxLQUFLLEdBQUdDLGdCQUFnQixDQUFDLElBQUksQ0FBQzlELFNBQVMsQ0FBQyxDQUFDK0QsZ0JBQWdCLENBQ3ZFLGVBQ0YsQ0FBQztJQUNELElBQUksQ0FBQ1QsV0FBVyxDQUFDTyxLQUFLLEdBQUdDLGdCQUFnQixDQUFDLElBQUksQ0FBQzlELFNBQVMsQ0FBQyxDQUFDK0QsZ0JBQWdCLENBQ3hFLGdCQUNGLENBQUM7SUFFRG5CLGFBQWEsQ0FBQyxJQUFJLENBQUNlLGFBQWEsQ0FBQztJQUNqQ2YsYUFBYSxDQUFDLElBQUksQ0FBQ2EsV0FBVyxDQUFDO0lBQy9CYixhQUFhLENBQUMsSUFBSSxDQUFDYyxVQUFVLENBQUM7O0lBRTlCO0lBQ0FNLE1BQU0sQ0FBQzNELGdCQUFnQixDQUFDLE9BQU8sRUFBR0MsS0FBSyxJQUFLO01BQzFDLFFBQVFBLEtBQUssQ0FBQzJELElBQUk7UUFDaEIsS0FBSyxPQUFPO1VBQ1YzRCxLQUFLLENBQUM0RCxjQUFjLENBQUMsQ0FBQztVQUN0QixJQUFJLENBQUNDLGdCQUFnQixDQUFDLENBQUM7VUFDdkI7UUFDRixLQUFLLFNBQVM7VUFDWixJQUFJLENBQUNaLFlBQVksQ0FBQ2EsTUFBTSxDQUFDLENBQUM7VUFDMUIsSUFBSSxDQUFDYixZQUFZLENBQUNjLGFBQWEsQ0FBQyxJQUFJQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7VUFDcEQ7UUFDRixLQUFLLFdBQVc7VUFDZCxJQUFJLENBQUNmLFlBQVksQ0FBQ2dCLFFBQVEsQ0FBQyxDQUFDO1VBQzVCLElBQUksQ0FBQ2hCLFlBQVksQ0FBQ2MsYUFBYSxDQUFDLElBQUlDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztVQUNwRDtRQUNGLEtBQUssWUFBWTtVQUNmLElBQUksQ0FBQ1gsYUFBYSxDQUFDYSxLQUFLLENBQUMsQ0FBQztVQUMxQjtRQUNGO01BQ0Y7SUFDRixDQUFDLENBQUM7SUFFRixJQUFJLENBQUNoQixZQUFZLENBQUNuRCxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsTUFBTTtNQUNqRCxJQUFJLENBQUN1RCxXQUFXLENBQ2JQLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUM5QnpFLFNBQVMsQ0FBQzZGLE1BQU0sQ0FBQyxXQUFXLENBQUM7TUFDakMsSUFBSSxDQUFDYixXQUFXLENBQ2JQLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUMvQnpFLFNBQVMsQ0FBQzZGLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDbkMsQ0FBQyxDQUFDO0VBQ0o7RUFFQUMsS0FBS0EsQ0FBQSxFQUFHO0lBQ04sSUFBSSxDQUFDQyxRQUFRLEdBQUcsSUFBSWhGLGlEQUFRLENBQzFCLElBQUksQ0FBQ0ssU0FBUyxDQUFDcUQsYUFBYSxDQUFDLHNCQUFzQixDQUFDLEVBQ3BEeEMsTUFBTSxDQUFDLElBQUksQ0FBQ3VDLFVBQVUsQ0FBQ1MsS0FBSyxDQUFDLEVBQzdCaEQsTUFBTSxDQUFDLElBQUksQ0FBQ3lDLFdBQVcsQ0FBQ08sS0FBSyxDQUFDLEVBQzlCLElBQUksQ0FBQ0wsWUFBWSxDQUFDb0IsT0FDcEIsQ0FBQztJQUVEN0IsWUFBWSxDQUFDLElBQUksQ0FBQ1ksYUFBYSxDQUFDO0lBQ2hDWixZQUFZLENBQUMsSUFBSSxDQUFDVSxXQUFXLENBQUM7SUFDOUJWLFlBQVksQ0FBQyxJQUFJLENBQUNXLFVBQVUsQ0FBQztJQUU3QixJQUFJLENBQUNOLFVBQVUsQ0FBQy9DLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNO01BQy9DLElBQUksQ0FBQ0wsU0FBUyxDQUFDNkUsS0FBSyxDQUFDQyxXQUFXLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQzFCLFVBQVUsQ0FBQ1MsS0FBSyxDQUFDO01BQ3hFLElBQUksQ0FBQ2MsUUFBUSxDQUFDdEQsV0FBVyxDQUFDUixNQUFNLENBQUMsSUFBSSxDQUFDdUMsVUFBVSxDQUFDUyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUM7SUFFRixJQUFJLENBQUNQLFdBQVcsQ0FBQ2pELGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNO01BQ2hELElBQUksQ0FBQ0wsU0FBUyxDQUFDNkUsS0FBSyxDQUFDQyxXQUFXLENBQzlCLGdCQUFnQixFQUNoQixJQUFJLENBQUN4QixXQUFXLENBQUNPLEtBQ25CLENBQUM7TUFDRCxJQUFJLENBQUNjLFFBQVEsQ0FBQ2pELFlBQVksQ0FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQ3lDLFdBQVcsQ0FBQ08sS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDO0lBRUYsSUFBSSxDQUFDRixhQUFhLENBQUN0RCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtNQUNqRCxJQUFJLENBQUNzRSxRQUFRLENBQUN2QyxPQUFPLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUM7SUFFRixJQUFJLENBQUNxQixXQUFXLENBQUNwRCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtNQUMvQyxJQUFJLENBQUM4RCxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQ1gsWUFBWSxDQUFDbkQsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE1BQU07TUFDakQsSUFBSSxDQUFDc0UsUUFBUSxDQUFDeEUsUUFBUSxHQUFHLElBQUksQ0FBQ3FELFlBQVksQ0FBQ29CLE9BQU87SUFDcEQsQ0FBQyxDQUFDO0lBRUYsSUFBSSxDQUFDbEIsVUFBVSxDQUFDckQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDOUMsSUFBSSxDQUFDTCxTQUFTLENBQUM2RSxLQUFLLENBQUNDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDMUIsVUFBVSxDQUFDUyxLQUFLLENBQUM7TUFDeEUsSUFBSSxDQUFDN0QsU0FBUyxDQUFDNkUsS0FBSyxDQUFDQyxXQUFXLENBQzlCLGdCQUFnQixFQUNoQixJQUFJLENBQUN4QixXQUFXLENBQUNPLEtBQ25CLENBQUM7TUFFRCxJQUFJLENBQUNjLFFBQVEsQ0FBQ3ZFLE9BQU8sQ0FDbkJTLE1BQU0sQ0FBQyxJQUFJLENBQUN1QyxVQUFVLENBQUNTLEtBQUssQ0FBQyxFQUM3QmhELE1BQU0sQ0FBQyxJQUFJLENBQUN5QyxXQUFXLENBQUNPLEtBQUssQ0FDL0IsQ0FBQztJQUNILENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQ04sWUFBWSxDQUFDbEQsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE1BQU07TUFDakQsSUFBSSxJQUFJLENBQUM2QyxTQUFTLEVBQUU7UUFDbEIsSUFBSSxDQUFDNkIsUUFBUSxDQUFDLENBQUM7UUFDZixJQUFJLENBQUNDLFNBQVMsQ0FBQyxDQUFDO01BQ2xCO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFFQWIsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQ2pCLFNBQVMsRUFBRTtNQUNuQixJQUFJLENBQUM4QixTQUFTLENBQUMsQ0FBQztNQUNoQixJQUFJLENBQUM5QixTQUFTLEdBQUcsSUFBSTtNQUNyQixJQUFJLENBQUNPLFdBQVcsQ0FBQ3dCLFNBQVMsR0FBRyxNQUFNO01BQ25DckMsYUFBYSxDQUFDLElBQUksQ0FBQ2UsYUFBYSxDQUFDO01BQ2pDZixhQUFhLENBQUMsSUFBSSxDQUFDYyxVQUFVLENBQUM7TUFDOUIsSUFBSSxDQUFDMUQsU0FBUyxDQUFDcEIsU0FBUyxDQUFDNkYsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN4QyxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNNLFFBQVEsQ0FBQyxDQUFDO01BQ2YsSUFBSSxDQUFDN0IsU0FBUyxHQUFHLEtBQUs7TUFDdEIsSUFBSSxDQUFDTyxXQUFXLENBQUN3QixTQUFTLEdBQUcsT0FBTztNQUNwQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUNZLGFBQWEsQ0FBQztNQUNoQ1osWUFBWSxDQUFDLElBQUksQ0FBQ1csVUFBVSxDQUFDO01BQzdCLElBQUksQ0FBQzFELFNBQVMsQ0FBQ3BCLFNBQVMsQ0FBQzZGLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDeEM7RUFDRjtFQUVBTyxTQUFTQSxDQUFBLEVBQUc7SUFDVixJQUFJLENBQUNFLE9BQU8sR0FBR0MsV0FBVyxDQUN4QixJQUFJLENBQUNDLGlCQUFpQixDQUFDLENBQUMsRUFDeEIsSUFBSSxJQUFJdkUsTUFBTSxDQUFDLElBQUksQ0FBQzBDLFlBQVksQ0FBQ00sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUM3QyxDQUFDO0VBQ0g7RUFFQXVCLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCLE9BQU8sTUFBTTtNQUNYLElBQUksSUFBSSxDQUFDVCxRQUFRLENBQUN2QyxPQUFPLENBQUMsQ0FBQyxFQUFFO1FBQzNCLElBQUksQ0FBQytCLGdCQUFnQixDQUFDLENBQUM7TUFDekI7SUFDRixDQUFDO0VBQ0g7RUFFQVksUUFBUUEsQ0FBQSxFQUFHO0lBQ1QsSUFBSSxJQUFJLENBQUNHLE9BQU8sRUFBRTtNQUNoQkcsYUFBYSxDQUFDLElBQUksQ0FBQ0gsT0FBTyxDQUFDO01BQzNCLElBQUksQ0FBQ0EsT0FBTyxHQUFHaEgsU0FBUztJQUMxQjtFQUNGO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7QUM1T2dDO0FBQ1g7QUFFckIsTUFBTW9ILFdBQVcsR0FBRyxJQUFJdEMsZ0RBQU8sQ0FBQ3RFLFFBQVEsQ0FBQzJFLGFBQWEsQ0FBQyxPQUFPLENBQWdCLENBQUM7QUFDL0VpQyxXQUFXLENBQUNaLEtBQUssQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKbkI7QUFDMEc7QUFDakI7QUFDekYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTyxnRkFBZ0YsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLGdDQUFnQyxzQkFBc0Isc0JBQXNCLHVCQUF1QixHQUFHLFdBQVcsbUJBQW1CLG1CQUFtQix1QkFBdUIsOEJBQThCLDZDQUE2QyxHQUFHLFVBQVUsOEJBQThCLEdBQUcscUJBQXFCLHFCQUFxQixHQUFHLGtCQUFrQiwwQkFBMEIsNEJBQTRCLDZCQUE2Qiw4QkFBOEIsbUNBQW1DLEdBQUcsMEJBQTBCLHVCQUF1QixtQkFBbUIsbUJBQW1CLGtCQUFrQiw0REFBNEQsMERBQTBELFdBQVcsR0FBRyxXQUFXLDRCQUE0Qiw2QkFBNkIsOEJBQThCLEdBQUcsaUJBQWlCLDRCQUE0Qiw2QkFBNkIsOEJBQThCLG1DQUFtQywyQkFBMkIsR0FBRyxXQUFXLGdDQUFnQyxHQUFHLFlBQVksNEJBQTRCLEdBQUcsb0JBQW9CLDJCQUEyQixHQUFHLHFCQUFxQiwyQkFBMkIsR0FBRyxnQkFBZ0Isa0JBQWtCLEdBQUcscUJBQXFCO0FBQzczRDtBQUNBLGlFQUFlLHVCQUF1QixFQUFDOzs7Ozs7Ozs7OztBQ2hGMUI7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQSxxRkFBcUY7QUFDckY7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNGQUFzRixxQkFBcUI7QUFDM0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLGlEQUFpRCxxQkFBcUI7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BGYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2RBLE1BQStGO0FBQy9GLE1BQXFGO0FBQ3JGLE1BQTRGO0FBQzVGLE1BQStHO0FBQy9HLE1BQXdHO0FBQ3hHLE1BQXdHO0FBQ3hHLE1BQW1HO0FBQ25HO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7O0FBRXJDLHVCQUF1Qix1R0FBYTtBQUNwQztBQUNBLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMsc0ZBQU87Ozs7QUFJNkM7QUFDckUsT0FBTyxpRUFBZSxzRkFBTyxJQUFJLHNGQUFPLFVBQVUsc0ZBQU8sbUJBQW1CLEVBQUM7Ozs7Ozs7Ozs7O0FDMUJoRTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDRCQUE0QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDZCQUE2QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ25GYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNqQ2E7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQSxjQUFjLEtBQXdDLEdBQUcsc0JBQWlCLEdBQUcsQ0FBSTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDVGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ob21ld29yay1sZXNzb24yMC8uL3NyYy9DZWxsLnRzIiwid2VicGFjazovL2hvbWV3b3JrLWxlc3NvbjIwLy4vc3JjL0dhbWVMaXZlLnRzIiwid2VicGFjazovL2hvbWV3b3JrLWxlc3NvbjIwLy4vc3JjL01haW5BcHAudHMiLCJ3ZWJwYWNrOi8vaG9tZXdvcmstbGVzc29uMjAvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vaG9tZXdvcmstbGVzc29uMjAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2hvbWV3b3JrLWxlc3NvbjIwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9ob21ld29yay1sZXNzb24yMC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2hvbWV3b3JrLWxlc3NvbjIwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2hvbWV3b3JrLWxlc3NvbjIwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2hvbWV3b3JrLWxlc3NvbjIwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9ob21ld29yay1sZXNzb24yMC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9ob21ld29yay1sZXNzb24yMC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9ob21ld29yay1sZXNzb24yMC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2hvbWV3b3JrLWxlc3NvbjIwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgZGVmYXVsdC1jYXNlICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG5leHBvcnQgZW51bSBDZWxsVHlwZSB7XG4gIGRlYWQgPSBcImRlYWRcIixcbiAgYWxpdmUgPSBcImFsaXZlXCIsXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbmV4cG9ydCBlbnVtIE1hcmtDZWxsVHlwZSB7XG4gIG1hcmtGb3JEZWFkID0gXCJtYXJrLWZvci1kZWFkXCIsXG4gIG1hcmtGb3JBbGl2ZSA9IFwibWFyay1mb3ItYWxpdmVcIixcbiAgbWFya0ZvckRlYWRJbnZpc2libGUgPSBcIm1hcmstZm9yLWRlYWQtaW52aXNpYmxlXCIsXG4gIG1hcmtGb3JBbGl2ZUludmlzaWJsZSA9IFwibWFyay1mb3ItYWxpdmUtaW52aXNpYmxlXCIsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbGwge1xuICByZWFkb25seSBjb29yWDogbnVtYmVyO1xuXG4gIHJlYWRvbmx5IGNvb3JZOiBudW1iZXI7XG5cbiAgcmVhZG9ubHkgY2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIHR5cGU6IENlbGxUeXBlO1xuXG4gIHR5cGVOZXh0VGljOiBNYXJrQ2VsbFR5cGUgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgbWFya2VkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoY29vclg6IG51bWJlciwgY29vclk6IG51bWJlciwgdHlwZT86IENlbGxUeXBlKSB7XG4gICAgdGhpcy5jb29yWCA9IGNvb3JYO1xuICAgIHRoaXMuY29vclkgPSBjb29yWTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlID8/IENlbGxUeXBlLmRlYWQ7XG5cbiAgICB0aGlzLmNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNlbGxcIik7XG5cbiAgICB0aGlzLmNlbGxFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgIHRoaXMuY2VsbEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLnR5cGUpO1xuICAgIHRoaXMuY2VsbEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY29vci14XCIsIGAke3RoaXMuY29vclh9YCk7XG4gICAgdGhpcy5jZWxsRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjb29yLXlcIiwgYCR7dGhpcy5jb29yWX1gKTtcbiAgICB0aGlzLmNlbGxFbGVtZW50LnRpdGxlID0gYENlbGwoJHt0aGlzLmNvb3JYfSwke3RoaXMuY29vcll9KWA7XG4gIH1cblxuICBvbkNsaWNrKCkge1xuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlIENlbGxUeXBlLmFsaXZlOlxuICAgICAgICB0aGlzLnNldFR5cGUoQ2VsbFR5cGUuZGVhZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDZWxsVHlwZS5kZWFkOlxuICAgICAgICB0aGlzLnNldFR5cGUoQ2VsbFR5cGUuYWxpdmUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBzZXRUeXBlKHR5cGU6IENlbGxUeXBlKSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLmNlbGxFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoLi4udGhpcy5jZWxsRWxlbWVudC5jbGFzc0xpc3QpO1xuICAgIHRoaXMuY2VsbEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgdGhpcy5jZWxsRWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMudHlwZSk7XG4gIH1cblxuICBtYXJrKHR5cGU6IE1hcmtDZWxsVHlwZSkge1xuICAgIHRoaXMubWFya2VkID0gdHJ1ZTtcbiAgICB0aGlzLnR5cGVOZXh0VGljID0gdHlwZTtcbiAgICB0aGlzLmNlbGxFbGVtZW50LmNsYXNzTGlzdC5hZGQodHlwZSk7XG4gIH1cblxuICBwcm9jZXNzTWFyaygpIHtcbiAgICBzd2l0Y2ggKHRoaXMudHlwZU5leHRUaWMpIHtcbiAgICAgIGNhc2UgTWFya0NlbGxUeXBlLm1hcmtGb3JBbGl2ZTpcbiAgICAgIGNhc2UgTWFya0NlbGxUeXBlLm1hcmtGb3JBbGl2ZUludmlzaWJsZTpcbiAgICAgICAgdGhpcy5zZXRUeXBlKENlbGxUeXBlLmFsaXZlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE1hcmtDZWxsVHlwZS5tYXJrRm9yRGVhZDpcbiAgICAgIGNhc2UgTWFya0NlbGxUeXBlLm1hcmtGb3JEZWFkSW52aXNpYmxlOlxuICAgICAgICB0aGlzLnNldFR5cGUoQ2VsbFR5cGUuZGVhZCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLm1hcmtDbGVhcigpO1xuICB9XG5cbiAgbWFya0NsZWFyKCkge1xuICAgIHRoaXMubWFya2VkID0gZmFsc2U7XG4gICAgdGhpcy50eXBlTmV4dFRpYyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNlbGxFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoTWFya0NlbGxUeXBlLm1hcmtGb3JBbGl2ZSk7XG4gICAgdGhpcy5jZWxsRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKE1hcmtDZWxsVHlwZS5tYXJrRm9yQWxpdmVJbnZpc2libGUpO1xuICAgIHRoaXMuY2VsbEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShNYXJrQ2VsbFR5cGUubWFya0ZvckRlYWQpO1xuICAgIHRoaXMuY2VsbEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShNYXJrQ2VsbFR5cGUubWFya0ZvckRlYWRJbnZpc2libGUpO1xuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1uZXN0ZWQtdGVybmFyeSAqL1xuaW1wb3J0IENlbGwsIHsgQ2VsbFR5cGUsIE1hcmtDZWxsVHlwZSB9IGZyb20gXCIuL0NlbGxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUxpdmUge1xuICByZWFkb25seSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIHJlYWRvbmx5IGNlbGxUb01hcms6IFNldDxDZWxsPiA9IG5ldyBTZXQoKTtcblxuICByZWFkb25seSBjZWxsVG9DaGFuZ2VOZXh0VGljOiBTZXQ8Q2VsbD4gPSBuZXcgU2V0KCk7XG5cbiAgZ3JpZDogQXJyYXk8QXJyYXk8Q2VsbD4+ID0gW107XG5cbiAgd2lkdGg6IG51bWJlcjtcblxuICBoZWlnaHQ6IG51bWJlcjtcblxuICBjdXJyZW50SG92ZXJDZWxsOiBDZWxsIHwgdW5kZWZpbmVkO1xuXG4gIG1hcmthYmxlOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICBtYXJrYWJsZT86IGJvb2xlYW4sXG4gICkge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLm1hcmthYmxlID0gbWFya2FibGUgPz8gZmFsc2U7XG5cbiAgICB0aGlzLmdldEdyaWQoKTtcblxuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhdGhpcy5jdXJyZW50SG92ZXJDZWxsKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLmdldENlbGwoXG4gICAgICAgICAgTnVtYmVyKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiY29vci14XCIpKSxcbiAgICAgICAgICBOdW1iZXIoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJjb29yLXlcIikpLFxuICAgICAgICApO1xuICAgICAgICBjZWxsLm9uQ2xpY2soKTtcbiAgICAgICAgdGhpcy5jZWxsVXBkYXRlQ2hlY2soY2VsbCk7XG4gICAgICAgIHRoaXMubWFya0dyaWQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEdyaWQod2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlcikge1xuICAgIHRoaXMuY2VsbFRvTWFyay5jbGVhcigpO1xuICAgIHRoaXMuY2VsbFRvQ2hhbmdlTmV4dFRpYy5jbGVhcigpO1xuICAgIHRoaXMuZ3JpZCA9IFtdO1xuXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoID8/IHRoaXMud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgPz8gdGhpcy5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5ICs9IDEpIHtcbiAgICAgIHRoaXMuZ3JpZFt5XSA9IFtdO1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4ICs9IDEpIHtcbiAgICAgICAgdGhpcy5ncmlkW3ldW3hdID0gbmV3IENlbGwoeCwgeSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zaG93R3JpZCgpO1xuICB9XG5cbiAgcmVzaXplV2lkdGgod2lkdGg6IG51bWJlcikge1xuICAgIGlmICh0aGlzLndpZHRoICE9PSB3aWR0aCkge1xuICAgICAgaWYgKHRoaXMud2lkdGggPiB3aWR0aCkge1xuICAgICAgICB0aGlzLmdyaWQuZm9yRWFjaCgocm93KSA9PiByb3cuc3BsaWNlKHdpZHRoLCB0aGlzLndpZHRoIC0gd2lkdGgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ3JpZC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgICAgICBmb3IgKGxldCB4ID0gdGhpcy53aWR0aDsgeCA8IHdpZHRoOyB4ICs9IDEpIHtcbiAgICAgICAgICAgIHJvdy5wdXNoKG5ldyBDZWxsKHgsIHkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgdGhpcy5zaG93R3JpZCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2l6ZUhlaWdodChoZWlnaHQ6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmhlaWdodCAhPT0gaGVpZ2h0KSB7XG4gICAgICBpZiAodGhpcy5oZWlnaHQgPiBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5ncmlkLnNwbGljZShoZWlnaHQsIHRoaXMuaGVpZ2h0IC0gaGVpZ2h0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IHkgPSB0aGlzLmhlaWdodDsgeSA8IGhlaWdodDsgeSArPSAxKSB7XG4gICAgICAgICAgdGhpcy5ncmlkW3ldID0gW107XG4gICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4ICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFt5XVt4XSA9IG5ldyBDZWxsKHgsIHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICB0aGlzLnNob3dHcmlkKCk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0dyaWQoKSB7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmdyaWQuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCkgPT4gdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoY2VsbC5jZWxsRWxlbWVudCkpO1xuICAgIH0pO1xuICB9XG5cbiAgbWFya0dyaWQoKSB7XG4gICAgdGhpcy5jZWxsVG9DaGFuZ2VOZXh0VGljLmNsZWFyKCk7XG5cbiAgICBjb25zdCBjZWxsczogU2V0PENlbGw+ID0gbmV3IFNldCgpO1xuICAgIFsuLi50aGlzLmNlbGxUb01hcmtdLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGxzLmFkZChjZWxsKTtcbiAgICAgIHRoaXMuZ2V0Q2VsbE5laWdoYm91cnMoY2VsbCkuZm9yRWFjaChjZWxscy5hZGQsIGNlbGxzKTtcbiAgICB9KTtcblxuICAgIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwubWFya0NsZWFyKCk7XG4gICAgICBjb25zdCBhbGl2ZUNlbGxOZWlnaGJvdXJzID0gdGhpcy5nZXRDZWxsTmVpZ2hib3VycyhjZWxsKS5yZWR1Y2UoXG4gICAgICAgIChyZXN1bHQsIGVsOiBDZWxsKSA9PlxuICAgICAgICAgIGVsLnR5cGUgPT09IENlbGxUeXBlLmFsaXZlID8gcmVzdWx0ICsgMSA6IHJlc3VsdCxcbiAgICAgICAgMCxcbiAgICAgICk7XG4gICAgICBpZiAoXG4gICAgICAgIGNlbGwudHlwZSA9PT0gQ2VsbFR5cGUuYWxpdmUgJiZcbiAgICAgICAgKGFsaXZlQ2VsbE5laWdoYm91cnMgPCAyIHx8IGFsaXZlQ2VsbE5laWdoYm91cnMgPiAzKVxuICAgICAgKSB7XG4gICAgICAgIGlmICh0aGlzLm1hcmthYmxlKSBjZWxsLm1hcmsoTWFya0NlbGxUeXBlLm1hcmtGb3JEZWFkKTtcbiAgICAgICAgZWxzZSBjZWxsLm1hcmsoTWFya0NlbGxUeXBlLm1hcmtGb3JEZWFkSW52aXNpYmxlKTtcbiAgICAgICAgdGhpcy5jZWxsVG9DaGFuZ2VOZXh0VGljLmFkZChjZWxsKTtcbiAgICAgIH1cbiAgICAgIGlmIChjZWxsLnR5cGUgPT09IENlbGxUeXBlLmRlYWQgJiYgYWxpdmVDZWxsTmVpZ2hib3VycyA9PT0gMykge1xuICAgICAgICBpZiAodGhpcy5tYXJrYWJsZSkgY2VsbC5tYXJrKE1hcmtDZWxsVHlwZS5tYXJrRm9yQWxpdmUpO1xuICAgICAgICBlbHNlIGNlbGwubWFyayhNYXJrQ2VsbFR5cGUubWFya0ZvckFsaXZlSW52aXNpYmxlKTtcbiAgICAgICAgdGhpcy5jZWxsVG9DaGFuZ2VOZXh0VGljLmFkZChjZWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNlbGxVcGRhdGVDaGVjayhjZWxsOiBDZWxsKSB7XG4gICAgaWYgKGNlbGwudHlwZSA9PT0gQ2VsbFR5cGUuYWxpdmUpIHtcbiAgICAgIHRoaXMuY2VsbFRvTWFyay5hZGQoY2VsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2VsbFRvTWFyay5kZWxldGUoY2VsbCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q2VsbE5laWdoYm91cnMoY2VsbDogQ2VsbCkge1xuICAgIHJldHVybiBbXG4gICAgICB0aGlzLmdldENlbGwoY2VsbC5jb29yWCAtIDEsIGNlbGwuY29vclkgLSAxKSxcbiAgICAgIHRoaXMuZ2V0Q2VsbChjZWxsLmNvb3JYLCBjZWxsLmNvb3JZIC0gMSksXG4gICAgICB0aGlzLmdldENlbGwoY2VsbC5jb29yWCArIDEsIGNlbGwuY29vclkgLSAxKSxcbiAgICAgIHRoaXMuZ2V0Q2VsbChjZWxsLmNvb3JYIC0gMSwgY2VsbC5jb29yWSksXG4gICAgICB0aGlzLmdldENlbGwoY2VsbC5jb29yWCArIDEsIGNlbGwuY29vclkpLFxuICAgICAgdGhpcy5nZXRDZWxsKGNlbGwuY29vclggLSAxLCBjZWxsLmNvb3JZICsgMSksXG4gICAgICB0aGlzLmdldENlbGwoY2VsbC5jb29yWCwgY2VsbC5jb29yWSArIDEpLFxuICAgICAgdGhpcy5nZXRDZWxsKGNlbGwuY29vclggKyAxLCBjZWxsLmNvb3JZICsgMSksXG4gICAgXTtcbiAgfVxuXG4gIG5leHRUaWMoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5jZWxsVG9DaGFuZ2VOZXh0VGljLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwucHJvY2Vzc01hcmsoKTtcbiAgICAgIHRoaXMuY2VsbFVwZGF0ZUNoZWNrKGNlbGwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5tYXJrR3JpZCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuY2VsbFRvQ2hhbmdlTmV4dFRpYy5zaXplID09PSAwO1xuICB9XG5cbiAgZ2V0Q2VsbChjb29yWDogbnVtYmVyLCBjb29yWTogbnVtYmVyKTogQ2VsbCB7XG4gICAgbGV0IHggPSBjb29yWDtcbiAgICBpZiAoISh4ID49IDAgJiYgeCA8IHRoaXMud2lkdGgpKSB7XG4gICAgICBpZiAoeCA8IDApIHggPSB0aGlzLndpZHRoIC0gKC14ICUgdGhpcy53aWR0aCk7XG4gICAgICBlbHNlIHggJT0gdGhpcy53aWR0aDtcbiAgICB9XG4gICAgbGV0IHkgPSBjb29yWTtcbiAgICBpZiAoISh5ID49IDAgJiYgeSA8IHRoaXMuaGVpZ2h0KSkge1xuICAgICAgaWYgKHkgPCAwKSB5ID0gdGhpcy5oZWlnaHQgLSAoLXkgJSB0aGlzLmhlaWdodCk7XG4gICAgICBlbHNlIHkgJT0gdGhpcy5oZWlnaHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdyaWRbeV1beF07XG4gIH1cblxuICBpbnNlcnRGaWd1cmUoc3RhcnRDZWxsOiBDZWxsLCBmaWd1cmVDb29yOiBzdHJpbmcpIHtcbiAgICBmaWd1cmVDb29yLnNwbGl0KFwiO1wiKS5mb3JFYWNoKChjb29yUGFpcikgPT4ge1xuICAgICAgY29uc3QgW3gsIHldID0gY29vclBhaXIuc3BsaXQoXCIsXCIpO1xuICAgICAgY29uc3QgY2VsbCA9IHRoaXMuZ2V0Q2VsbChcbiAgICAgICAgTnVtYmVyKHgpICsgc3RhcnRDZWxsLmNvb3JYLFxuICAgICAgICBOdW1iZXIoeSkgKyBzdGFydENlbGwuY29vclksXG4gICAgICApO1xuICAgICAgY2VsbC5zZXRUeXBlKENlbGxUeXBlLmFsaXZlKTtcbiAgICAgIHRoaXMuY2VsbFVwZGF0ZUNoZWNrKGNlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgZGVsZXRlRmlndXJlKHN0YXJ0Q2VsbDogQ2VsbCwgZmlndXJlQ29vcjogc3RyaW5nKSB7XG4gICAgZmlndXJlQ29vci5zcGxpdChcIjtcIikuZm9yRWFjaCgoY29vclBhaXIpID0+IHtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGNvb3JQYWlyLnNwbGl0KFwiLFwiKTtcbiAgICAgIGNvbnN0IGNlbGwgPSB0aGlzLmdldENlbGwoXG4gICAgICAgIE51bWJlcih4KSArIHN0YXJ0Q2VsbC5jb29yWCxcbiAgICAgICAgTnVtYmVyKHkpICsgc3RhcnRDZWxsLmNvb3JZLFxuICAgICAgKTtcbiAgICAgIGNlbGwuc2V0VHlwZShDZWxsVHlwZS5kZWFkKTtcbiAgICAgIHRoaXMuY2VsbFVwZGF0ZUNoZWNrKGNlbGwpO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgR2FtZUxpdmUgZnJvbSBcIi4vR2FtZUxpdmVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVCdXR0b24oYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUJ1dHRvbihidXR0b246IEhUTUxCdXR0b25FbGVtZW50KSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBidXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbkFwcCB7XG4gIHJlYWRvbmx5IGFwcFRlbXBsYXRlID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5ncy1ibG9ja1wiPlxuICAgIDxpbnB1dCBjbGFzcz1cIm1hcmstY2hlY2tcIiB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwibWFyay1jaGVja1wiIC8+XG4gICAgPGxhYmVsIGZvcj1cIm1hcmstY2hlY2tcIj5cbiAgICAgINCj0LrQsNC30YvQstCw0YLRjCDQutCw0LrQuNC1INC60LvQtdGC0LrQuCDQuNC30LzQtdC90Y/RgtGB0Y8g0L3QsCDRgdC70LXQtNGD0Y7RidC10Lwg0YLQuNC60LVcbiAgICA8L2xhYmVsPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNldHRpbmdzLWJsb2NrXCI+XG4gICAgPGxhYmVsPtCg0LfQsNC80LXRgCDRgdC10YLQutC4IDo8L2xhYmVsPlxuICAgIDxpbnB1dCBjbGFzcz1cIndpZHRoLWlucHV0XCIgcGxhY2Vob2xkZXI9XCJXaWR0aFwiIHR5cGU9XCJudW1iZXJcIiBwYXR0ZXJuPVwiWzAtOV0rXCIgcmVxdWlyZWQgLz5cbiAgICBYXG4gICAgPGlucHV0IGNsYXNzPVwiaGVpZ2h0LWlucHV0XCIgcGxhY2Vob2xkZXI9XCJIZWlnaHRcIiB0eXBlPVwibnVtYmVyXCIgcGF0dGVybj1cIlswLTldK1wiIHJlcXVpcmVkIC8+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImNyZWF0ZUdyaWRcIiB0eXBlPVwiYnV0dG9uXCI+0KHQvtC30LTQsNGC0Ywg0L3QvtCy0YPRjiDRgdC10YLQutGDPC9idXR0b24+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2V0dGluZ3MtYmxvY2tcIj5cbiAgICA8bGFiZWw+0KHQutC+0YDQvtGB0YLRjCA6PC9sYWJlbD5cbiAgICA8aW5wdXQgY2xhc3M9XCJzcGVlZC1pbnB1dFwiIHR5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiB2YWx1ZT1cIjEwXCIgbWF4PVwiNDVcIiBzdGVwPVwiNVwiIC8+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2V0dGluZ3MtYmxvY2tcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwibmV4dFRpY1wiIHR5cGU9XCJidXR0b25cIj7QodC70LXQtNGD0Y7RidC40Lkg0YLQuNC6PC9idXR0b24+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInN0YXJ0XCIgdHlwZT1cImJ1dHRvblwiPtCh0YLQsNGA0YI8L2J1dHRvbj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZXR0aW5ncy1ibG9jayBsZWdlbmRcIj5cbiAgICA8bGFiZWw+0JvQtdCz0LXQvdC00LA6PC9sYWJlbD5cbiAgICA8Y2VsbCBjbGFzcz1cImNlbGwtbGVnZW5kIGRlYWRcIiB0aXRsZT1cItCc0ZHRgNGC0LLQsNGPINC60LvQtdGC0LrQsFwiPjwvY2VsbD5cbiAgICA8Y2VsbCBjbGFzcz1cImNlbGwtbGVnZW5kIGFsaXZlXCIgdGl0bGU9XCLQltC40LLQsNGPINC60LvQtdGC0LrQsFwiPjwvY2VsbD5cbiAgICA8Y2VsbCBjbGFzcz1cImNlbGwtbGVnZW5kIG1hcmstZm9yLWRlYWQgaW52aXNpYmxlXCIgdGl0bGU9XCLQo9C80YDRkdGCINC90LAg0YHQu9C10LTRg9GO0YnQtdC8INGC0LjQutC1XCI+PC9jZWxsPlxuICAgIDxjZWxsIGNsYXNzPVwiY2VsbC1sZWdlbmQgbWFyay1mb3ItYWxpdmUgaW52aXNpYmxlXCIgdGl0bGU9XCLQntC20LjQstGR0YIg0L3QsCDRgdC70LXQtNGD0Y7RidC10Lwg0YLQuNC60LVcIj48L2NlbGw+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibGl2ZS1nYW1lLWNvbnRhaW5lclwiPjwvZGl2PmA7XG5cbiAgcmVhZG9ubHkgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICB3aWR0aElucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIGhlaWdodElucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIHNwZWVkRWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICBtYXJrQ2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgc3RhcnRCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuXG4gIGdyaWRCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuXG4gIG5leHRUaWNCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuXG4gIGxlZ2VuZEJsb2NrOiBIVE1MRWxlbWVudDtcblxuICBzdGFydEZsYWcgPSBmYWxzZTtcblxuICB0aW1lcklkITogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cbiAgZ2FtZUxpdmUhOiBHYW1lTGl2ZTtcblxuICBjb25zdHJ1Y3Rvcihyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuY29udGFpbmVyID0gcm9vdDtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLmFwcFRlbXBsYXRlO1xuXG4gICAgLy8gY2xhc3MgZmllbGRzIGluaXRcbiAgICB0aGlzLndpZHRoSW5wdXQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIud2lkdGgtaW5wdXRcIixcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5oZWlnaHRJbnB1dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIi5oZWlnaHQtaW5wdXRcIixcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5zcGVlZEVsZW1lbnQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuc3BlZWQtaW5wdXRcIixcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5tYXJrQ2hlY2tib3ggPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIubWFyay1jaGVja1wiLFxuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICB0aGlzLnN0YXJ0QnV0dG9uID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLnN0YXJ0XCIsXG4gICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICB0aGlzLmdyaWRCdXR0b24gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuY3JlYXRlR3JpZFwiLFxuICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgdGhpcy5uZXh0VGljQnV0dG9uID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLm5leHRUaWNcIixcbiAgICApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHRoaXMubGVnZW5kQmxvY2sgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmxlZ2VuZFwiKSBhcyBIVE1MRWxlbWVudDtcblxuICAgIHRoaXMud2lkdGhJbnB1dC52YWx1ZSA9IGdldENvbXB1dGVkU3R5bGUodGhpcy5jb250YWluZXIpLmdldFByb3BlcnR5VmFsdWUoXG4gICAgICBcIi0tZmllbGQtd2lkdGhcIixcbiAgICApO1xuICAgIHRoaXMuaGVpZ2h0SW5wdXQudmFsdWUgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKFxuICAgICAgXCItLWZpZWxkLWhlaWdodFwiLFxuICAgICk7XG5cbiAgICBkaXNhYmxlQnV0dG9uKHRoaXMubmV4dFRpY0J1dHRvbik7XG4gICAgZGlzYWJsZUJ1dHRvbih0aGlzLnN0YXJ0QnV0dG9uKTtcbiAgICBkaXNhYmxlQnV0dG9uKHRoaXMuZ3JpZEJ1dHRvbik7XG5cbiAgICAvLyBsaXN0ZW5lcnMgaW5pdFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmNvZGUpIHtcbiAgICAgICAgY2FzZSBcIlNwYWNlXCI6XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uQ2xpY2soKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFycm93VXBcIjpcbiAgICAgICAgICB0aGlzLnNwZWVkRWxlbWVudC5zdGVwVXAoKTtcbiAgICAgICAgICB0aGlzLnNwZWVkRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImNoYW5nZVwiKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJBcnJvd0Rvd25cIjpcbiAgICAgICAgICB0aGlzLnNwZWVkRWxlbWVudC5zdGVwRG93bigpO1xuICAgICAgICAgIHRoaXMuc3BlZWRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiY2hhbmdlXCIpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFycm93UmlnaHRcIjpcbiAgICAgICAgICB0aGlzLm5leHRUaWNCdXR0b24uY2xpY2soKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubWFya0NoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5sZWdlbmRCbG9ja1xuICAgICAgICAucXVlcnlTZWxlY3RvcihcIi5tYXJrLWZvci1kZWFkXCIpXG4gICAgICAgID8uY2xhc3NMaXN0LnRvZ2dsZShcImludmlzaWJsZVwiKTtcbiAgICAgIHRoaXMubGVnZW5kQmxvY2tcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIubWFyay1mb3ItYWxpdmVcIilcbiAgICAgICAgPy5jbGFzc0xpc3QudG9nZ2xlKFwiaW52aXNpYmxlXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5nYW1lTGl2ZSA9IG5ldyBHYW1lTGl2ZShcbiAgICAgIHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIubGl2ZS1nYW1lLWNvbnRhaW5lclwiKSBhcyBIVE1MRWxlbWVudCxcbiAgICAgIE51bWJlcih0aGlzLndpZHRoSW5wdXQudmFsdWUpLFxuICAgICAgTnVtYmVyKHRoaXMuaGVpZ2h0SW5wdXQudmFsdWUpLFxuICAgICAgdGhpcy5tYXJrQ2hlY2tib3guY2hlY2tlZCxcbiAgICApO1xuXG4gICAgZW5hYmxlQnV0dG9uKHRoaXMubmV4dFRpY0J1dHRvbik7XG4gICAgZW5hYmxlQnV0dG9uKHRoaXMuc3RhcnRCdXR0b24pO1xuICAgIGVuYWJsZUJ1dHRvbih0aGlzLmdyaWRCdXR0b24pO1xuXG4gICAgdGhpcy53aWR0aElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoXCItLWZpZWxkLXdpZHRoXCIsIHRoaXMud2lkdGhJbnB1dC52YWx1ZSk7XG4gICAgICB0aGlzLmdhbWVMaXZlLnJlc2l6ZVdpZHRoKE51bWJlcih0aGlzLndpZHRoSW5wdXQudmFsdWUpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaGVpZ2h0SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLWZpZWxkLWhlaWdodFwiLFxuICAgICAgICB0aGlzLmhlaWdodElucHV0LnZhbHVlLFxuICAgICAgKTtcbiAgICAgIHRoaXMuZ2FtZUxpdmUucmVzaXplSGVpZ2h0KE51bWJlcih0aGlzLmhlaWdodElucHV0LnZhbHVlKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm5leHRUaWNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHRoaXMuZ2FtZUxpdmUubmV4dFRpYygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGFydEJ1dHRvbkNsaWNrKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1hcmtDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgIHRoaXMuZ2FtZUxpdmUubWFya2FibGUgPSB0aGlzLm1hcmtDaGVja2JveC5jaGVja2VkO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ncmlkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tZmllbGQtd2lkdGhcIiwgdGhpcy53aWR0aElucHV0LnZhbHVlKTtcbiAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tZmllbGQtaGVpZ2h0XCIsXG4gICAgICAgIHRoaXMuaGVpZ2h0SW5wdXQudmFsdWUsXG4gICAgICApO1xuXG4gICAgICB0aGlzLmdhbWVMaXZlLmdldEdyaWQoXG4gICAgICAgIE51bWJlcih0aGlzLndpZHRoSW5wdXQudmFsdWUpLFxuICAgICAgICBOdW1iZXIodGhpcy5oZWlnaHRJbnB1dC52YWx1ZSksXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zcGVlZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGFydEZsYWcpIHtcbiAgICAgICAgdGhpcy5nYW1lU3RvcCgpO1xuICAgICAgICB0aGlzLmdhbWVTdGFydCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnRCdXR0b25DbGljaygpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRGbGFnKSB7XG4gICAgICB0aGlzLmdhbWVTdGFydCgpO1xuICAgICAgdGhpcy5zdGFydEZsYWcgPSB0cnVlO1xuICAgICAgdGhpcy5zdGFydEJ1dHRvbi5pbm5lclRleHQgPSBcItCh0YLQvtC/XCI7XG4gICAgICBkaXNhYmxlQnV0dG9uKHRoaXMubmV4dFRpY0J1dHRvbik7XG4gICAgICBkaXNhYmxlQnV0dG9uKHRoaXMuZ3JpZEJ1dHRvbik7XG4gICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKFwicnVuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdhbWVTdG9wKCk7XG4gICAgICB0aGlzLnN0YXJ0RmxhZyA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGFydEJ1dHRvbi5pbm5lclRleHQgPSBcItCh0YLQsNGA0YJcIjtcbiAgICAgIGVuYWJsZUJ1dHRvbih0aGlzLm5leHRUaWNCdXR0b24pO1xuICAgICAgZW5hYmxlQnV0dG9uKHRoaXMuZ3JpZEJ1dHRvbik7XG4gICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKFwicnVuXCIpO1xuICAgIH1cbiAgfVxuXG4gIGdhbWVTdGFydCgpIHtcbiAgICB0aGlzLnRpbWVySWQgPSBzZXRJbnRlcnZhbChcbiAgICAgIHRoaXMuZ2FtZVN0YXJ0RnVuY3Rpb24oKSxcbiAgICAgIDEwMDAgLyAoTnVtYmVyKHRoaXMuc3BlZWRFbGVtZW50LnZhbHVlKSArIDUpLFxuICAgICk7XG4gIH1cblxuICBnYW1lU3RhcnRGdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZ2FtZUxpdmUubmV4dFRpYygpKSB7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b25DbGljaygpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnYW1lU3RvcCgpIHtcbiAgICBpZiAodGhpcy50aW1lcklkKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJZCk7XG4gICAgICB0aGlzLnRpbWVySWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgTWFpbkFwcCBmcm9tIFwiLi9NYWluQXBwXCI7XG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuXG5jb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBNYWluQXBwKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpblwiKSBhcyBIVE1MRWxlbWVudCk7XG5hcHBsaWNhdGlvbi5zdGFydCgpO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcbiAgLS1jZWxsLXNpemU6IDIwcHg7XG4gIC0tZmllbGQtd2lkdGg6IDQwO1xuICAtLWZpZWxkLWhlaWdodDogMjU7XG59XG5cbi5tYWluIHtcbiAgb3ZlcmZsb3c6IGF1dG87XG4gIG1hcmdpbjogMCBhdXRvO1xuICBwYWRkaW5nOiAycmVtIDJyZW07XG4gIGJvcmRlcjogM3B4IHNvbGlkICMzMzMzMzM7XG4gIGJvcmRlci1yYWRpdXM6IDIlIDYlIDUlIDQlIC8gMSUgMSUgMiUgNCU7XG59XG5cbi5ydW4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjk2OTY5O1xufVxuXG4uc2V0dGluZ3MtYmxvY2sge1xuICBwYWRkaW5nOiA0cHggNHB4O1xufVxuXG4uY2VsbC1sZWdlbmQge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiB2YXIoLS1jZWxsLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLWNlbGwtc2l6ZSk7XG4gIGJvcmRlcjogMXB4IHNvbGlkICMzMzMzMzM7XG4gIGJvcmRlci1yYWRpdXM6IDEwJSAxMCUgMTAlIDEwJTtcbn1cblxuLmxpdmUtZ2FtZS1jb250YWluZXIge1xuICB3aWR0aDogZml0LWNvbnRlbnQ7XG4gIG92ZXJmbG93OiBhdXRvO1xuICBtYXJnaW46IDAgYXV0bztcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQodmFyKC0tZmllbGQtd2lkdGgpLCBhdXRvKTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQodmFyKC0tZmllbGQtaGVpZ2h0KSwgYXV0byk7XG4gIGdhcDogMDtcbn1cblxuLmNlbGwge1xuICB3aWR0aDogdmFyKC0tY2VsbC1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1jZWxsLXNpemUpO1xuICBib3JkZXI6IDFweCBzb2xpZCAjMzMzMzMzO1xufVxuXG4uY2VsbDpob3ZlciB7XG4gIHdpZHRoOiB2YXIoLS1jZWxsLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLWNlbGwtc2l6ZSk7XG4gIGJvcmRlcjogMXB4IHNvbGlkICMzMzMzMzM7XG4gIGJvcmRlci1yYWRpdXM6IDEwJSAxMCUgMTAlIDEwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcbn1cblxuLmRlYWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBhbGljZWJsdWU7XG59XG5cbi5hbGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuXG4ubWFyay1mb3ItZGVhZCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XG59XG5cbi5tYXJrLWZvci1hbGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsdWU7XG59XG5cbi5pbnZpc2libGUge1xuICBkaXNwbGF5OiBub25lO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsY0FBYztFQUNkLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsd0NBQXdDO0FBQzFDOztBQUVBO0VBQ0UseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLHVCQUF1QjtFQUN2Qix3QkFBd0I7RUFDeEIseUJBQXlCO0VBQ3pCLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixjQUFjO0VBQ2QsY0FBYztFQUNkLGFBQWE7RUFDYix1REFBdUQ7RUFDdkQscURBQXFEO0VBQ3JELE1BQU07QUFDUjs7QUFFQTtFQUNFLHVCQUF1QjtFQUN2Qix3QkFBd0I7RUFDeEIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLHdCQUF3QjtFQUN4Qix5QkFBeUI7RUFDekIsOEJBQThCO0VBQzlCLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGFBQWE7QUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI6cm9vdCB7XFxuICAtLWNlbGwtc2l6ZTogMjBweDtcXG4gIC0tZmllbGQtd2lkdGg6IDQwO1xcbiAgLS1maWVsZC1oZWlnaHQ6IDI1O1xcbn1cXG5cXG4ubWFpbiB7XFxuICBvdmVyZmxvdzogYXV0bztcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgcGFkZGluZzogMnJlbSAycmVtO1xcbiAgYm9yZGVyOiAzcHggc29saWQgIzMzMzMzMztcXG4gIGJvcmRlci1yYWRpdXM6IDIlIDYlIDUlIDQlIC8gMSUgMSUgMiUgNCU7XFxufVxcblxcbi5ydW4ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY5Njk2OTtcXG59XFxuXFxuLnNldHRpbmdzLWJsb2NrIHtcXG4gIHBhZGRpbmc6IDRweCA0cHg7XFxufVxcblxcbi5jZWxsLWxlZ2VuZCB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB3aWR0aDogdmFyKC0tY2VsbC1zaXplKTtcXG4gIGhlaWdodDogdmFyKC0tY2VsbC1zaXplKTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICMzMzMzMzM7XFxuICBib3JkZXItcmFkaXVzOiAxMCUgMTAlIDEwJSAxMCU7XFxufVxcblxcbi5saXZlLWdhbWUtY29udGFpbmVyIHtcXG4gIHdpZHRoOiBmaXQtY29udGVudDtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQodmFyKC0tZmllbGQtd2lkdGgpLCBhdXRvKTtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KHZhcigtLWZpZWxkLWhlaWdodCksIGF1dG8pO1xcbiAgZ2FwOiAwO1xcbn1cXG5cXG4uY2VsbCB7XFxuICB3aWR0aDogdmFyKC0tY2VsbC1zaXplKTtcXG4gIGhlaWdodDogdmFyKC0tY2VsbC1zaXplKTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICMzMzMzMzM7XFxufVxcblxcbi5jZWxsOmhvdmVyIHtcXG4gIHdpZHRoOiB2YXIoLS1jZWxsLXNpemUpO1xcbiAgaGVpZ2h0OiB2YXIoLS1jZWxsLXNpemUpO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzMzMzMzMztcXG4gIGJvcmRlci1yYWRpdXM6IDEwJSAxMCUgMTAlIDEwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxufVxcblxcbi5kZWFkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFsaWNlYmx1ZTtcXG59XFxuXFxuLmFsaXZlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4ubWFyay1mb3ItZGVhZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xcbn1cXG5cXG4ubWFyay1mb3ItYWxpdmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcXG59XFxuXFxuLmludmlzaWJsZSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07Il0sIm5hbWVzIjpbIkNlbGxUeXBlIiwiTWFya0NlbGxUeXBlIiwiQ2VsbCIsInR5cGVOZXh0VGljIiwidW5kZWZpbmVkIiwibWFya2VkIiwiY29uc3RydWN0b3IiLCJjb29yWCIsImNvb3JZIiwidHlwZSIsImRlYWQiLCJjZWxsRWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsInRpdGxlIiwib25DbGljayIsImFsaXZlIiwic2V0VHlwZSIsInJlbW92ZSIsIm1hcmsiLCJwcm9jZXNzTWFyayIsIm1hcmtGb3JBbGl2ZSIsIm1hcmtGb3JBbGl2ZUludmlzaWJsZSIsIm1hcmtGb3JEZWFkIiwibWFya0ZvckRlYWRJbnZpc2libGUiLCJtYXJrQ2xlYXIiLCJHYW1lTGl2ZSIsImNlbGxUb01hcmsiLCJTZXQiLCJjZWxsVG9DaGFuZ2VOZXh0VGljIiwiZ3JpZCIsImNvbnRhaW5lciIsIndpZHRoIiwiaGVpZ2h0IiwibWFya2FibGUiLCJnZXRHcmlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidGFyZ2V0IiwiSFRNTEVsZW1lbnQiLCJjdXJyZW50SG92ZXJDZWxsIiwiZWxlbWVudCIsImNlbGwiLCJnZXRDZWxsIiwiTnVtYmVyIiwiZ2V0QXR0cmlidXRlIiwiY2VsbFVwZGF0ZUNoZWNrIiwibWFya0dyaWQiLCJjbGVhciIsInkiLCJ4Iiwic2hvd0dyaWQiLCJyZXNpemVXaWR0aCIsImZvckVhY2giLCJyb3ciLCJzcGxpY2UiLCJwdXNoIiwicmVzaXplSGVpZ2h0IiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJjZWxscyIsImdldENlbGxOZWlnaGJvdXJzIiwiYWxpdmVDZWxsTmVpZ2hib3VycyIsInJlZHVjZSIsInJlc3VsdCIsImVsIiwiZGVsZXRlIiwibmV4dFRpYyIsInNpemUiLCJpbnNlcnRGaWd1cmUiLCJzdGFydENlbGwiLCJmaWd1cmVDb29yIiwic3BsaXQiLCJjb29yUGFpciIsImRlbGV0ZUZpZ3VyZSIsImRpc2FibGVCdXR0b24iLCJidXR0b24iLCJkaXNhYmxlZCIsImVuYWJsZUJ1dHRvbiIsIk1haW5BcHAiLCJhcHBUZW1wbGF0ZSIsInN0YXJ0RmxhZyIsInJvb3QiLCJ3aWR0aElucHV0IiwicXVlcnlTZWxlY3RvciIsImhlaWdodElucHV0Iiwic3BlZWRFbGVtZW50IiwibWFya0NoZWNrYm94Iiwic3RhcnRCdXR0b24iLCJncmlkQnV0dG9uIiwibmV4dFRpY0J1dHRvbiIsImxlZ2VuZEJsb2NrIiwidmFsdWUiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsIndpbmRvdyIsImNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0YXJ0QnV0dG9uQ2xpY2siLCJzdGVwVXAiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJzdGVwRG93biIsImNsaWNrIiwidG9nZ2xlIiwic3RhcnQiLCJnYW1lTGl2ZSIsImNoZWNrZWQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwiZ2FtZVN0b3AiLCJnYW1lU3RhcnQiLCJpbm5lclRleHQiLCJ0aW1lcklkIiwic2V0SW50ZXJ2YWwiLCJnYW1lU3RhcnRGdW5jdGlvbiIsImNsZWFySW50ZXJ2YWwiLCJhcHBsaWNhdGlvbiJdLCJzb3VyY2VSb290IjoiIn0=