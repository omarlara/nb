(function($, window, document) {

    /*Dropdown*/
    ;(function($) {
        function dropdownEnbridge(element) {
            this.element = element;
            console.log('element');

            this.addMethods();
        }

        dropdownEnbridge.prototype.addMethods = function addMethods() {
            var self = this;

            $(this.element).bind('click', function () {

                $(this).toggleClass('active');

            })

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
            $('.enbridge-dropdown').enbridgeDropdown();
        });

    })(jQuery);

})(jQuery, window, document);
