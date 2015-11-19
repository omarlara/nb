//Global constants for Ajax SessionHandler call
var fieldSeparator = "||";
var keyValueSeparator = "~~";
var accountSeparator = "^^";
var ajaxLoadingMsg = "Loading ...";
var myAccountMsg = $('<span id=lblAccountAjaxMsg>' + ajaxLoadingMsg + '</span>');

//Gloable variables for Ajax SessionHandler call
var Extranet_IsPosted = "False";
var Extranet_DisplayCombo = false;
var Extranet_AllAjaxFields = "";
var Extranet_Processed = false;

 // implementing a trim function for strings in javascript
 String.prototype.trim = function () {
        return this.replace(/^\s*/, "").replace(/\s*$/, "");
    }

//Start - Handle Ajax call error
function pageLoad() {

    var manager = Sys.WebForms.PageRequestManager.getInstance();

    manager.add_endRequest(endRequest);

}

function endRequest(sender, args) {

    var Error = args.get_error();

    if (Error && Error.message)
    //alert(Error.message);
        window.location.reload();

    args.set_errorHandled(true);

}
//End - Handle Ajax call error

 function callMyEnbridgeSessionHandler(isPosted, timeout) {
     //Save values in global variables for reference by the Ajax callback function
     Extranet_IsPosted = isPosted;

     //Get all the fields to be retrieved by the ajax call
     Extranet_AllAjaxFields = "";
     var formAjaxFields = $("#Extranet_divAjaxPopulateFields");
     if (formAjaxFields.text() == '') {
         // no need to call ajax as the current page has no ajax fields
         return;
     }
     //Fields required by the form
     Extranet_AllAjaxFields = formAjaxFields.text().replace(/\n/g, '').replace(/ /g, '');
     //Uncomment if we don't want the control fields to be sent to the browser
     //formAjaxFields.remove();

     //alert("Extranet_AllAjaxFields=" + Extranet_AllAjaxFields);
     disableAllAjaxFields();

     //Make the ajax call
     $.ajax({
         url: '/UN/SessionHandler.aspx',
         async: true,
         data: { param: Extranet_AllAjaxFields },
         cache: false,
         timeout: timeout,
         dataType: "jsonp",
         jsonp: "jsoncallback",
         success: function (data, status) { jsonpcallback(data); },
         error: function (XHR, textStatus, errorThrown) { ajaxTimedOut(); }
     });
     setTimeout("ajaxTimedOut();", timeout);
 }

 function disableAllAjaxFields() {
     //alert(Extranet_AllAjaxFields);
     var fieldpairs = Extranet_AllAjaxFields.split(',');
     for (var i = 0; i < fieldpairs.length; i++) {
         //fieldpair = <html id to display the value>:<field to be retrieved>,
         var fieldpair = fieldpairs[i];
         var fields = fieldpair.split(':');
         var htmlName = fields[0].trim();
         var fieldName = fields[1].trim();
         try {
             //Disable each ajax field with the "Loading..." text
             if (fieldName == "AccountNumber") {
                 //Account number may be a text box or dropdown depending on user login or not
                 $("#" + htmlName).hide().after(myAccountMsg);
             } else if (htmlName.indexOf("_lbl") > 0) {
             //Don't re-populate the value if submit is clicked
             } else if (Extranet_IsPosted == "False") {
                 $("#" + htmlName).val(ajaxLoadingMsg).attr('disabled', true); ;
             }
         } catch (e) {
             //Ignore error and continue to next field
         }
     }
 }

 //clearData = true or false
 //true to set the input field to empty (from Loading...)
 //false to retain the input field value (populated by ajax)
 function enableAllAjaxFields(clearData) {
     //alert(allAjaxFields);
     var fieldpairs = Extranet_AllAjaxFields.split(',');
     for (var i = 0; i < fieldpairs.length; i++) {
         //fieldpair = <html id to display the value>:<field to be retrieved>,
         var fieldpair = fieldpairs[i];
         var fields = fieldpair.split(':');
         var htmlName = fields[0].trim();
         var fieldName = fields[1].trim();
         try {
             //Enable each ajax field
             if (fieldName == "AccountNumber") {
                myAccountMsg.hide();
                //Account number may be a text box or dropdown depending on user login or not
                if (Extranet_DisplayCombo) {
                    $("#" + htmlName).hide();
                } else {
                    $("#" + htmlName).show();
                }
             } else if (htmlName.indexOf("_lbl") > 0) {
             //Don't re-populate the value if submit is clicked
             } else if (Extranet_IsPosted == "False") {
                 $("#" + htmlName).removeAttr('disabled');
                 if (clearData)
                     $("#" + htmlName).val('').removeAttr('disabled');
                 else
                     $("#" + htmlName).removeAttr('disabled');
             }
         } catch (e) {
             //Ignore error and continue to next field
         }
     }
 }

 function ajaxTimedOut() {
     if (!Extranet_Processed) {
         //alert('ajaxTimedOut: Extranet_AllAjaxFields=' + Extranet_AllAjaxFields);
         Extranet_Processed = true;
         enableAllAjaxFields(true);
     }
 }

 //data=<html id1 to display the value>~~<field1 to be retrieved>~~<field1 value>||<html2 id to display the value>~~<field1 to be retrieved>~~<field2 value>||...
 function jsonpcallback(data) {
     //alert("Ajax callback triggered with results=" + data.results + "; Extranet_IsPosted=" + Extranet_IsPosted);

     //User not logged in or timed out
     if (data.results == '' || Extranet_Processed) {
         ajaxTimedOut();
         return;
     }
     Extranet_Processed = true;
     var fieldpairs = data.results.split(fieldSeparator);
     for (var i = 0; i < fieldpairs.length; i++) {
         //fieldpair = <html id to display the value>~~<field to be retrieved>~~<field value>
         var fieldpair = fieldpairs[i];
         var fields = fieldpair.split(keyValueSeparator);
         var htmlName = fields[0].trim();
         var fieldName = fields[1].trim();
         try {
             //Populate each field value by the ajax return value
             if (fieldName == "AccountNumber") {
                 values = fields[2];
                 if (values.indexOf(accountSeparator) > 0) {
                     //Populate account dropdown as only the selected account will be returned
                     populateMyEnbridgeDropDown(htmlName, values);
                 } else {
                     $("#" + htmlName).val(values);
                 }
             } else if (htmlName.indexOf("_lbl") > 0) {
                 $("#" + htmlName).text(fields[2]);
             } else if (Extranet_IsPosted == "False") {
                 //Don't re-populate the value if submit is clicked
                 //if ($("#" + htmlName).val() == "") 
                 $("#" + htmlName).val(fields[2]);
             }
         } catch (e) {
           //Ignore error and continue to next field
         }
     }

     enableAllAjaxFields(false);
 }

 //Populate account dropdown dynamically
 function populateMyEnbridgeDropDown(htmlName, values) {
     var accountLen = 16;
     var myAccount = $("#" + htmlName);
     //Create the account number dropdown dynamically
     var myCombo = $('<select id=ddl' + htmlName + "></select>");

     //Populate the actual input account field after a dropdown value is selected
     myCombo.bind({
         change: function () {
                    //Store the account number portion of the drop down value into the form's account number
                    myAccount.val(myCombo.val().substr(0, accountLen));
                 }
     });

     //Populate the dropdown values
     var accountValues = values.split(accountSeparator);
     for (var i = 1; i < accountValues.length; i++) {
         var accountValue = accountValues[i];
         //Truncate account value if maxAccountValueLen is provided
         if (typeof (maxAccountValueLen) != "undefined")
             if (accountValue.length > maxAccountValueLen)
                 accountValue = accountValue.substr(0, maxAccountValueLen);

         myCombo.append(
           $('<option></option>').val(accountValues[i]).html(accountValue)
         );
     }

     //Set default value for dropdown
     //alert("Extranet_IsPosted=" + Extranet_IsPosted + "; myAccount.val=" + myAccount.val());
     if (Extranet_IsPosted == "False" || myAccount.val() == '') {
         //From ajax return value - selected account in MyPage
         myCombo.attr('selectedIndex', accountValues[0]);
         myCombo.trigger('change');
         Extranet_DisplayCombo = true;
     } else {
         //From the actual input account number value
         for (var i = 1; i < accountValues.length; i++) {
             if (accountValues[i].substr(0, accountLen) == myAccount.val()) {
                 //alert("found " + myAccount.val());
                 myCombo.attr('selectedIndex', i - 1);
                 Extranet_DisplayCombo = true;
                 break;
             }
         }
     }
     
     if (Extranet_DisplayCombo)
         //Add the dropdown in DOM
         myAccount.before(myCombo);
 }
 