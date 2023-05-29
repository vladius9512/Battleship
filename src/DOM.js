export const mainElem = document.getElementsByTagName("main")[0];

function createElement(elemType, className) {
    const elem = document.createElement(elemType);
    elem.classList.add(className);
    return elem;
}

export function newGameUI() {
    const div = createElement("div", "new-game-container");
    const h2 = createElement("h2");
    h2.innerText = "New Game";
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

export function createBoard() {
    const div = createElement("div", "player-board");
    for (let i = 0; i < 10; i++) {
        const row = createElement("div", "row");
        for (let j = 0; j < 10; j++) {
            const square = createElement("div", "square");
            square.dataset.location = `${i},${j}`;
            square.addEventListener("click", () => {
                console.log(square.dataset.location);
            });
            row.appendChild(square);
        }
        div.appendChild(row);
    }
    mainElem.appendChild(div);
}

function boardSetUp() {}
