const Datastore = require('nedb');

module.exports = function(options = {}) {
	if (!options.storage && !options.inMemoryOnly) {
		options.storage = require('./storage');
	}
	
	return new Datastore(options);
}
