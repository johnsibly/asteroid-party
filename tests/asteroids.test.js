const asteroids = require('../gameLogic.js');
const isPointInPolygon = asteroids.isPointInPolygon;
const doesCircleOverlapPolygon = asteroids.doesCircleOverlapPolygon;

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



