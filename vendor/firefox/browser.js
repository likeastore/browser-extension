;(function (window) {
	var app = window.app = window.app || {};

	app.browser = {
		name: 'Firefox',

		getUrl: function (url) {
			return app.rootUrl + '/' + url;
		}
	};
})(window);