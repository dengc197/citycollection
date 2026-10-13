var c = document.getElementById('poster');
var ctx = c.getContext('2d');
c.width = 1080;
c.height = 1920;
ctx.scale(2, 2);

var mid = 270;
var img1 = new Image();
var img2 = new Image();
var img3 = new Image();
var loaded = 0;

function ok() {
  loaded = loaded + 1;
  if (loaded == 3) {
    start();
  }
}

img1.onload = ok;
img2.onload = ok;
img3.onload = ok;
img1.src = 'assets/mosaic.jpg';
img2.src = 'assets/strip.jpg';
img3.src = 'assets/slider.png';

function fit() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  var cw = h * 9 / 16;
  var ch = h;
  if (cw > w) {
    cw = w;
    ch = w * 16 / 9;
  }
  c.style.width = cw + 'px';
  c.style.height = ch + 'px';
  c.style.marginTop = ((h - ch) / 2) + 'px';
}
window.onresize = fit;
fit();

function sm(t) {
  return t * t * (3 - 2 * t);
}

function getP(t) {
  if (t < 0.6) return 0;
  if (t < 3.6) return sm((t - 0.6) / 3);
  if (t < 4.4) return 1;
  if (t < 5.2) return 1 - sm((t - 4.4) / 0.8);
  if (t < 5.8) return 0;
  if (t < 6.8) return 0.42 * sm((t - 5.8) / 1);
  if (t < 8) return 0.42;
  if (t < 8.4) return 0.42 - 0.06 * sm((t - 8) / 0.4);
  if (t < 8.9) return 0.36;
  if (t < 10) return 0.36 + 0.64 * sm((t - 8.9) / 1.1);
  if (t < 10.6) return 1;
  if (t < 11.6) return 1 - sm((t - 10.6) / 1);
  return 0;
}

function spread(y, s) {
  var d = (s - y) / 520;
  if (d < 0) d = 0;
  if (d > 1) d = 1;
  return sm(d) * 205;
}

function tape(side, s) {
  var y;
  ctx.beginPath();
  if (side == 0) {
    ctx.moveTo(0, 0);
    for (y = 0; y <= 960; y = y + 6) {
      ctx.lineTo(mid - 40 - spread(y, s) + 1, y);
    }
    ctx.lineTo(0, 960);
  } else {
    ctx.moveTo(540, 0);
    for (y = 0; y <= 960; y = y + 6) {
      ctx.lineTo(mid + spread(y, s) + 41, y);
    }
    ctx.lineTo(540, 960);
  }
  ctx.closePath();
}

function word(txt, px, a, color) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = color;
  ctx.font = 'bold 118px "Chakra Petch", Impact, sans-serif';
  ctx.translate(px, 480 + ctx.measureText(txt).width / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(txt, 0, 0);
  ctx.restore();
}

function draw(t) {
  var p = getP(t);
  var s = 960 + 90 - p * 1140;
  var jam = 0;
  if (t > 6.9 && t < 8) jam = 1;
  var shake = 0;
  if (jam == 1) shake = Math.sin(t * 60) * 2.5;

  var a2 = 0.3;
  if (t > 5.4 && t < 6) a2 = 0.3 + 0.7 * (t - 5.4) / 0.6;
  if (t >= 6 && t < 11.2) a2 = 1;
  if (t >= 11.2 && t < 11.8) a2 = 1 - 0.7 * (t - 11.2) / 0.6;
  var a1 = 1.3 - a2;

  ctx.drawImage(img1, 0, 0, 540, 960);

  ctx.save();
  tape(0, s);
  ctx.fillStyle = '#0b0b0b';
  ctx.fill();
  ctx.clip();
  word('SMOOTH', 160, a1, '#f3efe4');
  ctx.restore();

  ctx.save();
  tape(1, s);
  ctx.fillStyle = '#a29f9a';
  ctx.fill();
  ctx.clip();
  word('STUCK', 500, a2, '#ffffff');
  ctx.restore();

  var y;
  for (y = 0; y < 960; y = y + 2) {
    var sp = spread(y, s);
    var mis = 0;
    if (jam == 1 && y > s && y < s + 110) {
      mis = 1 - (y - s) / 110;
    }
    ctx.drawImage(img2, 0, y + 20, 40, 2, mid - 40 - sp + mis * 3, y, 40, 2.4);
    ctx.drawImage(img2, 40, y + 20 + Math.round(mis * 10), 42, 2, mid + sp - mis * 3, y, 42, 2.4);
  }

  ctx.drawImage(img3, mid - 56 + shake, s - 30, 112, 237);
}

function start() {
  var t0 = new Date().getTime();
  setInterval(function () {
    var t = ((new Date().getTime() - t0) / 1000) % 12;
    draw(t);
  }, 30);
}
