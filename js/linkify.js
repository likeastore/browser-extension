;(function (window) {
	var app = window.app = window.app || {};

	app.linkify = {
		init: function () {
			Mark.pipes.linkify = function (input) {
				var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

				var result = input.replace(urlRegex, function (url) {
					return '<a href="' + url + '" target="_blank">' + url + '</a>';
				});

				return result;
			};
		}
	};

})(window);
