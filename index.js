var queue = require('queue-async'),
    glob = require('glob'),
    cwise = require('cwise'),
    ndarray = require('ndarray'),
    getPixels = require('get-pixels'),
    savePixels = require('save-pixels');

var q = queue(10);

['data/20130815_1658.png',
'data/20130815_1718.png',
'data/20130815_1738.png'
].forEach(function(f) {
    q.defer(getPixels, f);
});

var processComponents = cwise({
  args: ["array", "array", "array", "array",  "array", "array", "array"],
  body: function grey(or, og, ob, a, ir, ig, ib) {
      or = ir;
      og = ig;
      ob = ib;
      a = 255;
  }
});

q.awaitAll(function(err, results) {
    var a = results[0],
        b = results[1],
        c = results[2];

    var out = ndarray(new Float32Array(a.size), a.shape.slice(0));
    var in_shape = a.shape.slice(0);
    in_shape.pop();
    processComponents(
        out.pick(-1, -1, 0),
        out.pick(-1, -1, 1),
        out.pick(-1, -1, 2),
        out.pick(-1, -1, 3),
        a.pick(-1, -1, 0),
        b.pick(-1, -1, 0),
        c.pick(-1, -1, 0));

    savePixels(out, 'png').pipe(process.stdout);
});
