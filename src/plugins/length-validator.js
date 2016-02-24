/* globals Enbridge */
Enbridge.Plugins.LengthValidator = Enbridge.Plugins.LengthValidator || function ($el) {
  this._value = '';
  this.$_el = $el;

  this.isValid = function (maxLength) {
    return (this._value.length <= maxLength );
  };

  this.setValue = function (value) {
    this._value = value;
  };

  if (!this.$_el) {
    return;
  }

  this.setValue(this.$_el.val());
};
