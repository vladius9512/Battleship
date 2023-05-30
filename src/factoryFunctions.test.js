const imported = require("./factoryFunctions");

test("creates a new ship of length 4 and with 0 hits", () => {
    expect(imported.createShip(4, 0, false)).toMatchObject({
        length: 4,
        hits: 0,
        sunk: false,
        hit: expect.any(Function),
        isSunk: expect.any(Function),
    });
});
