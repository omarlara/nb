/*! moves - v1.0.0 - 2016-02-24*/
var Enbridge = window.Enbridge || {
  UrlServices: {
    GET_PROVINCES: '/WebServices/AddressService.svc/GetProvinces',
    VALIDATE_CUSTOMER_AND_GET_DATA: '/WebServices/GasAccountService.svc/ValidateCustomerAndGetData',
    VALIDATE_PHONE_BLACKLIST: '/WebServices/PhoneService.svc/IsPhoneNumberBlacklisted'
  },
  Templates: {
    PROVINCE: '<option value=":provinceCode" :wasPicked>:provinceName</option>'
  },
  CountryCodes: {
    CANADA: 'CA'
  },
  ProvinceCodes: {
    ONTARIO: 'ON'
  },
  TrackingUrls: {
    AUTHENTICATED_FLOW: 'Moves/MoveEntry.aspx',
    AUTHENTICATED_FLOW_SUMMARY: 'Moves/MoveSummary.aspx',
    AUTHENTICATED_FLOW_SUCCESS: 'Moves/MoveThanks.aspx',

    OPEN_NEW_GAS_ACCOUNT_FLOW: '/homes/start-stop-move/moving/newaccountentry.aspx',
    OPEN_NEW_GAS_ACCOUNT_FLOW_SUMMARY: '/homes/start-stop-move/moving/newaccountsummary.aspx',
    OPEN_NEW_GAS_ACCOUNT_FLOW_SUCCESS: '/homes/start-stop-move/moving/newaccountthanks.aspx',

    MOVE_OUT_FORM_FLOW: '/homes/start-stop-move/moving/move-out-entry.aspx',
    MOVE_OUT_FORM_FLOW_SUMMARY: '/homes/start-stop-move/moving/move-out-summary.aspx',
    MOVE_OUT_FORM_FLOW_SUCESSS: '/homes/start-stop-move/moving/move-out-thanks.aspx'
  },
  Plugins: {},
  Events: {
    TRACK_IN_WEBTRENDS: 'Enbridge.Events.trackInWebTrends'
  }
};

window.Enbridge.DateUtils = window.Enbridge.DateUtils || {};

Enbridge.DateUtils.addDaysToDate = function(date, number) {
  var result = true,
    currentDate = date.getDate();

  if (!parseInt(number, 10)) {
    result = false;
  }

  date.setDate(currentDate + number);

  return result;
};

/*Date Formater*/
function dateFormater(stringDate) {
  var splitDates = stringDate.split('-'),
    dateValue = '';

  switch (splitDates[1]) {
    case '1':
      dateValue = 'January';
      break;
    case '2':
      dateValue = 'February';
      break;
    case '3':
      dateValue = 'March';
      break;
    case '4':
      dateValue = 'April';
      break;
    case '5':
      dateValue = 'May';
      break;
    case '6':
      dateValue = 'June';
      break;
    case '7':
      dateValue = 'July';
      break;
    case '8':
      dateValue = 'August';
      break;
    case '9':
      dateValue = 'September';
      break;
    case '10':
      dateValue = 'October';
      break;
    case '11':
      dateValue = 'November';
      break;
    case '12':
      dateValue = 'December';
      break;
  }

  switch (splitDates[2]) {
    case '1':
    case '21':
    case '31':
      dateValue += (' ' + splitDates[2] + 'st');
      break;
    case '2':
    case '22':
      dateValue += (' ' + splitDates[2] + 'nd');
      break;
    case '3':
    case '23':
      dateValue += (' ' + splitDates[2] + 'rd');
      break;
    case '1':
      dateValue += (' ' + splitDates[2] + 'st');
      break;
    default:
      dateValue += (' ' + splitDates[2] + 'th');
      break;
  }

  return dateValue;
}
Enbridge.DateUtils.dateFormater = dateFormater;

function getTotalDays(year, month) {
    return 32 - new Date(year, month - 1, 32).getDate();
}
Enbridge.DateUtils.getTotalDays = getTotalDays;

window.Enbridge.ServiceUtils = window.Enbridge.ServiceUtils || {};

function loadProvinces(data, id, pickProvince) {
  $.getJSON(Enbridge.UrlServices.GET_PROVINCES, data, function populateProvinces(provinces) {
    var i = 0,
      len = provinces.length || 0,
      $provinceDropdown = $('[data-id="' + id + '"]'),
      compilation = '';

    for (i = 0; i < len; i += 1) {
      compilation +=
        Enbridge.Templates.PROVINCE.replace(':provinceCode', provinces[i].Code)
        .replace(':provinceName', provinces[i].Name)
        .replace(':wasPicked', (!!pickProvince && pickProvince === provinces[i].Code ? 'selected' : ''))
    }

    $provinceDropdown.html(compilation);
    $provinceDropdown.enbridgeDropdown();
  });
}
Enbridge.ServiceUtils.loadProvices = loadProvinces;

function trackAccordionWizardStepsInWebTrends (e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    var step = Enbridge.Plugins.AccordionWizard.getCurrentStep($('.accordion')),
    url = document.URL;

    // Do not repeat step
    if (step > Enbridge.currentStep) Enbridge.currentStep = step;
    else return;

    // Move form
    if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW) >= 0) {
      switch (step) {
        case 2:
            dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/address.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_New_Address_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20New%20Address','WT.si_x', '2');
            break;
        case 3:
            // Auth Dates Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/dates.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_Dates_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20Dates','WT.si_x', '3');
            break;
        case 4:
            // Auth Your Info Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/your-info.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_Your_Info_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20Your%20Info','WT.si_x', '4');
            break;
      }
    }

    // Moveout form
    if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW) >= 0) {
      switch (step) {
        case 2:
            // UnAuth Move Out New Address Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/address.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Address_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Address','WT.si_x', '2');
            break;
        case 3:
            // UnAuth Move Out Dates Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/dates.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Dates_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Dates','WT.si_x', '3');
            break;
        case 4:
            // UnAuth Move Out Your Info Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/your-info.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Your_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Your%20Info','WT.si_x', '4');
            break;
      }
    }

    // Newaccount entry
    if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW) >= 0) {
      switch (step) {
        case 2:
            // New Customer Address Step"
            dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/address.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Address_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Address%20Info','WT.si_x', '2');
            break;
        case 3:
            // New Customer Dates Step"
            dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/dates.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Dates_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Dates','WT.si_x', '3');
            break;
        case 4:
            // New Customer Your Info Step"
            dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/billing-services.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Billing_Services_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Billing%20Services','WT.si_x', '4');
            break;
      }
    }
}
Enbridge.ServiceUtils.trackAccordionWizardStepsInWebTrends = trackAccordionWizardStepsInWebTrends;

function trackWebTrendsHandler () {
  var step = Enbridge.Plugins.AccordionWizard.getCurrentStep($('.accordion')),
      url = document.URL;

  // Auth Summary Step
  if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW_SUMMARY) >= 0) {
      dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/summary.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Summary_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Summary','WT.si_x', '5');
  }
  // Auth Move Successs Step
  if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW_SUCCESS) >= 0) {
      dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/success.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Move_Success_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Success','WT.si_x', '6','WT.si_c', '1');
  }

  // UnAuth Move Out Summary Step
  if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW_SUMMARY) >= 0) {
    dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/summary.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Summary_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Summary','WT.si_x', '5');
  }
  // UnAuth Move Out Successs Step
  if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW_SUCESSS) >= 0) {
    dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/success.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Success_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Success','WT.si_x', '6','WT.si_cs', '1');
  }

  // Open new gas account - Summary Step
  if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW_SUMMARY) >= 0) {
    dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/summary.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Summary_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Summary','WT.si_x', '5');
  }
  // Open new gas account - Successs Step
  if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW_SUCCESS) >= 0) {
      dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/success.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Move_Success_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Success','WT.si_x', '6','WT.si_c', '1');
  }

  // Do not repeat step
  if (step > Enbridge.currentStep) Enbridge.currentStep = step;
  else return;

  // Move form
  if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW) >= 0) {
    switch (step) {
      case 1:
          // Auth Move Details Step
          dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/details.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_Move_Details_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20Details','WT.si_x', '1');
          break;
    }
  }

  // Moveout form
  if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW) >= 0) {
    switch (step) {
      case 1:
          // UnAuth Move Out Account Info Step
          dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/account-info.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Account_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Account%20Info','WT.si_x', '1');
          break;
    }
  }

  // Newaccount entry
  if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW) >= 0) {
    switch (step) {
      case 1:
          // New Customer Info Step"
          dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/customer-info.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Cust_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Customer%20Info','WT.si_x', '1');
          break;
    }
  }
}
Enbridge.ServiceUtils.trackWebTrendsHandler = trackWebTrendsHandler;

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

window.Enbridge.ValidateUtils = window.Enbridge.ValidateUtils || {};

Enbridge.ValidateUtils.isValidYear = function(value) {
  if (!parseInt(value, 10)) return false;

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
var isBusinessDay = function(dateToCheck) {
    //If it's Sunday, avoid a service call
    if(dateToCheck.getDay() == 0){
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

    if (result == "true") {
      return false;
    } else {
      return true;
    }
};
Enbridge.ValidateUtils.isBusinessDay = isBusinessDay;

Enbridge.Plugins.AccordionWizard = window.Enbridge.Plugins.AccordionWizard || {
    // Know which is the current step (active step) in wizard
    getCurrentStep: function ($accordion) {
      if ($accordion.length < 1) {
        return -1;
      }
      var $accordionItems = $accordion.find('.accordion-item');
      var i, len, accordionItem;
      for (i = 0, len = $accordionItems.length; i < len; i += 1) {
        accordionItem = $accordionItems.get(i);
        if (accordionItem.className.indexOf('active') >= 0) {
          return (i + 1);
        }
      }
      return -1;
    }
};

Enbridge.Plugins.AgeValidator = (function($) {
  var AgeValidator = function($el) {
    var $_el = $el;
    var _date;

    function validate(expectedAge) {
      var now = Date.now();

      // Years of the person
      return (now - _date.valueOf()) / (365 * 24 * 3600 * 1000) >= expectedAge;
    };

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
    if ($day.length < 1) return;

    var monthId = $_el.attr('data-validate-age-month') || '';
    var $month = $_el.find('[data-id="' + monthId + '"]');
    if ($month.length < 1) return;

    var yearId = $_el.attr('data-validate-age-year') || '';
    var $year = $_el.find('[data-id="' + yearId + '"]');
    if ($year.length < 1) return;

    this.setDate(
      parseInt($year.val(), 10),
      parseInt($month.val(), 10),
      parseInt($day.val(), 10)
    );
  }
  return AgeValidator;
}(jQuery));

(function ($) {
  function CodeTool(element) {
    this.element = element;

    this.addMethods();
  }
  CodeTool.prototype.restart = function() {
    $element
      .removeClass('opened required')
      .addClass('closed');
  };

  CodeTool.prototype.addMethods = function() {
    var $element = $(this.element);

    $element.find('.opener')
      .bind('click', function(e) {
        e.stopPropagation();

        $element
          .toggleClass('opened closed required')
          .find('.code-container').attr('data-required', true);
      });

    $element.find('.submiter')
      .bind('click', function(e) {
        e.preventDefault();

        var currentCode = $element.find('input[type="text"]').val() || '',
          success = 'Your new address is serviced by Enbridge.',
          error = 'Your new address is not serviced by Enbridge. Please contact your local municipality to find a local provicer. You may still proceed in order to let us know when you are moving out.',
          request = null,
          result = null;

        if (!currentCode.postalCode()) {
          $element
            .find('.result')
            .html('<span>' + error + '</span>')
            .addClass('error-code');

          $('[data-id="stop"]')
            .attr('checked', true);

          $('[data-id="stop-select"]')
            .removeClass('hide-flow')
            .attr('data-required', true);

          return;
        }

        $.ajax({
          url: '/WebServices/AddressService.svc/IsPostalCodeInServiceArea',
          type: 'GET',
          dataType: 'application/json',
          data: {
            'postalCode': currentCode
          },
          success: function(data) {
            data = data.toBoolean();
            if (!!data) {
              $element
                .addClass('success-zip')
                .find('.result')
                .html('<img src="../../AppImages/success.png"> <span>' + success + '</span>')
                .addClass('success-code')
                .removeClass('error-code');

              $('[data-id=transfer]')
                .attr('checked', true);

              $('[data-id=code-validator]').val(currentCode).trigger('keyup');
            } else {
              $element
                .find('.result')
                .html('<span>' + error + '</span>')
                .addClass('error-code');

              $('[data-id="stop"]')
                .attr('checked', true);

              $('[data-id="stop-select"]')
                .removeClass('hide-flow')
                .removeAttr('data-required');
            }
          },
          error: function() {
            console.log('Error on the service');
          }
        });

      });
  };
  Enbridge.Plugins.CodeTool = CodeTool;

  $.fn.codeTool = function(element) {
    return this.each(function() {
      (new CodeTool(this));
    });
  };
})(jQuery);

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

(function($) {
  function dropdownEnbridge(element) {
    this.source = element;
    this.init();
    this.addMethods();
  }

  function copyToHiddenInput(source, value) {
    var $hiddenInput = $('input[type="hidden"][data-assoc="' + source.getAttribute('data-id') + '"]');
    if ($hiddenInput.length > 0) {
      $hiddenInput.val(value);
    }
  }

  dropdownEnbridge.prototype.init = function() {
    var $element = $(this.source),
      id = $element.attr('data-id') + '-dropdown',
      elementNodes = this.source.children || [],
      nodes = [],
      element = '',
      name = '';

    if (!elementNodes.length) return;

    this.destroy(id);

    for (var i = 0, size = elementNodes.length; i < size; i++) {
      var temp = '<li class="list-item" data-value="' + elementNodes[i].value + '">' + elementNodes[i].text + '</li>';

      if (elementNodes[i].selected) {
        name = elementNodes[i].text;
      }

      nodes.push(temp);
    }

    name = (name) ? name : (elementNodes[0].text || '');

    element = '<div class="enbridge-dropdown" id="' + id + '">' +
      '<div class="header"><span class="selected">' + name + '</span><span class="indicator"></span></div><ul class="list-items">' +
      nodes.join('') +
      '</ul></div>';

    $element.after(element);

    this.element = this.source.nextElementSibling;

    copyToHiddenInput(this.source, this.source.value);
  };

  dropdownEnbridge.prototype.addMethods = function addMethods() {
    var self = this,
      $element = $(this.element);

    $element.bind('click', function() {
      $(this).toggleClass('active');
    });

    $element.bind('mouseleave', function() {
      this.className = 'enbridge-dropdown';
    });

    $element
      .find('.list-items .list-item')
      .bind('click', function() {
        var $current = $(this),
          $source = $(self.source),
          text = $current.text() || '',
          value = $current.attr('data-value') || '',
          $header = $element.find('.header'),
          totalWidth = $header.width(),
          indicatorWidth = $header.find('.indicator').width(),
          padding = $header.css('padding-left').replace('px', '') * 2;

        $element.find('.header .selected')
          .width((totalWidth - indicatorWidth - padding))
          .text(text);

        $element.find('.result').val(value);

        $source
          .find('option:selected')
          .removeAttr('selected');

        $source
          .find('option[value="' + value + '"]')
          .attr('selected', true);

        copyToHiddenInput(self.source, value);
      });
  };

  dropdownEnbridge.prototype.destroy = function(id) {
    var $element = $('#' + id);

    if (!$element.length)
      return;

    $element.unbind('click');
    $element.find('.list-items .list-item').unbind('click');
    $element.remove();
  };
  Enbridge.Plugins.Dropdown = dropdownEnbridge;

  $.fn.enbridgeDropdown = function(element) {
    return this.each(function() {
      (new dropdownEnbridge(this));
    });
  };
}(jQuery));

var validator = function formValidator($form) {
  var error = false,
    radio = $form.find('input[type="radio"]').removeClass('input-error input-success'),
    select = $form.find('.enbridge-select:not(.ignore)').removeClass('input-error'),
    zipTool = $form.find('.zip-code-tool.[data-required="true"]').removeClass('success-field'),
    newAddress = $form.find('.new-address:visible'),
    oneFromGroup = $form.find('.required-from-group:visible'),
    text = $form.find('input[type="text"]:not(.ignore)'),
    ageValidatorElements = $form.find('[data-validate-age=""]:not(.ignore)');

  $form.find('.error-message, .error-code').remove();
  $form.find('.input-error').removeClass('input-error');

  for (var i = radio.length - 1; i >= 0; i--) {
    var $current = $(radio[i]);

    if ($current.attr('data-required') && !($current.hasClass('input-success') || $current.attr('checked'))) {
      var $current = $(radio[i]);

      if (!$current.hasClass('input-error')) {
        $current.closest('.set-field')
          .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
      }

      $('[name = "' + $current.attr('name') + '"]')
        .addClass('input-error');

    } else {
      var name = $current.attr('name');

      $('input[name="' + name + '"]')
        .removeClass('input-error')
        .addClass('input-success');

      $current.closest('.set-field')
        .find('.error-message').remove();

    }

  }

  if ($form.find('input[type="radio"].input-error').length) {
    error = true;
  }

  for (var i = zipTool.length - 1; i >= 0; i--) {
    var $current = $(zipTool[i]),
      $codeContainer = $current.find('.code-container');

    if (!$codeContainer.val().postalCode()) {
      $codeContainer
        .addClass('input-error')
        .after('<p class="error-message">' + $codeContainer.attr('data-required-error') + '</p>');
    }

    if (!$current.hasClass('success-zip')) {
      error = true;
    }
  }

  for (var i = newAddress.length - 1; i >= 0; i--) {
    if (!$(newAddress[i]).hasClass('success-field')) {
      error = true;
    }
  }

  for (var i = select.length - 1; i >= 0; i--) {
    var $current = $(select[i]);
    if ($current.attr('data-required') && !$current.val()) {

      if ($current.attr('data-position') == 'top') {
        $current
          .addClass('input-error')
          .before('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
      } else {
        $current
          .addClass('input-error')
          .next()
          .after('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
      }

      error = true;
    }
  }

  var lengthValidator = null;
  for (var i = text.length - 1; i >= 0; i--) {
    var $current = $(text[i]),
      pattern = $current.attr('data-pattern') || '';

    // Required when other input were populated
    if ($current.attr('data-required')) {
      var attributes = $current[0].attributes;

      $.each(attributes, function(index, attr) {
        if (attr.name.indexOf('data-rel') >= 0) {
          var $rel =
            $('[data-rel="' + attr.value + '"]');

          if ($rel.attr('data-optional') && $rel.val() && !$current.val()) {
            $current.addClass('input-error');
            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');

            error = true;
            return;
          } else if ($rel.attr('data-optional') && !$rel.val()) {
            error = false;
          } else if (!$current.val()) {
            // Is empty
            $rel.addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
            error = true;
          }
        }
      });
    }
    if (!!$current.val()) {
      switch (pattern) {
        case 'postal-code':
          if (!$current.val().postalCode()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'account-number':
          if (!$current.val().replace(/\s+/g, '').isValidAccount()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-lada':
          if (!$current.val().validLada()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error pattern-error');

            $current.closest('.set-field')
              .append('<p class="error-message pattern-error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-phone':
          var _self = $current,
            value = _self.val();
          if (value.validPhoneFormat()) {
            $.ajax({
              type: 'GET',
              url: Enbridge.UrlServices.VALIDATE_PHONE_BLACKLIST,
              data: {
                phoneNumber: value
              },
              async: false,
              success: function(data) {
                _self.closest('.set-field').find('.pattern-error-message').remove();
                _self.removeClass('input-error pattern-error');
                if (data) {
                  $('[data-rel="' + _self.attr('data-rel') + '"]')
                    .addClass('input-error pattern-error');

                  _self.closest('.set-field')
                    .append('<p class="error-message pattern-error-message">Uh-oh! It looks like the phone number you\'ve entered is not valid. Please check the number you entered and try again.</p>');
                  error = true;
                }
              },
              error: function(xhr, error) {
                throw 'Error on request';
              }
            });
          } else {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error pattern-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-year':
          if (!$current.val().validYear()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-email':
          if (!$current.val().validEmail()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        default:
          break;
      }
    }
    // Length Validator
    if (!!$current.attr('data-max-length')) {
      if (!!lengthValidator) {
        lengthValidator = null;
      }
      lengthValidator = new Enbridge.Plugins.LengthValidator(
        $current
      );
      maxLength = parseInt($current.attr('data-max-length'), 10);
      if (!lengthValidator.isValid(maxLength)) {
        if (!$current.hasClass('input-error')) {
          $current.addClass('input-error');
        }
        $current.closest('.set-field')
          .append('<p class="error-message">' + ($current.attr('data-max-length-error') || 'Length error!') + '</p>');
        error = true;
      }
    }
  }

  if (error) {
    for (var i = oneFromGroup.length - 1; i >= 0; i -= 1) {
      var $current = $(oneFromGroup[i]);

      if ($current.find('.input-error').length < 1) {
        oneFromGroup.find('.input-error:not(.pattern-error)').removeClass('input-error');
        oneFromGroup.find('.error-message:not(.pattern-error-message)').remove();
        error = ($form.find('.input-error').length > 0);
        break;
      }
    }
  }
  if (!error) {
    // Age Validator
    var $item = '',
      isCheckable = true,
      dateItem = '';
    for (var i = ageValidatorElements.length - 1; i >= 0; i -= 1) {
      $item = $(ageValidatorElements[i]);
      dateItem = $item.find('select, input');
      for (var j = dateItem.length - 1; j >= 0; j -= 1) {
        if ($(dateItem[j]).val() === '') {
          isCheckable = false;
          break;
        }
      }
      if (isCheckable) {
        var $ageValidator = new Enbridge.Plugins.AgeValidator($item);
        if (!$ageValidator.isValid()) {
          error = true;
          break;
        }
      }
    }

  }

  return error;
};
Enbridge.Plugins.Validator = validator;

Enbridge.Plugins.LengthValidator = Enbridge.Plugins.LengthValidator || (function ($) {
  var LengthValidator = function ($el) {
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
  return LengthValidator;
}(jQuery));

Date.prototype.addDays = function(number) {
  return Enbridge.DateUtils.addDaysToDate(this, number);
};

String.prototype.toBoolean = function() {
  return Enbridge.Utils.stringToBoolean(this);
};

String.prototype.validYear = function() {
  return Enbridge.ValidateUtils.isValidYear(this);
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
