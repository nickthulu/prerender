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
		".ico"
	],
	appendBlockedResources: []
}

module.exports = (options = {}) => {
	const opts = Object.assign({}, defaultOptions, options)

	return {
		tabCreated: (req, res, next) => {
			req.prerender.tab.Network.setBlockedURLs({
				urls: opts.blockedResources.concat(opts.appendBlockedResources)
			}).then(() => {
				next();
			}).catch(() => {
				res.send(504);
			});
		}
	}
};
