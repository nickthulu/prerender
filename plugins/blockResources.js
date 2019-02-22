const defaultOptions = {
	blockedResources: [
		"google-analytics.com",
		"api.mixpanel.com",
		"fonts.googleapis.com",
		"stats.g.doubleclick.net",
		"mc.yandex.ru",
		"use.typekit.net",
		"beacon.tapfiliate.com",
		"js-agent.newrelic.com",
		"api.segment.io",
		"woopra.com",
		"static.olark.com",
		"static.getclicky.com",
		"fast.fonts.com",
		"youtube.com/embed",
		"cdn.heapanalytics.com",
		"googleads.g.doubleclick.net",
		"pagead2.googlesyndication.com",
		"fullstory.com/rec",
		"navilytics.com/nls_ajax.php",
		"log.optimizely.com/event",
		"hn.inspectlet.com",
		"tpc.googlesyndication.com",
		"partner.googleadservices.com",
		".ttf",
		".eot",
		".otf",
		".woff",
		".png",
		".gif",
		".tiff",
		".pdf",
		".jpg",
		".jpeg",
		".ico",
	],
	appendBlockedResources: []
}

module.exports = (options = {}) => {
	const opts = Object.assign({}, defaultOptions, options)
	const blockedResources = opts.blockedResources.concat(opts.appendBlockedResources)

	return {
		tabCreated: (req, res, next) => {
			// Support different versions of the Chrome API
			const debuggerProtocol = ({interceptionId, request}) => {
				const continueOptions = {interceptionId}
				if( blockedResources.some(substring => request.url.includes(substring)) ) {
					continueOptions.errorReason = 'Aborted'
				}
				req.prerender.tab.Network.continueInterceptedRequest(continueOptions)
			}

			if( 'setRequestInterception' in req.prerender.tab.Network ) {
				req.prerender.tab.Network.setRequestInterception({ patterns: [{urlPattern: '*'}] })
					.then(() => next())
					.catch(e => {
						console.error('Could not enable request interception:', e)
						return Promise.reject(e)
					})

				req.prerender.tab.Network.requestIntercepted(debuggerProtocol)
			} else if( 'setRequestInterceptionEnabled' in req.prerender.tab.Network ) {
				req.prerender.tab.Network.setRequestInterceptionEnabled({enabled: true, patterns: [{urlPattern: '*'}]})
					.then(() => next())
					.catch(e => {
						console.error('Could not enable request interception:', e)
						return Promise.reject(e)
					})

				req.prerender.tab.Network.requestIntercepted(debuggerProtocol)
			} else {
				console.log('blockResources plugin not able to work-- unfamiliar Chrome API version!')
				next()
			}
		}
	}
};
