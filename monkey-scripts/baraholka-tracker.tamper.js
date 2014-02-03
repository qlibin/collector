// ==UserScript==
// @name       My Fancy New Userscript
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://baraholka.leprosorium.ru/
// @copyright  2012+, You
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var Refresher = function (aTimeoutValue) {
    
    var _timeoutValue = aTimeoutValue?aTimeoutValue:5000;
    
    function reload() {
        window.location.reload();
    }
    
    var timeout = setTimeout(function() {
        reload();
    }, _timeoutValue);
    
    return {
        reloadNow: function() {
            reload();
        },
        deactivate: function() {
            clearTimeout(timeout);
        }
    }
};

var Targets = function (a_targets) {
    
    var _targets = a_targets;
    
    return {
        get: function() {
            return _targets;
        }
    }
};

var UrlNotifier = function (a_url) {
    
    var _url = a_url;
    
    return {
        notify: function(target, item, keywords) {
            $.get(url + '?target=' + target.name + '&keywords=' + encodeURIComponent(keywords) + '&item=' + encodeURIComponent(item.html()), function( data ) {
  				//$( ".result" ).html( data );
  				alert( "Load was performed." );
			});
        }
    }
};

var AlertNotifier = function () {
    
    return {
        notify: function(target, item, keywords) {
            alert('target: ' + target.name + ', keywords: ' + keywords + '. text: ' + item.text());
        }
    }
};

var LinksOnTopNotifier = function () {
    
    return {
        notify: function(target, item, keywords) {
            // target.name
            // keywords
            // item.text()
            var itemid = item.attr('id');
            console.log("itemid: " + itemid);
            var linkToItemText = target.name + "(" + keywords + "): " + item.text().substr(0, 250) + '...';
            item.css("border", "dotted 2px red").css("padding", "1ex");
            $("<div><a href=\"#"+itemid+"\">"+linkToItemText+"</a></div>").insertBefore($("body *:first-child").first()).css("font-size", "small").css("margin", "1em").children('a').css("text-decoration", "none").select('a:visited').css('color', 'gray');
        }
    }
};

var Parser = function (a_itemsSelector, a_targets, a_notifier) {
    
    var _targets = a_targets;
    var _notifier = a_notifier;
    var _itemsSelector = a_itemsSelector;
    
    function checkOnKeyword(item, keyword) {
        //console.log(keyword);
        var pattern = new RegExp(keyword, 'im');
        return item.text().match(pattern) != null;
        // return (item.text().indexOf(keyword) > -1)
    }
    
    function checkOnTarget(item, target) {
        var keywords = [];
        for (var i = 0; i < target.keywords.length; i++) {
            if (checkOnKeyword(item, target.keywords[i]))
                keywords.push(target.keywords[i]);
        }
        return keywords;
    }
    
    function onItem(item) {
        var targets = _targets.get();
        for (key in targets) {
            var target = targets[key];
            console.log('target ' + key);
            var keywords = checkOnTarget(item, target);
            console.log('keywords.lenght ' + keywords.length);
            if (keywords.length > 0) {
                _notifier.notify(target, item, keywords);
            }
        }
    }
    
    function scanItems() {
//        $(_itemsSelector).each(function(){
        $(_itemsSelector)./*first().*/each(function(){
            var el = this;
            console.log(el);
            try {
            	onItem($(el));
	            console.log('item processed');
            } catch(e) {
                console.log('error processing: ' + e.message);
            }
        });
    }
    
    return {
        scan: function() {
            scanItems();
        }
    }
};

$(document).ready(function() {
    //alert($('div.post').length)
    var targets = new Targets({
        //maza: {name: 'maza', keywords: ['маза', 'год', 'новые', 'проект']},
        appleTv: {name: 'appleTv', keywords: ['apple tv', 'appletv', 'atv']},
        roomba: {name: 'roomba', keywords: ['irobot', 'roomba', 'робот', 'пылесос']},
        piano: {name: 'piano', keywords: ['пианин', 'фортепиан', 'синтезатор', 'midi', 'миди']}
    });
    //var notifier = new UrlNotifier('http://libin.org.ru/baraholka');
    var notifier = new LinksOnTopNotifier();
    var parser = new Parser('div.post', targets, notifier);
    parser.scan();
    var refresher = new Refresher(180000);
});