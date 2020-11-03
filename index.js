const app = require('express')(),
      http = require('http').Server(app),
      io = require('socket.io')(http);

const refreshInterval = 50;
let players = [];

function getRandomColor() {
  const letters = '08F'; // 3 * 3 * 3 = 27 possible colours
  let color = '#';
  for (let i = 0; i < 3; i++) { // Keep it simple to #08F format
    color += letters[Math.floor(Math.random() * 3)];
  }
  return color;
}

function addPlayer(id) {
  if (players.length == 0) {
    setInterval(() => updateState(), refreshInterval);
  }
  players.push({id: id, x: 320, y: 240, direction: 2.0 * Math.PI * Math.random(), velocity: 1, firing: false, color: getRandomColor(), bulletActive: false, bulletX: 0, bulletY: 0, bulletDirection: 0});
}

function updateState() {
  players.forEach(player => {
    if (player.velocity > 0) {
      player.x = player.x + player.velocity * Math.cos(player.direction);
      player.y = player.y + player.velocity * Math.sin(player.direction);
      wrapAroundScreen(player);
    }

    if (player.bulletActive) {
      player.bulletX = player.bulletX + 3.0 * Math.cos(player.bulletDirection);
      player.bulletY = player.bulletY + 3.0 * Math.sin(player.bulletDirection);
      if (player.bulletX > 640 || player.bulletX < 0 || player.bulletY > 480 || player.bulletY < 0) {
        player.bulletActive = false;
      }
    }
  });

  io.emit('move', players);
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/phone.html');
});

function wrapAroundScreen(player) {
  if (player.x > 640) {
    player.x -= 640;
  } else if (player.x < 0) {
    player.x += 640;
  }
  if (player.y > 480) {
    player.y -= 480;
  } else if (player.y < 0) {
    player.y += 480;
  }
}

function getAngleOffset(direction, offset) {
  newDirection = direction + offset * Math.PI;
  while (newDirection > (2 * Math.PI)) {
    newDirection -= (2 * Math.PI);
  }
  return newDirection;
}

io.on('connection', function(socket){
  addPlayer(socket.id);
  console.log(`Client ${socket.id} connected`);

  socket.on('keydown', function (msg) {
    const player = players.find(player => player.id == socket.id)
    switch(msg.keyCode) {
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
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected because ${reason}`);
    // remove player from players array
    players.splice(players.findIndex(i => i.id === socket.id), 1);
  });

  socket.on('stop', function () {
    socket.broadcast.emit('stop');
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log(`listening on *:${process.env.PORT || 3000}`);
});
