# prerender-express-fork

Prerender is a service that uses Headless Chrome to render HTML, screenshots, PDFs, and HAR files out of any web page. The Prerender route takes the URL and loads it in Headless Chrome(ium), waits for the page to finish loading by waiting for the network to be idle, and then returns your content.

This fork has reformatted the Prerender service to function as an Express service, allowing for interoperability with other Express middlewares.

##### The quickest way to run your own prerender server:

```bash
$ npm install prerender express
```
##### server.js
```js
const app = require('express')()
const prerender = require('prerender')().start()
app.any('*', prerender.onRequest)
app.listen(3000, () => console.log(`Server accepting requests on port ${port}`))
```
##### test it:
```bash
curl http://localhost:3000/?url=https://www.example.com/
```

# Examples

See the [examples/server.js](./examples/server.js) file for an example of a more complete server with a health dashboard at /status using [express-status-monitor](https://www.npmjs.com/package/express-status-monitor).

View [Prerender's original documentation](https://github.com/prerender/prerender) for more details. This Readme will contain only differences from the original documentation.

# Usage in Docker

This project can be used in Docker, but it should be noted:

Chromium and related projects rely heavily on shared memory to operate! Docker's default /dev/shm allocation is only 64MB, which may lead to core dumps and crashes if your page is hard to render or you get multiple requests.

To give Prerender more shared memory, look at the `--shm-size` flag, which I would recommend setting to at least `256m`.

Docker Swarm does not have support for granular shm size like this. To work around this, you must bind-mount `/dev/shm` into the container to give it full access to your shared memory.

## Plugins

All plugins are now under the `plugins` directory. When requiring in a particular plugin, you can do that like so:
```js
const whitelistPlugin = require('prerender/plugins/whitelist')
```

View the list of built-in plugins [here](./plugins).

### blockResources

This plugin is now a function, rather than just an object.

When creating the plugin, you can include additional domains to block:

```js
const prerender = require('prerender')({
	plugins: [
		require('prerender/plugins/blockResources')({
			appendBlockedResources: [
				'amazon-such-and-such.com',
			]
		}),
	]
}).start()
```

Or you can replace the list entirely if it's too restrictive for you:

```js
const prerender = require('prerender')({
	plugins: [
		require('prerender/plugins/blockResources')({
			blockedResources: [
				'only-this-bad-host.com',
			]
		}),
	]
}).start()

```
