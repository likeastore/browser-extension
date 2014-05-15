;(function () {
	var app = window.app = window.app || {};
	//var api = 'https://app.likeastore.com/api';
	var api = 'http://localhost:3001/api';


	var searchQuery = function () {
		var url = $.url();
		return url.fparam('q') || url.param('q');
	};

	var MainView = function (block) {
		var self = this;
		var logo = chrome.extension.getURL('img/logo.png');

		self.$ = $('\
			<div class="ls-search">\
				<div class="logo">\
					<a href="https://likeastore.com">\
						<img src="' + logo +'" alt="likeastore.com" style="width: 180px" />\
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
		var icons = chrome.extension.getURL('bower_components/likeastore-icons-pack/128');

		var context = results.data.map(function (item) {
			return {
				title: item.title || item.description,
				description: item.description,
				source: item.source,
				thumbnail: item.thumbnail,
				date: new Date(item.date).toLocaleDateString(),
				icon: icons + '/' + item.type + '.png'
			};
		});

		var template = '\
			{{data}}\
				<li class="item">\
					<img src="{{icon}}" class="ls-icon" />\
					<a href={{source}} class="ls-title">{{title|tease>7}}</a>\
					<div class="ls-link">\
						<a href={{source}}>{{source}}</a>\
					</div>\
					<div class="ls-description">{{description|tease>21}}</div>\
					<div class="ls-date">\
						You\'ve favorited this page on {{date}}\
					</div>\
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

			$.get(api + '/search?text=' + text + '&pageSize=10')
				.done(haveResults(results))
				.fail(login);
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