var demux = require('./demux');

var canvas = document.body.appendChild(document.createElement('canvas'));

canvas.width = 425;
canvas.height = 200;

demux('foo3.png', canvas, 10);
