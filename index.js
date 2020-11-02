var app = require('express')(),
  http = require('http').Server(app),
  io = require('socket.io')(http);

const refreshInterval = 50;
let players = [];

function addPlayer(id) {
  if (players.length == 0) {
    setTimeout(() => updateState(), refreshInterval);
  }
  players.push({id: id, x: 320, y: 240, direction: 2.0 * Math.PI * Math.random(), velocity: 1, firing: false});
}

function updateState() {
  players.forEach(player => {
    if (player.velocity > 0) {
      player.x = player.x + player.velocity * Math.cos(player.direction);
      player.y = player.y + player.velocity * Math.sin(player.direction);
      if (player.x > 640){
        player.x -= 640;
      } else if (player.x < 0) {
        player.x += 640;
      }
      if (player.y > 480){
        player.y -= 480;
      } else if (player.y < 0) {
        player.y += 480;
      }
      
    }

    // console.log(JSON.stringify(player));
  });

  io.emit('move', players);
  setTimeout(() => updateState(), refreshInterval);
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/phone.html');
});

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

  /*
  socket.on('keypress'), function (msg) {
    socket.broadcast.emit('keypress');
  } */

  socket.on('keydown', function (msg) {
    const player = players.find(player => player.id == socket.id)
    switch(msg.keyCode) {
      case 37: // Left
        player.direction = getAngleOffset(player.direction, 0.1);
        break;
      case 39: // Right
        player.direction = getAngleOffset(player.direction, -0.1);
        break;
    }
    // socket.broadcast.emit('keydown', msg);
  });

  socket.on('stop', function () {
    socket.broadcast.emit('stop');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
