// Check whether the selected For Homes or For Businesses in Primary menu matches the cookie's value.
// If not match (normally due to caching), trust the cookie and change the selected tab accordingly
function CheckPrimaryMenu() {

    var cookieValue = null;
    var setCookie = false;
    var defaultUrl = '/homes';

    if ($(".homeBusinessNav li.selected").length == 0) {
        //User has not clicked the For Homes or For Businesses
        //Therefore use cookie to determine which option to hightlight
        var cookieValue = $.cookie("MyEnbridgeHomeOrBusiness");
        if (cookieValue == null) {
            setCookie = true;
            cookieValue = defaultUrl;
        }

        if (cookieValue == defaultUrl) {
            $(".homeBusinessNav li:eq(0)").addClass('selected');   //default to first option i.e. For Homes
        } else {
            $('body').addClass('bluemenu');
            $(".homeBusinessNav li:eq(1)").addClass('selected');
        }
    } else {
        if (!$(".homeBusinessNav li.selected a").attr('href').toLowerCase().startsWith(defaultUrl)) {
            $('body').addClass('bluemenu');
        }
        //Determine cookie value
        setCookie = true;
        cookieValue = location.pathname.slice(0, -1)
        var endIdx = cookieValue.indexOf("/", 5);
        // Just get the first section (i.e. /homes or /businesses) of the url
        if (endIdx > 5) {
            cookieValue = cookieValue.substring(0, endIdx);
        }
    }

    if (setCookie) {
        $.cookie("MyEnbridgeHomeOrBusiness", cookieValue, { expires: 36500, path: '/' });
    }

    // Set link for Enbridge logo
    $('a.logo').attr('href', cookieValue);

}


// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function ShowDescForSwitchToPaper(show) {
    var txt = $('.txtDescForSwitchToPaper');
    if (show) {
        txt.removeClass("hidden").focus();
    } else {
        if (!txt.hasClass("hidden"))
            txt.addClass("hidden");
    }
}

//Add au=y to the url to distinguish login page and non login page. It resolves the browser caching problem 
function AddLoggedInParmToUrl() {
    $('a[href]').attr('href', function (index, href) {
        var param = "au=y";
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

String.prototype.endsWith = function (suffix) {
    return this.match(suffix + "$") == suffix;
};

function GotoFormTop(anchorSelector) {
    var firstTime;
    if (firstTime == undefined) {
        firstTime = false;
        if (anchorSelector == null) anchorSelector = "h4.formname";
        if ($(anchorSelector).length > 0) $('html,body').animate({ scrollTop: $(anchorSelector).offset().top }, 0);
    }
}

// necessary to disable the weekends on client-side navigation
function OnDayRender(calendarInstance, args) {
    // convert the date-triplet to a javascript date
    // we need Date.getDay() method to determine 
    // which days should be disabled (e.g. every Saturday (day = 6) and Sunday (day = 0))                
    var jsDate = new Date(args.get_date()[0], args.get_date()[1] - 1, args.get_date()[2]);
    if (jsDate.getDay() == 0 || jsDate.getDay() == 6) {
        var otherMonthCssClass = "rcOutOfRange";
        args.get_cell().className = otherMonthCssClass;
        // replace the default cell content (anchor tag) with a span element 
        // that contains the processed calendar day number -- necessary for the calendar skinning mechanism 
        args.get_cell().innerHTML = "<span>" + args.get_date()[2] + "</span>";
        // disable selection and hover effect for the cell
        args.get_cell().DayId = "";
    }
}


