(function ($) {
  function CodeTool(element) {
    this.element = element;

    this.addMethods();
  }
  CodeTool.prototype.restart = function() {
    $element
      .removeClass('opened required')
      .addClass('closed');
  };

  CodeTool.prototype.addMethods = function() {
    var $element = $(this.element);

    $element.find('.opener')
      .bind('click', function(e) {
        e.stopPropagation();

        $element
          .toggleClass('opened closed required')
          .find('.code-container').attr('data-required', true);
      });

    $element.find('.submiter')
      .bind('click', function(e) {
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
          success: function(data) {
            data = data.toBoolean();
            if (!!data) {
              $element
                .addClass('success-zip')
                .find('.result')
                .html('<img src="../../AppImages/success.png"> <span>' + success + '</span>')
                .addClass('success-code')
                .removeClass('error-code');

              $('[data-id=transfer]')
                .attr('checked', true);

              $('[data-id=code-validator]').val(currentCode).trigger('keyup');
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
          error: function() {
            console.log('Error on the service');
          }
        });

      });
  };
  Enbridge.Plugins.CodeTool = CodeTool;

  $.fn.codeTool = function(element) {
    return this.each(function() {
      (new CodeTool(this));
    });
  };
})(jQuery);
