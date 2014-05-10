;(function (window) {
	var api = 'https://api.mixpanel.com';
	var app = window.app = window.app || {};

	var mixpanel = {};

	function init(token, user) {
		mixpanel.token = token;
		mixpanel.distinct_id = user.email;
	}

	function track(event) {
		var payload = {
			event: event,
			properties: {
				distinct_id: mixpanel.distinct_id,
				token: mixpanel.token,
				browser: 'Chrome'
			}
		};

		var data = window.base64(JSON.stringify(payload));

		var url = api + '/track?data=' + data;
		$.get(url);
	}

	app.analytics = {
		init: init,
		track: track
	};

})(window);