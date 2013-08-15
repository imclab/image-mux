var getPixels = require('get-pixels'),
    ndarray = require('ndarray'),
    raf = require('raf-component'),
    savePixels = require('save-pixels'),
    cwise = require('cwise');

var processComponents = cwise({
  args: ["array", "array", "array", "array", "array"],
  body: function grey(or, og, ob, a, ir) {
      or = ir;
      og = ir;
      ob = ir;
      a = 255;
  }
});

module.exports = function(image, canvas, fps) {
    getPixels(image, function(err, px) {
        var r = ndarray(new Float32Array(px.size), px.shape.slice(0));
        var g = ndarray(new Float32Array(px.size), px.shape.slice(0));
        var b = ndarray(new Float32Array(px.size), px.shape.slice(0));
        processComponents(
            r.pick(-1, -1, 0),
            r.pick(-1, -1, 1),
            r.pick(-1, -1, 2),
            r.pick(-1, -1, 3),
            px.pick(-1, -1, 0));
        processComponents(
            g.pick(-1, -1, 0),
            g.pick(-1, -1, 1),
            g.pick(-1, -1, 2),
            g.pick(-1, -1, 3),
            px.pick(-1, -1, 1));
        processComponents(
            b.pick(-1, -1, 0),
            b.pick(-1, -1, 1),
            b.pick(-1, -1, 2),
            b.pick(-1, -1, 3),
            px.pick(-1, -1, 2));

        var ctx = canvas.getContext('2d');

        var img = [
            document.createElement('img'),
            document.createElement('img'),
            document.createElement('img')
        ];

        var can1 = savePixels(r, 'canvas');
        var can2 = savePixels(g, 'canvas');
        var can3 = savePixels(b, 'canvas');

        img[0].src = can1.toDataURL();
        img[1].src = can2.toDataURL();
        img[2].src = can3.toDataURL();

        function animate() {
            raf(animate);
            draw();
        }

        var frame = 0;
        var prev = Date.now();
        ctx.globalCompositeOperation = 'darken';
        function draw() {
            var curr = Date.now();
            var diff = curr - prev;
            prev = curr;
            frame += diff / 100;
            if (frame > 3) frame = 0;
            canvas.width = canvas.width;
            var a = Math.floor(frame);
            var b = Math.ceil(frame);
            if (a == b) {
                if (a == 3) a = 0;
                ctx.globalAlpha = 1;
                ctx.drawImage(img[a], 0, 0);
                return;
            }
            ctx.globalAlpha = (b - frame);
            ctx.drawImage(img[a], 0, 0);
            ctx.globalAlpha = (frame - a);
            if (b == 3) {
                ctx.drawImage(img[0], 0, 0);
            } else {
                ctx.drawImage(img[b], 0, 0);
            }
        }

        animate();
    });
};
