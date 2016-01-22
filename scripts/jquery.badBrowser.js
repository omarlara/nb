
function GetUserAgent() {

    var browser = GetBrowserVersion1();

    if (browser.name == "Unknown") {
        // This is a special case if we detect this case, means we do not know the user agent , and becasue each useragent has a different string 
        // Order and also due to lack of sufficient information on at which character index the correct information resides , we will have to capture the whole user agent.
        var userAgent = navigator.userAgent;

    } else {

        var userAgent = browser.name + browser.version;
    }
    return userAgent;
}

//Return the current browser name and version
function GetBrowserVersion1() {
    var browser = "Unknown";
    var version = "Unknown";
    var userAgent = navigator.userAgent.toLowerCase();
    $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());

    // Is this a version of IE?
    if ($.browser.msie) {
        browser = "IE";
        version = $.browser.version;
    }

    // Is this a version of Chrome?
    if ($.browser.chrome) {
        browser = "Chrome";
        version = userAgent.substring(userAgent.indexOf('chrome/') + 7);
        // If it is chrome then jQuery thinks it's safari so we have to tell it it isn't
        $.browser.safari = false;
    }

    // Is this a version of Safari?
    if ($.browser.safari) {
        browser = "Safari";
        // Add the version number
        version = userAgent.substring(userAgent.indexOf('version/') + 8);
    }

    // Is this a version of Mozilla?
    if ($.browser.mozilla) {
        //Is it Firefox?
        if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
            browser = "Firefox";
            // Add the version number
            version = userAgent.substring(userAgent.indexOf('firefox/') + 8);
        }
    }

    // Is this a version of Opera?
    if ($.browser.opera) {
        browser = "Opera";
        if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Opera/x.x or Opera x.x (ignoring remaining decimal places);
            version = new Number(RegExp.$1) // capture x.x portion and store as a number
        }
    }

    return { name: browser, version: version };
}

//Return true if the current browser's version is supported by Extranet
function CheckBrowserVersion1() {
    var browser = GetBrowserVersion1();
    var version = browser.version.toString();
    if (version.indexOf(".") > 0)
        if (version.length >= (version.indexOf(".") + 2))
            version = version.substring(0, version.indexOf(".") + 2);
        else
            version = version.substring(0, version.indexOf("."));
    version = parseFloat(version);
    //alert(browser.version + ' - ' + version);
    var allow = false;

    switch (browser.name) {

        case "IE":
            allow = version >= 7 ? true : false;
            break;
        case "Firefox":
            allow = version >= 3.5 ? true : false;
            break;
        case "Chrome":
            allow = version >= 8 ? true : false;
            break;
        case "Safari":
            allow = version >= 4 ? true : false;
            break;
        case "Opera":
            allow = version >= 9 ? true : false;
            break;

    }


    return allow;
}




function UnsupportedBrowserCookie() {
    // Set up a cookie that you acknowledge that the browser is not supported and you would like to close the warning pannel*/
    $.cookie("UnsupportedBrowserCookie", "Yes", { expires: 1, path: '/' });

}


//Return true for supported browser or user wants to continue
function UnsupportedBrowserCookieExists() {
    if ($.cookie("UnsupportedBrowserCookie") == "Yes") {
        //alert('Cookie detected do not show friendly message');
        return true;
    } else {
        return false;

    }

}


function badBrowser() {

    if (CheckBrowserVersion1()) {
        return false;
    } else {
        return true;
    }
}

function getBadBrowser(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function setBadBrowser(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}



function browserDetectionScript() {
    /** The Script with run the Browser / Version test after which the pop on is displayed on the main page of the site**/
    /** The script will also launch a User Agent capture code snippet "meta tag" which will be tracked via web trends **/
    /** Just need to show it when ever the unsupported browser window opens up**/
    if (badBrowser()) { // Well if its unsupported browser

        //alert(UnsupportedBrowserCookieExists());

        $('head').append('<meta name=\"DCSext.notSupported\" content=\"' + GetUserAgent() + '\" />');

        if (UnsupportedBrowserCookieExists() == false) {   //Check if the cookies exist
            $(function () {
                $("<div id='browserWarning'>You are using an unsupported browser. Please switch to a current version of Internet Explorer, Firefox, Chrome, Safari or Opera. &nbsp;&nbsp;&nbsp;[<a href='#' id='warningClose'>Ignore for 1 day</a>] </div> ")
			.css({
			    backgroundColor: '#fcfdde',
			    'width': '100%',
			    'border-top': 'solid 1px #000',
			    'border-bottom': 'solid 1px #000',
			    'text-align': 'center',
			    padding: '5px 0px 5px 0px'
			})
			.prependTo("body");

                $('#warningClose').click(function () {
                    UnsupportedBrowserCookie();
                    $('#browserWarning').slideUp('slow');
                    return false;
                });
            });
        } else

        // Don't display anything at all 
        {


        }

    }
}
		



