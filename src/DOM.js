const { Gameboard } = require("./factoryFunctions");

export const mainElem = document.getElementsByTagName("main")[0];

let playerBoard = Gameboard();
let dragged;

function createElement(elemType, className) {
    const elem = document.createElement(elemType);
    elem.classList.add(className);
    return elem;
}

export function newGameUI() {
    const div = createElement("div", "new-game-container");
    const h2 = createElement("h2");
    h2.innerText = "New Game";
    h2.addEventListener("click", () => {
        resetMain();
        placeBoatsStartGame();
        drawBoard();
    });
    const creditsDiv = createElement("div", "credits");
    const p = createElement("p");
    p.innerText = "Created by vladius9512";
    const a = createElement("a");
    a.href = "https://github.com/vladius9512";
    a.target = "_blank";
    const img = createElement("img");
    img.src = "./images/github.svg";
    img.alt = "github-logo";
    a.append(img);
    creditsDiv.append(p, a);
    div.append(h2, creditsDiv);
    mainElem.append(div);
}

function resetMain() {
    mainElem.innerHTML = "";
}

function drawBoard() {
    const div = createElement("div", "player-board");
    const boardMatrix = playerBoard.locations;
    for (let i = 0; i < boardMatrix.length; i++) {
        const row = createElement("div", "row");
        for (let j = 0; j < boardMatrix.length; j++) {
            const square = createElement("div", "square");
            if (boardMatrix[i][j] === 1) {
                square.classList.add("ship");
            }
            square.addEventListener(
                "dragover",
                (e) => {
                    e.preventDefault();
                },
                false
            );
            square.addEventListener("drop", (e) => {
                e.preventDefault();
                if (boardMatrix[i][j] === 1) return;
                if (dragged.dataset.placed === "on") return;
                dragged.dataset.placed = "on";
                let shipLength = dragged.children.length;
                const boatDirection = dragged.dataset.horizontal;
                if (j + shipLength - 1 > 10 && boatDirection === "on") {
                    return;
                }
                if (i + shipLength - 1 > 10 && boatDirection === "off") {
                    return;
                }
                if (boatDirection === "on") {
                    while (shipLength != 0) {
                        boardMatrix[i][j + shipLength - 1] = 1;
                        shipLength--;
                    }
                } else {
                    while (shipLength != 0) {
                        boardMatrix[i + shipLength - 1][j] = 1;
                        shipLength--;
                    }
                }
                div.innerHTML = "";
                drawBoard();
            });
            row.appendChild(square);
        }
        div.appendChild(row);
    }
    mainElem.appendChild(div);
}

function placeBoatsStartGame() {
    const div = createElement("div", "boats-container");
    const carrier = createBoat(5, "ship-container");
    const battleship = createBoat(4, "ship-container");
    const cruiser = createBoat(3, "ship-container");
    const destroyer = createBoat(2, "ship-container");
    const startGame = createElement("div", "start-game-container");
    const startGameBtn = createElement("button", "start-game");
    startGameBtn.innerText = "Start Game";
    startGameBtn.addEventListener("click", () => {
        console.log("Starting game");
    });
    startGame.appendChild(startGameBtn);
    div.append(carrier, battleship, cruiser, destroyer);
    mainElem.append(div, startGame);
}

function createBoat(length, boatName) {
    const boatDiv = createElement("div", boatName);
    boatDiv.dataset.horizontal = "on";
    boatDiv.dataset.placed = "off";
    boatDiv.draggable = "true";
    boatDiv.addEventListener("drag", () => {
        dragged = boatDiv;
    });
    for (let i = 0; i < length; i++) {
        const boatPart = createElement("div", "boat-part");
        boatDiv.appendChild(boatPart);
    }
    boatDiv.addEventListener("click", () => {
        if (boatDiv.dataset.placed === "on") return;
        if (boatDiv.dataset.horizontal === "on") {
            boatDiv.dataset.horizontal = "off";
        } else {
            boatDiv.dataset.horizontal = "on";
        }
    });
    return boatDiv;
}
