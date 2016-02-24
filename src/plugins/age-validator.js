/* globals Enbridge */
Enbridge.Plugins.AgeValidator = function($el) {
  var $_el = $el;
  var _date;

  function validate(expectedAge) {
    var now = Date.now();

    // Years of the person
    return (now - _date.valueOf()) / (365 * 24 * 3600 * 1000) >= expectedAge;
  }

  this.setDate = function(year, month, day) {
    _date = new Date(year, month - 1, day);
  };

  this.isValid = function(expectedAge) {
    expectedAge = expectedAge || $_el.attr('data-validate-age-greater-than');

    var messageError = '<p class="error-message">' + $_el.attr('data-validate-age-error-message') + '</p>';

    // Add error message
    if (!validate(parseInt(expectedAge, 10))) {
      $_el.append(messageError);
      return false;
    }

    return true;
  };

  // Set
  if (!$el) {
    return;
  }

  var dayId = $_el.attr('data-validate-age-day') || '';
  var $day = $_el.find('[data-id="' + dayId + '"]');
  if ($day.length < 1) {
    return;
  }

  var monthId = $_el.attr('data-validate-age-month') || '';
  var $month = $_el.find('[data-id="' + monthId + '"]');
  if ($month.length < 1) {
    return;
  }

  var yearId = $_el.attr('data-validate-age-year') || '';
  var $year = $_el.find('[data-id="' + yearId + '"]');
  if ($year.length < 1) {
    return;
  }

  this.setDate(
    parseInt($year.val(), 10),
    parseInt($month.val(), 10),
    parseInt($day.val(), 10)
  );
};
