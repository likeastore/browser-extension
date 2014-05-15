Mark.pipes.linkify = function (input) {
	var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

	var result = input.replace(urlRegex, function (url) {
		return '<a href="' + url + '" target="_blank">' + url + '</a>';
	});

	return result;
};