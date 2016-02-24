Enbridge.Utils = Enbridge.Utils || {};

function setLikeDislike(value) {
  $("#hdnLikeDislike").val(value);
}
Enbridge.Utils.setLikeDislike = setLikeDislike;

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
