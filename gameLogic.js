module.exports.isPointInPolygon = isPointInPolygon;
module.exports.processAction = processAction;
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
module.exports.doesCircleOverlapPolygon = doesCircleOverlapPolygon;

let _io = null;

let players = [];
let asteroids = [];
let highScore = {name: '', score: 0};
const width = 375, height = 375;
const refreshInterval = 50;
const asteroidSpawnInterval = 5000;
const bulletSpeed = 3.0;
const bulletRadius = 3;
const maxAsteroids = 5;
let asteroidSpawnIntervalId = null;
let intervalId = null;
let shipNames = ["Valiant", "Bandit", "Hurricane", "Tortoise", "Falcon", "Voyager", "Bastion", "Rhapsody", "Tranquility", "Gremlin", "Guardian", "Trident"];

function initialiseGame() {
  shuffleArray(shipNames);
  intervalId = setInterval(() => updateState(), refreshInterval);
  asteroidSpawnIntervalId = setInterval(() => addAsteroid(), asteroidSpawnInterval);
}

function processAction(id, msg) {
  const player = players.find(player => player.id == id);
  switch (msg.keyCode) {
    case 37: // Left
      player.direction = getAngleOffset(player.direction, -0.1);
      break;
    case 39: // Right
      player.direction = getAngleOffset(player.direction, 0.1);
      break;
    case 32: // Spacebar
      player.bulletActive = true;
      player.bulletDirection = player.direction;
      player.bulletX = player.x;
      player.bulletY = player.y;
  }
}

function getRandomColor() {
  const letters = '08F'; // 3 * 3 * 3 = 27 possible colours
  let color = '#';
  for (let i = 0; i < 3; i++) { // Keep it simple to #08F format
    color += letters[Math.floor(Math.random() * 3)];
  }
  return color;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function getAngleOffset(direction, offset) {
  newDirection = direction + offset * Math.PI;
  while (newDirection > (2 * Math.PI)) {
    newDirection -= (2 * Math.PI);
  }
  return newDirection;
}

function addPlayer(id, io) {
  if (io) {
    _io = io;
  }
  if (players.length == 0) {
    initialiseGame();
  }
  players.push({id: id, 
    name: shipNames[players.length], 
    x: width/2.0, 
    y: height/2.0, 
    direction: 2.0 * Math.PI * Math.random(), 
    velocity: 1, 
    firing: false, 
    color: getRandomColor(), 
    score: 0, 
    bulletActive: false, 
    bulletX: 0, 
    bulletY: 0, 
    bulletDirection: 0});
}

function addAsteroid() {
  if (asteroids.length < maxAsteroids) {
    const numbAsteroidVertices = 8.0;
    let vertices = [];
    for (let angle = 0; angle < 2.0 * Math.PI; angle+=((2.0 * Math.PI) / numbAsteroidVertices)) {
      let distanceFromCentre = getRandDistFromCentre();
      vertices.push({x: Math.floor(distanceFromCentre * Math.cos(angle)), 
                     y: Math.floor(distanceFromCentre * Math.sin(angle))});
    }
    asteroids.push({x: Math.floor(Math.random() * width), 
                    y: Math.floor(Math.random() * height), 
                    direction: 2.0 * Math.PI * Math.random(), 
                    velocity: 1, 
                    vertices: vertices});
  }
}

function getRandDistFromCentre() {
  return 10 * (1 + Math.floor(2.0 * Math.random()));
}


function updateState() {
  players.forEach(player => {
    if (player.velocity > 0) {
      player.x = player.x + player.velocity * Math.cos(player.direction);
      player.y = player.y + player.velocity * Math.sin(player.direction);
      wrapAroundScreen(player);
    }
    
    if (player.bulletActive) {
      player.bulletX = player.bulletX + bulletSpeed * Math.cos(player.bulletDirection);
      player.bulletY = player.bulletY + bulletSpeed * Math.sin(player.bulletDirection);
      if (player.bulletX > width || player.bulletX < 0 || player.bulletY > height || player.bulletY < 0) {
        player.bulletActive = false;
      }

      players.forEach(playerCheckCollision => {
        if (player.id != playerCheckCollision.id) {
          if (player.bulletX > (playerCheckCollision.x - 10) && player.bulletX < (playerCheckCollision.x + 10) && player.bulletY > (playerCheckCollision.y - 10) && player.bulletY < (playerCheckCollision.y + 10)) {
              removePlayer(playerCheckCollision.id); // There may be a bug here if two players are hit at once
              addPlayer(playerCheckCollision.id);
              increaseScore(player);
          }
        }
      });
    }
    
    for (let index = asteroids.length - 1; index >= 0; index--) {
      asteroidCheckCollision = asteroids[index];
      if (player.bulletActive) {
        if (doesCircleOverlapPolygon(asteroidCheckCollision.vertices, player.bulletX - asteroidCheckCollision.x, player.bulletY - asteroidCheckCollision.y)) {
          asteroids.splice(index, 1);
          increaseScore(player);
        }
      }

      const points = getShipPoints(player);
      for(let n = 0; n < points.length; n++) {
        const point = points[n];
        if (isPointInPolygon(asteroidCheckCollision.vertices, point.x - asteroidCheckCollision.x, point.y - asteroidCheckCollision.y))
        {
          removePlayer(player.id); // There may be a bug here if two players are hit at once
          addPlayer(player.id);
          break;
        }
      };
    }
  });

  function getShipPoints(player) {
    const angle1 = player.direction;
    const angle2 = getAngleOffset(player.direction, 0.75);
    const angle3 = getAngleOffset(player.direction, 1.0);
    const angle4 = getAngleOffset(player.direction, 1.25);

    let points = [];
    points.push({x: player.x + 10 * Math.cos(angle1), y: player.y + 10 * Math.sin(angle1)})
    points.push({x: player.x + 10 * Math.cos(angle2), y: player.y + 10 * Math.sin(angle2)})
    points.push({x: player.x + 5 * Math.cos(angle3), y: player.y + 5 * Math.sin(angle3)})
    points.push({x: player.x + 10 * Math.cos(angle4), y: player.y + 10 * Math.sin(angle4)})
    return points;
  }
    
  asteroids.forEach(asteroid => {
    if (asteroid.velocity > 0) {
    asteroid.x = asteroid.x + asteroid.velocity * Math.cos(asteroid.direction);
      asteroid.y = asteroid.y + asteroid.velocity * Math.sin(asteroid.direction);
      wrapAroundScreen(asteroid);
    }
  });
  _io.emit('move', {players, asteroids, highScore});
}

function doesCircleOverlapPolygon(vertices, testx, testy) {
  const numSides = 10; // assume circle approximates to a decagon (10 sides)
  points = [];
  for (let angle = 0; angle < 2.0 * Math.PI; angle+=((2.0 * Math.PI) / numSides)) {
    points.push({x: testx + bulletRadius * Math.cos(angle), 
                 y: testy + bulletRadius * Math.sin(angle)});
  }
  let doesOverlap = false;
  for (let i = 0; !doesOverlap && i < points.length; i++) {
    doesOverlap = isPointInPolygon(vertices, points[i].x, points[i].y);
  }
  return doesOverlap;
}

// Approach from https://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon/2922778#2922778
function isPointInPolygon(vertices, testx, testy) {
  var minX = vertices[0].x, maxX = vertices[0].x;
  var minY = vertices[0].y, maxY = vertices[0].y;
  for (var n = 1; n < vertices.length; n++) {
    var q = vertices[n];
    minX = Math.min(q.x, minX);
    maxX = Math.max(q.x, maxX);
    minY = Math.min(q.y, minY);
    maxY = Math.max(q.y, maxY);
  }

  if (testx < minX || testx > maxX || testy < minY || testy > maxY) {
    return false;
  }

  let isInside = false;
  for (let i = 0, j = vertices.length-1; i < vertices.length; j = i, i++) {
    if (((vertices[i].y > testy) != (vertices[j].y > testy))) {
      if (testx < (((vertices[j].x-vertices[i].x) * (testy-vertices[i].y) / (vertices[j].y-vertices[i].y)) + vertices[i].x)) {
        isInside = !isInside;
      }
    }
  }
  return isInside;
}
  
function increaseScore(player) {
  player.score++;
  if (player.score > highScore.score) {
    highScore.name = player.name;
    highScore.score = player.score;
  }
}

function removePlayer(id) {
  players.splice(players.findIndex(i => i.id === id), 1);
  if (players.length == 0) {
    clearInterval(intervalId);
  }
}
  
function wrapAroundScreen(body) {
  if (body.x > width) {
    body.x -= width;
  } else if (body.x < 0) {
    body.x += width;
  }
  if (body.y > height) {
    body.y -= height;
  } else if (body.y < 0) {
    body.y += height;
  }
}

