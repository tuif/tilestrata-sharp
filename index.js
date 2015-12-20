var sharp = require('sharp');

module.exports = function(fn) {
	return {
		name: 'sharp',
		transform: function(server, req, buffer, headers, callback) {
			var image;

			try { image = sharp(buffer); fn(image, sharp); }
			catch (err) { return callback(err); }

			image.toBuffer(function(err, buffer, info) {
				if (err) return callback(err);
				delete headers['content-type'];
				delete headers['Content-Type'];
				delete headers['content-length'];
				delete headers['Content-Length'];
				headers['content-type'] = 'image/' + info.format;
				headers['content-length'] = info.size;
				callback(null, buffer, headers);
			});
		}
	};
};
