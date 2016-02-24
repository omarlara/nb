/* globals Enbridge */

window.Enbridge.ValidateUtils = window.Enbridge.ValidateUtils || {};

Enbridge.ValidateUtils.isValidYear = function(value) {
  if (!parseInt(value, 10)) {
    return false;
  }

  return value >= 1900;
};

Enbridge.ValidateUtils.isValidEmail = function(value) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(value);
};

Enbridge.ValidateUtils.isPostalCode = function(value) {
  return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(value);
};

Enbridge.ValidateUtils.isValidAccount = function(value) {
  return /^\d{12}$/i.test(value);
};

Enbridge.ValidateUtils.isPhoneFormatValid = function(value) {
  return /^(\d[\- \ \ .]{0,1}){6}\d$/g.test(value);
};

Enbridge.ValidateUtils.isValidLada = function(value) {
  return /^\d{3}$/i.test(value);
};

Enbridge.ValidateUtils.isValidPhoneFormat = function(value) {
  return /^\d{3,3}(\-)\d{4,4}\d$/.test(value);
};

//Determine if a day is a business day
Enbridge.ValidateUtils.isBusinessDay = function(dateToCheck) {
    //If it's Sunday, avoid a service call
    if(0 === dateToCheck.getDay()) {
        return false;
    }

    var formattedDate = dateToCheck.getFullYear() + "-" + (dateToCheck.getMonth() + 1) + "-" + dateToCheck.getDate();
    var result = $.ajax({
      type: 'GET',
      async: false,
      url: '/WebServices/DateService.svc/IsSundayOrHolidayDate',
      data: {
        date: formattedDate
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('An error occurred checking for business date.' + textStatus + ' : ' + errorThrown + ' : ' + jqXHR.responseText);
      }
    }).responseText;

    return (result !== "true");
};
