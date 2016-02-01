(function ($) {
    /*Run validations for each section*/
    $('.accordion .accordion-item .validator').bind('click', function (e) {
        e.preventDefault();

        var $current = $(this).closest('.accordion-item'),
            $finishDate = $current.find('.finish-date'),
            $startDate = $current.find('.start-date');

        if (!validator($current.find('.enbridge-form')) && !dateValidator($startDate, $finishDate)) {
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

            }

            var city = $('[data-id=moving-out-city-or-town]').val() || '',
                numberHouse = $('input[data-id=moving-out-street-number]').val() || '',
                unitNumber = $('input[data-id=pre-street-number]').val() || '',
                suffix = $('input[data-id=moving-out-suffix]').val() || '',
                streetName = $('input[data-id=moving-out-street]').val() || '',
                zipCode = $('[data-id=moving-out-postal-code-input]').val() || '',
                province = $('[data-id=moving-out-province]').val() || '',
                address = formatDisplayStreet(unitNumber, numberHouse, suffix, streetName, city, province, zipCode);

            $('#current-address').html(address);
        }

    });

    /*Submit button*/

    $('.dialog .submit-button').bind('click', function (e) {
        var $this = $('#' + $(this).attr('data-item-related')),
            $current = $this.closest('.accordion-item'),
            $finishDate = $current.find('.finish-date'),
            $startDate = $current.find('.start-date');

        if ($this.hasClass('disabled')) {
            return false;
        }

        if (!validator($current.find('.enbridge-form')) && !dateValidator($startDate, $finishDate)) {
            return true;
        } else {
            return false;
        }
    });

    /*Return to the previous step*/
    $('.accordion .accordion-item .prev').bind('click', function (e) {
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
    $('.steps .next-step').bind('click', function () {
        var $current = $(this).closest('.accordion-item'),
            $currentStep = $(this).closest('.steps'),
            nextStep = $(this).attr('data-next-step');

        if (!validator($current.find('.enbridge-form'))) {
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
    $('.edit-info').bind('click', function (e) {
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
    })

    /*Calendar get date*/
    $('.calendar').bind('click', function (e) {
        if (!(e.target.className.indexOf('ui-datepicker-today') && parseInt(e.target.textContent))) {
            return;
        }

        var $this = $(this),
            date = $this.datepicker('getDate'),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            dateFormated = year + '-' + month + '-' + day,
            $inputElem = $('[data-id="' + $this.closest('.calendar-column').attr('data-calendar') + '"]');

        $inputElem.val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());

        $.ajax({
            url: '/WebServices/DateService.svc/IsWeekendOrHolidayDate',
            type: 'GET',
            dataType: 'application/json',
            data: {
                date: dateFormated
            },
            success: function (data) {

                $('[data-calendar="' + $inputElem.attr('data-id') + '"]')
                        .find('.error-code')
                            .remove();

                if (JSON.parse(data)) {

                    $('[data-calendar="' + $inputElem.attr('data-id') + '"]')
                            .append('<div class="result error-code"><img src="../../AppImages/error.png"><span>Date must not be a holiday or a weekend date.</span></div>');
                } else {
                    $('[data-calendar="' + $inputElem.attr('data-id') + '"]')
                            .find('.result')
                                .remove();
                }
            },
            error: function () {
                console.log('Conection issue');
            }
        });
    });

    /*Forms Reset*/
    $('.enbridge-form input[type="radio"]').bind('click', function () {
        var name = $(this).attr('name') || '';

        $(this).closest('.set-field')
            .find('.error-message')
                .remove();

        $('input[name="' + name + '"]').removeClass('input-success input-error');
    });
} (jQuery));