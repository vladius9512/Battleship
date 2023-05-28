function createShip(length, hits, sunk) {
    return {
        length: length,
        hits: hits,
        sunk: sunk,
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

module.exports = createShip;
