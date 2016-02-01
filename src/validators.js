/*Validators*/
var validator = function formValidator($form) {
    var error = false,
        radio = $form.find('input[type="radio"]').removeClass('input-error input-success'),
        select = $form.find('.enbridge-select').removeClass('input-error'),
        zipTool = $form.find('.zip-code-tool.[data-required="true"]').removeClass('success-field'),
        newAddress = $form.find('.new-address'),
        oneFromGroup = $form.find('.required-from-group'),
        text = $form.find('input[type="text"]:not(.ignore)');

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

    for (var i = text.length - 1; i >= 0; i--) {
        var $current = $(text[i]),
            pattern = $current.attr('data-pattern') || '';

        if ($current.attr('data-required') && !$current.val()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
                .addClass('input-error');

            $current.closest('.set-field')
                .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
            error = true;
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
    }
    if (error) {
        for (var i = oneFromGroup.length - 1; i >= 0; i -= 1) {
            var $current = $(oneFromGroup[i]);

            if ($current.find('.input-error').length < 1) {
                oneFromGroup.find('.input-error').removeClass('input-error');
                oneFromGroup.find('.error-message').remove();
                error = ($form.find('.input-error').length > 0);
                break;
            }
        }
    }


    return error;
};

//Determine if a day is a business day
var isBusinessDay = function (dateToCheck) {
    var formattedDate = dateToCheck.getFullYear() + "-" + (dateToCheck.getMonth() + 1) + "-" + dateToCheck.getDate();
    var result = $.ajax({
        type: 'GET',
        async: false,
        url: '/WebServices/DateService.svc/IsWeekendOrHolidayDate',
        data: { date: formattedDate },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('An error occurred checking for business date.' + textStatus + ' : ' + errorThrown + ' : ' + jqXHR.responseText);
        }
    }).responseText;

    if (result == "true") {
        return true;
    }
    else {
        return false;
    }
}

//Validate the selected dates.  
//Note that return results are returned immediately to avoid web service calls.
//Also note the check to see if it is a holiday date happens on the on click event of a calendar.
var dateValidator = function ($renewDate, $lastService) {

    var renewDate = new Date($renewDate.val()),
        $renewDateContainer = $('.address-component').eq(0),

        finishLastService = new Date($lastService.val()),
        $finishLastServiceContainer = $('.address-component').eq(1),
        now = new Date();

    if ($renewDateContainer.hasClass('no-date-selected')) {
        $renewDateContainer.removeClass('no-date-selected');
    }

    if ($finishLastServiceContainer.hasClass('no-date-selected')) {
        $finishLastServiceContainer.removeClass('no-date-selected');
    }

    //Determine the type of move
    var stepsRadio = $("input[type='radio'][name='steps']:checked");
    if (stepsRadio.length > 0) {
        stepsVal = stepsRadio.val();
    }

    //Determine if renew date validation is necessary (correct step on auth move page or if not auth move page)
    var validateRenewDate = $renewDate.attr('data-required') &&
        (stepsRadio.length <= 0 || stepsVal == 'transfer' || stepsVal == 'add');

    var validateLastService = $lastService.attr('data-required') &&
        (stepsRadio.length <= 0 || stepsVal == 'transfer' || stepsVal == 'stop');

    //Ensure date is selected
    if (validateRenewDate && !$renewDate.val() && isNaN(renewDate.valueOf())) {
        $('[data-calendar*="' + $renewDate.attr('data-id') + '"]')
                .append('<div class="result error-code"><img src="../../AppImages/error.png"><span>Missing Date.</span></div>');

        // Add border to calendar container (startDate) when user doesn't pick a date
        if (!$renewDateContainer.hasClass('no-date-selected')) {
            $renewDateContainer.addClass('no-date-selected');
        }
        return true;
    }

    //Ensure date is selected
    if (validateLastService && !$lastService.val() && isNaN(finishLastService.valueOf())) {

        $('[data-calendar*="' + $lastService.attr('data-id') + '"]')
                .append('<div class="result error-code"><img src="../../AppImages/error.png"><span>Missing Date.</span></div>');

        // Add border to calendar container (finishDate) when user doesn't pick a date
        if (!$finishLastServiceContainer.removeClass('no-date-selected')) {
            $finishLastServiceContainer.addClass('no-date-selected');
        }

        return true;
    }

    //Figure out the date 3 business days in the future
    var additionalBusinessDays = 1;
    var additionalDays = 1;
    var minimumDate;
    while (additionalBusinessDays < 3) {
        minimumDate = new Date(now.getTime() + (additionalDays * 86400000));
        if (isBusinessDay(minimumDate)) {
            additionalBusinessDays++;
        }
        additionalDays++;
    }

    //Start date must be 3 business days in the future
    if (validateRenewDate && renewDate < minimumDate) {
        $('[data-calendar*="' + $renewDate.attr('data-id') + '"]')
            .append('<div class="result error-code"><img src="../../AppImages/error.png"><span>Date must be 3 business days in the future.</span></div>');
        return true;
    }

    //End date must be 3 business days in the future
    if (validateLastService && finishLastService < minimumDate) {
        $('[data-calendar*="' + $lastService.attr('data-id') + '"]')
            .append('<div class="result error-code"><img src="../../AppImages/error.png"><span>Date must be 3 business days in the future.</span></div>');
        return true;
    }

    return false;
};
