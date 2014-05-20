;(function () {
	var app = window.app = window.app || {};
	var api = 'https://app.likeastore.com/api';
	var img = app.browser.getUrl('img');

	var searchQuery = function () {
		var url = $.url();
		return url.fparam('q') || url.param('q');
	};

	var searchPage = function () {
		var url = $.url();
		var start = url.fparam('start') || url.param('start');

		return (start / 10) + 1;
	};

	var MainView = function (block) {
		var self = this;

		self.$ = $('\
			<div class="ls-search">\
				<div class="logo">\
					<a href="https://likeastore.com">\
						<img src="' + img + '/logo.png' + '" alt="likeastore.com" style="width: 180px" />\
					</a>\
				</div>\
				<div class="ls-container"><div class="ls-loader"></div></div>\
			</div>\
			<div class="ls-right ls-share">\
				<a href="https://likeastore.com/share" target="_blank">Share</a>\
			</div>\
		');

		self.render = function () {
			block.append(self.$);
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
			self.$.html('<a href="https://likeastore.com/login" target="_blank">Log In</a> or <a href="https://likeastore.com/join" target="_blank">Create Account</a> to search your likes.');
			return self;
		};
	};

	var ResultsView = function (results) {
		var self = this;

		var title = function (item) {
			return item.titleHtml || item.title;
		};

		var description = function (item) {
			return item.descriptionHtml || item.description;
		};

		var source = function (item) {
			return item.sourceHtml || item.source;
		};

		var context = results.data.map(function (item) {
			return {
				title: title(item) || description(item),
				description: description(item),
				url: item.source,
				source: source(item),
				thumbnail: item.thumbnail,
				date: new Date(item.date).toLocaleDateString(),
				icon: img + '/' + item.type + '.png'
			};
		});

		var template = '\
			{{data}}\
				<li class="item">\
					<img src="{{icon}}" class="ls-icon" />\
					<a href={{url}} class="ls-title">{{title|tease>7}}</a>\
					<div class="ls-link">\
						<a href="{{url}}">{{source}}</a>\
					</div>\
					<div class="ls-description">{{description|tease>21|linkify}}</div>\
				</li>\
			{{/data}}\
			<li class="ls-more">\
				<div>\
					Not found yet? Visit the web site for <a href="{{more}}">more</a> results.\
				</div>\
			</li>\
		';

		self.$ = $('<ul class="ls-results"></ul>');

		self.render = function () {
			var text = searchQuery();

			var more = 'https://app.likeastore.com/search?text=' + encodeURI(text);
			var content = Mark.up(template, {data: context, more: more});

			self.$.html(content);
			self.bindEvents();

			return self;
		};

		self.bindEvents = function () {
			self.$.find('.item a').click(function () {
				app.analytics.track('search extension results clicked');
			});

			self.$.find('.ls-more a').click(function () {
				app.analytics.track('search extension more clicked');
			});

			app.analytics.track('search extension');
		};
	};

	var App = function (block) {
		var user = function () {
			return $.get(api + '/users/me');
		};

		var login = function () {
			var mainView = new MainView(block);
			mainView.subview(new LoginView());
			mainView.render();
		};

		var haveResults = function (fn) {
			return function (res) {
				res && res.data && res.data.length > 0 && fn(res);
			};
		};

		var results = function (res) {
			var mainView = new MainView(block);
			mainView.subview(new ResultsView(res));
			mainView.render();
		};

		var search = function () {
			var text = searchQuery();
			var page = searchPage();

			$.get(api + '/search?text=' + text + '&page=' + page + '&pageSize=10')
				.done(haveResults(results));
		};

		var ready = function (user) {
			app.analytics.init('c5c59411e311ab48cfe2846460be7d7e', user);
		};

		return {
			run: function () {
				user()
					.done(ready)
					.done(search)
					.fail(login);
			}
		};
	};

	$('#rhs_block').waitUntilExists(function () {
		new App($(this)).run();
	});

})();