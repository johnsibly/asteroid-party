const gameLogic = require('../gameLogic.js');
const isPointInPolygon = gameLogic.isPointInPolygon;
const doesCircleOverlapPolygon = gameLogic.doesCircleOverlapPolygon;
const mockIO = { emit: function (command, state) { console.log("mockIO.emit called"); } };

beforeEach(() => {
});

it('Test object outside concave polygon', () => {
    const polygon = [{x:0, y:0}, {x:0, y:1}, {x:2, y:1}, {x:2, y:3}, {x:0, y:3}, {x:0, y:4}, {x:3, y:4}, {x:3, y:0}];
    const testx = 1, testy = 2;
    expect(isPointInPolygon(polygon, testx, testy)).toEqual(false);
});

it('Test object on edge of concave polygon', () => {
    const polygon = [{x:0, y:0}, {x:0, y:1}, {x:2, y:1}, {x:2, y:3}, {x:0, y:3}, {x:0, y:4}, {x:3, y:4}, {x:3, y:0}];
    const testx = 2, testy = 2;
    expect(isPointInPolygon(polygon, testx, testy)).toEqual(true);
});

it('Test circle just overlapping rectangle', () => {
    const polygon = [{x:1, y:1}, {x:1, y:10}, {x:10, y:10}, {x:10, y:1}];
    const testx = 0.9, testy = 0.9;
    expect(doesCircleOverlapPolygon(polygon, testx, testy)).toEqual(true);
});

it('Add 2 players, remove 1, add 1 should all have unique names', () => {
    console.debug();
    gameLogic.addPlayer(1, mockIO);
    gameLogic.addPlayer(2, mockIO);
    const player2Name = gameLogic.players[1].name;
    gameLogic.removePlayer(2);
    gameLogic.addPlayer(3, mockIO);
    const player3Name = gameLogic.players[1].name;
    expect(gameLogic.players.length).toEqual(2);
    expect(player2Name).not.toBe(player3Name);
});

