export const mainElem = document.getElementsByTagName("main")[0];

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
        createBoard();
        placeBoatsStartGame();
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

export function createBoard() {
    const div = createElement("div", "player-board");
    for (let i = 0; i < 10; i++) {
        const row = createElement("div", "row");
        for (let j = 0; j < 10; j++) {
            const square = createElement("div", "square");
            square.dataset.row = i;
            square.dataset.col = j;
            square.addEventListener(
                "dragover",
                (e) => {
                    e.preventDefault();
                },
                false
            );
            square.addEventListener("drop", (e) => {
                e.preventDefault();
                const selectedSquare = e.target;
                const row = selectedSquare.parentElement;
                const rowArr = selectedSquare.parentElement.children;
                const selectedSquareRow = selectedSquare.dataset.row;
                const selectedSquareColumn = selectedSquare.dataset.col;
                if (Number(selectedSquareColumn) + 3 > 9) {
                    return;
                }
                let holder = [];
                for (const elem of rowArr) {
                    const elemRow = elem.dataset.row;
                    const elemCol = elem.dataset.col;
                    if (
                        elemCol >= selectedSquareColumn &&
                        elemCol <=
                            Number(selectedSquareColumn) +
                                Number(dragged.children.length) -
                                1
                    ) {
                        holder.push({ div: elem, col: elemCol });
                    }
                }
                row.insertBefore(dragged, selectedSquare);
                const draggedChildren = dragged.children;
                let i = 0;
                for (const elem of holder) {
                    draggedChildren[i].dataset.row = selectedSquareRow;
                    draggedChildren[i].dataset.col = elem.col;
                    i++;
                    row.removeChild(elem.div);
                }
            });
            square.addEventListener("click", () => {
                //attack probably;
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
    boatDiv.draggable = "true";
    boatDiv.addEventListener("drag", () => {
        dragged = boatDiv;
    });
    for (let i = 0; i < length; i++) {
        const boatPart = createElement("div", "boat-part");
        boatDiv.appendChild(boatPart);
    }
    boatDiv.addEventListener("click", () => {
        if (boatDiv.dataset.horizontal === "on") {
            boatDiv.dataset.horizontal = "off";
        } else {
            boatDiv.dataset.horizontal = "on";
        }
    });
    return boatDiv;
}
