/*Dialog - 1 - Moving out*/
(function ($) {
    $('[account-authorization="bill"]').keyup(function () {
        var $this = $(this),
            accountNumber = $('[data-id="moving-out-account-number"]').val(),
            postalCode = $('[data-id="moving-out-postal-code"]').val(),
            name = $('[data-id="moving-out-name"]').val();

        $.ajax({
            type: 'POST',
            url: '/WebServices/GasAccountService.svc/ValidateCustomerAndGetData',
            data: JSON.stringify({ AccountNumber: accountNumber, FullName: name, PostalCode: postalCode }),
            contentType: "application/json",
            success: function (result) {
                if (!!result) {
                    var displayText = null,
                        serviceAddress = result.ServiceAddress;
                    $('[account-authorization-required="true"').css('visibility', 'visible');
                    $('#account-authorization-failure-message').css('visibility', 'hidden');

                    displayText = formatDisplayStreet(
                        serviceAddress.Unit,
                        serviceAddress.StreetNumber,
                        serviceAddress.Suffix,
                        serviceAddress.StreetName,
                        serviceAddress.City,
                        serviceAddress.Province,
                        serviceAddress.PostalCode);

                    $('#current-address').html(displayText);
                }
                else {
                    $('[account-authorization-required="true"').css('visibility', 'hidden');
                    $('#account-authorization-failure-message').css('visibility', 'visible');
                }
            },
            failure: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        });
    });

    /*Stop radio button click, show/hide Select reason select*/
    $('[name="steps"]').bind('click', function () {
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
    });

    /*
    When you click on the next sep, on Select your street
    if you have selected No one above, you will show form, in another case you will be on the select street number
    */

    $('#get-address').bind('click', function () {
        var $this = $(this),
            $radio = $('#select-street-container [type="radio"]:checked'),
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
        for (var i = 0, rangesNum = ranges.length; i < rangesNum; i++) {
            numbers.push('<option value="' + ranges[i] + '">' + ranges[i] + '</option>');
        }

        $('<select class="enbridge-select" id="current-number" data-required="true">' + numbers.join('') + '</select>')
            .appendTo(container)
            .enbridgeDropdown();

    });

    /*Run validator at phone required group*/
    $('.required-from-group').find('input').bind('change', function () {
        validator($(this).parents('.enbridge-form'));
    });

    /*New account entry business input variation*/
    $('input[name=device-type]').bind('change', function () {
        var accountType = $('input[name=device-type]:checked').val();
        $('div[class$="inputs-container"]').hide().find('input').addClass('ignore');
        $('.' + accountType + '-inputs-container').show().find('input').removeClass('ignore input-error').parent().find('.error-message').remove();
    });

    /*Set Address on decline/accept step container*/
    $('#confirm-address-button').bind('click', function () {
        var city = $('[name="select-street-container"]:checked').attr('data-city') || '',
            numberHouse = $('#current-number').val() || '',
            unitNumber = $('input[data-id=pre-street-number]').val() || '',
            suffix = $('input[data-id=pre-suffix]').val() || '',
            streetName = $('[name="select-street-container"]:checked').attr('data-street') || '',
            zipCode = $('[data-id="code-validator"]').val(),
            province = $('[name="select-street-container"]:checked').attr('data-province') || '',
            address = formatDisplayStreet(unitNumber, numberHouse, suffix, streetName, city, province, zipCode);

        $('.address').last().html(address);

        $('#address-confirmation').html(address);

        $('[data-id="street-number"]').val(numberHouse);
        $('[data-id="suffix"]').val(suffix);
        $('[data-id="misc-info"]').val(unitNumber);
    });

    /*Info Decline*/
    $('[data-id="info-decline"]').bind('click', function (e) {
        e.preventDefault();
        $('[data-id="code-validator"]')
            .removeClass('success-field')
            .val('');

        $('[name="house-property"]')
            .attr({ 'checked': false })
            .removeAttr('data-required')
            .removeClass('input-error');

        $('#select-street-container, #data-dropdown').empty('');

        $('#confirm-address, #first-step').toggleClass('active-step');
    });

    /*Info confirmation*/
    $('[data-id="info-confirmation"]').bind('click', function (e) {
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
    $('[data-id="mailing-address-alternative"], [data-id="mailing-address"]').change(function () {
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
    $('#complete-new-user').bind('click', function () {
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
                              $('[data-id="country"]').val() + ' ' + +$('[data-id="province"]').val() + ', ' + $('[data-id="postal-code-input"]').val();

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

        $('#start-service-wait').text(dateFormater(dateEndService));
        $('#end-service-wait').text(dateFormater(dateStartService));

        $('#birth-day').text(birthDay);

        $('#user-phone').text($('[data-id="user-mobile-lada"]').val() + ' ' + $('[data-rel="mobile-phone-your-info"]').val());
        $('#mobile-phone').text($('[data-id="user-home-lada"]').val() + ' ' + $('[data-id="user-home-phone"]').val());

        $('#additional-contact').text($('[data-id="additional-fist-name"]').val() + ' ' + $('[data-id="additional-last-name"]').val());

    });

    /*Reset mailing information*/
    $('[data-id="personal-info-user"]').bind('click', function () {
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
            .attr({ 'checked': false })
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
    $('[data-id="reset-personal-info"]').bind('click', function () {
        $('#personal-info').find('[type="text"]')
            .val('');

        /*Disable submit*/
        $('[data-id="moving-out-submit"]').addClass('disabled');
    });

    /*Start Over*/
    $('#new-account-start-over').bind('click', function () {
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
            .attr({ 'checked': false })
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

        if (!this.value.validYear() || !parseInt(month))
            return;

        availableDays = getTotalDays(parseInt(year), parseInt(month));

        for (var total = options.length - 1; total > 0; total--) {
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

    $('.birth-day-controller-month + .enbridge-dropdown .list-item').bind('click', function () {
        var $this = $(this),
            birthDayController = $this.closest('.enbridge-dropdown').prev().attr('data-birth-day-controller'),
            year = $('[data-id="' + $this.closest('.enbridge-dropdown').prev().attr('data-birth-year-controller') + '"]').val(),
            day = $('[data-id ="' + birthDayController + '"]').val(),
            month = $this.attr('data-value'),
            options = $('[data-id ="' + birthDayController + '"] + .enbridge-dropdown .list-item'),
            $day = $('[data-id ="' + birthDayController + '"]'),
            availableDays = null;

        if (!year.validYear() || !parseInt(month))
            return;

        availableDays = getTotalDays(parseInt(year), parseInt(month));

        for (var total = options.length - 1; total > 0; total--) {
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
}(jQuery));
