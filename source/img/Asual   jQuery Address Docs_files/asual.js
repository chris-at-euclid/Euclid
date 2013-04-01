// For discussion and comments, see: http://remysharp.com/2009/01/07/html5-enabling-script/
(function(){if(!/*@cc_on!@*/0)return;var e = "abbr,article,aside,audio,canvas,datalist,details,eventsource,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video".split(','),i=e.length;while(i--){document.createElement(e[i])}})()

function reloadPreviewDiv() {
    var previewString = document.getElementById("commentText").value;
    if (previewString.length > 0){
        previewString = previewString.replace(new RegExp("(.*)\n\n([^#\*\n\n].*)","g"), "<p>$1</p><p>$2</p>");
        previewString = previewString.replace(new RegExp("(.*)\n([^#\*\n].*)","g"), "$1<br />$2");
        document.getElementById("commentPreview").innerHTML = previewString;
    }
}

function popup(url, w, h){
    var l = Math.round((window.screen.width - w)/2);
    var t = Math.round((window.screen.height - h)/2);
    var demo = window.open(url, "", "toolbar=0,location=0,status=1,menubar=0,scrollbars=0,resizable=1,width=" + w + ",height=" + h + ",left=" + l + ",top=" + t + "");
    demo.focus();
}

function seeMore(link, id, height){
    var el = document.getElementById(id);
    var count = el.getElementsByTagName('li').length * 12.5;
    if (typeof el.emHeight == 'undefined') {
        el.emHeight = height;
        el.messages = ['Want more websites?', 'Still want more?'];
    }
    el.emHeight = Math.min(el.emHeight + height, count);
    el.style.height = el.emHeight + 'px';
    if (count == el.emHeight) {
        link.parentNode.parentNode.removeChild(link.parentNode);
    } else {
        link.innerHTML = el.messages[0];
        if (el.messages.length > 1) {
            el.messages.splice(0, 1);
        }
    }      
}

function twitterify(tweet) {
    if (tweet.search(/(https?:\/\/[-\w\.]+:?\/[\w\/_\.]*(\?\S+)?)/) > -1) {
        tweet = tweet.replace(/(https?:\/\/[-\w\.]+:?\/[\w\/_\.]*(\?\S+)?)/, "<a href='$1'>$1</a>")
    }
    if (tweet.search(/@\w+/) > -1) {
        tweet = tweet.replace(/(@)(\w+)/g, "<a href='http://twitter.com/$2'>$1$2</a>");
    }
    return tweet;
}

function twitter(response) {
    var results = new Array();
    for (var i = 0, r; r = response.results[i]; i++) {
        results.push('<div><h3><a href="http://twitter.com/' + r.from_user + '">' + 
            '<img src="' + r.profile_image_url + '" width="16" height="16" alt="' + r.from_user + '" /><span>' + 
            r.from_user + '</span></a></h3><p>' + twitterify(r.text) + '</p></div>');
    }
    var twitter = document.getElementById('twitter');
    if (twitter) {
        twitter.innerHTML = results.join('');
    }
}

function load(){
    var as = document.getElementsByTagName('a');
    for (var i = 0, a; a = as[i]; i++) {
        if (/^\/download\//.test(a.getAttribute('href', 2))) {
            a.onclick = function() {
                _gaq.push(['_trackPageview', this.getAttribute('href', 2)]);
            }
        }
    }    
    var twitter = document.getElementById('twitter');
    if (twitter) {
        var request = document.createElement('script');
        request.setAttribute('type', 'text/javascript');
        request.setAttribute('src', 'http://search.twitter.com/search.json?callback=twitter&' + twitter.className.replace(/ /g, '&').replace(/:/g, '='));
        twitter.className = 'twitter';
        twitter.innerHTML = '<p class="loading"><img src="/resources/asual-loading.gif" width="16" height="16" alt="Loading" /> Loading...</p>';
        document.getElementsByTagName('head')[0].appendChild(request);
    }
}

var Browser = new function() {
    
    var _agent = navigator.userAgent.toLowerCase(),
        _safari = /webkit/.test(_agent),
        _opera = /opera/.test(_agent),
        _msie = /msie/.test(_agent) && !/opera/.test(_agent),
        _mozilla = /mozilla/.test(_agent) && !/(compatible|webkit)/.test(_agent),
        _version = parseFloat(_msie ? _agent.substr(_agent.indexOf('msie') + 4) : 
            (_agent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0,'0'])[1]);
        
    /**
     * The string representation of this class.
     * @return {String}
     * @static
     */
    this.toString = function() {
        return '[class Browser]';
    };
    
    /**
     * Detects the version of the browser.
     * @return {Number}
     * @static
     */
    this.getVersion = function() {
        return _version;
    };

    /**
     * Detects if the browser is Internet Explorer.
     * @return {Boolean}
     * @static
     */
    this.isMSIE = function() {
        return _msie;
    };

    /**
     * Detects if the browser is Safari.
     * @return {Boolean}
     * @static
     */
    this.isSafari = function() {
        return _safari;
    };

    /**
     * Detects if the browser is Opera.
     * @return {Boolean}
     * @static
     */
    this.isOpera = function() {
        return _opera;
    };

    /**
     * Detects if the browser is Mozilla.
     * @return {Boolean}
     * @static
     */
    this.isMozilla = function() {
        return _mozilla;
    };
};

var Events = new function() {

    var DOM_LOADED = 'DOMContentLoaded', 
        STOP = 'onstop',
        _w = window,
        _d = document,
        _cache = [],
        _msie = Browser.isMSIE(),
        _safari = Browser.isSafari();
    
    /**
     * The string representation of this class.
     * @return {String}
     * @static
     */
    this.toString = function() {
        return '[class Events]';
    };
    
    /**
     * Adds an event listener to an object.
     * @param {Object} obj The object that provides events.
     * @param {String} type The type of the event.
     * @param {Function} listener The event listener function.
     * @return {void}
     * @static
     */
    this.addListener = function(obj, type, listener) {
        _cache.push({o: obj, t: type, l: listener});
        if (!(type == DOM_LOADED && (_msie || _safari))) {
            if (obj.addEventListener)
                obj.addEventListener(type, listener, false);
            else if (obj.attachEvent)
                obj.attachEvent('on' + type, listener);
        }
    };

    /**
     * Removes an event listener from an object.
     * @param {Object} obj The object that provides events.
     * @param {String} type The type of the event.
     * @param {Function} listener The event listener function.
     * @return {void}     
     * @static
     */
    this.removeListener = function(obj, type, listener) {
        for (var i = 0, e; e = _cache[i]; i++) {
            if (e.o == obj && e.t == type && e.l == listener) {
                _cache.splice(i, 1);
                break;
            }
        }
        if (!(type == DOM_LOADED && (_msie || _safari))) {
            if (obj.removeEventListener)
                obj.removeEventListener(type, listener, false);
            else if (obj.detachEvent)
                obj.detachEvent('on' + type, listener);
        }
    };

    var _unload = function() {
        for (var i = 0, evt; evt = _cache[i]; i++) {
            if (evt.t != DOM_LOADED)
                Events.removeListener(evt.o, evt.t, evt.l);
        }
    };
    
    var _unloadFix = function() {
        if (_d.readyState == 'interactive') {
            function stop() {
                _d.detachEvent(STOP, stop);
                _unload();
            };
            _d.attachEvent(STOP, stop);
            _w.setTimeout(function() {
                _d.detachEvent(STOP, stop);
            }, 0);
        }
    };

    if (_msie || _safari) {
        (function (){
            try {
                if ((_msie && _d.body) || !/loaded|complete/.test(_d.readyState))
                    _d.documentElement.doScroll('left');
            } catch(e) {
                return setTimeout(arguments.callee, 0);
            }
            for (var i = 0, e; e = _cache[i]; i++)
                if (e.t == DOM_LOADED) e.l.call(null);
        })();
    }
    
    if (_msie)
        _w.attachEvent('onbeforeunload', _unloadFix);

    this.addListener(_w, 'unload', _unload);
};

Events.addListener(document, 'DOMContentLoaded', load);

// Syntax Highlighter
var dp={sh:{Toolbar:{},Utils:{},RegexLib:{},Brushes:{},Strings:{},Version:"1.4.1"}};dp.sh.Strings={AboutDialog:"<html><head><title>About...</title></head><body class=\"dp-about\"><table cellspacing=\"0\"><tr><td class=\"copy\"><p class=\"title\">dp.SyntaxHighlighter</div><div class=\"para\">Version: {V}</p><p><a href=\"http://www.dreamprojections.com/syntaxhighlighter/?ref=about\" target=\"_blank\">http://www.dreamprojections.com/SyntaxHighlighter</a></p>&copy; 2004-2005 Alex Gorbatchev. All right reserved.</td></tr><tr><td class=\"footer\"><input type=\"button\" class=\"close\" value=\"OK\" onClick=\"window.close()\"/></td></tr></table></body></html>"};dp.SyntaxHighlighter=dp.sh;dp.sh.Toolbar.Commands={ExpandSource:{label:"+ expand source",check:function(_1){return _1.collapse;},func:function(_2,_3){_2.parentNode.removeChild(_2);_3.div.className=_3.div.className.replace("collapsed","");}},ViewSource:{label:"view plain",func:function(_4,_5){var _6=_5.originalCode.replace(/</g,"&lt;");var _7=window.open("","_blank","width=760, height=400, location=0, resizable=1, menubar=0, scrollbars=1");_7.document.write("<textarea style=\"width:99%;height:99%\">"+_6+"</textarea>");_7.document.close();}},CopyToClipboard:{label:"copy to clipboard",check:function(){return window.clipboardData!=null;},func:function(_8,_9){window.clipboardData.setData("text",_9.originalCode);alert("The code is in your clipboard now");}},PrintSource:{label:"print",func:function(_a,_b){var _c=document.createElement("IFRAME");var _d=null;_c.style.cssText="position:absolute;width:0px;height:0px;left:-500px;top:-500px;";document.body.appendChild(_c);_d=_c.contentWindow.document;dp.sh.Utils.CopyStyles(_d,window.document);_d.write("<div class=\""+_b.div.className.replace("collapsed","")+" printing\">"+_b.div.innerHTML+"</div>");_d.close();_c.contentWindow.focus();_c.contentWindow.print();alert("Printing...");document.body.removeChild(_c);}},About:{label:"?",func:function(_e){var _f=window.open("","_blank","dialog,width=360,height=240,scrollbars=0");var doc=_f.document;dp.sh.Utils.CopyStyles(doc,window.document);doc.write(dp.sh.Strings.AboutDialog.replace("{V}",dp.sh.Version));doc.close();_f.focus();}}};dp.sh.Toolbar.Create=function(_11){var div=document.createElement("DIV");div.className="tools";for(var _13 in dp.sh.Toolbar.Commands){var cmd=dp.sh.Toolbar.Commands[_13];if(cmd.check!=null&&!cmd.check(_11)){continue;}div.innerHTML+="<a href=\"#\" onclick=\"dp.sh.Toolbar.Command('"+_13+"',this);return false;\">"+cmd.label+"</a>";}return div;};dp.sh.Toolbar.Command=function(_15,_16){var n=_16;while(n!=null&&n.className.indexOf("dp-highlighter")==-1){n=n.parentNode;}if(n!=null){dp.sh.Toolbar.Commands[_15].func(_16,n.highlighter);}};dp.sh.Utils.CopyStyles=function(_18,_19){var _1a=_19.getElementsByTagName("link");for(var i=0;i<_1a.length;i++){if(_1a[i].rel.toLowerCase()=="stylesheet"){_18.write("<link type=\"text/css\" rel=\"stylesheet\" href=\""+_1a[i].href+"\"></link>");}}};dp.sh.RegexLib={MultiLineCComments:new RegExp("/\\*[\\s\\S]*?\\*/","gm"),SingleLineCComments:new RegExp("//.*$","gm"),SingleLinePerlComments:new RegExp("#.*$","gm"),DoubleQuotedString:new RegExp("\"(?:\\.|(\\\\\\\")|[^\\\"\"])*\"","g"),SingleQuotedString:new RegExp("'(?:\\.|(\\\\\\')|[^\\''])*'","g")};dp.sh.Match=function(_1c,_1d,css){this.value=_1c;this.index=_1d;this.length=_1c.length;this.css=css;};dp.sh.Highlighter=function(){this.noGutter=false;this.addControls=true;this.collapse=false;this.tabsToSpaces=true;this.wrapColumn=80;this.showColumns=true;};dp.sh.Highlighter.SortCallback=function(m1,m2){if(m1.index<m2.index){return-1;}else{if(m1.index>m2.index){return 1;}else{if(m1.length<m2.length){return-1;}else{if(m1.length>m2.length){return 1;}}}}return 0;};dp.sh.Highlighter.prototype.CreateElement=function(_21){var _22=document.createElement(_21);_22.highlighter=this;return _22;};dp.sh.Highlighter.prototype.GetMatches=function(_23,css){var _25=0;var _26=null;while((_26=_23.exec(this.code))!=null){this.matches[this.matches.length]=new dp.sh.Match(_26[0],_26.index,css);}};dp.sh.Highlighter.prototype.AddBit=function(str,css){if(str==null||str.length==0){return;}var _29=this.CreateElement("SPAN");str=str.replace(/&/g,"&amp;");str=str.replace(/ /g,"&nbsp;");str=str.replace(/</g,"&lt;");str=str.replace(/\n/gm,"&nbsp;<br>");if(css!=null){var _2a=new RegExp("<br>","gi");if(_2a.test(str)){var _2b=str.split("&nbsp;<br>");str="";for(var i=0;i<_2b.length;i++){_29=this.CreateElement("SPAN");_29.className=css;_29.innerHTML=_2b[i];this.div.appendChild(_29);if(i+1<_2b.length){this.div.appendChild(this.CreateElement("BR"));}}}else{_29.className=css;_29.innerHTML=str;this.div.appendChild(_29);}}else{_29.innerHTML=str;this.div.appendChild(_29);}};dp.sh.Highlighter.prototype.IsInside=function(_2d){if(_2d==null||_2d.length==0){return false;}for(var i=0;i<this.matches.length;i++){var c=this.matches[i];if(c==null){continue;}if((_2d.index>c.index)&&(_2d.index<c.index+c.length)){return true;}}return false;};dp.sh.Highlighter.prototype.ProcessRegexList=function(){for(var i=0;i<this.regexList.length;i++){this.GetMatches(this.regexList[i].regex,this.regexList[i].css);}};dp.sh.Highlighter.prototype.ProcessSmartTabs=function(_31){var _32=_31.split("\n");var _33="";var _34=4;var tab="\t";function InsertSpaces(_36,pos,_38){var _39=_36.substr(0,pos);var _3a=_36.substr(pos+1,_36.length);var _3b="";for(var i=0;i<_38;i++){_3b+=" ";}return _39+_3b+_3a;}function ProcessLine(_3d,_3e){if(_3d.indexOf(tab)==-1){return _3d;}var pos=0;while((pos=_3d.indexOf(tab))!=-1){var _40=_3e-pos%_3e;_3d=InsertSpaces(_3d,pos,_40);}return _3d;}for(var i=0;i<_32.length;i++){_33+=ProcessLine(_32[i],_34)+"\n";}return _33;};dp.sh.Highlighter.prototype.SwitchToList=function(){var _42=this.div.innerHTML.replace(/<(br)\/?>/gi,"\n");var _43=_42.split("\n");if(this.addControls==true){this.bar.appendChild(dp.sh.Toolbar.Create(this));}if(this.showColumns){var div=this.CreateElement("div");var _45=this.CreateElement("div");var _46=10;var i=1;while(i<=150){if(i%_46==0){div.innerHTML+=i;i+=(i+"").length;}else{div.innerHTML+="&middot;";i++;}}_45.className="columns";_45.appendChild(div);this.bar.appendChild(_45);}for(var i=0,_48=this.firstLine;i<_43.length-1;i++,_48++){var li=this.CreateElement("LI");var _4a=this.CreateElement("SPAN");li.className=(i%2==0)?"alt":"";_4a.innerHTML=_43[i]+"&nbsp;";li.appendChild(_4a);this.ol.appendChild(li);}this.div.innerHTML="";};dp.sh.Highlighter.prototype.Highlight=function(_4b){function Trim(str){return str.replace(/^\s*(.*?)[\s\n]*$/g,"$1");}function Chop(str){return str.replace(/\n*$/,"").replace(/^\n*/,"");}function Unindent(str){var _4f=str.split("\n");var _50=new Array();var _51=new RegExp("^\\s*","g");var min=1000;for(var i=0;i<_4f.length&&min>0;i++){if(Trim(_4f[i]).length==0){continue;}var _54=_51.exec(_4f[i]);if(_54!=null&&_54.length>0){min=Math.min(_54[0].length,min);}}if(min>0){for(var i=0;i<_4f.length;i++){_4f[i]=_4f[i].substr(min);}}return _4f.join("\n");}function Copy(_55,_56,_57){return _55.substr(_56,_57-_56);}var pos=0;this.originalCode=_4b;this.code=Chop(Unindent(_4b));this.div=this.CreateElement("DIV");this.bar=this.CreateElement("DIV");this.ol=this.CreateElement("OL");this.matches=new Array();this.div.className="dp-highlighter";this.div.highlighter=this;this.bar.className="bar";this.ol.start=this.firstLine;if(this.CssClass!=null){this.ol.className=this.CssClass;}if(this.collapse){this.div.className+=" collapsed";}if(this.noGutter){this.div.className+=" nogutter";}if(this.tabsToSpaces==true){this.code=this.ProcessSmartTabs(this.code);}this.ProcessRegexList();if(this.matches.length==0){this.AddBit(this.code,null);this.SwitchToList();this.div.appendChild(this.ol);return;}this.matches=this.matches.sort(dp.sh.Highlighter.SortCallback);for(var i=0;i<this.matches.length;i++){if(this.IsInside(this.matches[i])){this.matches[i]=null;}}for(var i=0;i<this.matches.length;i++){var _5a=this.matches[i];if(_5a==null||_5a.length==0){continue;}this.AddBit(Copy(this.code,pos,_5a.index),null);this.AddBit(_5a.value,_5a.css);pos=_5a.index+_5a.length;}this.AddBit(this.code.substr(pos),null);this.SwitchToList();this.div.appendChild(this.bar);this.div.appendChild(this.ol);};dp.sh.Highlighter.prototype.GetKeywords=function(str){return"\\b"+str.replace(/ /g,"\\b|\\b")+"\\b";};dp.sh.HighlightAll=function(_5c,_5d,_5e,_5f,_60,_61){function FindValue(){var a=arguments;for(var i=0;i<a.length;i++){if(a[i]==null){continue;}if(typeof(a[i])=="string"&&a[i]!=""){return a[i]+"";}if(typeof(a[i])=="object"&&a[i].value!=""){return a[i].value+"";}}return null;}function IsOptionSet(_64,_65){for(var i=0;i<_65.length;i++){if(_65[i]==_64){return true;}}return false;}function GetOptionValue(_67,_68,_69){var _6a=new RegExp("^"+_67+"\\[(\\w+)\\]$","gi");var _6b=null;for(var i=0;i<_68.length;i++){if((_6b=_6a.exec(_68[i]))!=null){return _6b[1];}}return _69;}var _6d=document.getElementsByName(_5c);var _6e=null;var _6f=new Object();var _70="value";if(_6d==null){return;}for(var _71 in dp.sh.Brushes){var _72=dp.sh.Brushes[_71].Aliases;if(_72==null){continue;}for(var i=0;i<_72.length;i++){_6f[_72[i]]=_71;}}for(var i=0;i<_6d.length;i++){var _74=_6d[i];var _75=FindValue(_74.attributes["class"],_74.className,_74.attributes["language"],_74.language);var _76="";if(_75==null){continue;}_75=_75.split(":");_76=_75[0].toLowerCase();if(_6f[_76]==null){continue;}_6e=new dp.sh.Brushes[_6f[_76]]();_74.style.display="none";_6e.noGutter=(_5d==null)?IsOptionSet("nogutter",_75):!_5d;_6e.addControls=(_5e==null)?!IsOptionSet("nocontrols",_75):_5e;_6e.collapse=(_5f==null)?IsOptionSet("collapse",_75):_5f;_6e.showColumns=(_61==null)?IsOptionSet("showcolumns",_75):_61;_6e.firstLine=(_60==null)?parseInt(GetOptionValue("firstline",_75,1)):_60;_6e.Highlight(_74[_70]);_74.parentNode.insertBefore(_6e.div,_74);}};var highlight=function(){dp.SyntaxHighlighter.HighlightAll('code');};

// ActionScript
dp.sh.Brushes.ActionScript = function()
{
    var keywords =    'class dynamic extends implements import interface new case ' + 
                    'do while else if for in switch throw intrinsic private ' + 
                    'public static get set function var try catch finally while ' + 
                    'with default break continue delete return each label internal ' + 
                    'native override protected const namespace package include use ' + 
                    'AS3 flash_proxy object_proxy';
    
    var specials =  'super this null Infinity NaN undefined true false is as ' + 
                    'instanceof typeof decodeURI decodeURIComponent encodeURI ' + 
                    'encodeURIComponent escape isFinite isNaN isXMLName parseFloat ' + 
                    'parseInt trace unescape';

    this.regexList = [
        { regex: dp.sh.RegexLib.SingleLineCComments,                            css: 'comment' },        // one line comments
        { regex: dp.sh.RegexLib.MultiLineCComments,                                css: 'comment' },        // multiline comments
        { regex: dp.sh.RegexLib.DoubleQuotedString,                                css: 'string' },        // strings
        { regex: dp.sh.RegexLib.SingleQuotedString,                                css: 'string' },        // strings
        { regex: new RegExp('\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b', 'gi'),    css: 'number' },        // numbers
        { regex: new RegExp(this.GetKeywords(keywords), 'gm'),                    css: 'keyword' },        // actionscript keyword
        { regex: new RegExp(this.GetKeywords(specials), 'gm'),                    css: 'special' }        // actionscript special word
        ];

    this.CssClass = 'dp-as';
}

dp.sh.Brushes.ActionScript.prototype    = new dp.sh.Highlighter();
dp.sh.Brushes.ActionScript.Aliases    = ['actionscript', 'as'];

// CSS
dp.sh.Brushes.CSS = function()
{
    var keywords =    'ascent azimuth background-attachment background-color background-image background-position ' +
                    'background-repeat background baseline bbox border-collapse border-color border-spacing ' +
                    'border-style border-top border-right border-bottom border-left border-top-color ' +
                    'border-right-color border-bottom-color border-left-color border-top-style border-right-style ' +
                    'border-bottom-style border-left-style border-top-width border-right-width border-bottom-width ' +
                    'border-left-width border-width border bottom cap-height caption-side centerline clear clip ' +
                    'color content counter-increment counter-reset cue-after cue-before cue cursor definition-src ' +
                    'descent direction display elevation empty-cells float font-size-adjust font-family font-size ' +
                    'font-stretch font-style font-variant font-weight font height left letter-spacing line-height ' +
                    'list-style-image list-style-position list-style-type list-style margin-top margin-right ' +
                    'margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height ' +
                    'min-width orphans outline-color outline-style outline-width outline overflow padding-top ' +
                    'padding-right padding-bottom padding-left padding page page-break-after page-break-before ' +
                    'page-break-inside pause pause-after pause-before pitch pitch-range play-during position ' +
                    'quotes richness right size slope src speak-header speak-numeral speak-punctuation speak ' +
                    'speech-rate stemh stemv stress table-layout text-align text-decoration text-indent ' +
                    'text-shadow text-transform top unicode-bidi unicode-range units-per-em vertical-align ' +
                    'visibility voice-family volume white-space widows width widths word-spacing x-height z-index';         

    var pseudos =   'active focus link hover visited before after lang first-letter first-line';

    var tags =      'a acronym address applet b bdo big blockquote body br button caption center cite code col ' +
                    'colgroup dd del dfn dir div dl dt em fieldset form h1 h2 h3 h4 h5 h6 hr html i iframe img' +
                    'input ins kbd label legend li marquee menu object ol optgroup option p plaintext pre q rt' +
                    'ruby s samp select small span strike strong sub sup table tbody td textarea tfoot th' +
                    'thead tr tt ul var';

    this.regexList = [
        { regex: dp.sh.RegexLib.MultiLineCComments,                    css: 'comment' },    // multiline comments
        { regex: new RegExp('\:(\.)*;', 'g'),                        css: 'value' },                // values
        { regex: new RegExp('[.#][\\w-]+', 'g'),                    css: 'definition' },        // definitions
        { regex: new RegExp(this.GetKeywords(keywords), 'gm'),        css: 'keyword' },             // keywords
        { regex: new RegExp(this.GetKeywords(pseudos), 'gm'),        css: 'pseudo' },             // pseudos
        { regex: new RegExp(this.GetKeywords(tags), 'gm'),               css: 'tag' }               // pseudos

        ];

    this.CssClass = 'dp-css';
}

dp.sh.Brushes.CSS.prototype    = new dp.sh.Highlighter();
dp.sh.Brushes.CSS.Aliases    = ['css'];

// JScript
dp.sh.Brushes.JScript = function()
{
    var keywords =    'abstract boolean break byte case catch char class const continue debugger ' +
                    'default delete do double else enum export extends false final finally float ' +
                    'for function goto if implements import in instanceof int interface long native ' +
                    'new null package private protected public return short static super switch ' +
                    'synchronized this throw throws transient true try typeof var void volatile while with';

    this.regexList = [
        { regex: dp.sh.RegexLib.SingleLineCComments,                css: 'comment' },            // one line comments
        { regex: dp.sh.RegexLib.MultiLineCComments,                    css: 'comment' },            // multiline comments
        { regex: dp.sh.RegexLib.DoubleQuotedString,                    css: 'string' },            // double quoted strings
        { regex: dp.sh.RegexLib.SingleQuotedString,                    css: 'string' },            // single quoted strings
        { regex: new RegExp('^\\s*#.*', 'gm'),                        css: 'preprocessor' },        // preprocessor tags like #region and #endregion
        { regex: new RegExp(this.GetKeywords(keywords), 'gm'),        css: 'keyword' }            // keywords
        ];

    this.CssClass = 'dp-js';
}

dp.sh.Brushes.JScript.prototype    = new dp.sh.Highlighter();
dp.sh.Brushes.JScript.Aliases    = ['js', 'jscript', 'javascript'];

// XML
dp.sh.Brushes.Xml = function()
{
    this.CssClass = 'dp-xml';
}

dp.sh.Brushes.Xml.prototype    = new dp.sh.Highlighter();
dp.sh.Brushes.Xml.Aliases    = ['xml', 'xhtml', 'xslt', 'html', 'xhtml'];

dp.sh.Brushes.Xml.prototype.ProcessRegexList = function()
{
    function push(array, value)
    {
        array[array.length] = value;
    }
    
    /* If only there was a way to get index of a group within a match, the whole XML
       could be matched with the expression looking something like that:
    
       (<!\[CDATA\[\s*.*\s*\]\]>)
       | (<!--\s*.*\s*?-->)
       | (<)*(\w+)*\s*(\w+)\s*=\s*(".*?"|'.*?'|\w+)(/*>)*
       | (</?)(.*?)(/?>)
    */
    var index    = 0;
    var match    = null;
    var regex    = null;

    // Match CDATA in the following format <![ ... [ ... ]]>
    // <\!\[[\w\s]*?\[(.|\s)*?\]\]>
    this.GetMatches(new RegExp('<\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\]>', 'gm'), 'cdata');
    
    // Match comments
    // <!--\s*.*\s*?-->
    this.GetMatches(new RegExp('<!--\\s*.*\\s*?-->', 'gm'), 'comments');

    // Match attributes and their values
    // (:|\w+)\s*=\s*(".*?"|\'.*?\'|\w+)*
    regex = new RegExp('([:\\w-\.]+)\\s*=\\s*(".*?"|\'.*?\'|\\w+)*', 'gm'); // Thanks to Tomi Blinnikka of Yahoo! for fixing namespaces in attributes
    while((match = regex.exec(this.code)) != null)
    {
        push(this.matches, new dp.sh.Match(match[1], match.index, 'attribute'));
    
        // if xml is invalid and attribute has no property value, ignore it    
        if(match[2] != undefined)
        {
            push(this.matches, new dp.sh.Match(match[2], match.index + match[0].indexOf(match[2]), 'attribute-value'));
        }
    }

    // Match opening and closing tag brackets
    // </*\?*(?!\!)|/*\?*>
    this.GetMatches(new RegExp('</*\\?*(?!\\!)|/*\\?*>', 'gm'), 'tag');

    // Match tag names
    // </*\?*\s*(\w+)
    regex = new RegExp('</*\\?*\\s*([:\\w-\.]+)', 'gm');
    while((match = regex.exec(this.code)) != null)
    {
        push(this.matches, new dp.sh.Match(match[1], match.index + match[0].indexOf(match[1]), 'tag-name'));
    }
}

// Text
dp.sh.Brushes.Text = function()
{
    this.regexList = [
        { regex: dp.sh.RegexLib.SingleLineCComments,                css: 'comment' },            // one line comments
        { regex: dp.sh.RegexLib.MultiLineCComments,                    css: 'comment' },            // multiline comments
        { regex: dp.sh.RegexLib.DoubleQuotedString,                    css: 'string' },            // double quoted strings
        { regex: dp.sh.RegexLib.SingleQuotedString,                    css: 'string' },            // single quoted strings
        { regex: new RegExp('^\\s*#.*', 'gm'),                        css: 'preprocessor' }        // preprocessor tags like #region and #endregion
        ];

    this.CssClass = 'dp-txt';
}

dp.sh.Brushes.Text.prototype    = new dp.sh.Highlighter();
dp.sh.Brushes.Text.Aliases    = ['txt'];