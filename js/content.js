;(function () {
	var app = window.app = window.app || {};
	var api = 'https://app.likeastore.com/api';

	var img = app.browser.getUrl('img');

	$.ajaxSetup({xhrFields: {withCredentials: true}});

	var searchQuery = function () {
		var url = $.url();
		return url.fparam('q') || url.param('q');
	};

	var searchPage = function () {
		var url = $.url();
		var start = url.fparam('start') || url.param('start');

		return (start && (start / 10) + 1) || 1;
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

		var context = {};

		context.items = results.items && results.items.data.map(function (item) {
			return {
				title: title(item) || description(item),
				description: description(item),
				url: item.source,
				trackUrl: item.trackUrl,
				source: source(item),
				thumbnail: item.thumbnail,
				date: new Date(item.date).toLocaleDateString(),
				icon: img + '/' + item.type + '.png'
			};
		});

		context.feeds = results.feeds && results.feeds.data.map(function (item) {
			return {
				title: title(item) || description(item),
				description: description(item),
				url: item.source,
				trackUrl: item.trackUrl,
				source: source(item),
				thumbnail: item.thumbnail,
				date: new Date(item.date).toLocaleDateString(),
				by: item.collection.owner.name,
				collectionUrl: 'https://app.likeastore.com/u/' + item.collection.owner.name + '/' + item.collection._id,
				icon: img + '/' + item.type + '.png'
			};
		});

		context.collections = results.collections && results.collections.data.map(function (item) {
			return {
				title: title(item) || description(item),
				description: description(item) || title(item),
				url: 'https://app.likeastore.com/u/' + item.userData.name + '/' + item._id,
				by: item.userData.name,
				icon: item.userData.avatar
			};
		});

		var template = '\
			{{if data.items|notempty}}\
				<p>From your favorites:</p>\
				{{data.items}}\
					<li class="item">\
						<img src="{{icon}}" class="ls-icon" />\
						<a href="{{trackUrl}}" class="ls-title">{{title|tease>7}}</a>\
						<div class="ls-link">\
							<a href="{{trackUrl}}">{{source}}</a>\
						</div>\
						<div class="ls-description">{{description|tease>21|linkify}}</div>\
						<a class="ls-detail" href="{{trackUrl}}">favorited by you at: {{date}}</a>\
					</li>\
				{{/data.items}}\
			{{/if}}\
			{{if data.feeds|notempty}}\
				<p>From your feed:</p>\
				{{data.feeds}}\
					<li class="item">\
						<img src="{{icon}}" class="ls-icon" />\
						<a href="{{trackUrl}}" class="ls-title">{{title|tease>7}}</a>\
						<div class="ls-link">\
							<a href="{{trackUrl}}">{{source}}</a>\
						</div>\
						<div class="ls-description">{{description|tease>21|linkify}}</div>\
						<a class="ls-detail" href="{{collectionUrl}}">favorited by @{{by}} at: {{date}}</a>\
					</li>\
				{{/data.feeds}}\
			{{/if}}\
			{{if data.collections|notempty}}\
				<p>Suggested collections to follow:</p>\
				{{data.collections}}\
					<li class="item">\
						<img src="{{icon}}" class="ls-icon-avatar" />\
						<a href="{{url}}" class="ls-title">{{title|tease>7}}</a>\
						<div class="ls-link">\
							<a href="{{url}}">{{url}}</a>\
						</div>\
						<div class="ls-description">{{description|tease>21|linkify}}</div>\
						<a class="ls-detail" href="{{collectionUrl}}">currated by @{{by}}</a>\
					</li>\
				{{/data.collections}}\
			{{/if}}\
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
			app.analytics.increment('Searches by Extension');
		};
	};

	var App = function (block) {
		var user = function () {
			return $.get(api + '/users/me');
		};

		var login = function (error) {
			var mainView = new MainView(block);
			mainView.subview(new LoginView());
			mainView.render();
		};

		var haveResults = function (fn) {
			return function (res) {
				var items = res && res.items.data && res.items.data.length > 0;
				var feeds = res && res.feeds.data && res.feeds.data.length > 0;
				var collections = res && res.collections.data && res.collections.data.length > 0;

				if (items || feeds || collections) {
					fn(res);
				}
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

			$.get(api + '/search2?text=' + text + '&page=' + page + '&pageSize=6&track=1')
				.done(haveResults(results));
		};

		var ready = function (user) {
			app.analytics.init('c5c59411e311ab48cfe2846460be7d7e', user);
		};

		return {
			run: function () {
				app.linkify.init();

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