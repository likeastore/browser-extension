;(function () {
	var app = window.app = window.app || {};
	var api = 'https://app.likeastore.com/api';

	var MainView = function () {
		var self = this;
		self.$ = $('\
			<div class="ls-search">\
				<h1>Likeastore - social bookmarks.</h1>\
				<div class="ls-container"><div class="ls-loader"></div></div>\
			</div>');

		self.render = function () {
			return self;
		};

		self.subview = function(view) {
			self.$.find('.ls-container').html(view.render().$);
		};
	};

	var LoginView = function () {
		var self = this;
		self.$ = $('<div class="ls-login"></div>');

		self.render = function () {
			self.$.html('<h1>You need to login</h1>');
			return self;
		};
	};

	var ResultsView = function (results) {
		var self = this;

		var context = results.data.map(function (item) {
			return {
				title: item.title || item.repo || item.name || item.authorName,
				description: item.description,
				source: item.source,
				thumbnail: item.thumbnail
			};
		});

		var searchResults = '\
			{{.}}\
				<li class="item">\
					<a href={{source}} class="ls-title">{{title}}</a>\
					<div class="ls-link">\
						<a href={{source}}>{{source}}</a>\
					</div>\
					<div class="ls-description">{{description|tease>10}}</div>\
				</li>\
			{{/.}}\
		';

		var searchEmpty = '\
			<p>Sorry, nothing found for this query.</p>\
		';

		self.$ = $('<ul class="ls-results"></ul>');

		self.render = function () {
			var template = context.length > 0 ? searchResults : searchEmpty;
			var content = Mark.up(template, context);

			self.$.html(content);
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