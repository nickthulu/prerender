const server = require('./lib/server');

module.exports = (options = {}) => {
	server.init(options);
	server.onRequest = server.onRequest.bind(server);

	if( options.plugins && Array.isArray(options.plugins) ) {
		options.plugins.forEach(plugin => server.use(plugin))
	}

	return server;
};
