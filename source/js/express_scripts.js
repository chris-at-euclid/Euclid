var ANIMATION_DELAY = 800;
var MASTER_INTERVAL_PERIOD = 30;
var RING_CHANGE_INTERVAL_PERIOD = 1000;
var BAR_CHANGE_INTERVAL_PERIOD = 30;
var BAR_MAX_HEIGHT = 140;
var BAR_MIN_HEIGHT = 6;
var BAR_START_HEIGHT = 1;
var BAR_MAX_HEIGHT_CHANGE = 20;
var RING_SLIDE_RATE = 10;
var BAR_SLIDE_RATE = 5;
var INTER_BAR_DELAY = 25;

var LIGHT_COLOR = "#107dae";
var MEDIUM_COLOR = "#74b4d0";
var DARK_COLOR = "#b7d8e7";

var masterInterval = null;
var ringChangeInterval;
var barChangeInterval;

var ringAngles = new Array(4);
var ringTargetAngles = new Array(4);
var ringChartDivs = new Array(4);
var ringChartBottoms = new Array(4);
var ringChartTops = new Array(4);
var ringAnimationVisible = new Array(4);

var bars;
var barHeights = new Array();
var barOriginalHeights = new Array();
var barTargetHeights = new Array();
var barChartDiv;
var barChartBottom;
var barChartTop;
var barAnimationVisible;

var diagramDiv;
var diagramBottom;
var diagramTop;
var diagramVisible;

var barAverage = 0;

var userScrolled = -1;

var expressInit = function(){
  //set up the animation elements
  //bars
  bars = $(".bar");
  barAverage = 0.0;
  for (var i=0; i<bars.length; i++){
    var barHeight = BAR_MIN_HEIGHT+(BAR_MAX_HEIGHT-BAR_MIN_HEIGHT)*getBellCurveValue((i/bars.length)*(i/bars.length));
    barAverage += barHeight;
    if (i==bars.length-1) barHeight = barAverage/bars.length;
    barHeights[i] = BAR_START_HEIGHT;
    barTargetHeights[i] = BAR_START_HEIGHT;
    barOriginalHeights[i] = barHeight;
  }
  if (!browserRunsAnimation()){
    for (var i=0; i<bars.length; i++){
      $(bars[i]).css('height', barOriginalHeights[i]+"px");
      $("#insights-diagram *").css("visibility", "visible");
    }
  }
  //rings
  for (var i=0; i<ringAngles.length; i++){
    ringAngles[i] = new Array(2);
    ringTargetAngles[i] = new Array(2);
    ringAngles[i][0] = parseFloat(getRotationDegrees($($(".ring-1.graph-light-color")[i])));
    ringTargetAngles[i][0] = ringAngles[i][0];
    ringAngles[i][1] = parseFloat(getRotationDegrees($($(".ring-2.graph-medium-color")[i])));
    ringTargetAngles[i][1] = ringAngles[i][1];
    ringChartDivs[i] = $($("#ring-chart-"+(i+1)));
    ringChartBottoms[i] = ringChartDivs[i].offset().top + parseInt($(ringChartBottoms[i]).height());
    ringChartTops[i] = ringChartDivs[i].offset().top + parseInt($(ringChartBottoms[i]).height());
    ringAnimationVisible[i] = false;
    if (browserRunsAnimation()) resetRingAnimation(i);
  }
  barChartDiv = $($("#bar-chart-container"));
  diagramDiv = $($("#diagram-area"));
  barAnimationVisible = false;
  diagramVisible = false;

  if (browserRunsAnimation()) {
    var animationDelay = (userScrolled>0)?0:ANIMATION_DELAY;
    setTimeout(checkChartVisibility,animationDelay);
    setTimeout(checkDiagramVisibility,animationDelay);
    // Bind a scroll event for the whole page
    $(window).bind("scroll", function(e)
    {
      //userScrolled++;
      var animationDelay = (userScrolled>0)?0:ANIMATION_DELAY;
      setTimeout(checkChartVisibility,animationDelay);
      setTimeout(checkDiagramVisibility,animationDelay);
    });
    $(window).bind("resize", function(e)
    {
      startAnimation();
      var animationDelay = (userScrolled>0)?0:ANIMATION_DELAY;
      setTimeout(checkChartVisibility,animationDelay);
      setTimeout(checkDiagramVisibility,animationDelay);
    });
  }

}

var fireDiagramAnimation = function(){
  //fade in diagram
  var rate = 170;
  $( "#router" ).css('visibility','visible').hide().fadeIn( rate, function() {
    // Animation complete
    $( "#dot-3" ).css('visibility','visible').hide().fadeIn( rate, function() {
      // Animation complete
      $( "#dot-2" ).css('visibility','visible').hide().fadeIn( rate, function() {
        // Animation complete
        $( "#dot-1" ).css('visibility','visible').hide().fadeIn( rate, function() {
            // Animation complete
          $( "#mobile-devices" ).css('visibility','visible').hide().fadeIn( rate, function() {
              // Animation complete
            $( "#dot-4" ).css('visibility','visible').hide().fadeIn( rate, function() {
                // Animation complete
              $( "#dot-5" ).css('visibility','visible').hide().fadeIn( rate, function() {
                  // Animation complete
                $( "#dot-6" ).css('visibility','visible').hide().fadeIn( rate, function() {
                    // Animation complete
                  $( "#laptop" ).css('visibility','visible').hide().fadeIn( rate, function() {
                      // Animation complete
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
}

var checkChartVisibility = function(){
  var screenBottom = $(this).scrollTop() + parseInt($(window).height());
  var screenTop = $(this).scrollTop() + parseInt($(".navbar").height());
  var fireAnimations = false;

  //check bars
  updateBarChartDivMetrics();
  var animationVisible = barAnimationVisible;
  if (screenBottom > barChartBottom){
    animationVisible = true;
  }
  //just became visible
  if (animationVisible && !barAnimationVisible){
    fireAnimations = true;
  }
  // //just became invisible
  barAnimationVisible = animationVisible;

  //if scrolling has reached the bottom of the bar chart, fire all the animations
  if(fireAnimations){
    for (var i=0; i<ringChartBottoms.length; i++){
      fireRingAnimation(i);
    }
    fireBarAnimation();
  }
}

var checkDiagramVisibility = function(){
  var screenBottom = $(this).scrollTop() + parseInt($(window).height());
  var screenTop = $(this).scrollTop() + parseInt($(".navbar").height());
  var fireAnimations = false;

  //check diagram
  updateDiagramDivMetrics();
  var animationVisible = diagramVisible;
  if (screenBottom > diagramBottom){
    animationVisible = true;
  }
  //just became visible
  if (animationVisible && !diagramVisible){
    //fireBarAnimation();
    fireDiagramAnimation();
    diagramVisible = true;
  }
}

var fireRingAnimation = function(ringIndex){
  startAnimation();
  randomizeRingTargets(ringIndex);
}

var resetRingAnimation = function(ringIndex){
  startAnimation();
  ringTargetAngles[ringIndex][0] = -181;
  ringAngles[ringIndex][0] = -180;
}
var fireBarAnimation = function(){
  startAnimation();
  raiseBarTargets();
}

var resetBarAnimation = function(){
  startAnimation();
  clearTimeout(barTargetTimeout);
  for (var i=0; i<barTargetHeights.length; i++){
    barTargetHeights[i] = BAR_START_HEIGHT;
    barHeights[i] = BAR_START_HEIGHT;
  }
}

var updateRingChartDivMetrics = function(){
  for (var i=0; i<ringChartBottoms.length; i++){
    ringChartTops[i] = ringChartDivs[i].offset().top;
    ringChartBottoms[i] = ringChartDivs[i].offset().top + parseInt(ringChartDivs[i].outerHeight());
  }
}

var updateBarChartDivMetrics = function(){
  barChartTop = barChartDiv.offset().top;
  barChartBottom = barChartDiv.offset().top + parseInt(barChartDiv.outerHeight());
}

var updateDiagramDivMetrics = function(){
  diagramTop = diagramDiv.offset().top;
  diagramBottom = diagramDiv.offset().top + parseInt(diagramDiv.outerHeight());
}

var startAnimation = function(){
  if (masterInterval == null){
    masterInterval = setInterval(animationLoop,MASTER_INTERVAL_PERIOD);
  }else{
  }
}
var stopAnimation = function(){
  clearInterval(masterInterval);
  masterInterval = null;
}
var browserRunsAnimation = function(){
  //return (window.innerWidth > 768);
  return ((!browserIsIE8()) && (!browserIsMobile()));
}
var browserIsIE8 = function(){
    var rv = -1; // Return value assumes not ie.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    if (rv==8){
    }else{
    }
    return rv==8;
}
var getBellCurveValue = function(x) {
  return (Math.sin(2 * Math.PI * (x - 1/4)) + 1) / 2;
}

var randomizeRingTargets = function(ringIndex){
  ringTargetAngles[ringIndex][0] = Math.random()*(-90);
  ringTargetAngles[ringIndex][1] = Math.random()*(-90)-90;
}

var barTargetIndex = 0;
var barTargetTimeout;
var raiseBarTargets = function(){
  barTargetIndex = 0;
  runBarTargetTimeout();
}
var runBarTargetTimeout = function(){
  barTargetTimeout = setTimeout(function(){
      raiseSingleBar(barTargetIndex);
      barTargetIndex++;
      if (barTargetIndex<barTargetHeights.length){
        runBarTargetTimeout();
      }
    },INTER_BAR_DELAY);
}
var raiseSingleBar = function(barIndex){
  barTargetHeights[barIndex] = barOriginalHeights[barIndex] + Math.random()*BAR_MAX_HEIGHT_CHANGE-(BAR_MAX_HEIGHT_CHANGE/2);
  if (barTargetHeights[barIndex]<BAR_MIN_HEIGHT)  barTargetHeights[barIndex] = BAR_MIN_HEIGHT;
}

var animationLoop = function(){
  //update the graphics
  //update rings
  var animationComplete = true;
  for (var i=0; i<ringTargetAngles.length; i++){
    var diffs = [(parseFloat(ringTargetAngles[i][0])-parseFloat(ringAngles[i][0])), (parseFloat(ringTargetAngles[i][1])-parseFloat(ringAngles[i][1]))]
    ringAngles[i][0] += diffs[0]/RING_SLIDE_RATE;
    ringAngles[i][1] += diffs[1]/RING_SLIDE_RATE;
    setRotationDegrees($($(".ring-1.graph-light-color")[i]),"rotate("+ringAngles[i][0]+"deg)");
    setRotationDegrees($($(".ring-2.graph-medium-color")[i]),"rotate("+ringAngles[i][1]+"deg)");
    if (diffs[0]>1 || diffs[1]>1) animationComplete = false;
  }
  //update bars
  for (var i=0; i<barHeights.length; i++){
    var diff = (parseFloat(barTargetHeights[i])-parseFloat(barHeights[i]));
    barHeights[i] += diff/BAR_SLIDE_RATE;
    $(bars[i]).css('height', barHeights[i]+"px");
    if (diff>1) animationComplete = false;
  }
  if (animationComplete) stopAnimation();
}

//thanks to stack overflow user "Twist"
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }

    //if(angle < 0) angle +=360;
    return angle;
}
function setRotationDegrees(obj,value) {
    obj.css("-webkit-transform",value);
    obj.css("-moz-transform",value);
    obj.css("-ms-transform",value);
    obj.css("-o-transform",value);
    obj.css("transform",value);
}

var browserIsMobile = function(){
  return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
}
