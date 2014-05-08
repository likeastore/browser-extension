;(function (window) {
	var app = window.app = window.app || {};

	function getSearchQuery() {
		var url = $.url();
		var query = url.param('q') || url.fparam('q');

		return query;
	}

	app.searchQuery = getSearchQuery;

})(window);
