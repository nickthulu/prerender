#!/usr/bin/env node
const app = require('express')()
const bodyParser = require('body-parser')
const compression = require('compression')
const status = require('express-status-monitor')

const cacheManager = require('cache-manager')
const S3Cache = require('cache-manager-s3')
const PrerenderCacheManagerGlue = require('prerender-cache-manager-glue')

const port = 3000

app.disable('x-powered-by')
app.use(compression())
app.use(status())

let cachePlugin
if( !('S3_ACCESS_KEY' in process.env) || !process.env.S3_ACCESS_KEY ) {
	cachePlugin = require('prerender-memory-cache')
	console.log('No S3 key detected, using memory cache')
} else {
	cachePlugin = new S3Cache({
		accessKey: process.env.S3_ACCESS_KEY,
		secretKey: process.env.S3_SECRET_KEY,
		bucket: process.env.S3_BUCKET,
	})
}

const prerenderCache = new PrerenderCacheManagerGlue(
	cacheManager.caching({
		store: cachePlugin,
		ttl: 3600,
	})
)

// Prerenderer
const prerender = require('prerender')({
	chromeLocation: process.env.CHROME_BIN,
	chromeFlags: [
		'--no-sandbox',
		'--remote-debugging-port=9222',
		'--headless',
		'--disable-gpu',
		'--disable-translate',
		'--disable-extensions',
		'--hide-scrollbars',
	],
	logRequests: true,
	plugins: [
		require('prerender/plugins/whitelist'),
		require('prerender/plugins/removeScriptTags'),
		require('prerender/plugins/httpHeaders'),
		require('prerender/plugins/blockResources')(),
		prerenderCache,
	]
}).start()

app.get('*', prerender.onRequest)

// dont check content-type and just always try to parse body as json
app.post('*', bodyParser.json({ type: () => true }), prerender.onRequest)

app.listen(port, () => console.log(`Server accepting requests on port ${port}`))
