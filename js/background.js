chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	var tabUrl = tab.url;
	console.log(tabUrl);
});