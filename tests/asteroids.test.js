const asteroids = require('../gameLogic.js');
const isPointInPolygon = asteroids.isPointInPolygon;

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