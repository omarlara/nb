/* globals Enbridge */
$(window).ready(function() {

  $('.enbridge-select').enbridgeDropdown();
  $('.enbridge-dropdown').bind('mouseleave', function() {
    this.className = 'enbridge-dropdown';
  });
  $('.zip-code-tool').codeTool();

  /***********************Flows for Dialogs***********************/
  /*Show feedback inputs if dislike*/
  $('.container-thankyou').find('.dislike').bind('click', function() {
    $(this).parent().find('.improve').removeClass('hidden');
  });

  $('.container-thankyou').find('.like').bind('click', function() {
    var _self = $(this),
      _parent = _self.parent();
    _self.attr('disabled', 'disabled');
    _parent.find('.improve').addClass('hidden');
    _parent.find('.liked-container').removeClass('hidden');
  });

  $('.container-thankyou').find('.enbridge-btn.green').bind('click', function() {
    var _self = $(this),
      _parent = $('.container-thankyou');
    _self.attr('disabled', 'disabled').addClass('disabled');
    _parent.find('textarea').attr('disabled', 'disabled');
    _parent.find('.dislike').attr('disabled', 'disabled');
    _parent.find('.liked-container').removeClass('hidden');
  });

  /*Sync email inputs*/
  $('[data-id=newcustomers-email], [data-id=newcustomers-email-business]').bind('change', function() {
    $('[data-id=newcustomers-email-billing]').val(this.value);
  });

  /*Update currentAddress ASP literal on select account*/
  $('#account-select-dropdown').find('.list-item').bind('click', function() {
    var accountType = $(this).attr('data-value');
    $.ajax({
      type: 'GET',
      url: '/WebServices/GasAccountService.svc/GetCustomerDetails',
      data: {
        accountNumber: accountType
      },
      contentType: 'application/json',
      success: function(data) {
        data = data.ServiceAddress;
        var address = Enbridge.Utils.formatDisplayStreet(data.Unit, data.StreetNumber, data.Suffix, data.StreetName, data.City, data.Province, data.PostalCode);
        $('#current-address-literal').find('.address').html(address);
      },
      error: function(xhr, error) {
        console.log(error);
      }
    });
  });

  /*Dialog - 1 - Moving out*/

  /*Stop radio button click, show/hide Select reason select*/
  $('[name="steps"]').bind('click', function() {
    var $element = $('[data-id="stop-select"]');

    if (this.value === 'stop') {
      $element
        .removeClass('hide-flow')
        .attr('data-required', true);
    } else {
      $element
        .addClass('hide-flow')
        .removeAttr('data-required');
    }

    $('#calendar-move-entry').attr('data-validation', this.value);
  });

  /*
  When you click on the next sep, on Select your street
  if you have selected None of the above, you will show form, in another case you will be on the select street number
  */

  $('#get-address').bind('click', function() {
    var $radio = $('#select-street-container [type="radio"]:checked'),
      ranges = $radio.attr('data-range').split(',') || ['0'],
      numbers = [],
      container = '#data-dropdown',
      street = $('[data-id="street"]').val();

    if (street === $radio.attr('data-street')) {
      $('[data-id="city-or-town"]').val($radio.attr('data-city'));
      $('[data-id="province"]').val($radio.attr('data-province'));
      $('[data-id="country"]').val('CA');
    }

    $('[name="select-street-container"]').attr('data-required', true);
    for (var i = 0, rangesNum = ranges.length; i < rangesNum; i += 1) {
      numbers.push('<option value="' + ranges[i] + '">' + ranges[i] + '</option>');
    }

    $('<select class="enbridge-select" id="current-number" data-required="true">' + numbers.join('') + '</select>')
      .appendTo(container)
      .enbridgeDropdown();
  });

  /*Run validator at phone required group*/
  $('.required-from-group').find('input').bind('change', function() {
    var oneFromGroup = $('.required-from-group:visible');
    for (var i = oneFromGroup.length - 1; i >= 0; i -= 1) {
      var $current = $(oneFromGroup[i]);

      if ($current.find('.input-error').length < 1) {
        oneFromGroup.find('.input-error:not(.pattern-error)').removeClass('input-error');
        oneFromGroup.find('.error-message:not(.pattern-error-message)').remove();
        break;
      }
    }
  });

  /*New account entry business input variation*/
  $('input[name=device-type]').bind('change', function() {
    var accountType = $('input[name=device-type]:checked').val(),
      tooltipText = '';
    $('div[class*="inputs-container"]').hide().find('input, select').addClass('ignore');
    $('[data-validate-age=""]').addClass('ignore');
    $('.' + accountType + '-inputs-container').removeClass('ignore').show().find('input, select').removeClass('ignore input-error').parent().find('.error-message').remove();

    if (accountType === 'business') {
      $('#bbpDisplayDiv').css('visibility', 'hidden');
      $('#bbpRadioDiv').css('visibility', 'hidden');
      tooltipText = 'This person will have full access to your account. This should be someone who has signing authority with your company, such as a co-owner, manager or accountant.';
      $("input[name=newcustomers-budget-billing-plan][value='no']").attr('checked', 'checked');
    } else {
      tooltipText = 'This person will also have full access to this account. So it needs to be your spouse or someone you trust, such as a friend or family member.';
      $('#bbpDisplayDiv').css('visibility', 'visible');
      $('#bbpRadioDiv').css('visibility', 'visible');
    }
    $('#additional-name-tooltip').text(tooltipText);

  });

  /*Set Address on decline/accept step container*/
  $('#confirm-address-button').bind('click', function() {
    var city = $('[name="select-street-container"]:checked').attr('data-city') || '',
      numberHouse = $('#current-number').val() || '',
      unitNumber = $('input[data-id=pre-street-number]').val() || '',
      suffix = $('input[data-id=pre-suffix]').val() || '',
      streetName = $('[name="select-street-container"]:checked').attr('data-street') || '',
      zipCode = $('[data-id="code-validator"]').val(),
      province = $('[name="select-street-container"]:checked').attr('data-province') || '',
      address = Enbridge.Utils.formatDisplayStreet(unitNumber, numberHouse, suffix, streetName, city, province, zipCode);

    $('.address').last().html(address);

    $('#address-confirmation').html(address);

    //Update the text boxes for service address.  The code behinds read out of these controls so
    //they must always contain the service address selected by the user.
    $('[data-id="street-number"]').val(numberHouse);
    $('[data-id="suffix"]').val(suffix);
    $('[data-id="misc-info"]').val(unitNumber);
    $('[data-id="street"]').val(streetName);
    $('[data-id="city-or-town"]').val(city);
    $('[data-id="country"]').val('CA');
    $('[data-id="province"]').val(province);
    $('input[type="hidden"][data-assoc="province"]').val(province);
    $('[data-id="postal-code-input"]').val(zipCode);
  });

  /*Info Decline*/
  $('[data-id="info-decline"]').bind('click', function(e) {
    e.preventDefault();
    $('[data-id="code-validator"]')
      .removeClass('success-field')
      .val('');

    $('[name="house-property"]')
      .attr({
        'checked': false
      })
      .removeAttr('data-required')
      .removeClass('input-error');

    $('#select-street-container, #data-dropdown').empty('');

    $('#confirm-address, #first-step').toggleClass('active-step');
  });

  /*Info confirmation*/
  $('[data-id="info-confirmation"]').bind('click', function(e) {
    e.preventDefault();
    $('#information-acceptance')
      .hide()
      .closest('.code-box')
      .width(280);

    $('#hide-message').
    hide()
      .closest('col')
      .addClass('xs5')
      .removeClass('xs12');

    $('#property-info').show();
    $('#step-address').removeClass('hidden');
    $('input[name="house-property"]').attr('data-required', true);
  });

  /*Add alternative mailer address*/
  $('[data-id="mailing-address-alternative"], [data-id="mailing-address"]').change(function() {
    if (this.checked) {
      $('#manual-property-info').removeClass('hidden');

      $('[data-id="street-alternative"], [data-rel="city-or-town-alternative"], [data-rel="country-alternative-element"], [data-rel="province-alternative-element"], [data-rel="postal-code-input-alternative"]')
        .attr('data-required', true);
    } else {
      $('#manual-property-info')
        .addClass('hidden')
        .find('.error-message')
        .remove();

      $('[data-id="street-alternative"], [data-rel="city-or-town-alternative"], [data-rel="postal-code-input-alternative"]')
        .removeAttr('data-required')
        .removeClass('input-error')
        .val('');

      $('[data-rel="street-alternative"]')
        .removeClass('input-error')
        .val('');

      $('[data-rel="country-alternative-element"], [data-rel="province-alternative-element"]')
        .removeAttr('data-required')
        .removeClass('input-error');
    }
  });

  /*Complete User Information*/
  $('#complete-new-user').bind('click', function() {
    var fromAddress = '',
      toAddress = '',
      dateEndService = $('[data-id="date-start"]').val(),
      dateStartService = $('[data-id="date-finish"]').val(),
      birthDay = $('[data-id="day-user-info"]').val() + '/' + $('[id="month-user-info"]').val() + '/' + $('[data-id="year-user-info"]').val();

    /*Check if the address is provided for the back end services*/
    if ($('#confirm-address').hasClass('active-step')) {
      /*Add additional information about mail address*/

      if ($('[data-id="mailing-address-alternative"]').attr('checked')) {
        fromAddress = $('#current-number').val() + ' ' + $('[name="select-street-container"]:checked').val() + ',' + $('[name="select-street-container"]:checked').attr('data-province') + ' ' + $('[data-id="code-validator"]').val();

        toAddress = $('[data-id="street-number-alternative"]').val() + ' ' + $('[data-id="suffix-alternative"]').val() + ' ' +
          $('[data-id="street-alternative"]').val() + ' ' + $('[data-id="misc-info-alternative"]').val() + ' ' + $('[data-id="city-or-town-alternative"]').val() + ', ' +
          $('[data-id="province-alternative-element"]').val() + ' ' + $('[data-id="postal-code-input-alternative"]').val();

        $('#from-modal').text(fromAddress);
        $('#to-modal').text(toAddress);

      } else {
        fromAddress = $('#current-number').val() + ' ' + $('[name="select-street-container"]:checked').val() + ' ' + $('[data-id="code-validator"]').val();

        $('#from-modal, #to-modal').text(fromAddress);
      }
    } else {
      /*Check if the address isn't provided by Enbridge service*/

      /*Add additional information about mail address*/
      if ($('[data-id="mailing-address-alternative"]').attr('checked')) {
        fromAddress = $('[data-id="street-number"]').val() + ' ' + $('[data-id="suffix"]').val() + ' ' +
          $('[data-id="street"]').val() + ' ' + $('[data-id="misc-info"]').val() + ' ' + $('#city-or-town').val() + ', ' +
          $('[data-id="country"]').val() + ' ' + $('[data-id="province"]').val() + ', ' + $('[data-id="postal-code-input"]').val();

        toAddress = $('[data-id="street-number-alternative"]').val() + ' ' + $('[data-id="suffix-alternative"]').val() + ' ' +
          $('[data-id="street-alternative"]').val() + ' ' + $('[data-id="misc-info-alternative"]').val() + ' ' + $('[data-id="city-or-town-alternative"]').val() + ', ' +
          $('[data-id="country-alternative-element"]').val() + ' ' + $('[data-id="province-alternative-element"]').val() + ',  ' + $('[data-id="postal-code-input-alternative"]').val();

        $('#from-modal').text(fromAddress);
        $('#to-modal').text(toAddress);

      } else {
        fromAddress = $('[data-id="street-number"]').val() + ' ' + $('[data-id="suffix"]').val() + ' ' +
          $('[data-id="street"]').val() + ' ' + $('[data-id="misc-info"]').val() + ' ' + $('#city-or-town').val() + ' ' +
          $('[data-id="country"]').val() + ' ' + $('[data-id="province"]').val() + ', ON ' + $('[data-id="postal-code-input"]').val();

        $('#from-modal, #to-modal').text(fromAddress);
      }
    }

    $('#start-service-wait').text(Enbridge.DateUtils.dateFormater(dateEndService));
    $('#end-service-wait').text(Enbridge.DateUtils.dateFormater(dateStartService));

    $('#birth-day').text(birthDay);

    $('#user-phone').text($('[data-id="user-mobile-lada"]').val() + ' ' + $('[data-rel="mobile-phone-your-info"]').val());
    $('#mobile-phone').text($('[data-id="user-home-lada"]').val() + ' ' + $('[data-id="user-home-phone"]').val());

    $('#additional-contact').text($('[data-id="additional-fist-name"]').val() + ' ' + $('[data-id="additional-last-name"]').val());

  });

  /*Reset mailing information*/
  $('[data-id="personal-info-user"]').bind('click', function() {
    var $form = $('#form-new-account').removeClass('hidden');

    $($form.find('.accordion-item')[1])
      .addClass('active')
      .removeClass('processed');

    $('#personal-info-address')
      .find('input[type=text]')
      .val('');

    $form.find('.success-field')
      .removeClass('success-field');

    $form.find('.result')
      .html('')
      .removeClass('success-code error-code');

    $('#information-acceptance')
      .show()
      .closest('.code-box')
      .width('');

    $('[name="house-property"]')
      .attr({
        'checked': false
      })
      .removeAttr('data-required');

    $('#hide-message').
    show()
      .closest('col')
      .addClass('xs12')
      .removeClass('xs5');

    $('#hide-message').
    show()
      .closest('col')
      .addClass('xs12')
      .removeClass('xs5');
    $('#property-info').hide();
    $('#step-address').addClass('hidden');

    $('[data-id="code-validator"]').val('');
    $('#select-street-container, #data-dropdown').empty('');

    $('#first-step').addClass('active-step');

    $form.find('.steps:not(#first-step)')
      .removeClass('active-step');

    $("#mailing-address, #mailing-address-alternative").attr("checked", false);
    /*Restart Mailing Information*/
    $('[data-id="street"], [data-id="street-alternative"], [data-id="city-or-town"], [data-rel="city-or-town-alternative"], [data-id="postal-code-input"], [data-rel="postal-code-input-alternative"]')
      .removeAttr('data-required')
      .removeClass('input-error')
      .val('');

    $('[data-rel="street"], [data-rel="street-alternative"]')
      .removeClass('input-error')
      .val('');

    $('[data-id="country"],[data-id="country-alternative-element"], [data-id="province"], [data-id="province-alternative-element"], [data-id="day-user-info"], [data-id="month-user-info"]')
      .removeAttr('data-required')
      .removeClass('input-error');

    /*Disable submit*/
    $('[data-id="moving-out-submit"]').addClass('disabled');
  });

  /*Reset personla info user*/
  $('[data-id="reset-personal-info"]').bind('click', function() {
    $('#personal-info').find('[type="text"]')
      .val('');

    /*Disable submit*/
    $('[data-id="moving-out-submit"]').addClass('disabled');
  });

  /*Start Over*/
  $('#new-account-entry-start-over').bind('click', function() {
    var $form = $('.accordion');
    $form.find('input').val('');
    $form.find('.accordion-item').removeClass('processed active');
    $form.find('.accordion-item')[0].className += ' active';
    $form.find('#steps-flow-1').find('.steps').removeClass('active-step');
    $form.find('#first-step').addClass('active-step');
    $form.find('.success-field').removeClass('success-field');
  });

  $('#new-account-start-over').bind('click', function() {
    var $form = $('#form-new-account').removeClass('hidden');

    $form.find('.accordion-item')
      .removeClass('active processed');

    $($form.find('.accordion-item')[0])
      .addClass('active')
      .removeClass('processed');

    $form.find('.success-field')
      .removeClass('success-field');

    $form.find('.result')
      .html('')
      .removeClass('success-code error-code');

    $form
      .find('.zip-code-tool')
      .removeClass('opened required success-zip')
      .addClass('closed')
      .find('.code-container')
      .removeAttr('data-required')
      .val('');

    $('#form-summary, #step-address, #manual-property-info').addClass('hidden');

    $('#information-acceptance')
      .show()
      .closest('.code-box')
      .closest('.code-box')
      .width('');

    $('#hide-message').
    show()
      .closest('col')
      .addClass('xs12')
      .removeClass('xs5');

    $('[name="steps"]')
      .attr('checked', false)
      .removeClass('input-success');

    $('[name="house-property"], [name="house-property-alternative"]')
      .attr({
        'checked': false
      })
      .removeAttr('data-required')
      .removeClass('input-error');

    $('#property-info').hide();

    $('[data-id="code-validator"]')
      .val('')
      .removeClass('success-field error-field');

    $('#select-street-container, #data-dropdown').empty('');

    $('#first-step').addClass('active-step');

    $form.find('.steps:not(#first-step)')
      .removeClass('active-step');

    $("#mailing-address, #mailing-address-alternative").attr("checked", false);
    /*Restart Mailing Information*/
    $('[data-id="street"], [data-id="street-alternative"], [data-id="city-or-town"], [data-rel="city-or-town-alternative"], [data-id="postal-code-input"], [data-rel="postal-code-input-alternative"]')
      .removeAttr('data-required')
      .removeClass('input-error')
      .val('');

    $('[data-rel="street"], [data-rel="street-alternative"]')
      .removeClass('input-error')
      .val('');

    $('[data-id="country"],[data-id="country-alternative-element"], [data-id="province"], [data-id="province-alternative-element"], [data-id="day-user-info"], [data-id="month-user-info"]')
      .removeAttr('data-required')
      .removeClass('input-error');

    /*Restart Personal Information*/
    $('[data-rel="mobile-phone-your-info"], [data-rel="home-phone-your-info"], [data-rel="business-phone-your-info"], [data-id="year-user-info"], [data-id="additional-fist-name"]. [data-id="additional-last-name"], [data-id="additional-last-name"], [data-id="additional-fist-name"]')
      .removeClass('input-error')
      .val('');

    /*Disable submit*/
    $('[data-id="moving-out-submit"]').addClass('disabled');
  });

  /*Birth Day controller*/

  $('.birth-day-controller-year').bind('change', function updateFromYear() {
    var $this = $(this),
      year = $this.val(),
      birthDayController = $this.attr('data-birth-day-controller'),
      month = $('[data-id ="' + $this.attr('data-birth-month-controller') + '"]').val(),
      day = $('[data-id ="' + birthDayController + '"]').val(),
      options = $('[data-id ="' + birthDayController + '"] + .enbridge-dropdown .list-item'),
      $day = $('[data-id ="' + birthDayController + '"]'),
      availableDays = null;

    if (!this.value.validYear() || !parseInt(month, 10)) {
      return;
    }

    availableDays = Enbridge.DateUtils.getTotalDays(parseInt(year, 10), parseInt(month, 10));

    for (var total = options.length - 1; total > 0; total-=1) {
      var $current = $(options[total]);

      if ($current.attr('data-value') > availableDays) {
        $current.addClass('hidden');
      } else {
        $current.removeClass('hidden');
      }
    }

    if (day === '' || day <= availableDays) {
      $('[data-id ="' + birthDayController + '"] + .enbridge-dropdown .selected').text(day);

    } else {
      var textCurrent = '';
      $day.find('option:selected').removeAttr('selected');
      textCurrent = $day.find('option:first-child').attr('selected', true).text();
      $('[data-id ="' + birthDayController + '"] + .enbridge-dropdown .selected').text(textCurrent);
    }

  });

  $('.birth-day-controller-month + .enbridge-dropdown .list-item').bind('click', function() {
    var $this = $(this),
      birthDayController = $this.closest('.enbridge-dropdown').prev().attr('data-birth-day-controller'),
      year = $('[data-id="' + $this.closest('.enbridge-dropdown').prev().attr('data-birth-year-controller') + '"]').val(),
      day = $('[data-id ="' + birthDayController + '"]').val(),
      month = $this.attr('data-value'),
      options = $('[data-id ="' + birthDayController + '"] + .enbridge-dropdown .list-item'),
      $day = $('[data-id ="' + birthDayController + '"]'),
      availableDays = null;

    if (!year.validYear() || !parseInt(month, 10)) {
      return;
    }

    availableDays = Enbridge.DateUtils.getTotalDays(parseInt(year, 10), parseInt(month, 10));

    for (var total = options.length - 1; total > 0; total-=1) {
      var $current = $(options[total]);

      if ($current.attr('data-value') > availableDays) {
        $current.addClass('hidden');
      } else {
        $current.removeClass('hidden');
      }
    }

    if (day === '' || day <= availableDays) {
      return;
    } else {
      var textCurrent = '';
      $day.find('option:selected').removeAttr('selected');
      textCurrent = $day.find('option:first-child').attr('selected', true).text();
      $('[data-id ="' + birthDayController + '"] + .enbridge-dropdown .selected').text(textCurrent);
    }

  });

  /*Dialog - 2 - New Customer*/

  /*Moving out finish*/
  $('#moving-out-finish').bind('click', function() {
    var fromAddress = $('[data-id="moving-out-street-number"]').val() + ' ' + $('[ data-id="moving-out-suffix"]').val() + ' ' +
      $('[data-id="moving-out-street"]').val() + ' ' + $('[data-id="moving-out-misc-info"]').val() + ' ' + $('[data-id="moving-out-city-or-town"]').val() + ' ' +
      $('[data-id="moving-out-country"]').val() + ' ' + $('[data-id="moving-out-province"]').val() + ', ON ' + $('[data-rel="moving-out-postal-code-input"]').val(),
      birthDay = $('[data-id="moving-out-your-day"]').val() + '/' + $('[data-id="moving-out-your-month"]').val() + '/' + $('[data-id="moving-out-your-year"]').val();

    $('#moving-new-date-summary').text(Enbridge.DateUtils.dateFormater($('[data-id="moving-out-date" ]').val()));

    $('#moving-out-from').text(fromAddress);
    $('#moving-out-summary-birth-day').text(birthDay);
    $('#moving-out-summary-user-phone').text($('[data-id="moving-out-home-phone-lada"]').val() + ' ' + $('[data-id="moving-out-home-phone"]').val());
    $('#moving-out-summary-mobile-phone').text($('[data-id="moving-out-mobile-phone-lada"]').val() + ' ' + $('[data-id="moving-out-mobile-phone"]').val());
  });

  /*Add alternative mailer address*/
  $('[data-id="newcustomers-mailing-address-alternative"], [data-id="newcustomers-mailing-address"]').change(function() {
    if (this.checked) {
      $('#newcustomers-manual-property-info').removeClass('hidden');

      $('[data-id="newcustomers-street-alternative"], [data-id="newcustomers-city-or-town-alternative"], [data-id="newcustomers-select-country-alternative"], [ data-id="newcustomers-select-province-alternative"], [data-id="newcustomers-postal-code-input-alternative"]')
        .attr('data-required', true);
    } else {
      $('#newcustomers-manual-property-info')
        .addClass('hidden')
        .find('.error-message')
        .remove();

      $('[data-id="newcustomers-street-alternative"], [data-id="newcustomers-city-or-town-alternative"], [data-id="newcustomers-postal-code-input-alternative"]')
        .removeAttr('data-required')
        .removeClass('input-error')
        .val('');

      $('[data-rel="newcustomers-street-alternative"]')
        .removeClass('input-error')
        .val('');

      $('[data-id="newcustomers-select-country-alternative"], [ data-id="newcustomers-select-province-alternative"]')
        .removeAttr('data-required')
        .removeClass('input-error');
    }
  });

  /*Set Address on decline/accept step container*/
  $('#newcustomers-confirm-address-button').bind('click', function() {
    var city = $('[name="newcustomers-select-street-container"]:checked').val() || '',
      numberHouse = $('#newcustomers-current-number').val() || '',
      zipCode = $('[data-id="newcustomers-code-validator"]').val() || '';

    $('#newcustomers-address-confirmation').text(numberHouse + ' ' + city + ', ON ' + zipCode);
  });

  /*Info Decline*/
  $('#newcustomers-info-decline').bind('click', function(e) {
    e.preventDefault();
    $('[data-id="newcustomers-code-validator"]')
      .removeClass('success-field')
      .val('');

    $('[name="newcustomers-house-property"]')
      .attr({
        'checked': false
      })
      .removeAttr('data-required')
      .removeClass('input-error');

    $('#newcustomers-select-street-container, #data-dropdown').empty('');

    $('#newcustomers-confirm-address, #newcustomers-first-step').toggleClass('active-step');
  });

  /*Info confirmation*/
  $('#newcustomers-info-confirmation').bind('click', function(e) {
    e.preventDefault();
    $('#newcustomers-information-acceptance')
      .hide()
      .closest('.code-box')
      .width(280);

    $('#newcustomershide-message')
      .hide()
      .closest('col')
      .addClass('xs5')
      .removeClass('xs12');

    $('#newcustomers-property-info').show();
    $('#newcustomers-step-address').removeClass('hidden');
    $('[name="newcustomers-house-property"]').attr('data-required', true);
  });

  /*Dialog - 3 - Move out*/

  /*Restart personal address information*/
  $('#moving-out-restart-personal-info').bind('click', function() {
    $('[data-id="moving-out-street-number"], [ data-id="moving-out-suffix"],[data-id="moving-out-street"],[data-id="moving-out-misc-info"],[data-id="moving-out-city-or-town"],[data-rel="moving-out-postal-code-input"]').val('');
  });

  /*Restart personal user information*/
  $('#moving-out-restart-personal-user-info').bind('click', function() {
    $('[data-id="moving-out-your-year"], [data-id="moving-out-email"]').val('');
    $('[data-rel="moving-out-home-phone"], [data-rel="moving-out-mobile-phone"], [data-rel="moving-out-business-phone"]').val('');
  });

  /*Start Over*/
  $('#moving-out-start-over').bind('click', function() {
    var $form = $('#moving-out-form').removeClass('hidden');

    $form.find('.accordion-item')
      .removeClass('active processed');

    $($form.find('.accordion-item')[0])
      .addClass('active');

    $form.find('input[type=text]').val('');

    $form.find('.success-field')
      .removeClass('success-field');

    $form.find('.result')
      .html('')
      .removeClass('success-code error-code');

    $form.closest('.dialog')
      .find('.submit-button')
      .addClass('disabled');

    $('#almost-done-summary').addClass('hidden');
  });

  /***********************Common Functionality***********************/

  /*Success Zip*/

  $('.new-address').keyup(function() {
    var $this = $(this),
      currentVal = $this.val(),
      container = $this.attr('data-content'),
      radioContent = [];

    $this.closest('.code-box')
      .find('.error-message ').remove();

    if (!currentVal.postalCode()) {
      $this
        .addClass('input-error')
        .after('<p class="error-message ">Please enter a valid postal code (example: A1A 1A1)</p>');
      return;
    }

    $this.removeClass('input-error');

    if ($this.next().hasClass('error-message')) {
      $this.next().remove();
    }

    $.ajax({
      url: '/WebServices/AddressService.svc/GetAddresses',
      type: 'GET',
      dataType: 'application/json',
      data: {
        'postalCode': currentVal
      },
      success: function(data) {
        if (!!data) {
          var containerEl = container.replace('#', ''),
            streetObj = [],
            keys = [],
            getNumbers = function getNumbers(range, init, end) {
              var returnVal = [];
              switch (range) {
                case 0:
                  for (; init <= end; init += 1) {
                    returnVal.push(init);
                  }
                  break;
                case 1:
                  for (; init <= end; init += 1) {
                    if (0 === (init % 2)) {
                      returnVal.push(init);
                    }
                  }
                  break;
                case 2:
                  for (; init <= end; init += 1) {
                    if (0 !== init % 2) {
                      returnVal.push(init);
                    }
                  }
                  break;
                default:
                  break;
              }
              return returnVal;
            };

          data = JSON.parse(data);

          for (var size = data.length - 1; size >= 0; size-=1) {
            if (!streetObj[data[size].StreetName]) {
              streetObj[data[size].StreetName] = {
                province: data[size].Province,
                city: data[size].City,
                street: data[size].StreetName,
                ranges: getNumbers(data[size].StreetNumberRangeFilter, data[size].StreetNumberStart, data[size].StreetNumberEnd)
              };

              keys.push(data[size].StreetName);
            } else {
              streetObj[data[size].StreetName].ranges.push(getNumbers(data[size].StreetNumberRangeFilter, data[size].StreetNumberStart, data[size].StreetNumberEnd));
            }
          }

          $this
            .addClass('success-field')
            .removeClass('input-error');

          var radioButton;
          var i;
          for (i = 0, size = keys.length; i < size; i += 1) {
            radioButton = '<input type="radio" id="' + (containerEl + '-' + i) + '" ' +
              'name="' + containerEl + '" value="' + streetObj[keys[i]].street + ', ' + streetObj[keys[i]].province + '" ' +
              'data-street = "' + streetObj[keys[i]].street + '" ' +
              'data-province = "' + streetObj[keys[i]].province + '" ' +
              'data-city = "' + streetObj[keys[i]].city + '" ' +
              'data-range = "' + streetObj[keys[i]].ranges.join(',') + '" ' + ((i === 0) ? 'checked ' : ' ') +
              'name="stepsContent" data-required-error="Please select yout street.">' +
              '<label class="fake-input" for="' + (containerEl + '-' + i) + '">' + streetObj[keys[i]].street + '</label>';
            radioContent.push(radioButton);
          }

          radioContent.push('<input type="radio" id="' + (containerEl + '-No') + '" ' +
            'name="' + containerEl + '" value = "" ' +
            'data-province = "" ' +
            'data-city = " " ' +
            'data-range = "0" ' +
            'name="stepsContent" data-required-error="Please select yout street.">' +
            '<label class="fake-input" for="' + (containerEl + '-No') + '">None of the above</label>');

          $(container).html(radioContent.join(''));

          $(container).find('input[type="radio"]').bind('click', function() {
            var name = $(this).attr('name') || '',
              containerBox = (this.value) ? $this.attr('data-first-op') : $this.attr('data-second-op');

            $('#get-address').attr('data-next-step', containerBox);
            $('#newcustomers-get-address').attr('data-next-step', containerBox);

            $('input[name="' + name + '"]').removeClass('input-success input-error');
          });

        } else {
          $this
            .removeClass('input-success success-field')
            .addClass('input-error');
        }
      },
      error: function() {
        $this
          .removeClass('input-success success-field')
          .addClass('input-error');
      }
    });
  });

  /***********************Accordion***********************/

  /*Header click to collapse section*/
  $('.accordion .accordion-item >.header').bind('click', function(event) {
    event.preventDefault();

    var $current = $(this).closest('.accordion-item');

    if ($current.hasClass('processed')) {
      return;
    } else if ($current.hasClass('active') || !$current.prev().length) {
      $current.toggleClass('active ');
    } else if ($current.prev().length && $current.prev().hasClass('processed')) {
      $current.toggleClass('active ');
    } else {
      return;
    }

  });

  /*Run validations for each section*/
  var postValidation = function ($current) {
    $current
      .removeClass('active')
      .addClass('processed');

    if ($current.next().length) {
      var $nextElement = $current.next().addClass('active');

      if (!$nextElement.next().length) {
        $current.closest('.dialog')
          .find('.submit-button')
          .removeClass('disabled');
      }

      /* Move to a different step */
      /* Set "data-go-to-step" flag, to move to different step */
      var $nextButton = $current.find('.validator');
      if (!!$('[data-id="stop-select"]').val() && $('input#stop[type="radio"]:checked').length > 0) {
        $nextButton.attr('data-go-to-step', 'select_your_address_form');
      } else {
        $nextButton.attr('data-go-to-step', '');
      }

      /* Set active the step you will visit */
      var goToStep, $step;
      goToStep = $nextButton.attr('data-go-to-step');
      $nextElement.find('.steps').each(function(index, step) {
        $step = $(step, $nextElement);

        if ($step.hasClass('active-step')) {
          $step.removeClass('active-step');
        }

        // if the flag is unavailable, keep moving to the established next step
        if (!goToStep && 0 === index) {
          if (!$step.hasClass('active-step')) {
            $step.addClass('active-step');
          }
          if (!$('.validator', $nextElement).hasClass('hidden')) {
            $('.validator', $nextElement).addClass('hidden');
          }
        } else if (!!goToStep && goToStep === $step.attr('id')) {
          // Move to established according the flag
          if (!$step.hasClass('active-step')) {
            $step.addClass('active-step');
          }
          if ($('.validator', $nextElement).hasClass('hidden')) {
            $('.validator', $nextElement).removeClass('hidden');
          }
        }
      });
      /**/
    }

    var city = $('[data-id$="city-or-town"]').val() || '',
      numberHouse = $('input[data-id="street-number"]').val() || '',
      unitNumber = $('input[data-id="pre-street-number"]').val() || '',
      suffix = $('input[data-id="suffix"]').val() || '',
      streetName = $('input[data-id$="street"]').val() || '',
      zipCode = $('[data-id$="postal-code-input"]').val() || '',
      province = $('[data-id$="province"]').val() || '',
      address = Enbridge.Utils.formatDisplayStreet(unitNumber, numberHouse, suffix, streetName, city, province, zipCode);

    $('#current-address').html(address);

    //Fix the new address display when manually type in address
    $('#new-address-display').html(address);

    // Populate address, just for MoveOutEntry form

    //Fixed the MoveOutEntry display new address issue, it should display the old address when validate the account details
    //if ($('#moving-out-form').length > 0) {
    //  $('.address:last').html(address);
    //}
    // Track in webtrends when move forward
    $('.accordion').trigger(Enbridge.Events.TRACK_IN_WEBTRENDS);
  };
  $('.accordion .accordion-item .validator').bind('click', function(e) {
    e.preventDefault();

    var $current = $(this).closest('.accordion-item');

    //Validate dates on the page.  Do date validation first since do not want to lose validation messages for dates as 
    //validator deletes all error messages.
    if (!Enbridge.Plugins.DateValidator() && !Enbridge.Plugins.Validator($current.find('.enbridge-form'))) {
      if ($(this).attr('data-id') === 'authenticate-validator') {
        var accountNumber = $('[data-id="moving-out-account-number"]').val(),
          postalCode = $('[data-id="moving-out-postal-code"]').val(),
          name = $('[data-id="moving-out-name"]').val();
        $('input:visible').removeClass('input-error').next('error-message').remove();

        $.ajax({
          type: 'POST',
          url: Enbridge.UrlServices.VALIDATE_CUSTOMER_AND_GET_DATA,
          data: JSON.stringify({
            AccountNumber: accountNumber,
            FullName: name,
            PostalCode: postalCode
          }),
          contentType: 'application/json',
          success: function(result) {
            if (!!result) {
              var displayText = null,
                serviceAddress = result.ServiceAddress,
                dateOfBirth = result.DateOfBirthAsIso8601;

              if (dateOfBirth === null || dateOfBirth === '0000-00-00') {
                $('[data-id=birthday-account-div]').hide();
              }
              $('#account-authorization-failure-message').css('visibility', 'hidden');

              displayText = Enbridge.Utils.formatDisplayStreet(
                serviceAddress.Unit,
                serviceAddress.StreetNumber,
                serviceAddress.Suffix,
                serviceAddress.StreetName,
                serviceAddress.City,
                serviceAddress.Province,
                serviceAddress.PostalCode);

              $('#current-address').html(displayText);

              $('#move-out-current-address').html(displayText);
              postValidation($current);
            } else {
              $('#account-authorization-failure-message').css('visibility', 'visible');
            }
          },
          failure: function(jqXHR) {
            console.log(jqXHR);
          }
        });
      } else {
        postValidation($current);
      }
    }
  });

  /*Submit button*/

  $('.dialog .submit-button').bind('click', function() {
    var $this = $('#' + $(this).attr('data-item-related')),
      $current = $this.closest('.accordion-item');

    if ($this.hasClass('disabled')) {
      return false;
    }

    //Validate forms.  Do date validation first since do not want to lose validation messages for dates as 
    //validator deletes all error messages.
    if (!Enbridge.Plugins.DateValidator() && !Enbridge.Plugins.Validator($current.find('.enbridge-form'))) {
      return true;
    } else {
      return false;
    }
  });

  /*Return to the previous step*/
  $('.accordion .accordion-item .prev').bind('click', function () {
    var $current = $(this).closest('.accordion-item');

    if ($current.prev().length) {
      $current
        .removeClass('active')
        .prev()
        .addClass('active')
        .removeClass('processed');

    }
  });

  /*Steps*/
  $('.steps .next-step').bind('click', function() {
    var $current = $(this).closest('.accordion-item'),
      $currentStep = $(this).closest('.steps'),
      nextStep = $(this).attr('data-next-step');

    if (!Enbridge.Plugins.Validator($current.find('.enbridge-form'))) {
      $currentStep.
      removeClass('active-step')
        .next();

      $(nextStep)
        .addClass('active-step')
        .find('input[type="radio"]').attr('required', true);

      if (this.id === 'get-address' && !$('[name=select-street-container]:checked').val()) {
        $('#step-address').removeClass('hidden');

        $('[data-id="street"], [data-id="city-or-town"], [data-id="country"], [data-id="province"], [data-id="postal-code-input"], [name="house-property-alternative"]')
          .attr('data-required', true);

      } else if (this.id === 'newcustomers-get-address' && !$('[name=newcustomers-select-street-container]:checked').val()) {
        $('#newcustomers-step-address').removeClass('hidden');

        $('[data-id="newcustomers-street"], [data-id="newcustomers-city-or-town"], [data-id="newcustomers-country"], [data-id="newcustomers-province"], [data-id="newcustomers-postal-code-input"], [name="newcustomers-house-property-alternative"]')
          .attr('data-required', true);
      }
    }
  });

  /*Edit information*/
  $('.edit-info').bind('click', function(e) {
    e.preventDefault();
    var $current = $(this),
      $temporal = $($(this).attr('data-accordion-element')),
      loop = true;

    $temporal
      .removeClass('processed')
      .addClass('active');
    while (loop) {
      if ($temporal.next().length) {
        $temporal = $temporal.next()
          .removeClass('processed active');
      } else {
        $temporal.closest('.accordion')
          .removeClass('hidden');
        loop = false;
      }
    }

    $current.closest('.summary')
      .addClass('hidden');
  });

  //Execute date validations and get the calendar date
  //Note that return results are returned immediately to avoid web service calls.
  $('.calendar').bind('click', function(e) {
    if (!(e.target.className.indexOf('ui-datepicker-today') && parseInt(e.target.textContent, 10))) {
      return;
    }

    var $this = $(this),
      date = $this.datepicker('getDate'),
      day = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear(),
      dateFormated = year + '-' + month + '-' + day,
      $calendarColumn = $this.closest('.calendar-column'),
      dataCalendar = $calendarColumn.attr('data-calendar'),
      $inputElem = $('[data-id="' + dataCalendar + '"]'),
      now = new Date();

    //Since you only want to compare the dates and not the times
    now.setHours(0, 0, 0, 0);

    //Reset errors
    $inputElem.attr('data-valid', 'true');
    $calendarColumn.find('.error-code').remove();

    $inputElem.val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());

    //Validations that are only for move out dates
    if ('date-finish' === dataCalendar || 'moving-out-date' === dataCalendar) {
      //Can never backdate a move out date
      if (date < now) {
        $inputElem.attr('data-valid', 'false');
        $calendarColumn.append('<div class="result error-code"><img src="/AppImages/exclamation-02.png"><span>Whoops! Your move-out date cannot be in the past.</span></div>');
        return;
      }

      //Figure out the date 3 business days in the future
      var additionalBusinessDays = 0;
      var additionalDays = 0;
      var minimumDate;
      while (additionalBusinessDays <= 3) {
        minimumDate = new Date(now.getTime() + (additionalDays * 86400000));
        if (0 !== minimumDate.getDay() && Enbridge.ValidateUtils.isBusinessDay(minimumDate)) {
          additionalBusinessDays += 1;
        }
        additionalDays += 1;
      }

      //Show a warning if the selected date is not 3 business days in the future
      if (date < minimumDate) {
        $calendarColumn.append('<div class="result error-code"><img src="/AppImages/exclamation-02.png"><span>It looks like your move-out date is in less than 3 business days. No worries, it just means that your final meter reading will need to be estimated.</span></div>');
        return;
      }
      //Show a warning if the selected date is before a day that is not a business day
      var dayAfterSelected = new Date(date.getTime() + 86400000);
      if (6 === date.getDay() || !Enbridge.ValidateUtils.isBusinessDay(dayAfterSelected)) {
        $calendarColumn.append('<div class="result error-code"><img src="/AppImages/exclamation-02.png"><span>It looks like your move-out date that is before a day that is not a business day. No worries, it just means that your final meter reading read the next business day.</span></div>');
        return;
      }
    }

    //Move in date validation
    else {
      //Warning if move in date is in the past
      if (date < now) {
        $calendarColumn.append('<div class="result error-code"><img src="/AppImages/exclamation-02.png"><span>Whoops! It looks like your move in date is in the past. Check it again to make sure it\'s correct. If so, you are taking full responsibility for the date selected.</span></div>');
        return;
      }
    }

    //Validations for both move out and move in

    //Determine if it's on a sunday or holiday
    if (0 === date.getDay()) {
      $calendarColumn.append('<div class="result error-code"><img src="/AppImages/exclamation-02.png"><span>It looks like your move date is a Sunday or Holiday. No worries, your move will be processed on the following business day.</span></div>');
      return;
    }

    $.ajax({
      url: '/WebServices/DateService.svc/IsSundayOrHolidayDate',
      type: 'GET',
      dataType: 'application/json',
      data: {
        date: dateFormated
      },
      success: function(data) {
        if (JSON.parse(data)) {
          $calendarColumn.append('<div class="result error-code"><img src="/AppImages/exclamation-02.png"><span>It looks like your move date is a Sunday or Holiday. No worries, your move will be processed on the following business day.</span></div>');

        } else {
          $calendarColumn.find('.result').remove();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('An error occurred checking for a Sunday or Holiday date.' + textStatus + ' : ' + errorThrown + ' : ' + jqXHR.responseText);
      }
    });
  });

  /*Forms Reset*/
  $('.enbridge-form input[type="radio"]').bind('click', function() {
    var name = $(this).attr('name') || '';

    $(this).closest('.set-field')
      .find('.error-message')
      .remove();

    $('input[name="' + name + '"]').removeClass('input-success input-error');
  });

  /*******************************Window Ready loaders ********************************/

  if ($('[data-id="stop"]:checked').length) {
    $('[data-id="stop-select"]')
      .removeClass('hide-flow')
      .attr('data-required', true);
  }

  $('label[for=device-type-home]').trigger('click');
  $('label[for=newcustomers-budget-billing-plan-yes]').trigger('click');

  $('#calendar-move-entry').attr('data-validation', ($('[name="steps"]:checked').val() || ''));

  if ('CA' !== $('[data-id="country"]').val()) {
    $('[data-id="postal-code-input"]').removeAttr('data-pattern');
  }

  if ('CA' !== $('[data-id="country-alternative-element"]').val()) {
    $('[data-id="postal-code-input-alternative"]').removeAttr('data-pattern');
  }

  if ('CA' !== $('[data-rel="country-alternative-element"]').val()) {
    $('[data-id="postal-code-input-alternative"]').removeAttr('data-pattern');
  }

  var calendar = $('.calendar'),
    currentDate = new Date(new Date().getTime() + (15 * 86400000)),
    confirmDialog = $('.confirm-dialog-close').dialog({
      autoOpen: false,
      resizable: false,
      dialogClass: 'confirm-dialog-close',
      width: 430,
      top: 200,
      modal: true,
      height: 440
    }),
    dialogConstant = {
      autoOpen: true,
      resizable: false,
      width: 720,
      modal: true,
      height: 440,
      top: 29,
      beforeClose: function () {
        confirmDialog.dialog('destroy');
        confirmDialog = $('.confirm-dialog-close')
          .removeClass('hidden')
          .dialog({
            autoOpen: true,
            resizable: false,
            dialogClass: 'confirm-dialog-close',
            width: 430,
            top: 200,
            modal: true,
            height: 440
          });
        $('.confirm-not-dialog').bind('click', function(e) {
          e.preventDefault();
          confirmDialog.dialog('close');

          return false;
        });
        return false;
      }
    };

  calendar.datepicker();

  $('.confirm-yes-dialog').bind('click', function() {
    // Track in webtrends when user closes the modal
    dcsMultiTrack('DCS.dcsuri', '/moves-form/close.html', 'WT.ti', 'Moves%20-%20Close', 'WT.z_engage', 'Close_Event', 'WT.z_UserStatus', 'UnAuth');
    // Redirect
    window.location = '/homes/start-stop-move/moving/index.aspx';
  });

  $('[data-id="date-finish"], [data-id="date-start"]').val(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate());

  var i,
  $current;

  for (i = calendar.length - 1; i >= 0; i-=1) {
    $current = $(calendar[i]).click();
    $current.datepicker("setDate", currentDate);

    var date = $current.datepicker('getDate');
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    $($current.closest('.calendar-column').attr('data-calendar'))
      .val(year + '-' + month + '-' + day);
  }

  $('.tooltip .icon').bind('click', function(e) {
    $(this).next()
      .addClass('active-tooltip')
      .show();
    e.stopPropagation();
  });

  $('.tooltip .cross').bind('click', function(e) {
    $(this).closest('.content-tooltip')
      .removeClass('active-tooltip')
      .hide();
    e.stopPropagation();
  });

  $('.modalopen').bind('click', function(e) {
    e.preventDefault();
    $($(this).attr('data-target'))
      .css("display", "none");

    var id = $(this).attr('data-target'),
      elements = $(id).siblings();

    elements.each(function(entry) {
      var idName = $(elements[entry]).attr('id'),
        idchange = '#' + idName;
      $(idchange).removeClass("hidden");
      $("#costumer-alert").addClass("hidden");
    });
  });

  $('.open-dialog').bind('click', function(e) {
    e.preventDefault();
    var $this = $(this);

    scroll(0, 0);
    $($this.attr('data-target'))
      .dialog({
        autoOpen: true,
        resizable: false,
        width: 720,
        modal: true,
        height: 440
      });
  });

  $('#existingcustomers, #newcustomers, #moving-out, #existingcustomers-summary')
    .removeClass('hidden')
    .dialog(dialogConstant).parent().appendTo(jQuery("form:first"));

  $('.enbridge-form input[type="text"]').bind('change', function() {
    var rel = $(this).attr('data-rel');

    $('[data-rel="' + rel + '"]').removeClass('input-error');

    $(this)
      .closest('.set-field')
      .find('.error-message')
      .remove();
  });

  // Implement provinces
  var countryServiceData = {
      countryCode: Enbridge.CountryCodes.CANADA
    },
    $countryDropdown = $('[data-id="country"], [data-id="moving-out-country"], [data-id="country-alternative-element"]'),
    $countryDropdownItems = $countryDropdown.next('.enbridge-dropdown').find('li');

  for (i = $countryDropdown.length - 1; i >= 0; i-=1) {
    var $currentDropdown = $($countryDropdown[i]);

    if ($currentDropdown.attr('data-province-rel')) {
      $currentDropdown
        .next('.enbridge-dropdown')
        .attr('data-province-rel', $currentDropdown.attr('data-province-rel'));
    }

    if ($currentDropdown.attr('data-postal-code-rel')) {
      $currentDropdown
        .next('.enbridge-dropdown')
        .attr('data-postal-code-rel', $currentDropdown.attr('data-postal-code-rel'));
    }

    countryServiceData.countryCode = $currentDropdown.val();

    if (countryServiceData.countryCode === Enbridge.CountryCodes.CANADA) {
      Enbridge.ServiceUtils.loadProvinces(countryServiceData, $currentDropdown.attr('data-province-rel'), Enbridge.ProvinceCodes.ONTARIO);
    } else {
      Enbridge.ServiceUtils.loadProvinces(countryServiceData, $currentDropdown.attr('data-province-rel'));
    }
  }

  $countryDropdownItems.bind('click', function () {
    var relationId = $(this).closest('.enbridge-dropdown').attr('data-province-rel'),
      postalCode = $(this).closest('.enbridge-dropdown').attr('data-postal-code-rel') || '';

    countryServiceData.countryCode = $(this).attr('data-value');

    if (countryServiceData.countryCode === Enbridge.CountryCodes.CANADA) {
      Enbridge.ServiceUtils.loadProvinces(countryServiceData, relationId, Enbridge.ProvinceCodes.ONTARIO);
    } else {
      Enbridge.ServiceUtils.loadProvinces(countryServiceData, relationId);
    }

    if (!postalCode) {
      return;
    }

    if ($(this).attr('data-value') === Enbridge.CountryCodes.CANADA) {
      $('[data-id="' + postalCode + '"]').attr('data-pattern', 'postal-code');
    } else {
      $('[data-id="' + postalCode + '"]').removeAttr('data-pattern');
    }
  });

  $("#sendProccessFeedbackButton").click(
    function() {
      try {
        var target = $("#feedbackFormName").val();
        var rating = $("#hdnLikeDislike").val();
        var message = $("#textFeedbackMessage").val();
        if (!message.trim()) {
          alert("please enter your comments");
          return false;
        }
        $.ajax({
          type: 'POST',
          url: '/WebServices/FeedbackService.svc/SendProcessFeedback',
          data: JSON.stringify({
            Target: target,
            Rating: rating,
            Message: message
          }),
          contentType: "application/json",
          success: function() {
            //window.location = '/homes/start-stop-move/moving/index.aspx';
          },
          error: function() {
            console.log('Error on the service');
            //window.location = '/homes/start-stop-move/moving/index.aspx';
          }
        });

      } catch (e) {
        console.log("Feedback email failed");
      }
    });

  /******************************* Webtrends implementation ********************************/

  // Flag to don't track in webtrends repeated steps
  Enbridge.currentStep = -1;

  $(document).bind(Enbridge.Events.TRACK_IN_WEBTRENDS, Enbridge.ServiceUtils.trackWebTrendsHandler);

  // Track steps in accordion wizard (flows) to webtrends
  $('.accordion')
    .bind(Enbridge.Events.TRACK_IN_WEBTRENDS, Enbridge.ServiceUtils.trackAccordionWizardStepsInWebTrends);

  // Track "save & return later" to webtrends
  $('.enbridge-container .enbridge-btn:contains("SAVE & RETURN LATER")').click(function() {
    dcsMultiTrack('DCS.dcsuri', '/moves-form/save-and-return-later.html', 'WT.ti', 'Moves%20-%20Save%20and%20Return%20Later', 'WT.z_engage', 'Start_Over_Event', 'WT.z_UserStatus', 'Auth');
  });

  // Track "cancel" (or Start over) to webtrends
  $('[id$="-start-over"]').bind('click', function() {
    dcsMultiTrack('DCS.dcsuri', '/moves-form/cancel.html', 'WT.ti', 'Moves%20-%20Cancel', 'WT.z_engage', 'Cancel_Saved_Move_Event', 'WT.z_UserStatus', 'Auth');
  });

  $(document).trigger(Enbridge.Events.TRACK_IN_WEBTRENDS);
});
