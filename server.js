#!/usr/bin/env node
const app = require('express')()
const bodyParser = require('body-parser')
const compression = require('compression')
const status = require('express-status-monitor')
const port = 3000

app.disable('x-powered-by')
app.use(compression())
app.use(status())

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
		require('prerender-memory-cache'),
	]
}).start()

app.get('*', prerender.onRequest)

// dont check content-type and just always try to parse body as json
app.post('*', bodyParser.json({ type: () => true }), prerender.onRequest)

app.listen(port, () => console.log(`Server accepting requests on port ${port}`))
