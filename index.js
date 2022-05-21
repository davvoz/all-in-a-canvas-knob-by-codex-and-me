/* no scroll */
document.body.style.overflow = 'hidden';
/* crea un canvas verde e un context */
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(0, 0, canvas.width, canvas.height);
/* crea la funzione disegna : disegna una forma e se è chiusa la riempie con un colore , ha uno spessore e un colore di linea */
function draw(shape, fill, stroke, strokeWidth) {
  ctx.beginPath();
  ctx.moveTo(shape[0][0], shape[0][1]);
  for (var i = 1; i < shape.length; i++) {
    ctx.lineTo(shape[i][0], shape[i][1]);
  }
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}
/* crea una funzione disegna bottone : nome , funzione , isToggle , testo . Il bottone è un disegno sulla canvas con un hadler un testo una forma una posizione */
function drawButton(name, handler, isToggle, text) {
  var button = {
    name: name,
    handler: handler,
    isToggle: isToggle,
    text: text,
    shape: [
      [0, 0],
      [100, 0],
      [100, 50],
      [0, 50]
    ],
    pos: [0, 0],
    isDown: false
  };
  button.draw = function() {
    draw(this.shape, this.isDown ? 'red' : 'white', 'black', 2);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(this.text, this.shape[0][0] + 10, this.shape[0][1] + 30);
  };
  button.hitTest = function(x, y) {
    return x >= this.shape[0][0] && x <= this.shape[1][0] && y >= this.shape[0][1] && y <= this.shape[2][1];
  };
  button.setPos = function(x, y) {
    this.pos = [x, y];
    for (var i = 0; i < this.shape.length; i++) {
      this.shape[i][0] += x;
      this.shape[i][1] += y;
    }
  };
  return button;
}
/* crea una zona bianca sopra */
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, 100);
/* crea una zona grigio chiaro sul resto della canvas */
ctx.fillStyle = '#eee';
ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
/* disegna le diagonali della zona sotto */
ctx.strokeStyle = '#aaa';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(0, 100);
ctx.lineTo(canvas.width, canvas.height);
ctx.moveTo(canvas.width, 100);
ctx.lineTo(0, canvas.height);
ctx.stroke();
/* metti un bordo nero grosso alla canvas */
ctx.strokeStyle = 'black';
ctx.lineWidth = 5;
ctx.strokeRect(0, 0, canvas.width, canvas.height);
/* centra la canvas nello schermo */
canvas.style.position = 'absolute';
canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';
/* Disegnando sulla canvas :dividi la parte funzionale(il rettangolo bianco)in 2 parti a  lunghezza variabile. A sinistra c'è il titolo , a destra 2 bottoni */
var title = 'My Drawing App';
var buttons = [
  drawButton('Clear', function() {
    ctx.clearRect(0, 100, canvas.width, canvas.height - 100);
  }, false, 'Clear'),
  drawButton('Toggle', function() {
    this.isDown = !this.isDown;
  }, true, 'Toggle')
];
/* disegna titolo e bottoni */
ctx.font = '30px Arial';
ctx.fillStyle = 'black';
ctx.fillText(title, 10, 70);
for (var i = 0; i < buttons.length; i++) {
  buttons[i].setPos(canvas.width - 110 * buttons.length + i * 110, 10);
  buttons[i].draw();
}
/* modifica drawButton , onhover manina */
canvas.onmousemove = function(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].hitTest(x, y)) {
      canvas.style.cursor = 'pointer';
      return;
    }
  }
  canvas.style.cursor = 'default';
};
/* crea la funzione disegna knob */
function drawKnob(name, handler, value, min, max, text) {
  var knob = {
    name: name,
    handler: handler,
    value: value,
    min: min,
    max: max,
    text: text,
    shape: [
      [0, 0],
      [50, 0],
      [50, 50],
      [0, 50]
    ],
    pos: [0, 0],
    isDown: false
  };
  knob.draw = function() {
    draw(this.shape, 'white', 'black', 2);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(this.text, this.shape[0][0] + 10, this.shape[0][1] + 30);
    ctx.beginPath();
    ctx.arc(this.shape[0][0] + 25, this.shape[0][1] + 25, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.shape[0][0] + 25, this.shape[0][1] + 25);
    ctx.lineTo(this.shape[0][0] + 25 + 20 * Math.cos(this.value * 2 * Math.PI), this.shape[0][1] + 25 + 20 * Math.sin(this.value * 2 * Math.PI));
    ctx.stroke();
  };
  knob.hitTest = function(x, y) {
    return x >= this.shape[0][0] && x <= this.shape[1][0] && y >= this.shape[0][1] && y <= this.shape[2][1];
  };
  knob.setPos = function(x, y) {
    this.pos = [x, y];
    for (var i = 0; i < this.shape.length; i++) {
      this.shape[i][0] += x;
      this.shape[i][1] += y;
    }
  };
  return knob;
}
/* disegna un knob sulla destra di clear */
var knobs = [
  drawKnob('Size', function(value) {
    this.value = value;
  }, 0.5, 0, 1, 'Size')
];
knobs[0].setPos(canvas.width - 110 * buttons.length - 60, 10);
knobs[0].draw();
/* tutto quello che hai disegnato finora si chiama gui e devi farla vedere sempre , anche durante un eventuale animazione */
function drawGui() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, 100);
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(canvas.width, 100);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(title, 10, 70);
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  for (var i = 0; i < knobs.length; i++) {
    knobs[i].draw();
  }
}
/* funzione disegna pallina : disegna una pallina di vari colori in base alla sua elasticità e durezza */
function drawBall(x, y, radius, elasticity, hardness) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'hsl(' + Math.round(elasticity * 120) + ', 100%, 50%)';
  ctx.fill();
  ctx.strokeStyle = 'hsl(' + Math.round(hardness * 120) + ', 100%, 50%)';
  ctx.lineWidth = 2;
  ctx.stroke();
}
/* quando clicco toggle , al passaggio del mouse disegno una pallina random per 5 secondi solo nella parte grigia */
var isDrawing = false;
var startTime = 0;
var endTime = 0;
canvas.onmousedown = function(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].hitTest(x, y)) {
      buttons[i].isDown = true;
      buttons[i].handler();
      if (buttons[i].isToggle) {
        isDrawing = !isDrawing;
        if (isDrawing) {
          startTime = new Date().getTime();
        } else {
          endTime = new Date().getTime();
        }
      }
      drawGui();
      return;
    }
  }
  for (var i = 0; i < knobs.length; i++) {
    if (knobs[i].hitTest(x, y)) {
      knobs[i].isDown = true;
      return;
    }
  }
};
canvas.onmouseup = function(e) {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].isDown = false;
  }
  for (var i = 0; i < knobs.length; i++) {
    knobs[i].isDown = false;
  }
  drawGui();
};
canvas.onmousemove = function(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  for (var i = 0; i < knobs.length; i++) {
    if (knobs[i].isDown) {
      knobs[i].value = (x - knobs[i].pos[0]) / 50;
      if (knobs[i].value < knobs[i].min) {
        knobs[i].value = knobs[i].min;
      }
      if (knobs[i].value > knobs[i].max) {
        knobs[i].value = knobs[i].max;
      }
      knobs[i].handler(knobs[i].value);
      drawGui();
      return;
    }
  }
  if (isDrawing && y > 100) {
    drawBall(x, y, knobs[0].value * 50, Math.random(), Math.random());
  }
};
/* ricordati di cambiare il colore e il testo e il colore al bottone in base allo stato */
buttons[1].text = isDrawing ? 'Stop' : 'Start';
buttons[1].isDown = isDrawing;
/* il knob controlla LA DIMENSIONE DELLA PALLINA */
knobs[0].handler = function(value) {
  this.value = value;
};
/* SCRIVI COSE COERENTI NEI BOTTONI E FIXA TUTTO */
buttons[0].text = 'Clear';
buttons[1].text = isDrawing ? 'Stop' : 'Start';
buttons[1].isDown = isDrawing;
knobs[0].text = 'Size';
/* AGGIORNA LA GUI CON LE PARTI NUOVE E SPOSTA LA NUOVA SCRITTA IN MEZZO */
function drawGui() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, 100);
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(canvas.width, 100);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(title, 10, 70);
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  for (var i = 0; i < knobs.length; i++) {
    knobs[i].draw();
  }
  ctx.font = '30px Impact';
  ctx.fillStyle = 'black';
  ctx.fillText('Size: ' + Math.round(knobs[0].value * 50), 10, 40);
  ctx.fillText('Balls: ' + Math.round((endTime - startTime) / 1000 * 30), 10, 70);
}
/* elimina il counter ball */
function drawGui() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, 100);
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(canvas.width, 100);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(title, 10, 70);
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  for (var i = 0; i < knobs.length; i++) {
    knobs[i].draw();
  }
  ctx.font = '30px Impact';
  ctx.fillStyle = 'black';
  ctx.fillText('Size: ' + Math.round(knobs[0].value * 50), canvas.width / 2 - 100, 40);
}
/* quando clicco clear delle palline scendono dall'alto e rimalzano tra loro e dentro il rettangolo grigio , non possono uscire */
var balls = [];
var gravity = 0.1;
var friction = 0.9;
var bounce = 0.8;
var isDrawing = false;
var startTime = 0;
var endTime = 0;
canvas.onmousedown = function(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].hitTest(x, y)) {
      buttons[i].isDown = true;
      buttons[i].handler();
      if (buttons[i].isToggle) {
        isDrawing = !isDrawing;
        if (isDrawing) {
          startTime = new Date().getTime();
        } else {
          endTime = new Date().getTime();
        }
      }
      drawGui();
      return;
    }
  }
  for (var i = 0; i < knobs.length; i++) {
    if (knobs[i].hitTest(x, y)) {
      knobs[i].isDown = true;
      return;
    }
  }
};
canvas.onmouseup = function(e) {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].isDown = false;
  }
  for (var i = 0; i < knobs.length; i++) {
    knobs[i].isDown = false;
  }
  drawGui();
};
canvas.onmousemove = function(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  for (var i = 0; i < knobs.length; i++) {
    if (knobs[i].isDown) {
      knobs[i].value = (x - knobs[i].pos[0]) / 50;
      if (knobs[i].value < knobs[i].min) {
        knobs[i].value = knobs[i].min;
      }
      if (knobs[i].value > knobs[i].max) {
        knobs[i].value = knobs[i].max;
      }
      knobs[i].handler(knobs[i].value);
      drawGui();
      return;
    }
  }
  if (isDrawing && y > 100) {
    drawBall(x, y, knobs[0].value * 50, Math.random(), Math.random());
  }
};
/* crea un animazione con delle palline che ribalzano nella parte grigia */
function drawFrame() {
  ctx.clearRect(0, 100, canvas.width, canvas.height - 100);
  for (var i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += gravity;
    balls[i].vx *= friction;
    balls[i].vy *= friction;
    if (balls[i].x + balls[i].radius > canvas.width) {
      balls[i].x = canvas.width - balls[i].radius;
      balls[i].vx *= -bounce;
    }
    if (balls[i].x - balls[i].radius < 0) {
      balls[i].x = balls[i].radius;
      balls[i].vx *= -bounce;
    }
    if (balls[i].y + balls[i].radius > canvas.height) {
      balls[i].y = canvas.height - balls[i].radius;
      balls[i].vy *= -bounce;
    }
    if (balls[i].y - balls[i].radius < 100) {
      balls[i].y = 100 + balls[i].radius;
      balls[i].vy *= -bounce;
    }
    for (var j = i + 1; j < balls.length; j++) {
      var dx = balls[j].x - balls[i].x;
      var dy = balls[j].y - balls[i].y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var minDist = balls[i].radius + balls[j].radius;
      if (dist < minDist) {
        var angle = Math.atan2(dy, dx);
        var tx = balls[i].x + Math.cos(angle) * minDist;
        var ty = balls[i].y + Math.sin(angle) * minDist;
        var ax = (tx - balls[j].x) * bounce;
        var ay = (ty - balls[j].y) * bounce;
        balls[i].vx -= ax;
        balls[i].vy -= ay;
        balls[j].vx += ax;
        balls[j].vy += ay;
      }
    }
    drawBall(balls[i].x, balls[i].y, balls[i].radius, balls[i].elasticity, balls[i].hardness);
  }
  drawGui();
  requestAnimationFrame(drawFrame);
}
/* cancella clear */
buttons.splice(0, 1);
/* fixa */
function drawGui() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, 100);
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(canvas.width, 100);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(title, 10, 70);
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  for (var i = 0; i < knobs.length; i++) {
    knobs[i].draw();
  }
  ctx.font = '30px Impact';
  ctx.fillStyle = 'black';
  ctx.fillText('Size: ' + Math.round(knobs[0].value * 50), canvas.width / 2 - 100, 40);
}