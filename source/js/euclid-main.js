

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


/* Banner Rotator Plugin */
(function($){
	$.fn.extend({ 
		euclidRotator: function(options) {
			return this.each(function() {
				if($(this).length){

					var $curBanner = $(this);
					var $nextBanner = $(options.next_banner);
					var i = 1;
					var imax = options.imgs.length -1;
					setInterval(function(){
						$curBanner.animate({left:"100%"}, 400, function(){
							//var $t = $(this);
							$curBanner.css({"background-image":"url(../../img/"+options.imgs[i]+")"});
							setTimeout(function(){
								$curBanner.css({left: 0});
							}, 500);
							setTimeout(function(){
								i++; 
								if(i > imax) i = 0;
								$nextBanner.css({"background-image":"url(../../img/"+options.imgs[i]+")"});//$("#banner-qsr-next").css({"background-image":"url(../../img/banners/qsr-rotation/"+i+".jpg)"});
							}, 1000);
						});
					}, 10000);


				}
			});
		}
	});
})(jQuery);





$(document).ready(function(){

	//$('#subnav').stickyWithinReason({});
	$('.toggleReleases').hide();
	$('.toggleAwards').hide();
	$('.toggleNews').hide();
	$('.toggleEvents').hide();
	$('#top-divider').stickyWithinReason({topPad: 0, bottomPad: 0});
	$('#subnav').stickyWithinReason({topPad: 0, bottomPad: 0, remainFixed: true});
	$(".dropdown").mouseleave(function(){
    $(".dropdown-menu").hide();
	});
	$('.viewAllReleases').click(function(e){
		e.preventDefault();
		$(this).hide();
		$('.toggleReleases').toggle();
	});
	$('.viewAllNews').click(function(e){
		e.preventDefault();
		$(this).hide();
		$('.toggleNews').toggle();
	});
	$('.viewAllEvents').click(function(e){
		e.preventDefault();
		$(this).hide();
		$('.toggleEvents').toggle();
	});
	$('.viewAllAwards').click(function(e){
		e.preventDefault();
		$(this).hide();
		$('.toggleAwards').toggle();
	});
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

	//preload imgs. just add <img src="" class="preload" data-pathtoimg="PATH HERE" /> to the page
	$('.preload').each(function(){
	    var me = $(this);
	    me.attr('src', me.attr('data-pathtoimg'));
	});

	// Rotator for home page
	/*	var curBanner = $("#banner-home-cur");
	if(curBanner.length > 0){
		var i = 2;
		var imax = 10;
		setInterval(function(){
			curBanner.animate({left:"100%"}, 400, function(){
				var $t = $(this);
				$t.css({"background-image":"url(../img/banners/home-rotation/"+i+".jpg)"});
				setTimeout(function(){
					$t.css({left: 0});
				}, 500);
				setTimeout(function(){
					i++; 
					if(i > imax) i = 1;
					$("#banner-home-next").css({"background-image":"url(../img/banners/home-rotation/"+i+".jpg)"});
				}, 1000);
			});
		}, 10000);
	}

	var curBanner = $("#banner-qsr-cur");
	if(curBanner.length > 0){
		var i = 2;
		var imax = 3;
		setInterval(function(){
			curBanner.animate({left:"100%"}, 400, function(){
				var $t = $(this);
				$t.css({"background-image":"url(../../img/banners/qsr-rotation/"+i+".jpg)"});
				setTimeout(function(){
					$t.css({left: 0});
				}, 500);
				setTimeout(function(){
					i++; 
					if(i > imax) i = 1;
					$("#banner-qsr-next").css({"background-image":"url(../../img/banners/qsr-rotation/"+i+".jpg)"});
				}, 1000);
			});
		}, 10000);
	}*/
	$("#banner-home-cur").euclidRotator({imgs: [
			"banners/specialty-rotation/1.jpg", 
			"banners/dept-rotation/4.jpg",
			"banners/qsr-rotation/1.jpg", 
			"banners/specialty-rotation/2.jpg", 
			"banners/dept-rotation/1.jpg", 
			"banners/qsr-rotation/2.jpg", 
			"banners/specialty-rotation/3.jpg", 
			"banners/dept-rotation/2.jpg", 
			"banners/qsr-rotation/3.jpg", 
			"banners/specialty-rotation/4.jpg", 
			"banners/dept-rotation/3.jpg", 
			"banners/specialty-rotation/5.jpg", 
			"banners/qsr-rotation/4.jpg", 
			"banners/dept-rotation/4.jpg", 
			"banners/dept-rotation/5.jpg", 
			"banners/qsr-rotation/5.jpg",
			"banners/dept-rotation/6.jpg"

		], next_banner: "#banner-home-next" });
	

	$("#banner-specialty-cur").euclidRotator({imgs: [
			"banners/specialty-rotation/1.jpg", 
			"banners/specialty-rotation/2.jpg", 
			"banners/specialty-rotation/3.jpg", 
			"banners/specialty-rotation/4.jpg", 
			"banners/specialty-rotation/5.jpg", 
			"banners/dept-rotation/4.jpg"
		], next_banner: "#banner-specialty-next" }
	);
	$("#banner-dept-cur").euclidRotator({imgs: [
			"banners/dept-rotation/1.jpg", 
			"banners/dept-rotation/2.jpg", 
			"banners/dept-rotation/3.jpg", 
			"banners/dept-rotation/4.jpg", 
			"banners/dept-rotation/5.jpg", 
			"banners/dept-rotation/6.jpg"
		], next_banner: "#banner-dept-next" }
	);
	
	$("#banner-qsr-cur").euclidRotator({imgs: ["banners/qsr-rotation/1.jpg", "banners/qsr-rotation/2.jpg", "banners/qsr-rotation/3.jpg", "banners/qsr-rotation/4.jpg", "banners/qsr-rotation/5.jpg"], next_banner: "#banner-qsr-next" });


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



























