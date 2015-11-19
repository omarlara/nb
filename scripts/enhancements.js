// ---- START PRINTER FRIENDLY PAGES ----

function makePrinterFriendly()
{
	$('img').remove();
	$('a').remove('.logo');
	$('a').contents().unwrap().wrap("<span style='text-decoration:underline'></span>");
	$('h3 > span').removeAttr('style'); //for Go Paperless Contest section on Go Paperless page
	$('h4').removeAttr('style'); //for Go Paperless Contest section on Go Paperless page
	$('p').removeAttr('style'); //for Go Paperless Contest section on Go Paperless page
	$('font').removeAttr('color'); // for blue h2 on unregulated-storage.aspx
	$('input').attr('disabled', true);
	$('td:input').attr('disabled', true);
    //$('select').attr('disabled', true);
	//$('select:input').attr('disabled', true);
	//$('td:select').attr('disabled', true);
	if ((window.location.toString().indexOf("homes/index.aspx") != -1) || (window.location.toString().indexOf("businesses/index.aspx") != -1)) {
	    $('style').remove();
	}
	$('.updateItem').attr('style', 'display:block');
}




// ---- END PRINTER FRIENDLY PAGES ----

// ---- START FONT RESIZING ----


// Exclusions include classes and ids for div tags in the header, footer, and left nav menu
function isExclusion(thisElement) {
    var result = false;
    if (
            thisElement.className == "layout"
            || thisElement.className == "contentContainer clearfix"
            || thisElement.className == "sectionNav"
            || thisElement.className == "heading"
            || thisElement.className == "headerContainer"
            || thisElement.className == "header"
            || thisElement.className == "clearfix"
            || thisElement.className == "headerElements"
            || thisElement.className == "myenbridgeNav"
            || thisElement.className == "searchBar"
            || thisElement.className == "primaryNav ucase clearfix"
            || thisElement.className == "utilityBar clear"
            || thisElement.className == "breadcrumbs navigation clearfix"
            || thisElement.className == "smellGas"
            || thisElement.className == "copyright"
            || thisElement.className == "banner "
            || thisElement.className == "bannernav"
            || thisElement.className == "myECheckBox"
            || thisElement.className == "footerContainer"
            || thisElement.className == "footer"
            || thisElement.className == "fatFooterNav layout clearfix"
            || thisElement.className == "columns column3"
            || thisElement.className == "moreLinks columns"
            || thisElement.className == "secondaryFooterMenu layout clearfix"
            || thisElement.className == "Extranet_divMyEnbridgeLogin"
            || thisElement.className == "myEnbridgeTitle"
            || thisElement.className == "myEnbridgeSection"
            || thisElement.className == "emergencyBeforeDig columns"
            || thisElement.className == "addthis_button_compact at300m"
            || thisElement.className == "addthis_toolbox addthis_default_style"
            || thisElement.className == "items"
            || thisElement.className == "moreaboutbilling"
            || thisElement.className == "moreaboutgasusage"
            || thisElement.htmlFor == "ddlAccount"
            || thisElement.id == "ctl00_divNavigationLeft"
            || thisElement.id == "ctl00_ucUtilityBar_uptPanelUtilityBar"
            || thisElement.id == "ctl00_ctl00_ucUtilityBar_uptPanelUtilityBar"
            || thisElement.id == "ctl00_ctl00_ucUtilityBar_listBreadcrumb"
            || thisElement.id == "ctl00_ucUtilityBar_divFontSize"
            || thisElement.id == "ctl00_ucUtilityBar_divPrintPage"
            || thisElement.id == "ctl00_ucUtilityBar_divRssFeed"
            || thisElement.id == "ctl00_ucUtilityBar_divSocialMedia"
            || thisElement.id == "ctl00_BodyContent_ctrlLogin1_panelLogin"
            || thisElement.id == "ctl00_BodyContent_ctrlLogin1_divNotSignedInReturning"
            || thisElement.id == "ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divPaperBilling"
            || thisElement.id == "ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divAccountDropDown"
            || thisElement.id == "ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptPanelAccountSummary"
            || thisElement.id == "ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divPaperBillSuboptions"
            || (thisElement.previousSibling && thisElement.previousSibling.id == "ctl00_BodyContent_ctrlLogin1_chkRememberMe")
            || (thisElement.parentNode && thisElement.parentNode.id == "ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptPanelAccountSummary")
            || (thisElement.className == "table" && thisElement.parentNode && thisElement.parentNode.className == "popupcontent")
        ) {
        result = true;
    }

    return result;
}

function fontResize(x) {

    var elements = document.getElementsByTagName('div');

    for (i = 0; i < elements.length; i++) {
        if (!isExclusion(elements[i])) {
            switch (x) {
            case 1:
                elements[i].style.fontSize = "11px";
                break;
            case -1:
                elements[i].style.fontSize = "9px";
                break;
            default:
                elements[i].style.fontSize = "10px";
                //elements[i].style.removeProperty('font-size');
                
            }
        }
    }

    var labels = document.getElementsByTagName('label');
    
    for (j = 0; j < labels.length; j++) {
        if (!isExclusion(labels[j])) {
            switch (x) {
            case 1:
                labels[j].style.fontSize = "14px";
                break;
            case -1:
                if (labels[j].id == "ctl00_BodyContent_FAQWidget_textQuerylabel" || labels[j].id == "ctl00_BodyContent_ctl00_litRelatedQuestions") {
                    labels[j].style.fontSize = "11px";
                }
                else {
                    labels[j].style.fontSize = "12px";
                }
                break;
            default:
                labels[j].style.fontSize = "13px";
                //labels[j].style.removeProperty('font-size');
            }
        }
    }

    switch (x) {
        case 1:
            $('#relatedinformation > UL > LI > A').attr('style', 'font-size: 13px');
            $('span.FAQs-title').attr('style', 'font-size: 13px');
            $('span.helpfulAnswer').attr('style', 'font-size: 11px');
            $('span.bodytextfaq > P').attr('style', 'font-size: 14px');
            $('span.bodytextfaq > UL > LI').attr('style', 'font-size: 14px');
            $('span.bodytextfaq > UL > LI > DIV').attr('style', 'font-size: 14px');
            $('div.bodytext > span > p > span > span, div.bodytext > p > span > span').attr('style', 'font-size: 11.667px');
            $('div.item > h1 > div').removeAttr('style', 'font-size');
            $('.securityBar.myenbridgeinside').attr('style', 'font-size: 13px');
            $('div.myETable > div, div.myETable > div > div, div.myESectionTitle, div.myETable > div > div, div.myESectionTitle > div').attr('style', 'font-size: 13.033px');
            $('div.optionsservicescontainer, div.optionsservicescontainer > div > p, .myESignedUp.myEHighlightP, .myEBillDeliveryCol1, .myEBillDeliveryCol2').attr('style', 'font-size: 13.033px');
            $('div.optionsservicescontainer, div.optionsservicescontainer > div > div > div > div > p, div.myECheckBox > p, div.myECheckBox > div').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_panelContent, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptPanelAccountSummary > div, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divAccountDropDown > div, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divAccountDropDown > div > label').attr('style', 'font-size: 13.033px');
            $('.formname').attr('style', 'font-size: 17px');
            $('.formtitle').attr('style', 'font-size: 14px');
            $('.contactServiceStep, .contactOffice').attr('style', 'font-size: 14px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_divMoreAboutBilling > div.items').attr('style', 'font-size: 10px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_divMoreAboutGasUsage > div.items').attr('style', 'font-size: 10px');
            $('.rtIn').attr('style', 'font-size: 13px');
            $('.popupcontent, .popupcontent > p, .popupcontent > ul > li > a').attr('style', 'font-size: 14px');
            $('#tooltipbody').attr('style', 'font-size: 12px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent1_uptMyPaymentHistory').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_divAccountDropDown').attr('style', 'font-size: 13.033px');
            $('#ctl00$ctl00$BodyContent$ContentPlaceHolder1$menuContent2$ddlAccount').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_errorSummaryCtrl1_vldsctrl').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_pnlIVR').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_divDescription').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent3_uptMyPaymentHistory').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptLvbPaymentHistory').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_spanLitCurBillAmtDue').attr('style', 'font-size: 13.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_spanLitCurOutstandingBal').attr('style', 'font-size: 13.033px');
            break;
        case -1:
            $('#relatedinformation > UL > LI > A').attr('style', 'font-size: 11px');
            $('span.FAQs-title').attr('style', 'font-size: 11px');
            $('span.helpfulAnswer').attr('style', 'font-size: 9px');
            $('span.bodytextfaq > P').attr('style', 'font-size: 12px');
            $('span.bodytextfaq > UL > LI').attr('style', 'font-size: 12px');
            $('span.bodytextfaq > UL > LI > DIV').attr('style', 'font-size: 12px');
            $('div.bodytext > span > p > span > span, div.bodytext > p > span > span').attr('style', 'font-size: 9.667px');
            $('div.item > h1 > div').removeAttr('style', 'font-size');
            $('.securityBar.myenbridgeinside').attr('style', 'font-size: 11px');
            $('div.myETable > div, div.myETable > div > div, div.myESectionTitle, div.myETable > div > div, div.myESectionTitle > div').attr('style', 'font-size: 11.033px');
            $('div.optionsservicescontainer, div.optionsservicescontainer > div > p, .myESignedUp.myEHighlightP, .myEBillDeliveryCol1, .myEBillDeliveryCol2').attr('style', 'font-size: 11.033px');
            $('div.optionsservicescontainer, div.optionsservicescontainer > div > div > div > div > p, div.myECheckBox > p, div.myECheckBox > div').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_panelContent, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptPanelAccountSummary > div, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divAccountDropDown > div, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divAccountDropDown > div > label').attr('style', 'font-size: 11.033px');
            $('.formname').attr('style', 'font-size: 15px');
            $('.formtitle').attr('style', 'font-size: 12px');
            $('.contactServiceStep, .contactOffice').attr('style', 'font-size: 12px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_divMoreAboutBilling > div.items').attr('style', 'font-size: 8px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_divMoreAboutGasUsage > div.items').attr('style', 'font-size: 8px');
            $('.rtIn').attr('style', 'font-size: 11px');
            $('.popupcontent, .popupcontent > p, .popupcontent > ul > li > a').attr('style', 'font-size: 12px');
            $('#tooltipbody').attr('style', 'font-size: 10px');
            $('.PSHYPERLINK').attr('style', 'font-size: 10pt');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent1_uptMyPaymentHistory').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_divAccountDropDown').attr('style', 'font-size: 11.033px');
            $('#ctl00$ctl00$BodyContent$ContentPlaceHolder1$menuContent2$ddlAccount').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_errorSummaryCtrl1_vldsctrl').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_pnlIVR').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_divDescription').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent3_uptMyPaymentHistory').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptLvbPaymentHistory').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_spanLitCurBillAmtDue').attr('style', 'font-size: 11.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_spanLitCurOutstandingBal').attr('style', 'font-size: 11.033px');
            break;
        default:
            $('#relatedinformation > UL > LI > A').removeAttr('style', 'font-size');
            $('span.FAQs-title').removeAttr('style', 'font-size');
            $('span.helpfulAnswer').removeAttr('style', 'font-size');
            $('span.bodytextfaq > P').removeAttr('style', 'font-size');
            $('span.bodytextfaq > UL > LI').removeAttr('style', 'font-size');
            $('span.bodytextfaq > UL > LI > DIV').removeAttr('style', 'font-size');
            $('div.bodytext > span > p > span > span, div.bodytext > p > span > span').removeAttr('style', 'font-size');
            $('div.item > h1 > div').removeAttr('style', 'font-size');
            $('.securityBar.myenbridgeinside').removeAttr('style', 'font-size');
            $('div.myETable > div, div.myETable > div > div, div.myESectionTitle, div.myETable > div > div, div.myESectionTitle > div').removeAttr('style', 'font-size');
            $('div.optionsservicescontainer, div.optionsservicescontainer > div > p, .myESignedUp.myEHighlightP, .myEBillDeliveryCol1, .myEBillDeliveryCol2').removeAttr('style', 'font-size');
            $('div.optionsservicescontainer, div.optionsservicescontainer > div > div > div > div > p, div.myECheckBox > p, div.myECheckBox > div').removeAttr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_panelContent, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptPanelAccountSummary > div, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divAccountDropDown > div, #ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_divAccountDropDown > div > label').removeAttr('style', 'font-size');
            $('.formname').removeAttr('style', 'font-size');
            $('.formtitle').removeAttr('style', 'font-size');
            $('.contactServiceStep, .contactOffice').removeAttr('style', 'font-size');
            $('.rtIn').removeAttr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_divMoreAboutBilling > div.items').removeAttr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_divMoreAboutGasUsage > div.items').removeAttr('style', 'font-size');
            $('.popupcontent, .popupcontent > p, .popupcontent > ul > li > a').removeAttr('style', 'font-size');
            $('#tooltipbody').removeAttr('style', 'font-size');
            $('.PSHYPERLINK').children().css('font-size', '9pt');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent1_uptMyPaymentHistory').attr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_divAccountDropDown').attr('style', 'font-size');
            $('#ctl00$ctl00$BodyContent$ContentPlaceHolder1$menuContent2$ddlAccount').attr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_errorSummaryCtrl1_vldsctrl').attr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_pnlIVR').attr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent2_divDescription').attr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent3_uptMyPaymentHistory').attr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_uptLvbPaymentHistory').attr('style', 'font-size');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_spanLitCurBillAmtDue').attr('style', 'font-size: 12.033px');
            $('#ctl00_ctl00_BodyContent_ContentPlaceHolder1_menuContent0_spanLitCurOutstandingBal').attr('style', 'font-size: 12.033px');
    }
     

} // end function

// ---- END FONT RESIZING ----


