all: site.bundle.js

site.bundle.js: index.js site.js demux.js package.json
	browserify site.js > site.bundle.js
