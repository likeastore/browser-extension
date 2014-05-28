;(function (window) {
	var app = window.app = window.app || {};

	app.browser = {
		name: 'Safari',

		getUrl: function (url) {
			return safari.extension.baseURI + url;
		}
	};
})(window);