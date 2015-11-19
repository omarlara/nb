
/*config stuff for banner*/
var bannerIndex = 0;
var uClick = false;
var autotime = 4000;
var t, newsitems, tickertotal;
var tickeritem = 0;
var numBanners;
var IsModalPage = false;

$(function () {
    numBanners = $("#movingbannercontainer").children().length
    /*check for url parameter*/
    var ids = gup("ids");

    ids = ids.split(",");
    var eleList = '';
    var idsLen = ids.length;
    for (var i = 0; i < idsLen; i++) {
        if (ids[i] != '') eleList = eleList + "#" + ids[i] + ','; //doing this causes an error on ff
    }

    eleList = eleList.substr(0, eleList.length - 1);
    if (eleList != '') eleList = $(eleList);
    if (eleList.length == 0 || eleList == '') eleList = $("#topnavguest,#bottomnavguest,#mainnavguest,#bannercalloutguest");
    eleList.removeClass("hidden")

    /*** Make selected breadcrumb item not clickable ***/
    $('.breadcrumbs li.selected a').removeAttr('href');

    /*** initialize drop down menu on hover ***/

    $('.dropdown li').hover(

	function () {
	    $(this).addClass('slide-down');
	    $(this).children("ul").slideDown(1);

	},
    // slide up
	function () {
	    obj = this;
	    $(this).children("ul").slideUp(1, function () {
	        $('.menu-first', obj).removeClass('slide-down');
	    });
	});

    /*** initialize left nav menu on hover ***/

    var leftNavConfig = {
        over: leftNavExpand, // function = onMouseOver callback (REQUIRED)    
        timeout: 900, // number = milliseconds delay before onMouseOut    
        out: leftNavCollapse // function = onMouseOut callback (REQUIRED)    
    };

    function leftNavExpand() {
        $(this)
	           .addClass('bulletMinus')
	           .removeClass('bulletPlus')
		       .addClass('slide-down')
		       .children("ul").slideDown(500);
    }
    // slide up
    function leftNavCollapse() {
        obj = this;
        $(this).addClass('bulletPlus')
		       .removeClass('bulletMinus')
        $(this).children("ul").slideUp(100, function () {
            $(obj).removeClass('slide-down');
        });
    }


    $('.sectionNav .navigation li.bulletPlus').hoverIntent(leftNavConfig);


    // *** call home page banner ****
    var banner = $("#movingbannerwindow");

    var siteurl = window.location.toString();
    if (siteurl.indexOf("print=true") == -1) {
        animateNav();
        animateTicker();
    }

    if (banner.length != 0) {
        if (numBanners > 1) {
            $(".bannerbtn").click(function (e) {
                e.preventDefault();
                var selectedbanner = $("#movingbannercontainer .selected");
                selectedbanner.stop(true, true);
                var ele = $(this);
                gotoBanner(ele);

            });
            //autorotate - disabled in the case of a printer friendly page
            if (siteurl.indexOf("print=true") == -1) {
                setTimeout("animateHeadersUp()", autotime);
            }
        } else {
            $(".bannerbtn").hide();
        }
    }
    // *** call tool tip menu ****
    initTooltips2();

    // *** call allaccountsmask ****
    $("#allaccountsmask").width($(window).width()).height($(window).height())

    var labelinputs = $(".labelinput");

    labelinputs.focusin(function () {
        var ele = $(this);
        if (!ele.hasClass('nonlabel')) {
            var lbl = ele.val();
            ele.data('lblval', lbl);
            ele.val('');
            ele.addClass('nonlabel');
        }
    });

    labelinputs.focusout(function () {
        var ele = $(this);
        var lbl = ele.val();
        if (lbl == '') {
            ele.val(ele.data('lblval'));
            ele.removeClass('nonlabel');
        }
        else ele.addClass('nonlabel');
    });

})



var animateHeadersUp = function (destinationIndex) {
    clearTimeout(t);

    if ($("#movingbannercontainer .selected").length == 0) {
        $(".bannerContainer").first().addClass('selected');
        bannerIndex = 0;
    }

    if (typeof destinationIndex == 'undefined') destinationIndex = bannerIndex + 1;
    //alert(destinationIndex);
    if (destinationIndex == numBanners) destinationIndex = 0;

    //var cIndex = $(".selected").index(ele);

    var bannerHeight = $(".bannerContainer").height();
    var movingBannerContainer = $("#movingbannercontainer");
    var firstbanner = $("#movingbannercontainer .selected");
    var secondbanner = $("#movingbannercontainer .bannerContainer:nth-child(" + (destinationIndex + 1) + ")");

    firstbanner.css({ zIndex: "3" }).addClass('selected');
    secondbanner.css({ zIndex: "2" });
    //alert(firstbanner);
    firstbanner.fadeOut(2000,
	function () {
	    firstbanner.css({ display: "block", zIndex: "1" }).removeClass('selected');
	    secondbanner.addClass('selected');
	    bannerIndex = destinationIndex;
	});
    $(".bannerbtn").removeClass("selected");
    $(".bannerbtn:nth-child(" + (destinationIndex + 1) + ")").addClass("selected");

    //var oldSelectedIndex = $(".bannerbtn").index($(".bannerbtn.selected").first())
    //var newSelectedIndex = (oldSelectedIndex + distance) % numBanners;
    //$(".bannerbtn").removeClass("selected").eq(bannerIndex+1).addClass("selected");

    t = setTimeout("animateHeadersUp()", autotime);

}

// *** banner navigation ****/
var gotoBanner = function (ele) {
    clearTimeout(t);
    var originIndex = $(".bannerbtn").index($(".bannerbtn.selected").first());
    var destinationIndex = $(".bannerbtn").index(ele);

    animateHeadersUp(destinationIndex);
}

// *** section menu navigation animation ****/
var animateNav = function () {
    var leftnav = $("#sectionNav");
    var ele;
    if (leftnav.length != 0) {
        //code to add classess to parent elements
        ele = $("#sectionNav .level2 > .selected")
        if ($("#sectionNav .level2 > .selected ul").length == 0)
            ele.addClass("notparent");
        else if ($("#sectionNav .level2 > .selected .selected").length == 0)
            ele.addClass("isparentselected");
        else
            ele.addClass("isparentnotselected");

        ele = $("#sectionNav .level1 > .selected")
        if ($("#sectionNav .level1 > .selected ul").length == 0)
            ele.addClass("notparent");
        else if ($("#sectionNav .level1 > .selected .selected").length == 0)
            ele.addClass("isparentselected");
        else
            ele.addClass("isparentnotselected");


        //code to animate nav
        $("#sectionNav .level1").slideDown(500, "easeInOutCirc");
        $("#sectionNav .selected .level2").delay(500).slideDown(500, "easeInOutCirc");
        $("#sectionNav .selected .level2 .selected .level3").delay(1000).slideDown(500, "easeInOutCirc");
        
    }
}

/* tool tips */

var initTooltips = function () {
    $(".tooltip")
		.each(function () {
		    if ($(this).attr("title") != "") {
		        $(this).data("content", $(this).attr("title"))
		        $(this).attr("title", "");
		    }
		})
		.click(
			function () {
			    var tooltip = $("#tooltipcontainerMyE");
			    //if (tooltip.hasClass("hidden")) {
			    var el = $(this);
			    var elpos = el.offset();
			    var eldimensions = { width: el.width(), height: el.height() }

			    var tooltipdimensions = {};
			    var tooltippos = {}
			    var viewportdimensions = { width: $(window).width(), height: $(window).height() }

			    tooltip.removeClass("hidden").find("#tooltipbody").html(el.data("content").replace(/\n/g, "<br />").replace(/@@b@@/g, "<strong>").replace(/@@\/b@@/g, "</strong>"))
			    tooltipdimensions.width = tooltip.width()
			    tooltipdimensions.height = tooltip.height()

			    tooltippos.top = elpos.top - tooltipdimensions.height - 15;
			    tooltippos.left = elpos.left - 23;

			    if (tooltippos.top < $(window).scrollTop()) {
			        tooltippos.top = elpos.top + eldimensions.height + 15;
			        tooltip.addClass("tooltipbelow");
			    }
			    if (tooltippos.left + tooltipdimensions.width > viewportdimensions.width) {
			        tooltippos.left -= 290;
			        tooltip.addClass("tooltipleft");
			    }

			    tooltip.css({ left: tooltippos.left + "px", top: tooltippos.top + "px" });
			    //} else {
			    //    tooltip.addClass("hidden")
			    //}
			}
		)
}

var initTooltips2 = function () {
    $(".tooltip2")
		.each(function () {
		    $(this).data("content", $(this).attr("title"))
		    $(this).attr("title", "");
		})
		.mouseover(
			function () {
			    var tooltip = $("#tooltipcontainer");
			    if (tooltip.hasClass("hidden")) {
			        tooltip.css({ width: "auto" });
			        var el = $(this);
			        var elpos = el.offset();
			        var eldimensions = { width: el.width(), height: el.height() }

			        var tooltipdimensions = {};
			        var tooltippos = {}
			        var viewportdimensions = { width: $(window).width(), height: $(window).height() }

			        tooltip.removeClass("hidden").find("#tooltipbody").html(el.data("content"))
			        tooltipdimensions.width = tooltip.width() > 300 ? 300 : tooltip.width();
			        tooltipdimensions.height = tooltip.height();

			        //by default, we will show tooltips to the right of the link, and centered vertically.
			        //check 1: tooltip appears past the viewport on the right side
			        //check 2: tooltip appears past the viewport on the top
			        //check 3: tooltip appears past the viewport on the bottom
			        if (elpos.left + eldimensions.width + 5 + tooltipdimensions.width > viewportdimensions.width) {
			            //switch to the left side
			            tooltippos.left = elpos.left - 20 - tooltipdimensions.width;
			        } else {
			            //display 5px to the right of the element
			            tooltippos.left = elpos.left + eldimensions.width + 5;
			        }
			        tooltippos.left = elpos.left - (tooltipdimensions.width / 2) + 5;
			        tooltippos.top = elpos.top - (tooltipdimensions.height) - 20;


			        tooltip.css({ left: tooltippos.left + "px", top: tooltippos.top + "px", width: tooltipdimensions.width + "px" });
			    } else {
			        tooltip.addClass("hidden")
			    }

			}
		)
		.mouseleave(
			function () {
			    $('#tooltipcontainer').addClass('hidden');
			}
		)
}


var closeTooltipMyE = function () {
    $('#tooltipcontainerMyE').addClass('hidden').removeClass("tooltipleft").removeClass("tooltipbelow");
}

var closeTooltip = function () {
    $('#tooltipcontainer').addClass('hidden').removeClass("tooltipleft").removeClass("tooltipbelow");
}

/**** my enbridge page toggleviewaccounts ****/

var toggleviewaccounts = function () {
    var allaccounts = $("#allaccountsview");

    if (allaccounts.hasClass("hidden")) {
        //show it, open mask
        $("#allaccountsmask").removeClass("hidden").css({ top: $(window).scrollTop() + "px" })
        allaccounts.removeClass("hidden");
    } else {
        allaccounts.addClass("hidden");
        $("#allaccountsmask").addClass("hidden")
    }

}




/** Resize of the modal layer logic **/
$(window).resize(function () {


    //This information has been added to fix a specific problem which is when you reduce the size of browser window , the template background gets chopped in half from right side
    // Logic Specific to the home page template background - Note this would not be neeeded if the flaw did not exist in origional template designs
    //if layout is less than size of the window, then header should be size of the layout
    var headerWidth = $(document).width();
    var layoutWidth = $('.layout').width();
    var windowWidth = $(window).width();
    var extrawidth = 100;
    if (layoutWidth > windowWidth) {
        headerWidth = layoutWidth + extrawidth;
        $('.headerContainer').css({ 'width': headerWidth });
        $('.footerContainer').css({ 'width': headerWidth });
        $('.movingbannerwindow').css({ 'width': headerWidth });

    }
    else {

        $('.headerContainer').removeAttr("style");
        $('.footerContainer').removeAttr("style");
        $('.movingbannerwindow').removeAttr("style");

    }

    // Logic Specific to the home page template background End below logic is for the "modal layer" Note

    waitForFinalEvent(function (page) {
        setMask(IsModalPage);  /* IsModal is set up on top of the page when we detect it to be a modal page and someone has click on modal it gets assigned the true value dynamically*/

    }, 500, "Unique String");
});


var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();

/** End of Resize of the modal layer logic **/



/**** modal dialog code ****/
/*var showmodal = function (page) {*/


function showmodal(page) {
    var pageUrl = page; //save the pageUrl in a variable bacause after the load function runs, the variable is changed to the page contents.
    $("#popupcontent").load(page, function (page) { loadpopup(pageUrl); });
    showLoadingMessage();
}

function showLoadingMessage() {
    var needResize = true;
    IsModalPage = true; //We setup the modal to true to identifiy that its a modal page
    setMask(needResize);
    $("#popupcontent").html("<img src=\"/AppImages/loading.gif\" >");
}

function setMask(needResize) {
    if (needResize != true)
        return;

    //Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    if (maskWidth < 1000) {
        maskWidth = 2000;
    }

    //Set heigth and width to mask to fill up the whole screen
    $('#mask').css({ 'width': maskWidth, 'height': maskHeight });

    //transition effect		
    $('#mask').fadeIn(500);
    $('#mask').fadeTo("slow", 0.8);
}


var loadpopup = function (pageUrl) {

    var title = $("#dialogtitlesetter").html();
    $("#dialogtitle").html(title);

    var id = "#dialog";

    //set width
    var popupWidth = $("#widthsetter").html();
    $(id).css('width', popupWidth);

    //Get the window height and width

    var winH = $(window).height();
    var winW = $(window).width();

    //Set the popup window to center but not closer than 50 pixels from the top.
    if ((winH / 2 - $(id).height() / 2) < 50)
        $(id).css('top', 50 + $(window).scrollTop());
    else
        $(id).css('top', (winH / 2 - $(id).height() / 2) + $(window).scrollTop());


    /** Special Case Added**/
    /** This is related to the message on the contact us page this negative behavior occours on that page**/
    if (($(id).width() / 2) > (winW / 2)) {
        /**We are hitting the negative value so the message will be shoved to left otherwise 10-30% of the page disappears unviewable territory on the browser **/
        $(id).css('left', 200);
    } else {
        $(id).css('left', winW / 2 - $(id).width() / 2);
    }


    //transition effect
    $(id).fadeIn(100);

    //if close button is clicked
    $('.dialogclose').click(function (e) {
        //Cancel the link behavior
        e.preventDefault();
        IsModalPage = false;  //This is being added becasue if we do not set this back to false, this stays as true and when you resize a page the mask comes back 
        $('#mask').hide();
        $('.window').hide();
    });

    //call the function for interactive bill or any other one specified.
    var initPopupFunction = $("#initJavaScriptFunction").html();
    if (initPopupFunction != null) {
        var func = eval(initPopupFunction);
        func();
    }

    //track this in WebTrends
    dcsMultiTrack('DCS.dcsuri', pageUrl, 'WT.ti', title);
}

function loadBillPage(page) {
    $('#popupcontent').load(page, initinteractivebill);
}


var initinteractivebill = function () {
    /* interactive bill layer clickable icons*/

    $('.icon_group').click(
		function () {
		    var ele = $(this).attr("id");
		    var eleClass = $(this).attr("class");
		    if (eleClass.toString().indexOf('icon_bill_doubledigit') > -1)
		        show_icon_bill_over_doubledigit(this); //  show overstate
		    else
		        show_icon_bill_over(this); //  show overstate

		    var otherEle = ele.replace('icon', '#callout_');
		    var eleIndex = $('.icon_group').index(this);
		    //alert('index1='+eleIndex);
		    $('.interactiveCallout').removeClass('show');
		    //hide instructions
		    $('#instructions').addClass('hidden');
		    //show selected index element
		    $('.interactiveCallout').eq(eleIndex).addClass('show');
		}
	);

    /* interactive callout navigation*/
    $('.interactiveCallout .next, .interactiveCallout .previous').click(
		function () {
		    var incrememter = ($(this).hasClass('next')) ? 1 : -1;
		    var ele = $(this).closest('div.interactiveCallout').attr("id");
		    var num = parseInt(ele.replace('callout_', '')) + incrememter;
		    var nextEle = "#callout_" + num;
		    var nextIconEle = "#icon" + num;

		    if (num > 9) { //if the number is not single digit i.e 10 + 
		        show_icon_bill_over_doubledigit(nextIconEle); //  show overstate for double digits

		    } else {
		        show_icon_bill_over(nextIconEle); //  Show overstate for single digits
		    }

		    $('.interactiveCallout').removeClass('show');
		    $(nextEle).addClass('show');
		}
	);
    $('.interactiveCallout .close').click(
		function () {
		    $('.interactiveCallout').removeClass('show');
		    $('#instructions').removeClass('hidden');
		    $('.icon_bill').removeClass('icon_bill_over_singledigit');
		}
	);
}


/* show / hide icons for interactive bill layer */

var show_icon_bill_over = function (ele) {                           /** This will handle the single digit*/
    $('.bill a').removeClass('icon_bill_over_singledigit');
    $('.bill a').removeClass('icon_bill_over_doubledigit');
    $(ele).addClass('icon_bill_over_singledigit');

}

var show_icon_bill_over_doubledigit = function (ele) {              /** This will handle the double digit*/
    $('.bill a').removeClass('icon_bill_over_singledigit');
    $('.bill a').removeClass('icon_bill_over_doubledigit');
    $(ele).addClass('icon_bill_over_doubledigit');

}



var gup = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

var animateTicker = function () {
    newsticker = $('.newsTicker');
    if (newsticker.length > 0) {
        newsitems = $('.updateItem');
        tickertotal = newsitems.length;
        nextTickerItem();
    }
}

var nextTickerItem = function () {
    if (tickeritem == tickertotal) tickeritem = 0;

    newsitems.eq(tickeritem).fadeIn(500).delay(3000).fadeOut(500, function () {
        tickeritem++;
        nextTickerItem();
    });
}

//tickertotal;
//tickeritem = 0;

// new function for resizing iframe height
// first used with industrial portal public content
function setIframeHeight(iframe) {
    if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
            iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
        }
    }
}

// new function for getting a parameter from a URL via javascript
function getURLParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function checkMobileOrDesktop() {
        //mobile or desktop

        if (screen.width <= 720 && getURLParameterByName('StayInDesktopMode') != "true") {
            window.location = "/mobile/index.aspx";
        }
    }

function persistDesktopMode() {
    if (getURLParameterByName('StayInDesktopMode') == "true") {
        AddDesktopParmToUrl();
    }
}

//Add StayInDesktopMode=true to the url 
function AddDesktopParmToUrl() {
    $('a[href]').attr('href', function (index, href) {
        var param = "StayInDesktopMode=true";
        if (href.match(/javascript/i) || href.indexOf('?' + param) > 0 || href.indexOf('&' + param) > 0 || href.indexOf('#') >= 0)
        // Ignore if javascript in href or au=y already exists
            return href;
        else if (this.host.substring(0, window.location.host.length) != window.location.host)
        // Ignore if not extranet link
            return href;
        else if (href.charAt(href.length - 1) === '?') //Very unlikely
            return href + param;
        else if (href.indexOf('?') >= 0)
            return href + '&' + param;
        else
            return href + '?' + param;
    });
}
