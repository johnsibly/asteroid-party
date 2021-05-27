let actionRepeatInterval = null;
document.getElementById("button_left").addEventListener("touchstart", e => handleKeyOrMouseDown(e, 37));
document.getElementById("button_right").addEventListener("touchstart", e => handleKeyOrMouseDown(e, 39));
document.getElementById("button_fire").addEventListener("touchstart", e => handleKeyOrMouseDown(e, 32));
document.getElementById("button_left").addEventListener("touchend", e => handleKeyOrMouseUp(e, 37));
document.getElementById("button_right").addEventListener("touchend", e => handleKeyOrMouseUp(e, 39));
document.getElementById("button_fire").addEventListener("touchend", e => handleKeyOrMouseUp(e, 32));

document.getElementById("button_left").addEventListener("mousedown", e => handleKeyOrMouseDown(e, 37));
document.getElementById("button_right").addEventListener("mousedown", e => handleKeyOrMouseDown(e, 39));
document.getElementById("button_fire").addEventListener("mousedown", e => handleKeyOrMouseDown(e, 32));
document.getElementById("button_left").addEventListener("mouseup", e => handleKeyOrMouseUp(e, 37));
document.getElementById("button_right").addEventListener("mouseup", e => handleKeyOrMouseUp(e, 39));
document.getElementById("button_fire").addEventListener("mouseup", e => handleKeyOrMouseUp(e, 32));
document.addEventListener('keydown', event => handleKeyOrMouseDown(event, event.keyCode));
document.addEventListener('keyup', e => handleKeyOrMouseUp(e, e.keyCode));

const socket = io(),
c=document.getElementById("canvas"),
ctx=c.getContext("2d");
ctx.strokeStyle = 'white';

let currrentKeyPressedDown = null;

function handleKeyOrMouseDown(e, keyCode) {
  if (typeof e.preventDefault == 'function') { 
    e.preventDefault();
  }
  currrentKeyPressedDown = keyCode;
  socket.emit('keydown', { keyCode: currrentKeyPressedDown });
  if (!actionRepeatInterval) {
    actionRepeatInterval = setInterval(() => socket.emit('keydown', { keyCode: currrentKeyPressedDown }), 100);
  }
}

function handleKeyOrMouseUp(e, keyCode) {
  currrentKeyPressedDown = null;
  if (typeof e.preventDefault == 'function') { 
    e.preventDefault();
  }
  if (actionRepeatInterval) {
    clearInterval(actionRepeatInterval);
    actionRepeatInterval = null;
  } 
}

function getAngleOffset(direction, offset) {
newDirection = direction + offset * Math.PI;
  while (newDirection > (2 * Math.PI)) {
    newDirection -= (2 * Math.PI);
  }
  return newDirection;
}

socket.on('move', function(state){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  state.players.forEach(player => {
    ctx.fillStyle = player.color;
    ctx.beginPath();

    const angle1 = player.direction;
    const angle2 = getAngleOffset(player.direction, 0.75);
    const angle3 = getAngleOffset(player.direction, 1.0);
    const angle4 = getAngleOffset(player.direction, 1.25);

    ctx.moveTo(player.x + 10 * Math.cos(angle1), player.y + 10 * Math.sin(angle1));
    ctx.lineTo(player.x + 10 * Math.cos(angle2), player.y + 10 * Math.sin(angle2));
    ctx.lineTo(player.x + 5 * Math.cos(angle3), player.y + 5 * Math.sin(angle3));
    ctx.lineTo(player.x + 10 * Math.cos(angle4), player.y + 10 * Math.sin(angle4));
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    if (player.bulletActive) {
      ctx.beginPath();
      ctx.arc(player.bulletX, player.bulletY, 3, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (player.color === '#000') { // ensure text is not black on black
      ctx.fillStyle = '#FFF';
    }
    const playerName = player.id === socket.id ? `${player.name} - You` : player.name;
    ctx.fillText(`${playerName} [${player.score}]`, player.x, player.y - 20);
  });

  state.asteroids.forEach(asteroid => {
    ctx.beginPath();
    ctx.moveTo(asteroid.x + asteroid.vertices[0].x, asteroid.y + asteroid.vertices[0].y);
    let angle = (2.0 * Math.PI) / asteroid.vertices.length;
    for (let vertex = 1; vertex < asteroid.vertices.length; vertex++) {
      ctx.lineTo(asteroid.x + asteroid.vertices[vertex].x, asteroid.y + asteroid.vertices[vertex].y);
    }
    ctx.closePath();
    ctx.stroke();
  });

  if (state.highScore.score > 0) {
    document.getElementById('highScore').innerText = `High score: ${state.highScore.name} scored ${state.highScore.score} from ${state.highScore.location}`;
  } else {
    document.getElementById('highScore').innerText = '';
  }
  document.getElementById('highScore').innerText += '\n- - - - - - - - - - - - - - - - - - - - - - - - \nPlayers connected:';
  state.players.forEach(player => {
    document.getElementById('highScore').innerText += `\n${player.name} from ${player.location}`;
  })
});

socket.on('pong', (latency) => {
  const now = new Date();
  const latencyString = `Latency ${latency}ms at ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  console.log(latencyString);
  document.getElementById('latency').innerText = latencyString
});