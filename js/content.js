;(function () {
	var app = window.app = window.app || {};
	var api = 'https://app.likeastore.com/api';

	var MainView = function () {
		var self = this;
		self.$ = $('<div class="likeastore-search"></div>');

		self.render = function () {
			return self;
		};

		self.subview = function(view) {
			self.$.replaceWith(view.render().$);
		};
	};

	var LoginView = function () {
		var self = this;
		self.$ = $('<div class="likeastore-login"></div>');

		self.render = function () {
			self.$.html('<h1>You need to login</h1>');
			return self;
		};
	};

	var ResultsView = function (block) {
		var self = this;
		self.$ = $('<div class="likeastore-search-results"></div>');

		self.render = function () {
			self.$.html('<h1>Likeastore search results</h1>');
			return self;
		};
	};

	var App = function (block) {
		var mainView = new MainView();
		block.prepend(mainView.render().$);

		var user = function () {
			return $.get(api + '/users/me');
		};

		var login = function () {
			mainView.subview(new LoginView());
		};

		var results = function (res) {
			mainView.subview(new ResultsView(res));
		};

		var search = function () {
			var text = app.searchQuery();

			$.get(api + '/search?text=' + text)
				.done(results)
				.fail(login);
		};

		return {
			run: function () {
				user()
					.done(search)
					.fail(login);
			}
		};
	};

	$('#rhs').waitUntilExists(function () {
		new App($(this)).run();
	});

})();