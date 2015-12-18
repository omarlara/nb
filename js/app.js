;(function ($, window, document) {
    var dateCurrent = new Date(),
        validYear = dateCurrent.getFullYear() - 19;

    String.prototype.validYear = function() {
        var value = this;
        if(!parseInt(value)) return false;

        if(value >= 1900 && value <= validYear) {
            return true;
        } else {
            return false;
        }
    }

    String.prototype.validEmail = function() {
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this);
    }

    String.prototype.postalCode = function() {
        return /^[a-z]\d[a-z]\s?\d[a-z]\d$/i.test(this);
    }

    String.prototype.PhoneFormat = function () {
        return /^\d{3,3}(\-)\d{4,4}\d$/.test(this);
    }

    /*Dropdown*/
    ; (function ($) {
        function dropdownEnbridge(element) {
            this.source = element;
            this.init();
            this.addMethods();
        }

        dropdownEnbridge.prototype.init = function () {
            var $element = $(this.source),
                elemenetNodes = this.source.children || [],
                nodes = [],
                element = '',
                name = '';

            if (!elemenetNodes.length) return;

            name = elemenetNodes[0].text || '';

            for (var i = 0, size = elemenetNodes.length; i < size; i++) {
                var temp = '<li class="list-item"><input type="hidden" value="'+
                            elemenetNodes[i].value+ '">' + elemenetNodes[i].text + '</li>';
                nodes.push(temp);
            }



            element = '<div class="enbridge-dropdown">' +
                      '<input type="hidden" class="result">' +
                      '<div class="header"><span class="selected">' + name + '</span><span class="indicator"></span></div><ul class="list-items">' +
                          nodes.join('') +
                      '</ul></div>';

            $element.after(element);

            this.element = this.source.nextElementSibling;
        };

        dropdownEnbridge.prototype.addMethods = function addMethods() {
            var self = this,
                $element =  $(this.element);

            $element.bind('click', function () {
                $(this).toggleClass('active');
            });

            $element
                .find('.list-items .list-item')
                    .bind('click', function() {
                        var $current = $(this),
                            $source = $(self.source),
                            text = $current.text() || '',
                            value = $current.find('input').val() || '',
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
                            .find('option[value="' + value +'"]')
                                .attr('selected', true);

                    });

            $(document).click(function(e) {
                if ( $.contains(self.element, e.target) ) {
                    return;
                } else {
                    $(self.element).removeClass('active');
                }
            });
        };

        $.fn.enbridgeDropdown = function (element) {
            return this.each(function() {
                (new dropdownEnbridge(this));
            });
        };

        $(window).ready(function() {
            $('.enbridge-select').enbridgeDropdown();
        });

    })(jQuery);

    /*Code Tool*/
    ;(function($){

        function CodeTool(element) {
            this.element = element;

            this.addMethods();
        }

        CodeTool.prototype.restart = function () {
            $element
                .removeClass('opened required')
                .addClass('closed');
        }

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

                    var currentCode = $element.find('name=[zip-tool]').val(),
                        success = 'Your new address is serviced by Enbridge.',
                        error = 'Your new address is not serviced by Enbridge. Please contact your local municipality to find a local provicer. You may still proceed in order to let us know when you are moving out.',
                        request = null,
                        result = null;

                    request =  $.post( "dummy.php",
                                    function(resp) {
                                        if (resp && resp.result) {
                                            $element
                                                .addClass('success-zip')
                                                .find('.result')
                                                    .html('<img src="assets/img/success.png"> <span>' + success + '</span>')
                                                    .addClass('success-code');
                                        } else {
                                            $element
                                                .find('.result')
                                                    .html('<span>' + error + '</span>')
                                                    .addClass('error-code');
                                        }

                                },"json");

                });
        };

        $.fn.codeTool = function (element) {
            return this.each(function() {
                (new CodeTool(this));
            });
        };

        $(window).ready(function() {
           $('.zip-code-tool').codeTool();
        });

    })(jQuery);

    /*Common*/

    /*Success Zip*/
    $('.new-address').change(function() {
        var $this = $(this),
            currentVal = $this.val(),
            container = $this.attr('data-content'),
            radioContent = [];

        $this.closest('.code-box')
            .find('.error-message ').remove();

        if(!$this.val().postalCode()) {
            $this
                .addClass('input-error')
                .after('<p class="error-message ">Please enter a valid postal code (example: A1A1A)</p>');
            return;
        }

        $this.removeClass('input-error');

        if($this.next().hasClass('error-message')) {
            $this.next().remove();
        }
        $.post( "dummy.php",
            function(resp) {
                if (resp && resp.result) {

                    var containerEl = container.replace('#','');
                    $this
                        .addClass('success-field')
                        .removeClass('input-error');

                    for (var i = 0, size = resp.elements.length; i< size; i +=1) {
                        var chain = '<input type="radio" id="' + (containerEl + '-' + i) + '"  name="' + containerEl + '"value="' + resp.elements[i].value + '" name="stepsContent" data-required-error="Please select yout street."><label class="fake-input" for="' + (containerEl + '-' + i) + '">' + resp.elements[i].name + '</label>';
                        radioContent.push(chain);
                    }

                    $(container).html(radioContent.join(''));
                    /*Select container*/
                    $(container).find('input[type="radio"]').bind('click', function() {
                        var name = $(this).attr('name') || '',
                            containerBox = (this.value)?$this.attr('data-first-op'): $this.attr('data-second-op');

                        $('#get-address').attr('data-next-step', containerBox);
                        $('#newcustomers-get-address').attr('data-next-step', containerBox);

                        $('input[name="' + name + '"]').removeClass('input-success input-error');
                    });


                } else {
                    $this
                        .removeClass('input-success success-field')
                        .addClass('input-error');
                }

            },"json");

    });

    /*Accordion*/
    var validator = function formValidator ($form) {
        var error = false,
            radio = $form.find('input[type="radio"]').removeClass('input-error input-success'),
            select = $form.find('.enbridge-select').removeClass('input-error'),
            zipTool = $form.find('.zip-code-tool.[data-required="true"]').removeClass('success-field'),
            newAddress = $form.find('.new-address'),
            text = $form.find('input[type="text"]');

        $form.find('.error-message, .error-code').remove();
        $form.find('.input-error').removeClass('input-error');

        for (var i = radio.length - 1; i >= 0; i--) {
            var $current = $(radio[i]);

            if($current.attr('data-required') && !($current.hasClass('input-success') || $current.attr('checked')) ) {
                var $current = $(radio[i]);

                if(!$current.hasClass('input-error')) {
                    $current.closest('.set-field')
                        .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
                }

                $('[name = "' + $current.attr('name') + '"]')
                    .addClass('input-error');

            } else {
                var name = $current.attr('name');

                $('input[name="' + name +'"]')
                    .removeClass('input-error')
                    .addClass('input-success');

                $current.closest('.set-field')
                        .find('.error-message').remove();

            }

        }

        if($form.find('input[type="radio"].input-error').length) {
            error = true;
        }

        for (var i = zipTool.length - 1; i >= 0; i--) {
            var $current = $(zipTool[i]),
                $codeContainer = $current.find('.code-container');

            if(!$codeContainer.val().postalCode()) {
               $codeContainer
                    .addClass('input-error')
                        .after('<p class="error-message">' + $codeContainer.attr('data-required-error') + '</p>') ;
            }

            if (!$current.hasClass('success-zip') ) {
                error = true;
            }
        }

        for (var i = newAddress.length - 1; i >= 0; i--) {
            if (!$(newAddress[i]).hasClass('success-field') ) {
                error = true;
            }
        }

        for (var i = select.length - 1; i >= 0; i--) {
            var $current = $(select[i]);
            if($current.attr('data-required') && !$current.val()) {


                if($current.attr('data-position') == 'top') {
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

            if($current.attr('data-required') && !$current.val()) {
                $('[data-rel="' + $current.attr('data-rel') + '"]')
                    .addClass('input-error');

                $current.closest('.set-field')
                    .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
                error = true;
            }
            if (!!$current.val()) {
                switch(pattern) {
                    case 'postal-code':
                        if(!$current.val().postalCode()) {
                            $('[data-rel="' + $current.attr('data-rel') + '"]')
                                .addClass('input-error');

                            $current.closest('.set-field')
                                .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
                            error = true;
                        }
                    break;
                    case 'valid-year':
                        if(!$current.val().validYear()) {
                            $('[data-rel="' + $current.attr('data-rel') + '"]')
                                .addClass('input-error');

                            $current.closest('.set-field')
                                .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
                            error = true;
                        }
                    break;
                    case 'valid-email':
                        if(!$current.val().validEmail()) {
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

        return error;
    };

    var dateValidator = function ($start, $end) {
        var error = false,
            init = new Date($start.val()),
            end = new Date($end.val()),
            now = new Date();

        if($start.attr('required') && $end.attr('required')) {
            if(init > end) {
                $('[data-calendar*="' + $start.attr('id') + '"]')
                    .append('<div class="result error-code"><img src="assets/img/error.png"><span>The initial date is bigger than end date. Aenean in ultrices nisl. Phasellus ipsum sapien, feugiat ac suscipit vitae, tristique at mi.</span></div>');
                error = true;
            } else if( end < now) {
                $('[data-calendar*="' + $end.attr('id') + '"]')
                    .append('<div class="result error-code"><img src="assets/img/error.png"><span>Initial date is in past. Phasellus ipsum sapien, feugiat ac suscipit vitae, tristique at mi.</span></div>');
                error = true;
            } else if ((end - init)/86400000 < 3) {
                $('[data-calendar*="' + $end.attr('id') + '"]')
                    .append('<div class="result error-code"><img src="assets/img/error.png"><span>The initial date is less than 3 days. Aenean in ultrices nisl. Phasellus ipsum sapien, feugiat ac suscipit vitae, tristique at mi.</span></div>');
                error = true;
            } else if ((''+end).indexOf('Sun') > - 1) {
                $('[data-calendar*="' + $end.attr('id') + '"]')
                    .append('<div class="result error-code"><img src="assets/img/error.png"><span>The initial date is in Holiday. Aenean in ultrices nisl. Phasellus ipsum sapien, feugiat ac suscipit vitae, tristique at mi.</span></div>');
                error = true;
            }
        }

        return error;
    };

    /*Flows*/
    /*Accordion 1 Moving out*/
    /*Stop radio button click, show/hide Select reason select*/
     $('[name="steps"]').click(function() {
        var $element = $('#stop-select');

        if(this.value === 'stop') {
            $element
                .removeClass('hide-flow')
                .attr('data-required', true);
        } else {
            $element
                .addClass('hide-flow')
                .removeAttr('data-required');
        }
    });

    /*When you click on the next sep, on Select your street
      if you have selected No one above, you will show form, in another case you will be on the select street number
    */
    $('#get-address').bind('click', function() {
        var $this = $(this);

        if($('[name="select-street-container"]:checked').val()) {
            $.ajax({
                url: 'dummy.php',
                type: 'POST',
                dataType: 'json',
                data: {},
                complete: function(xhr,status) {
                    var jsonObj = null;
                    if (!xhr || xhr.status != 200 || !xhr.response) {
                        console.log(xhr);
                    } else {
                        jsonObj = JSON.parse(xhr.response);

                        if(jsonObj.numbers) {
                            var numbers = [],
                                container = '#data-dropdown';

                            $(container).html('');

                            for (var i = 0, size = jsonObj.numbers.length; i < size; i++) {
                                numbers.push('<option value="' + jsonObj.numbers[i] + '">' + jsonObj.numbers[i] + '</option>');
                            }

                            $('<select class="enbridge-select" id="current-number" data-required="true">' + numbers.join('') + '</select>')
                                .appendTo(container)
                                .enbridgeDropdown();

                        }
                    }
                }
            });

        }
    });

    /*Info Decline*/
    $('#info-decline').bind('click', function(e) {
        e.preventDefault();
        $('#code-validator')
            .removeClass('success-field')
            .val('');

        $('[name="house-property"]')
            .attr({'checked': false})
            .removeAttr('data-required')
            .removeClass('input-error');

        $('#select-street-container, #data-dropdown').empty('');

        $('#confirm-address, #first-step').toggleClass('active-step');
    });

    /*Info confirmation*/
    $('#info-confirmation').bind('click', function(e) {
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
    $('#mailing-address-alternative, #mailing-address').change(function() {
        if(this.checked) {
            $('#manual-property-info').removeClass('hidden');
            $('#street-alternative, #city-or-town-alternative, #country-alternative, #province-alternative, #postal-code-input-alternative').attr('data-required', true);
        } else {
            $('#manual-property-info')
                .addClass('hidden')
                .find('.error-message')
                    .remove();
            $('[data-rel="street-alternative"], #city-or-town-alternative, #country-alternative, #province-alternative, #postal-code-input-alternative')
                .removeAttr('data-required')
                .removeClass('input-error');
        }
    });

    /*
    $('#previous-dates').bind('click', function() {
        var $target = $($(this).attr('data-target')),
            elements = null;

        $target.find('.active-step')
            .removeClass('active-step');

        elements =  $target.find('.steps:first-child')
                       .removeClass('.processed');

        if(elements[0]) {
            $(elements[0]).addClass('active-step');
        }
    });
    */

    /*Code*/
    $('.postal-code-verify').keyup( function(e) {
        e.stopPropagation();
        var $this = $(this).removeClass('input-sucess input-error');

        $this.closest('.set-field')
            .find('.error-message, .result')
                .remove();
''
        if (!($this.attr('data-pattern') === 'postal-code')) return;

        if($this.val().postalCode()) {
            $this.addClass('input-sucess');

            $.ajax({
                url: 'dummy.php',
                complete: function(xhr,status) {
                    $this.closest('.set-field')
                        .find('.error-message, .result')
                            .remove();

                    if (!xhr || xhr.status != 200) {
                        $this
                            .addClass('input-error')
                            .closest('.set-field')
                                .append('<p class="result error-code">' + $this.attr('data-error') + '</p>');
                    } else {
                        $this
                            .removeClass('input-error')
                            .closest('.set-field')
                                .append('<p class="result success-code">' + $this.attr('data-success') + '</p>');
                    }
                }
            });

        } else {
            $this
                .addClass('input-error')
                .closest('.set-field')
                    .append('<p class="error-message">' + $this.attr('data-pattern-error') + '</p>');
        }

    });

    $('.accordion .accordion-item >.header').bind('click', function(event) {
        event.preventDefault();

        var $current = $(this).closest('.accordion-item');

        if ($current.hasClass('processed')) {
            return;
        } else if($current.hasClass('active') || !$current.prev().length) {
            $current.toggleClass('active ');
        } else if ($current.prev().length && $current.prev().hasClass('processed')) {
            $current.toggleClass('active ');
        } else {
            return;
        }

    });

    $('.accordion .accordion-item .validator').bind('click', function(e) {
        e.preventDefault();

        var $current = $(this).closest('.accordion-item'),
            $startDate = $current.find('.start-date'),
            $finishDate = $current.find('.finish-date');

        if(!validator($current.find('.enbridge-form')) && !dateValidator($startDate, $finishDate)) {
            $current
                .removeClass('active')
                .addClass('processed');

            if($current.next().length) {
                $current.next().addClass('active');
            } else {
                var $accordion = $current.closest('.accordion').addClass('hidden'),
                    $target = $($accordion.attr('data-target'));

                $target.removeClass('hidden');

                $accordion.closest('.dialog')
                    .find('.submit-button')
                        .removeClass('disabled');
            }
        }

    });

    $('.accordion .accordion-item .prev').bind('click', function(e) {
        var $current = $(this).closest('.accordion-item');

        if($current.prev().length) {
            $current
                .removeClass('active')
                .prev()
                    .addClass('active')
                    .removeClass('processed');

        }
    });

    $('.steps .next-step').bind('click', function() {
        var $current = $(this).closest('.accordion-item'),
            $currentStep = $(this).closest('.steps'),
            nextStep = $(this).attr('data-next-step');

        if(!validator($current.find('.enbridge-form'))) {
            $currentStep.
                removeClass('active-step')
                    .next();

            $(nextStep)
                .addClass('active-step')
                    .find('input[type="radio"]').attr('required', true);

            if (this.id === 'get-address' && !$('[name=select-street-container]:checked').val()) {
                $('#step-address').removeClass('hidden');

                 $('#street, #city-or-town, #country, #province, #postal-code-input, [name="house-property-alternative"]')
                    .attr('data-required', true);

            } else if (this.id === 'newcustomers-get-address' && !$('[name=newcustomers-select-street-container]:checked').val()) {
                $('#newcustomers-step-address').removeClass('hidden');

                $('#newcustomers-street').attr('required', true);
                $('#newcustomers-city-or-town').attr('required', true);
                $('#newcustomers-country').attr('required', true);
                $('#newcustomers-province').attr('required', true);
                $('#newcustomers-postal-code-input').attr('required', true);
            }
        }
    });

    $('#complete-new-user').bind('click', function() {
        var fromAddress = '',
            toAddress = '',
            dateEndService = $('#date-start').val(),
            dateStartService = $('#date-finish').val(),
            birthDay = $('#day-user-info').val() + '/' + $('#month-user-info').val() + '/' + $('#year-user-info').val();

        if($('#confirm-address').hasClass('active-step')) {
            if($("#mailing-address").attr('checked')) {
                fromAddress = $('#current-number').val() + ' ' + $('[name="select-street-container"]:checked').val() + ', ON ' + $("#code-validator").val();
                toAddress = $('#street-number-alternative').val() + ' ' +$('#suffix-alternative').val() + ' ' +
                            $('#street-alternative').val() + ' ' + $('#misc-info-alternative').val() + ' ' +  $('#city-or-town-alternative').val() + ' ' +
                            $('#country-alternative').val() + ' ' +  $('#province-alternative').val() +  ', ON ' + $('#postal-code-input-alternative').val();

                $('#from-modal').text(fromAddress);
                $('#to-modal').text(toAddress);

            } else {
                fromAddress = $('#current-number').val() + ' ' + $('[name="select-street-container"]:checked').val() + ', ON ' + $("#code-validator").val();

                 $('#from-modal, #to-modal').text(fromAddress);
            }
        } else {

            if($("#mailing-address-alternative").attr('checked')) {
                fromAddress = $('#street-number').val() + ' ' +$('#suffix').val() + ' ' +
                              $('#street').val() + ' ' + $('#misc-info').val() + ' ' +  $('#city-or-town').val() + ' ' +
                              $('#country').val() + ' ' +  $('#province').val() +  ', ON ' + $('#postal-code-input').val();

                toAddress = $('#street-number-alternative').val() + ' ' +$('#suffix-alternative').val() + ' ' +
                            $('#street-alternative').val() + ' ' + $('#misc-info-alternative').val() + ' ' +  $('#city-or-town-alternative').val() + ' ' +
                            $('#country-alternative').val() + ' ' +  $('#province-alternative').val() +  ', ON ' + $('#postal-code-input-alternative').val();

                $('#from-modal').text(fromAddress);
                $('#to-modal').text(toAddress);

            } else {
                fromAddress = $('#street-number').val() + ' ' +$('#suffix').val() + ' ' +
                              $('#street').val() + ' ' + $('#misc-info').val() + ' ' +  $('#city-or-town').val() + ' ' +
                              $('#country').val() + ' ' +  $('#province').val() +  ', ON ' + $('#postal-code-input').val();

                $('#from-modal, #to-modal').text(fromAddress);
            }
        }

        $('#start-service-wait').text(dateFormater(dateEndService));
        $('#end-service-wait').text(dateFormater(dateStartService));

        $('#birth-day').text(birthDay);

        $('#user-phone').text( $('#user-home-lada').val() + ' ' + $('#user-home-phone').val());
        $('#mobile-phone').text( $('#user-mobile-lada').val() + ' ' + $('#user-mobile-phone').val());

        $('#additional-contact').text($('#additional-fist-name').val() + ' ' + $('#additional-last-name').val());

    });

    function dateFormater (stringDate) {
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

        switch(splitDates[2]) {
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

    $('.edit-info').bind('click', function(e) {
        e.preventDefault();
        var $current = $(this),
            $temporal = $($(this).attr('data-accordion-element')),
            loop = true;

        $temporal
            .removeClass('processed')
            .addClass('active');
        while(loop) {
            if($temporal.next().length) {
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

    $('#personal-info-user').bind('click', function() {
        var $form = $('#form-new-account').removeClass('hidden');

        $($form.find('.accordion-item')[1])
            .addClass('active')
            .removeClass('processed');

        $('#personal-info-address').find('input[type=text]').val('');

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
            .attr({'checked': false, "required": false})
            .removeClass('input-error');

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
        //$('[name="house-property"]').attr({'reqquired': false, 'checked'})

        $('#code-validator').val('');
        $('#select-street-container, #data-dropdown').empty('');

        $('#first-step').addClass('active-step');

        $form.find('.steps:not(#first-step)')
            .removeClass('active-step');


        $("#mailing-address, #mailing-address-alternative").attr("checked",false);

        $('#manual-property-info').addClass('hidden');
        $('#misc-info').attr('required', false);
        $('#street-number, #street-number-alternative').attr('required', false);
        $('#suffix-number, #suffix-alternative').attr('required', false);
        $('#street, #street-alternative').attr('required', false);
        $('#city-or-town, #city-or-town-alternative').attr('required', false);
        $('#country, #country-alternative').attr('required', false);
        $('#province, #province-alternative').attr('required', false);
        $('#postal-code-input, #postal-code-input-alternative').attr('required', false);
        $('input[name="house-property"]').attr('required', false);
    });

    $('#new-account-start-over').bind('click', function() {
        var $form = $('#form-new-account').removeClass('hidden');

        $form.find('.accordion-item')
            .removeClass('active processed');


        $($form.find('.accordion-item')[0])
            .addClass('active')
            .removeClass('processed');

        $form.find('input[type=text]').val('');

        $form.find('.success-field')
            .removeClass('success-field');

        $form.find('.result')
            .html('')
            .removeClass('success-code error-code');

        $form
            .find('.zip-code-tool')
                .removeClass('opened required success-zip')
                .addClass('closed');

        $('#form-summary, #step-address, #manual-property-info').addClass('hidden');

        $('#information-acceptance')
            .show()
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

        $('[name="house-property"]')
            .attr({'checked': false, "required": false})
            .removeClass('input-error');

        $('#property-info').hide();

        $('#code-validator').val('');

        $('#select-street-container, #data-dropdown').empty('');

        $('#first-step').addClass('active-step');

        $form.find('.steps:not(#first-step)')
            .removeClass('active-step');

        $("#mailing-address, #mailing-address-alternative").attr("checked",false);

        $('#misc-info').attr('required', false);
        $('#street-number, #street-number-alternative').attr('required', false);
        $('#suffix-number, #suffix-alternative').attr('required', false);
        $('#street, #street-alternative').attr('required', false);
        $('#city-or-town, #city-or-town-alternative').attr('required', false);
        $('#country, #country-alternative').attr('required', false);
        $('#province, #province-alternative').attr('required', false);
        $('#postal-code-input, #postal-code-input-alternative').attr('required', false);
        $('input[name="house-property"]').attr('required', false);
    });

    $("#reset-personal-info").bind('click', function() {
        $('#personal-info').find('[type="text"]')
            .val('');
    });


/*
    $('#get-address').bind('click', function() {
        var $this = $(this);

        $.post( "dummy.php",
            function(resp) {
                if (resp && resp.result) {
                    var numbers = [],
                        container = $this.attr('data-number-dropdown');

                    $(container).html('');

                    for (var i = 0, size = resp.numbers.length; i < size; i++) {
                        numbers.push('<option value="' + resp.numbers[i] + ' ">' + resp.numbers[i] + '</option>');
                    }

                    $('<select class="enbridge-select" id="current-number" data-required="true">' + numbers.join('') + '</select>')
                        .appendTo(container)
                        .enbridgeDropdown();

                } else {
                    $this
                        .removeClass('input-success success-field')
                        .addClass('input-error');
                }

            },"json");

    });
*/
    $('#newcustomers-get-address').bind('click', function() {
        var $this = $(this);

        $.post( "dummy.php",
            function(resp) {
                if (resp && resp.result) {
                    var numbers = [],
                        container = $this.attr('data-number-dropdown');

                    $(container).html('');

                    for (var i = 0, size = resp.numbers.length; i < size; i++) {
                        numbers.push('<option value="' + resp.numbers[i] + ' ">' + resp.numbers[i] + '</option>');
                    }

                    $('<select class="enbridge-select" id="newcustomers-current-number" data-required="true">' + numbers.join('') + '</select>')
                        .appendTo(container)
                        .enbridgeDropdown();

                } else {
                    $this
                        .removeClass('input-success success-field')
                        .addClass('input-error');
                }

            },"json");

    });

    $('#confirm-address-button').bind('click', function() {
        var city = $('[name="select-street-container"]:checked').val() || '',
            numberHouse =$('#current-number').val() || '',
            zipCode = $('#code-validator').val();

        $('#address-confirmation').text(numberHouse + ' ' + city + ', ON ' + zipCode);
    });

    $('#newcustomers-confirm-address-button').bind('click', function() {
        var city = $('[name="newcustomers-select-street-container"]:checked').val() || '',
            numberHouse =$('#newcustomers-current-number').val() || '',
            zipCode = $('#newcustomers-code-validator').val() || '';

        $('#newcustomers-address-confirmation').text(numberHouse + ' ' + city + ', ON ' + zipCode);
    });

    $('#newcustomers-info-confirmation').bind('click', function(e) {
        e.preventDefault();
        $('#newcustomers-information-acceptance')
            .hide()
                .closest('.code-box')
                    .width(280);

        $('#newcustomershide-message').
            hide()
                .closest('col')
                    .addClass('xs5')
                    .removeClass('xs12');

        $('#newcustomers-property-info').show();
        $('#newcustomers-step-address').removeClass('hidden');
        $('input[name="newcustomers-house-property"]').attr('required');
    });


    $('#newcustomers-info-decline').bind('click', function(e) {
        e.preventDefault();
        $('#newcustomers-code-validator')
            .removeClass('success-field')
            .val('');

        $('[name="newcustomers-house-property"]')
            .attr({'checked': false, "required": false})
            .removeClass('input-error');

        $('#newcustomers-select-street-container, #data-dropdown').empty('');

        $('#newcustomers-confirm-address, #newcustomers-first-step').toggleClass('active-step');
    });


    $('#newcustomers-mailing-address-alternative, #newcustomers-mailing-address').change(function() {
        var required = false;
        if(this.checked) {
            $('#newcustomers-manual-property-info').removeClass('hidden');
            required = true;
        } else {
            $('#newcustomers-manual-property-info').addClass('hidden');
            required = false;
        }

        $('#newcustomers-street-alternative').attr('required', required);
        $('#newcustomers-city-or-town-alternative').attr('required', required);
        $('#newcustomers-country-alternative').attr('required',required);
        $('#newcustomers-province-alternative').attr('required', required);
        $('#newcustomers-postal-code-input-alternative').attr('required', required);
    });

    $('#moving-out-finish').bind('click', function() {
        var fromAddress = $('#moving-out-street-number').val() + ' ' +$('#moving-out-suffix').val() + ' ' +
                          $('#moving-out-street').val() + ' ' + $('#moving-out-misc-info').val() + ' ' +  $('#moving-out-city-or-town').val() + ' ' +
                          $('#moving-out-country').val() + ' ' +  $('#moving-out-province').val() +  ', ON ' + $('#moving-out-postal-code-input').val(),
            birthDay = $('#moving-out-your-day').val() + '/' + $('#moving-out-your-month').val() + '/' + $('#moving-out-your-year').val();

        $('#moving-new-date-summary').text(dateFormater($('#moving-out-date').val()));

        $('#moving-out-from').text(fromAddress);
        $('#moving-out-summary-birth-day').text(birthDay);
        $('#moving-out-summary-user-phone').text( $('#moving-out-home-phone-lada').val() + ' ' + $('#moving-out-home-phone').val());
        $('#moving-out-summary-mobile-phone').text( $('#moving-out-mobile-phone-lada').val() + ' ' + $('#moving-out-mobile-phone').val());
    });

    $('#moving-out-restart-personal-info').bind('click', function () {
        $('#moving-out-street-number, #moving-out-suffix,#moving-out-street,#moving-out-misc-info,#moving-out-city-or-town,#moving-out-postal-code-input').val('');
    });

    $('#moving-out-restart-personal-user-info').bind('click', function () {
        $('#moving-out-your-year, #moving-out-email').val('');
        $('[data-rel="moving-out-home-phone"], [data-rel="moving-out-mobile-phone"], [data-rel="moving-out-business-phone"]').val('');
    });

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

    $('.calendar').bind('click', function(e) {
        if(!(e.target.className.indexOf('ui-datepicker-today') && parseInt(e.target.textContent))) {
            return;
        }

        var $this = $(this),
            date = $this.datepicker('getDate'),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();

        $($this.closest('.calendar-column').attr('data-calendar'))
            .val(year + '-' + month + '-' + day);
    });

    /*Forms*/
    $('.enbridge-form input[type="radio"]').bind('click', function() {
        var name = $(this).attr('name') || '';

        $(this).closest('.set-field')
            .find('.error-message')
                .remove();

        $('input[name="' + name + '"]').removeClass('input-success input-error');
    });

    $(window).ready(function() {
        var calendar = $('.calendar'),
            currentDate = new Date(),
            dialogConstant = {
                    autoOpen: false,
                    resizable: false,
                    height: 240,
                    width: 720,
                    modal: true,
                    height: 440,
                    top:29
            };

        calendar.datepicker();

        for (var i = calendar.length - 1; i >= 0; i--) {
            var $current =  $(calendar[i]).click(),
                date = $current.datepicker('getDate'),
                day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear();

            $($current.closest('.calendar-column').attr('data-calendar'))
                .val(year + '-' + month + '-' + day);
        }

        $('.tooltip .icon').bind('click', function(){
            $(this).next()
                .addClass('active-tooltip')
                .show();
        });

        $('.tooltip .cross').bind('click', function(){
            $(this).closest('.content-tooltip')
                .removeClass('active-tooltip')
                .hide();
        });

        $('.modalopen').bind('click',function(e){
            e.preventDefault();
           $($(this).attr('data-target')).css("display","none");
           var id = $(this).attr('data-target');
            elements = $(id).siblings();
            elements.each(function(entry){
                var idName = $(elements[entry]).attr('id');
                var idchange = '#'+idName;
                console.log(idchange);
                $(idchange).removeClass("hidden");
                $("#costumer-alert").addClass("hidden");

            });
        });

        $('.open-dialog').bind('click', function(e) {
            e.preventDefault();

            if($(this).attr('data-target')=="#movingoutredirect")
            {
                window.location="04_moving_out_login.html";
            }
            else
            {
                scroll(0,0);
                $($(this).attr('data-target'))
                    .dialog({
                        autoOpen:true,
                        resizable: false,
                        height:400,
                        width:720,
                        modal: true,
                        height:440
                    });
            }
        });

        $('#existingcustomers, #newcustomers, #moving-out')
            .removeClass('hidden')
            .dialog(dialogConstant);

    });

})(jQuery, window, document);
