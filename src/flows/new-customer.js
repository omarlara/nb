(function ($) {
    /*Dialog - 2 - New Customer*/

    /*Moving out finish*/
    $('#moving-out-finish').bind('click', function () {
        var fromAddress = $('[data-id="moving-out-street-number"]').val() + ' ' + $('[ data-id="moving-out-suffix"]').val() + ' ' +
                          $('[data-id="moving-out-street"]').val() + ' ' + $('[data-id="moving-out-misc-info"]').val() + ' ' + $('[data-id="moving-out-city-or-town"]').val() + ' ' +
                          $('[data-id="moving-out-country"]').val() + ' ' + $('[data-id="moving-out-province"]').val() + ', ON ' + $('[data-rel="moving-out-postal-code-input"]').val(),
            birthDay = $('[data-id="moving-out-your-day"]').val() + '/' + $('[data-id="moving-out-your-month"]').val() + '/' + $('[data-id="moving-out-your-year"]').val();

        $('#moving-new-date-summary').text(dateFormater($('[data-id="moving-out-date" ]').val()));

        $('#moving-out-from').text(fromAddress);
        $('#moving-out-summary-birth-day').text(birthDay);
        $('#moving-out-summary-user-phone').text($('[data-id="moving-out-home-phone-lada"]').val() + ' ' + $('[data-id="moving-out-home-phone"]').val());
        $('#moving-out-summary-mobile-phone').text($('[data-id="moving-out-mobile-phone-lada"]').val() + ' ' + $('[data-id="moving-out-mobile-phone"]').val());
    });


    /*Add alternative mailer address*/
    $('[data-id="newcustomers-mailing-address-alternative"], [data-id="newcustomers-mailing-address"]').change(function () {
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
    $('#newcustomers-confirm-address-button').bind('click', function () {
        var city = $('[name="newcustomers-select-street-container"]:checked').val() || '',
            numberHouse = $('#newcustomers-current-number').val() || '',
            zipCode = $('[data-id="newcustomers-code-validator"]').val() || '';

        $('#newcustomers-address-confirmation').text(numberHouse + ' ' + city + ', ON ' + zipCode);
    });

    /*Info Decline*/
    $('#newcustomers-info-decline').bind('click', function (e) {
        e.preventDefault();
        $('[data-id="newcustomers-code-validator"]')
            .removeClass('success-field')
            .val('');

        $('[name="newcustomers-house-property"]')
            .attr({ 'checked': false })
            .removeAttr('data-required')
            .removeClass('input-error');

        $('#newcustomers-select-street-container, #data-dropdown').empty('');

        $('#newcustomers-confirm-address, #newcustomers-first-step').toggleClass('active-step');
    });

    /*Info confirmation*/
    $('#newcustomers-info-confirmation').bind('click', function (e) {
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
}(jQuery));
