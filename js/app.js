(function($, window, document) {

    /*Dropdown*/
    ;(function($) {
        function dropdownEnbridge(element) {

            this.source = element;
            this.init();

            console.log('element');

            this.addMethods();
        }

        dropdownEnbridge.prototype.init = function () {
            var $element = $(this.source),
                elemenetNodes = this.source.children || [],
                nodes = [],
                element = '';

            if(!elemenetNodes.length)
                return;

            for(var i = 0, size = elemenetNodes.length; i < size; i++) {
                var temp = '<li class="list-item"><input type="hidden" value="'+
                            elemenetNodes[i].value+ '">' + elemenetNodes[i].text + '</li>';
                nodes.push(temp);
            }

            element = '<div class="enbridge-dropdown enbridge-dropdown">' +
                      '<input type="hidden" class="result">' +
                      '<div class="header"><span class="selected">Select an option</span><span class="indicator"></span></div><ul class="list-items">' +
                          nodes.join('') +
                      '</ul></div>';

            $element.after(element);

            this.element = this.source.nextElementSibling;
        }

        dropdownEnbridge.prototype.addMethods = function addMethods() {
            var self = this,
                $element =  $(this.element);

            $element.bind('click', function () {
                $(this).toggleClass('active');
            })

            $element
                .find('.list-items .list-item')
                    .bind('click', function() {
                        var $current = $(this),
                            $source = $(self.source)
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
        }

        $.fn.enbridgeDropdown = function (element) {
            return this.each(function() {
                (new dropdownEnbridge(this));
            });
        }

        $(window).ready(function() {
            $('.enbridge-select').enbridgeDropdown();
        });

    })(jQuery);

    /*Code Tool*/
    ;(function($){

        function CodeTool(element) {
            this.element = element;

            this.addMethods();
        };

        CodeTool.prototype.addMethods = function () {
            var $element = $(this.element);

            $element.find('.opener')
                .bind('click', function (e) {
                    e.stopPropagation();

                    $element.toggleClass('opened closed');
                });

            $element.find('.submiter')
                .bind('click', function (e) {
                    e.preventDefault();

                    var currentCode = $element.find('name=[zip-tool]').val(),
                        success = 'Your new address is serviced by Enbridge.',
                        error = 'Your new address is not serviced by Enbridge. Please contact your local municipality to find a local provicer. You may still proceed in order to let us know when you are moving out.',
                        request = null,
                        result = null;

                    request =  $.post( "http://beta.json-generator.com/api/json/get/4yzCsvG1x",
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
                                                    .html('<img src="assets/img/error.png"> <span>' + error + '</span>')
                                                    .addClass('error-code');
                                        }

                                },"json");

                });
        }

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

    /*Accordion*/

    (function() {

        var validator = function formValidator ($form) {
            var error = false,
                radio = $form.find('input[type="radio"]').removeClass('input-error input-success'),
                select = $form.find('.enbridge-select').removeClass('input-error'),
                zipTool = $form.find('.zip-code-tool');


            for (var i = radio.length - 1; i >= 0; i--) {
                if(radio[i].required && !(radio[i].className.indexOf('input-success') > -1 || radio[i].checked) ) {
                    radio[i].className += ' input-error';
                } else {
                    var name = radio[i].name,
                        elements = document.getElementsByName(name);

                    for(var i = elements.length - 1; i >= 0; i-- ) {
                        radio[i].className += ' input-success';
                        radio[i].className = radio[i].className.replace('input-error', '');
                    }
                }

            }

            if($form.find('input[type="radio"].input-error').length) {
                error = true;
            }

            for (var i = zipTool.length - 1; i >= 0; i--) {
                if (!$(zipTool[i]).hasClass('success-zip') ) {
                    error = true;
                }
            }

            for(var i = select.length - 1; i >= 0; i--) {
                if(select[i].required && !select[i].value) {
                    select[i].className += ' input-success';
                    error = true;
                }
            }

            return error;
        };

        $('.accordion .accordion-item >.header').bind('click', function(event) {
            event.preventDefault();

            var $current = $(this).closest('.accordion-item');

            $current.toggleClass('active ');

        });

        $('.accordion .accordion-item .validator').bind('click', function(e) {
            e.preventDefault();

            var $current = $(this).closest('.accordion-item');

            if(!validator($current.find('.enbridge-form'))) {
                $current
                    .removeClass('active')
                    .addClass('processed');

                if($current.next().length) {
                    $current.next().addClass('active');
                }
            }

        });

        /*Flows*/
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


        /*Forms*/
        $('.enbridge-form input[type="radio"]').bind('click', function() {
            var name = $(this).attr('name') || '';


            $('input[name="' + name + '"]').removeClass('input-success input-error');
        });


    })()


})(jQuery, window, document);
