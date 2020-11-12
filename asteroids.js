const app = require('express')(),
      express = require('express');
      http = require('http').Server(app),
      io = require('socket.io')(http),
      game = require('./gameLogic.js');

io.on('connection', function(socket){
  game.addPlayer(socket.id, io);
  console.log(`Client ${socket.id} connected`);

  socket.on('keydown', function (msg) {
    game.processAction(socket.id, msg);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected because ${reason}`);
    game.removePlayer(socket.id);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log(`listening on *:${process.env.PORT || 3000}`);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));
app.use('/favicon.ico', express.static('public/favicon.ico'));



