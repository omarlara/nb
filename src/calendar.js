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
