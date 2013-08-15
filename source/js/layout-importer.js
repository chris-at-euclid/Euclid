var replaceUrls = function() {
	var href=$(this).attr("href"); 
	if(href)
		$(this).attr("href", "http://euclidanalytics.com"+href);
	else {
		var src=$(this).attr("src"); 
		$(this).attr("src", "http://euclidanalytics.com"+src);
	}
}
var replaceSearchStr = "a:not([href*='http://']), img:not([src*='http://'])";
$.ajax({
	url: 'http://localhost:4567/layoutcomponents.json',
	dataType: 'jsonp',
	success: function(data) {
		$(document).ready(function() {
			$("header").html(data.header).find(replaceSearchStr).each(replaceUrls);
			$("footer").html(data.footer).find(replaceSearchStr).each(replaceUrls);
		});
	},
	jsonpCallback: "localJsonpCallback"
});
function localJsonpCallback(json) {}