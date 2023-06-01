function createShip({ length, hits, sunk, row, col }) {
    return {
        length: length,
        hits: hits || 0,
        sunk: sunk || false,
        id: Date.now(),
        position: {
            row: row,
            column: col,
        },
        hit() {
            this.hits++;
            this.isSunk();
        },
        isSunk() {
            if (this.length === this.hits) {
                this.sunk = true;
            }
        },
    };
}

function createGrid() {
    let a = [];
    for (let i = 0; i < 10; i++) {
        a[i] = [];
        for (let j = 0; j < 10; j++) {
            a[i][j] = 0;
        }
    }
    return a;
}

export function Gameboard() {
    return {
        locations: createGrid(),
        ships: [],
        placeShip(length, row, column, vertical) {
            let position;
            if (vertical === true) {
                position = {
                    row: [],
                    column: [column],
                };
                for (let i = row; i < row + length; i++) {
                    this.locations[i][column] = 1;
                    position.row.push(i);
                }
            } else {
                position = {
                    row: [row],
                    column: [],
                };
                for (let i = column; i < column + length; i++) {
                    this.locations[row][i] = 1;
                    position.column.push(i);
                }
            }
            const ship = createShip({
                length: length,
                row: position.row,
                col: position.column,
            });
            this.ships.push(ship);
        },
        receiveAttack(row, column) {
            const shipHit = this.ships.some((ship) => {
                if (
                    ship.position.row.includes(row) &&
                    ship.position.column.includes(column)
                ) {
                    ship.hit();
                    return true;
                }
                return false;
            });
            if (shipHit === false) {
                this.locations[row][column] = "x";
            }
        },
        checkSinked() {
            return this.ships.every((ship) => {
                return ship.sunk === true;
            });
        },
        remainingShips() {
            return this.ships.filter(({ sunk }) => sunk === false).length;
        },
    };
}

function createPlayer() {
    const gameboard = Gameboard();
    return {
        gameboard: gameboard,
        turn: true,
        attack(row, column) {
            return { atkRow: row, atkColumn: column };
        },
    };
}

export function AI() {
    const gameboard = Gameboard();
    const oponentGrid = createGrid();
    gameboard.placeShip(4, 2, 3);
    gameboard.placeShip(2, 0, 0);
    gameboard.placeShip(5, 9, 0);
    gameboard.placeShip(3, 5, 5, true);
    return {
        gameboard: gameboard,
        markedLocations: oponentGrid,
        doMove() {
            let moves = generateMove();
            if (this.markedLocations[moves.row][moves.column] === 0) {
                this.markedLocations[moves.row][moves.column] = "x";
                return moves;
            } else {
                return this.doMove();
            }
        },
    };
}

function generateMove() {
    const row = Math.floor(Math.random() * 9);
    const column = Math.floor(Math.random() * 9);
    return { row: row, column: column };
}

function main() {
    const computer = AI();
    const player = createPlayer();
    const move = computer.doMove();
    player.gameboard.receiveAttack(move.row, move.column);
    console.log(player);
    computer.gameboard.receiveAttack(0, 0);
    console.log(computer);
}

//module.exports = {Gameboard, AI, createShip};
