// bootstrap.js
/** General Namespace **/
var Enbridge = window.Enbridge || {
    UrlServices: {
        GET_PROVINCES: '/WebServices/AddressService.svc/GetProvinces'
    },
    Templates: {
        PROVINCE: '<option value=":provinceCode">:provinceName</option>'
    },
    CountryCodes: {
        CANADA: 'CA'
    }
};
/*******************************Window Ready loaders ********************************/
;$(window).ready(function () {
    if ($('[data-id="stop"]:checked').length) {
        $('[data-id="stop-select"]')
            .removeClass('hide-flow')
            .attr('data-required', true);
    }

    if ($('[data-id="country"]').val() != 'CA') {
        $('[data-id="postal-code-input"]').removeAttr('data-pattern');
    }

    if ($('[data-id="country-alternative-element"]').val() != 'CA') {
        $('[data-id="postal-code-input-alternative"]').removeAttr('data-pattern');
    }

    if ($('[data-rel="country-alternative-element"]').val() != 'CA') {
        $('[data-id="postal-code-input-alternative"]').removeAttr('data-pattern');
    }
});

// prototype.js
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

// common.js
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
// utils.js
/***********************General functions***********************/

/* Format a date for display in a literal */
function formatDisplayStreet(unitNumber, streetNumber, suffix, streetName, city, province, postalCode) {
    var address = [];

    if (!!unitNumber) {
        address.push(unitNumber + ' - ');
    }

    address.push(streetNumber);

    if (!!suffix) {
        address.push(suffix + ' ');
    }

    address.push(streetName + ' <br /> ' + city + ', ' + province + '<br />' + postalCode);

    return address.join('').toUpperCase();
}

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
        case '1': case '21': case '31':
            dateValue += (' ' + splitDates[2] + 'st');
            break;
        case '2': case '22':
            dateValue += (' ' + splitDates[2] + 'nd');
            break;
        case '3': case '23':
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

function getTotalDays(year, month) {
    return 32 - new Date(year, month - 1, 32).getDate();
}

// calendar.js
/*Calendar section*/
(function ($) {
    $(window).ready(function () {
        var calendar = $('.calendar'),
            currentDate = new Date(new Date().getTime() + (15 * 86400000)), //Move 15 days into future so that it doesn't interfere with saving and resumption
            confirmDialog = '',
            dialogConstant = {
                autoOpen: true,
                resizable: false,
                height: 240,
                width: 720,
                modal: true,
                height: 440,
                top: 29,
                beforeClose: function (e) {
                    if (confirmDialog !== '') {
                        confirmDialog.dialog('destroy');
                    }
                    confirmDialog = $('.confirm-dialog-close')
                    .dialog({
                        autoOpen: true,
                        resizable: false,
                        dialogClass: 'confirm-dialog-close',
                        width: 430,
                        top: 200,
                        modal: true,
                        height: 440
                    });
                    $('.confirm-not-dialog').bind('click', function (e) {
                        e.preventDefault();
                        confirmDialog.dialog('close');
                        return false;
                    });
                    return false;
                }
            };

        calendar.datepicker();

        $('.confirm-yes-dialog').bind('click', function () {
            window.location = '/homes/start-stop-move/moving/index.aspx';
        });

        $('[data-id="date-finish"], [data-id="date-start"]').val(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate());

        for (var i = calendar.length - 1; i >= 0; i--) {

            var $current = $(calendar[i]).click();
            $current.datepicker("setDate", currentDate);
            var date = $current.datepicker('getDate');
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            /**/
            // Remove border when user doesn't pick a date
            var $currentContainer = $current.parent().parent();
            if ($currentContainer.hasClass('no-date-selected')) {
                $currentContainer.removeClass('no-date-selected');
            } /**/

            $($current.closest('.calendar-column').attr('data-calendar'))
                .val(year + '-' + month + '-' + day);
        }

        $('.tooltip .icon').bind('click', function () {
            $(this).next()
                .addClass('active-tooltip')
                .show();
        });

        $('.tooltip .cross').bind('click', function () {
            $(this).closest('.content-tooltip')
                .removeClass('active-tooltip')
                .hide();
        });

        $('.modalopen').bind('click', function (e) {
            e.preventDefault();
            $($(this).attr('data-target'))
                .css("display", "none");

            var id = $(this).attr('data-target'),
                elements = $(id).siblings();

            elements.each(function (entry) {
                var idName = $(elements[entry]).attr('id'),
                        idchange = '#' + idName;
                $(idchange).removeClass("hidden");
                $("#costumer-alert").addClass("hidden");
            });
        });

        $('.open-dialog').bind('click', function (e) {
            e.preventDefault();
            var $this = $(this);

            scroll(0, 0);
            $($this.attr('data-target'))
                .dialog({
                    autoOpen: true,
                    resizable: false,
                    height: 400,
                    width: 720,
                    modal: true,
                    height: 440
                });
        });

        var numberHouse = $('[data-id="current-number"]').val() || '',
            unitNumber = $('input[data-id=pre-street-number]').val() || '',
            suffix = $('input[data-id=pre-suffix]').val() || '';

        $('[data-id="street-number"]').val(numberHouse);
        $('[data-id="suffix"]').val(suffix);
        $('[data-id="misc-info"]').val(unitNumber);

        $('#existingcustomers, #newcustomers, #moving-out')
            .removeClass('hidden')
            .dialog(dialogConstant).parent().appendTo(jQuery("form:first"));

        $('.enbridge-form input[type="text"]').bind('change', function () {
            var rel = $(this).attr('data-rel');

            $('[data-rel="' + rel + '"]').removeClass('input-error');

            $(this)
                .closest('.set-field')
                    .find('.error-message')
                        .remove();
        });

    });
} (jQuery));

// plugins/codetool.js
/*Code Tool*/

function CodeTool(element) {
    this.element = element;

    this.addMethods();
}

CodeTool.prototype.restart = function () {
    $element
        .removeClass('opened required')
        .addClass('closed');
};

CodeTool.prototype.addMethods = function () {
    var $element = $(this.element);

    $element.find('.opener')
        .bind('click', function (e) {
            e.stopPropagation();

            $element
                .toggleClass('opened closed required')
                .find('.code-container').attr('data-required', true);
        });

    $element.find('.submiter')
        .bind('click', function (e) {
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
                success: function (data) {
                    if (!!data) {
                        $element
                            .addClass('success-zip')
                            .find('.result')
                                .html('<img src="../../AppImages/success.png"> <span>' + success + '</span>')
                                .addClass('success-code');

                        $('[data-id="transfer"]')
                            .attr('checked', true);
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
                error: function () {
                    console.log('Error on the service');
                }
            });

        });
};

$.fn.codeTool = function (element) {
    return this.each(function () {
        (new CodeTool(this));
    });
};

; (function ($) {
    $(window).ready(function () {
        $('.zip-code-tool').codeTool();
    });

})(jQuery);

// plugins/dropdown.js
/***********************Plugins declaration***********************/

/*Dropdown*/
function dropdownEnbridge(element) {
    this.source = element;
    this.init();
    this.addMethods();
}

dropdownEnbridge.prototype.init = function () {
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
};

dropdownEnbridge.prototype.addMethods = function addMethods() {
    var self = this,
        $element = $(this.element);

    $element.bind('click', function () {
        $(this).toggleClass('active');
    });

    $element.bind('mouseleave', function () {
        this.className = 'enbridge-dropdown';
    });

    $element
        .find('.list-items .list-item')
            .bind('click', function () {
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

    var value = this.getAttribute('data-value');
                var $copyToHidden = $('input[type="hidden"][data-assoc="' + self.source.getAttribute('data-id') + '"]');
                if ($copyToHidden.length > 0) {
                  $copyToHidden.val(value);
                }
            });

};

dropdownEnbridge.prototype.destroy = function (id) {
    var $element = $('#' + id);

    if (!$element.length)
        return;

    $element.unbind('click');
    $element.find('.list-items .list-item').unbind('click');
    $element.remove();
}

$.fn.enbridgeDropdown = function (element) {
    return this.each(function () {
        (new dropdownEnbridge(this));
    });
};

; (function ($) {
    $(window).ready(function () {
        $('.enbridge-select').enbridgeDropdown();
        $('.enbridge-dropdown').bind('mouseleave', function () {
            this.className = 'enbridge-dropdown';
        });
    });

})(jQuery);

// flows/accordion.js
/***********************Accordion***********************/
(function ($) {

    /*Header click to collapse section*/
    $('.accordion .accordion-item >.header').bind('click', function (event) {
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
}(jQuery));
// flows/move-out.js
(function ($) {
    /*Dialog - 3 - Move out*/

    /*Restart personal address information*/
    $('#moving-out-restart-personal-info').bind('click', function () {
        $('[data-id="moving-out-street-number"], [ data-id="moving-out-suffix"],[data-id="moving-out-street"],[data-id="moving-out-misc-info"],[data-id="moving-out-city-or-town"],[data-rel="moving-out-postal-code-input"]').val('');
    });

    /*Restart personal user information*/
    $('#moving-out-restart-personal-user-info').bind('click', function () {
        $('[data-id="moving-out-your-year"], [data-id="moving-out-email"]').val('');
        $('[data-rel="moving-out-home-phone"], [data-rel="moving-out-mobile-phone"], [data-rel="moving-out-business-phone"]').val('');
    });

    /*Start Over*/
    $('#moving-out-start-over').bind('click', function () {
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
}(jQuery));

// flows/moving-out.js
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

// flows/new-customer.js
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

// services/provinces.js
; (function (window, $) {

    var Enbridge = window.Enbridge;

    function loadProvinces(data, id) {
        $.getJSON(Enbridge.UrlServices.GET_PROVINCES, data, function populateProvinces(provinces) {
            var i = 0,
                len = provinces.length || 0,
                $provinceDropdown = $('[data-id="' + id + '"]'),
                compilation = '';

            for (i = 0; i < len; i += 1) {
                compilation +=
                    Enbridge.Templates.PROVINCE.replace(':provinceCode', provinces[i].Code)
                        .replace(':provinceName', provinces[i].Name);
            }

            $provinceDropdown.html(compilation);
            $provinceDropdown.enbridgeDropdown();
        });
    }

    $(document).ready(function () {
        var countryServiceData = {
            countryCode: Enbridge.CountryCodes.CANADA
        },
            $countryDropdown = $('[data-id="country"], [data-id="moving-out-country"], [data-id="country-alternative-element"]'),
            $countryDropdownItems = $countryDropdown.next('.enbridge-dropdown').find('li');

        for (var i = $countryDropdown.length - 1; i >= 0; i--) {
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
            loadProvinces(countryServiceData, $currentDropdown.attr('data-province-rel'));
        }

        $countryDropdownItems.bind('click', function (e) {
            var relationId = $(this).closest('.enbridge-dropdown').attr('data-province-rel'),
                postalCode = $(this).closest('.enbridge-dropdown').attr('data-postal-code-rel') || '';

            countryServiceData.countryCode = $(this).attr('data-value');
            loadProvinces(countryServiceData, relationId);

            if (!postalCode) {
                return;
            }

            if ($(this).attr('data-value') === 'CA') {
                $('[data-id="' + postalCode + '"]').attr('data-pattern', 'postal-code');
            } else {
                $('[data-id="' + postalCode + '"]').removeAttr('data-pattern');
            }
        });

    });
} (window, jQuery));

// services/zip.js
/*Success Zip*/
(function ($)) {
    $('.new-address').keyup(function () {
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
            success: function (data) {
                if (!!data) {
                    var containerEl = container.replace('#', ''),
                        streetObj = [],
                        keys = [],
                        getNumbers = function getNumbers(range, init, end) {
                            var returnVal = [];
                            switch (range) {
                                case 0:
                                    for (; init <= end; init++) {
                                        returnVal.push(init)
                                    }
                                    break;
                                case 1:
                                    for (; init <= end; init++) {
                                        if (init % 2 == 0)
                                            returnVal.push(init)
                                    }
                                    break;
                                case 2:
                                    for (; init <= end; init++) {
                                        if (init % 2 != 0)
                                            returnVal.push(init)
                                    }
                                    break;
                                default:
                                    break;
                            }
                            return returnVal;
                        };

                    data = JSON.parse(data);

                    for (var size = data.length - 1; size >= 0; size--) {
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

                    for (var i = 0, size = keys.length; i < size; i++) {
                        var radioButton = '<input type="radio" id="' + (containerEl + '-' + i) + '" ' +
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
                            '<label class="fake-input" for="' + (containerEl + '-No') + '">No one above</label>');

                    $(container).html(radioContent.join(''));


                    $(container).find('input[type="radio"]').bind('click', function () {
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
            error: function () {
                $this
                    .removeClass('input-success success-field')
                    .addClass('input-error');
            }
        });
    });
}(jQuery));
