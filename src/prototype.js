/***********************Prototyping functions***********************/
var dateCurrent = new Date(),
    validYear = dateCurrent.getFullYear() - 19;

String.prototype.validYear = function () {
    var value = this;
    if (!parseInt(value)) return false;

    if (value >= 1900) {
        return true;
    } else {
        return false;
    }
}

String.prototype.validEmail = function () {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this);
};

String.prototype.postalCode = function () {
    return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(this);
};

String.prototype.PhoneFormat = function () {
    return /^\d{3,3}(\-)\d{4,4}\d$/.test(this);
};
