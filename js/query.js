;(function (window) {
	var app = window.app = window.app || {};

	function getSearchQuery() {
		var params = getQueryParams();
		return params.q;
	}

	function getQueryParams() {
		var query = window.document.URL.replace('?', '').split(/&|#/);
		var obj = {};

		for (var i = 0; i < query.length; i++) {
			var param = query[i].split('=')[0];
			var value = query[i].split('=')[1];
			obj[param] = value;
		}

		return obj;
	}

	app.searchQuery = getSearchQuery;

})(window);
