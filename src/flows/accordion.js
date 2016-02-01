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