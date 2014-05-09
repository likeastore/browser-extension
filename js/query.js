;(function (window) {
	var app = window.app = window.app || {};

	function getSearchQuery() {
		var url = $.url();
		var query = url.fparam('q') || url.param('q');

		return query;
	}

	app.searchQuery = getSearchQuery;

})(window);
