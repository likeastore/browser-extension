;(function (window) {
	var app = window.app = window.app || {};

	app.browser = {
		name: 'Chrome',

		getUrl: function (url) {
			return app.rootUrl + '/' + url;
		}
	};
})(window);