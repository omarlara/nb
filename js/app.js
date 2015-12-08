(function ($, window, document) {

    String.prototype.postalCode = function() {
        return /^[a-zA-Z0-9]{6,6}$/.test(this);
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
                            value = $current.find('input').val() || '';

                        $element.find('.header .selected').text(text);
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
                        .toggleClass('opened closed required');
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
    $('.new-adress').change(function() {
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
        } else {
            $this.removeClass('input-error');

            if($this.next().hasClass('error-message')) {
                $this.next().remove();
            }
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
                            containerBox = (this.value)?'#select_your_adress': '#select_your_adress_form';

                        $('#get-adress').attr('data-next-step', containerBox);

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
            zipTool = $form.find('.zip-code-tool.required').removeClass('success-field'),
            newAddress = $form.find('.new-adress'),
            text = $form.find('input[type="text"]');

        $form.find('.error-message, .error-code').remove();
        $form.find('.input-error').removeClass('input-error');

        for (var i = radio.length - 1; i >= 0; i--) {
            if (!radio[i].className) {
               radio[i] .className = '';
            }

            if(radio[i].required && !(radio[i].className.indexOf('input-success') > -1 || radio[i].checked) ) {
                var $current = $(radio[i]);

                if(!$current.hasClass('input-error')) {
                    $(radio[i]).closest('.set-field')
                        .append('<p class="error-message pull26 ">' + $(radio[i]).attr('data-required-error') + '</p>');
                }

                $('[name = "' + $current.attr('name') + '"]')
                    .addClass('input-error');

            } else {
                var name = radio[i].name;

                $('input[name="' + name +'"]')
                    .removeClass('input-error')
                    .addClass('input-success');

                $(radio[i]).closest('.set-field')
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
            if(select[i].required && !select[i].value) {
                var $current = $(select[i]);

                if($current.attr('data-position') == 'top') {
                    $current
                        .addClass('input-error')
                        .before('<p class="error-message pull26 ">' + $current.attr('data-required-error') + '</p>');
                } else {
                    $current
                        .addClass('input-error')
                        .next()
                            .after('<p class="error-message pull26 ">' + $current.attr('data-required-error') + '</p>');
                }

                error = true;
            }
        }

        for (var i = text.length - 1; i >= 0; i--) {
            if(text[i].required && !text[i].value) {
                $current = $(text[i]);
                $('[data-rel="' + $current.attr('data-rel') + '"]')
                    .addClass('input-error');

                $current.closest('.set-field')
                    .after('<p class="error-message pull26 ">' + $current.attr('data-required-error') + '</p>');
                error = true;
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
                    .find('.sumbit-button')
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

            if (this.id === 'get-adress' && !$('[name=select-street-container]:checked').val()) {
                $('#step-adress').removeClass('hidden');

                $('#street').attr('required', true);
                $('#city-or-town').attr('required', true);
                $('#country').attr('required', true);
                $('#province').attr('required', true);
                $('#postal-code-input').attr('required', true);
            }
        }
    });

    $('#complete-new-user').bind('click', function() {
        var fromAddress = '',
            toAddress = '',
            dateEndService = $('#date-start').val(),
            dateStartService = $('#date-finish').val(),
            birthDay = $('#day-user-info').val() + '/' + $('#month-user-info').val() + '/' + $('#year-user-info').val();

        if($('#confirm-adress').hasClass('active-step')) {
            if($("#mailing-adress").attr('checked')) {
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

            if($("#mailing-adress-alternative").attr('checked')) {
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

        $('#personal-info-adress').find('input[type=text]').val('');

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
        $('#step-adress').addClass('hidden');
        //$('[name="house-property"]').attr({'reqquired': false, 'checked'})

        $('#code-validator').val('');
        $('#select-street-container, #data-dropdown').empty('');

        $('#first-step').addClass('active-step');

        $form.find('.steps:not(#first-step)')
            .removeClass('active-step');


        $("#mailing-adress, #mailing-adress-alternative").attr("checked",false);

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

        $('#step-adress').addClass('hidden');
        $('#property-info').hide();

        $('#code-validator').val('');
        $('#select-street-container, #data-dropdown').empty('');

        $('#first-step').addClass('active-step');

        $form.find('.steps:not(#first-step)')
            .removeClass('active-step');

        $("#mailing-adress, #mailing-adress-alternative").attr("checked",false);

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

    $("#reset-personal-info").bind('click', function() {
        $('#personal-info').find('[type="text"]')
            .val('');
    });

    /*Flows*/

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

    $('input[name="steps"]').change( function() {
        if(this.value === 'stop') {
            $('#stop-select')
                .removeClass('hide-flow')
                .attr('required', true);
        } else {
            $('#stop-select')
                .addClass('hide-flow')
                .attr('required', false);
        }
    });

    $('#get-adress').bind('click', function() {
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

                    $('<select class="enbridge-select" id="current-number" required>' + numbers.join('') + '</select>')
                        .appendTo(container)
                        .enbridgeDropdown();

                } else {
                    $this
                        .removeClass('input-success success-field')
                        .addClass('input-error');
                }

            },"json");

    });

    $('#confirm-adress-button').bind('click', function() {
        var city = $('[name="select-street-container"]:checked').val() || '',
            numberHouse =$('#current-number').val() || '',
            zipCode = $('#code-validator').val();

        $('#adress-conformation').text(numberHouse + ' ' + city + ' ' + zipCode);
    });

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
        $('#step-adress').removeClass('hidden');
        $('input[name="house-property"]').attr('required');
    });

    $('#info-decline').bind('click', function(e) {
        e.preventDefault();
        $('#code-validator')
            .removeClass('success-field')
            .val('');

        $('[name="house-property"]')
            .attr({'checked': false, "required": false})
            .removeClass('input-error');

        $('#select-street-container, #data-dropdown').empty('');

        $('#confirm-adress, #first-step').toggleClass('active-step');
    });

    $('#mailing-adress-alternative, #mailing-adress').change(function() {
       if(this.checked) {
            $('#manual-property-info').removeClass('hidden');
            $('#street-alternative').attr('required', true);
            $('#city-or-town-alternative').attr('required', true);
            $('#country-alternative').attr('required', true);
            $('#province-alternative').attr('required', true);
            $('#postal-code-input-alternative').attr('required', true);
       } else {
            $('#manual-property-info').addClass('hidden');
            $('#street-alternative').attr('required', false);
            $('#city-or-town-alternative').attr('required', false);
            $('#country-alternative').attr('required', false);
            $('#province-alternative').attr('required', false);
            $('#postal-code-input-alternative').attr('required', false);
        }
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

    /*End Flow*/


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
           currentDate = new Date();

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

        $("#existingcustomers")
            .removeClass('hidden')
            .dialog({
                autoOpen: false,
                resizable: false,
                height: 240,
                width: 720,
                modal: true,
                height: 440
        });

        $("#newcustomers").dialog({
            autoOpen: false,
            resizable: false,
            height: 240,
            width: 720,
            modal: true,
            height: 440
        });

        $("#postalcode").dialog({
            autoOpen: false,
            resizable: false,
            height: 240,
            width: 720,
            modal: true,
            height: 440
        });

        $("#movingout").dialog({
            autoOpen: false,
            resizable: false,
            height: 240,
            width: 720,
            modal: true,
            height: 440
        });

    });


})(jQuery, window, document);
