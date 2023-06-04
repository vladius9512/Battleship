const { Gameboard, AI } = require("./factoryFunctions");
const { checkSquaresHorizontal, checkSquaresVertical } = require("./utils");
//import { Gameboard, AI } from "./factoryFunctions.js";

const mainElem = document.getElementsByTagName("main")[0];
const overlay = document.getElementsByClassName("overlay")[0];

let playerBoard = Gameboard();
let computer = AI();
let dragged;

function createElement(elemType, className) {
    const elem = document.createElement(elemType);
    if (className !== undefined) elem.classList.add(className);
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
                let shipLength = dragged.children.length;
                if (boardMatrix[i][j] === 1) {
                    return;
                }
                if (i != 0 && j != 0) {
                    if (boardMatrix[i - 1][j - 1] === 1) {
                        return;
                    }
                }
                if (i != 9 && j != 9) {
                    if (boardMatrix[i + 1][j + 1] === 1) {
                        return;
                    }
                }
                if (dragged.dataset.horizontal === "on") {
                    if (
                        checkSquaresHorizontal(
                            boardMatrix,
                            i,
                            shipLength,
                            j
                        ) === false
                    ) {
                        return;
                    }
                } else {
                    if (
                        checkSquaresVertical(boardMatrix, j, shipLength, i) ===
                        false
                    ) {
                        return;
                    }
                }
                if (dragged.dataset.placed === "on") return;
                const boatDirection = dragged.dataset.horizontal;
                if (j + shipLength > 10 && boatDirection === "on") {
                    return;
                }
                if (i + shipLength > 10 && boatDirection === "off") {
                    return;
                }
                if (boatDirection === "on") {
                    dragged.dataset.placed = "on";
                    playerBoard.placeShip(shipLength, i, j, false);
                } else {
                    dragged.dataset.placed = "on";
                    playerBoard.placeShip(shipLength, i, j, true);
                }
                div.innerHTML = "";
                drawBoard();
                mainElem.removeChild(mainElem.children[2]);
            });
            row.appendChild(square);
        }
        div.appendChild(row);
    }
    mainElem.appendChild(div);
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

function placeBoatsStartGame() {
    const div = createElement("div", "boats-container");
    const carrier = createBoat(5, "ship-container");
    const battleship = createBoat(4, "ship-container");
    const cruiser = createBoat(3, "ship-container");
    const destroyer = createBoat(2, "ship-container");
    const startGame = createElement("div", "start-game-container");
    const startGameBtn = createElement("button", "start-game");
    startGameBtn.innerText = "Start Game";
    startGameBtn.id = "start-game";
    startGameBtn.addEventListener("click", () => {
        if (playerBoard.ships.length != 4) return;
        else generatePlayerAndAIBoards();
    });
    startGame.appendChild(startGameBtn);
    div.append(carrier, battleship, cruiser, destroyer);
    mainElem.append(div, startGame);
}

function drawAIBoard() {
    const div = createElement("div", "computer-board");
    const boardMatrix = computer.gameboard.locations;
    for (let i = 0; i < boardMatrix.length; i++) {
        const row = createElement("div", "row");
        for (let j = 0; j < boardMatrix.length; j++) {
            const square = createElement("div", "square");
            row.appendChild(square);
            let attacked = false;
            square.addEventListener("click", () => {
                if (attacked) return;
                computer.gameboard.receiveAttack(i, j);
                if (computer.gameboard.checkSinked())
                    endGameScreen("You won the game!");
                if (playerBoard.checkSinked())
                    endGameScreen("Computer won! Try again!");
                if (boardMatrix[i][j] === 1) {
                    square.classList.add("hit");
                    square.classList.add("disabled");
                } else {
                    square.classList.add("miss");
                    square.classList.add("disabled");
                }
                attacked = true;
                updateShipsAlive(
                    computer.gameboard.remainingShips(),
                    playerBoard.remainingShips()
                );
                const move = computer.doMove();
                playerBoard.receiveAttack(move.row, move.column);
                updatePlayerBoard();
            });
        }
        div.appendChild(row);
    }
    mainElem.appendChild(div);
}

function updateShipsAlive(remainingShipsComp, remainingShipsPlayer) {
    const div = document.getElementById("ships-alive");
    div.firstChild.innerText = `Computer has ${remainingShipsComp} ships alive`;
    div.children[1].innerText = `You have ${remainingShipsPlayer} ships alive`;
}

function updatePlayerBoard() {
    const div = createElement("div", "player-board");
    const boardMatrix = playerBoard.locations;
    for (let i = 0; i < boardMatrix.length; i++) {
        const row = createElement("div", "row");
        for (let j = 0; j < boardMatrix.length; j++) {
            const square = createElement("div", "square");
            if (boardMatrix[i][j] === 1) {
                square.classList.add("ship");
            }
            if (boardMatrix[i][j] === "x") {
                square.classList.add("miss");
            }
            row.appendChild(square);
        }
        div.appendChild(row);
    }
    mainElem.insertBefore(div, mainElem.children[0]);
    mainElem.removeChild(mainElem.children[1]);
}

function generatePlayerAndAIBoards() {
    const versus = createElement("p");
    const div = createElement("div");
    div.id = "ships-alive";
    const shipText = createElement("p");
    const playerText = createElement("p");
    playerText.innerText = `You have 4 ships alive`;
    shipText.innerText = `Computer has 4 ships alive`;
    div.append(shipText, playerText);
    versus.innerText = "vs";
    resetMain();
    drawBoard();
    mainElem.appendChild(versus);
    drawAIBoard();
    mainElem.appendChild(div);
}

function endGameScreen(message) {
    const div = createElement("div", "outcome-restart");
    const p = createElement("p");
    p.innerText = message;
    div.appendChild(p);
    const playAgainBtn = createElement("button", "play-again");
    playAgainBtn.innerText = "Play Again";
    playAgainBtn.addEventListener("click", () => {
        resetMain();
        overlay.classList.remove("active");
        playerBoard = Gameboard();
        computer = AI();
        placeBoatsStartGame();
        drawBoard();
    });
    div.appendChild(playAgainBtn);
    overlay.classList.add("active");
    mainElem.append(div);
}
