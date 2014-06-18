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
				browser: app.browser.name
			}
		};

		var data = window.base64(JSON.stringify(payload));
		var url = api + '/track?data=' + data;

		$.get(url);
	}

	function increment(property) {
		var inc = {};
		inc[property] = 1;

		var payload = {
			$token: mixpanel.token,
			$distinct_id: mixpanel.distinct_id,
			$add: inc
		};

		var data = window.base64(JSON.stringify(payload));
		var url = api + '/engage?data=' + data;

		$.get(url);
	}

	app.analytics = {
		init: init,
		track: track,
		increment: increment
	};

})(window);