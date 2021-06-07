const app = require('express')(),
      express = require('express'),
      http = require('http').Server(app),
      io = require('socket.io')(http),
      game = require('./gameLogic.js'),
      axios = require('axios').default;

function getMostPreciseLocation(geoResponse) {
  let location = 'Unknown location';
  if (geoResponse.city) {
    location == geoResponse.city;
  } else if (geoResponse.region_name) {
    location = geoResponse.region_name;
  } else if (geoResponse.country_name) {
    location = geoResponse.country_name;
  } else if (geoResponse.ip) {
    location = geoResponse.ip;
  }
  return location;
}

io.on('connection', function(socket){

  const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3];
  console.log(ip);

  let location = '';
  axios.get(`https://tools.keycdn.com/geo.json?host=${ip}`, {
    headers: {
      'User-Agent': 'keycdn-tools:https://asteroid-party.herokuapp.com'
    }
  })
  .then(function (response) {
    // handle success
    const geoResponse = response.data.data.geo;
    location = getMostPreciseLocation(geoResponse);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    game.addPlayer(socket.id, io, location);
    console.log(`Client ${socket.id} connected`);
  
    socket.on('keydown', function (msg) {
      game.processAction(socket.id, msg);
    });
  
    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected because ${reason}`);
      game.removePlayer(socket.id);
    });
  });
});

http.listen(process.env.PORT || 80, function(){
  console.log(`listening on *:${process.env.PORT || 80}`);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));
app.use('/favicon.ico', express.static('public/favicon.ico'));



