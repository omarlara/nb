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
                            text = $current.text() || '',
                            value = $current.find('input').val() || '';

                        $element.find('.header .selected').text(text);
                        $element.find('.result').val(value);
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

})(jQuery, window, document);
