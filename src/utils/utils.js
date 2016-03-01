/* globals Enbridge */

Enbridge.Utils = Enbridge.Utils || {};

Enbridge.Utils.setLikeDislike = function (value) {
  $("#hdnLikeDislike").val(value);
};

Enbridge.Utils.stringToBoolean = function(value) {
  switch (value.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(value);
  }
};

Enbridge.Utils.formatDisplayStreet = function (unitNumber, streetNumber, suffix, streetName, city, province, postalCode) {
  var address = [];

  if (!!unitNumber) {
    address.push(unitNumber + ' - ');
  }

  address.push(streetNumber + ' ');

  if (!!suffix) {
    address.push(suffix + ' ');
  }

  address.push(streetName + ' <br /> ' + city + ', ' + province + '<br />' + postalCode);

  return address.join('').toUpperCase();
};
