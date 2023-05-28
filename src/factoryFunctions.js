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

function Gameboard() {
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

module.exports = { createShip };
