;(function (window) {
	var app = window.app = window.app || {};

	app.browser = {
		name: 'Firefox',

		getUrl: function (url) {
			throw new Error('not implemented');
		}
	};
})(window);