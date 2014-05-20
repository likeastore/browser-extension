;(function (window, self) {
	var app = window.app = window.app || {};

	app.browser = {
		name: 'Firefox',

		getUrl: function (url) {
			return self.options.rootUrl + url;
		}
	};
})(window, self);