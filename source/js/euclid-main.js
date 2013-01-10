

/* Plugin that makes object sticky, but stops before it overlaps a defined 'stopAt' element */
(function($){
 
	$.fn.extend({ 
		stickyWithinReason: function(options) {
			var defaults = {
				'stopAt': "footer",
				'topPad': 20,
				'bottomPad': 20,
				'remainFixed': false
			};
			var settings = $.extend({}, defaults, options);
			return this.each(function() {

				if($(this).length){
					var sticky = $(this);
			     	var stickyTop = sticky.offset().top - settings['topPad']; 
	     			var stickyHeight = sticky.height();
	     			var limit = $(settings['stopAt']).offset().top - stickyHeight - settings['topPad'] - settings['bottomPad'];
	     			var originalTop = sticky.css('top');

	     			var isBound = false;
	     			var scrollFunction = function(){
						var windowTop = $(window).scrollTop(); 
						if(limit < windowTop) {
							var diff = limit - windowTop + settings['topPad'];
							sticky.css({ position: 'fixed', top: diff });
						}
						else if(stickyTop < windowTop)
							sticky.css({ position: 'fixed', top: settings['topPad'] });
						else
							reset(false);
					}
					var resizeFunction = function() {
	     				var isTinyScreen = $(document).width() < 700;
						if(!isTinyScreen && !isBound) {
	     					$(window).bind('scroll', scrollFunction);
	     					isBound = true;
	     					scrollFunction(); //Execute once to get everything back to the correct positioning
	     				}
	     				else if(isTinyScreen && isBound) {
	     					$(window).unbind('scroll', scrollFunction);
	     					reset(true);
	     					isBound = false;
	     				}
					}
					var reset = function(isMobile){
						if(!settings['remainFixed'] || isMobile)
							sticky.css('position','static');
						else {
							sticky.css('top', originalTop);
							sticky.css('position', 'absolute')
						}
					}

					//kick it off with the resize function which handles binding / unbinding based on the doc width
					resizeFunction();
	     			$(window).resize(resizeFunction);

				}
			});
		}
	});
})(jQuery);



$(document).ready(function(){

	//$('#subnav').stickyWithinReason({});
	$('#top-divider').stickyWithinReason({topPad: 0, bottomPad: 0});
	$('#subnav').stickyWithinReason({topPad: 0, bottomPad: 0, remainFixed: true});

	$('#comments').blur(function(){                   
	    if(!$(this).val())
	        $(this).addClass('empty');
	    else
	        $(this).removeClass('empty');
	});

	$('#name input, #email input, #company_name input, #num_locations input, #phone input').blur(function(){ contactFormValidator(true); });

	if(document.location.href.indexOf('willsmith') > -1 ){

		var eggimgs = ['../../img/egg/willsmith.gif', '../../img/egg/judd.jpg', '../../img/egg/steve1.png', '../../img/egg/steve2.png', '../../img/egg/julia.png'];



		$('img:not(.logo)').each(function(){
			var randomnumber=Math.floor(Math.random()*eggimgs.length)
			$(this).attr('src', eggimgs[randomnumber]);
		});
		$('.banner').css('background-image', 'url(../../img/egg/banner.jpg)')
	}

});


//Form validation for the contact form 
contactFormValidator = function(skipEmptyCheck) {

	var isValid = true;

	var showValidationMsg = function(element, msg){ element.children('.invalid-msg').text(msg).removeClass('hide'); }

	//Clear the alerts before we validate
	$('#name .invalid-msg, #email .invalid-msg, #company_name .invalid-msg, #num_locations .invalid-msg, #phone .invalid-msg').addClass('hide');

	//Are all of the optional fields filled?
	if(!skipEmptyCheck) {
		$.each(['#name', '#email', '#company_name', '#num_locations'], function(k,v){
			if(!$(v + " input").val()) {
				showValidationMsg($(v), "This is a required field");
				isValid = false;
			}
		});
	}


	//Field specific Validation

	if($("#email input").val() && !/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($("#email input").val())) {
		//http://www.designchemical.com/blog/index.php/jquery/email-validation-using-jquery/
		showValidationMsg($("#email"), "This is not a valid email address");
		isValid = false;
	}	

	if($("#phone input").val() && $("#phone input").val().replace(/[^\d.]/g, "").length < 10) {
		//because there can be so many different formats of phone numbers, rather than trying to validate each different possible 
		// format, just strip it down to the numbers only. if there are more than 10 digits, we're good. 
		showValidationMsg($("#phone"), "This is not a valid phone number");
		isValid = false;
	}

	if($("#num_locations input").val() && !/^\s*(\+|-)?\d+\s*$/.test($("#num_locations input").val())) {
		//http://www.designchemical.com/blog/index.php/jquery/email-validation-using-jquery/
		showValidationMsg($("#num_locations"), "This is not a valid number");
		isValid = false;
	}	

	return isValid;
}



























