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
