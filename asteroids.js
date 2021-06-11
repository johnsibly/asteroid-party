/* eslint-disable no-console */
const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const game = require('./gameLogic');

io.on('connection', (socket) => {
  game.addPlayer(socket.id, io);
  console.log(`Client ${socket.id} connected`);

  socket.on('keydown', (msg) => {
    game.processAction(socket.id, msg);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected because ${reason}`);
    game.removePlayer(socket.id);
  });
});

http.listen(process.env.PORT || 80, () => {
  console.log(`listening on *:${process.env.PORT || 80}`);
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.use(express.static('public'));
app.use('/favicon.ico', express.static('public/favicon.ico'));
