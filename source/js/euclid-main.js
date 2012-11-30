

/* Plugin that makes object sticky, but stops before it overlaps a defined 'stopAt' element 
(function( $ ){

	//$.fn.extend({ 
		$.fn.stickyWithinReason = function(options) {

			var defaults = {
				'stopAt': "footer",
				'bottomPad': 20
			};
			var settings = $.extend({}, defaults, options);

			return this.each(function () {
				
				if($(this).length){
					var sticky = $(this);
			     	var stickyTop = sticky.offset().top; 
			     	var stickyHeight = sticky.height();
			     	var limit = $(settings['stopAt']).offset().top - stickyHeight - settings['bottomPad'];

					$(window).scroll(function(){
						var windowTop = $(window).scrollTop(); 

						if(limit < windowTop) {
							var diff = limit - windowTop;
							sticky.css({ position: 'fixed', top: diff });
						}
						else if(stickyTop < windowTop) {
							el.css({ position: 'fixed', top: 0 });
						}
						else {
							el.css('position','static');
						}

					});	     
				}

			});

		}
	//});
})( jQuery );
*/



(function($){
 
	//Attach this new method to jQuery
	$.fn.extend({ 

		//This is where you write your plugin's name
		stickyWithinReason: function(options) {

			var defaults = {
				'stopAt': "footer",
				'topPad': 20,
				'bottomPad': 20
			};
			var settings = $.extend({}, defaults, options);

			//Iterate over the current set of matched elements
			return this.each(function() {

				if($(this).length){
					var sticky = $(this);
			     	var stickyTop = sticky.offset().top - settings['topPad']; 
	     			var stickyHeight = sticky.height();
	     			var limit = $(settings['stopAt']).offset().top - stickyHeight - settings['topPad'] - settings['bottomPad'];

					$(window).scroll(function(){
						var windowTop = $(window).scrollTop(); 

						if(limit < windowTop) {
							var diff = limit - windowTop + settings['topPad'];
							sticky.css({ position: 'fixed', top: diff });
						}
						else if(stickyTop < windowTop) {
							sticky.css({ position: 'fixed', top: settings['topPad'] });
						}
						else {
							sticky.css('position','static');
						}
					});	     
				}



			});
		}
	});
})(jQuery);



$(document).ready(function(){
	$('#subnav').stickyWithinReason({});
/*
	$("#subnav").stickyWithinReason();

	var stickyWithinReason = function(selector, options) {
		
		if($(selector).length){

			var defaults = {
				'stopAt': "footer",
				'topPad': 20,
				'bottomPad': 20
			};
			var settings = $.extend({}, defaults, options);

			var sticky = $(selector);
	     	var stickyTop = sticky.offset().top - settings['topPad']; 
	     	var stickyHeight = sticky.height();
	     	var limit = $(settings['stopAt']).offset().top - stickyHeight - settings['topPad'] - settings['bottomPad'];

			$(window).scroll(function(){
				var windowTop = $(window).scrollTop(); 

				if(limit < windowTop) {
					var diff = limit - windowTop + settings['topPad'];
					sticky.css({ position: 'fixed', top: diff });
				}
				else if(stickyTop < windowTop) {
					sticky.css({ position: 'fixed', top: settings['topPad'] });
				}
				else {
					sticky.css('position','static');
				}

			});	     
		}
	}
*/
	//	stickyWithinReason('#subnav', {});
	$('#top-divider').stickyWithinReason({topPad: 0, bottomPad: 0});


});