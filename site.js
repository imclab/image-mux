var demux = require('./demux');

var canvas = document.body.appendChild(document.createElement('canvas'));

canvas.width = 425;
canvas.height = 200;

document.body.appendChild(document.createElement('h3')).innerHTML = 'image-mux';
demux('foo3.png', canvas, 10);
document.body.appendChild(document.createElement('img')).src = 'foo3.png';
