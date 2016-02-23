//Validate the dates.  Return true if not valid.  
var dateValidator = function() {
  //Make sure all the calendars have valid dates or have not yet been validated.
  //The calendar on click event would have performed the actual validation
  var dateControls = $('[data-id="date-finish"][data-valid="false"], [data-id="date-start"][data-valid="false"], [data-id="moving-out-date"][data-valid="false"]')
  if (dateControls.length > 0) {
    return true;
  }
};
Enbridge.Plugins.DateValidator = dateValidator;
