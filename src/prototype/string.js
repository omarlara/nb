String.prototype.validYear = function() {
  return Enbridge.ValidateUtils.isValidYear(this);
};

String.prototype.toBoolean = function() {
  return Enbridge.ValidateUtils.stringToBoolean(this);
};

String.prototype.validEmail = function() {
  return Enbridge.ValidateUtils.isValidEmail(this);
};

String.prototype.postalCode = function() {
  return Enbridge.ValidateUtils.isPostalCode(this);
};

String.prototype.isValidAccount = function() {
  return Enbridge.ValidateUtils.isValidAccount(this);
};

String.prototype.validPhoneFormat = function() {
  return Enbridge.ValidateUtils.isPhoneFormatValid(this);
};

String.prototype.validLada = function() {
  return Enbridge.ValidateUtils.isValidLada(this);
};

String.prototype.PhoneFormat = function() {
  return Enbridge.ValidateUtils.isValidPhoneFormat(this);
};
