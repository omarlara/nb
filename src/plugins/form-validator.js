var validator = function formValidator($form) {
  var error = false,
    radio = $form.find('input[type="radio"]').removeClass('input-error input-success'),
    select = $form.find('.enbridge-select:not(.ignore)').removeClass('input-error'),
    zipTool = $form.find('.zip-code-tool.[data-required="true"]').removeClass('success-field'),
    newAddress = $form.find('.new-address:visible'),
    oneFromGroup = $form.find('.required-from-group:visible'),
    text = $form.find('input[type="text"]:not(.ignore)'),
    ageValidatorElements = $form.find('[data-validate-age=""]:not(.ignore)');

  $form.find('.error-message, .error-code').remove();
  $form.find('.input-error').removeClass('input-error');

  for (var i = radio.length - 1; i >= 0; i--) {
    var $current = $(radio[i]);

    if ($current.attr('data-required') && !($current.hasClass('input-success') || $current.attr('checked'))) {
      var $current = $(radio[i]);

      if (!$current.hasClass('input-error')) {
        $current.closest('.set-field')
          .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
      }

      $('[name = "' + $current.attr('name') + '"]')
        .addClass('input-error');

    } else {
      var name = $current.attr('name');

      $('input[name="' + name + '"]')
        .removeClass('input-error')
        .addClass('input-success');

      $current.closest('.set-field')
        .find('.error-message').remove();

    }

  }

  if ($form.find('input[type="radio"].input-error').length) {
    error = true;
  }

  for (var i = zipTool.length - 1; i >= 0; i--) {
    var $current = $(zipTool[i]),
      $codeContainer = $current.find('.code-container');

    if (!$codeContainer.val().postalCode()) {
      $codeContainer
        .addClass('input-error')
        .after('<p class="error-message">' + $codeContainer.attr('data-required-error') + '</p>');
    }

    if (!$current.hasClass('success-zip')) {
      error = true;
    }
  }

  for (var i = newAddress.length - 1; i >= 0; i--) {
    if (!$(newAddress[i]).hasClass('success-field')) {
      error = true;
    }
  }

  for (var i = select.length - 1; i >= 0; i--) {
    var $current = $(select[i]);
    if ($current.attr('data-required') && !$current.val()) {

      if ($current.attr('data-position') == 'top') {
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

  var lengthValidator = null;
  for (var i = text.length - 1; i >= 0; i--) {
    var $current = $(text[i]),
      pattern = $current.attr('data-pattern') || '';

    // Required when other input were populated
    if ($current.attr('data-required')) {
      var attributes = $current[0].attributes;

      $.each(attributes, function(index, attr) {
        if (attr.name.indexOf('data-rel') >= 0) {
          var $rel =
            $('[data-rel="' + attr.value + '"]');

          if ($rel.attr('data-optional') && $rel.val() && !$current.val()) {
            $current.addClass('input-error');
            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');

            error = true;
            return;
          } else if ($rel.attr('data-optional') && !$rel.val()) {
            error = false;
          } else if (!$current.val()) {
            // Is empty
            $rel.addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-required-error') + '</p>');
            error = true;
          }
        }
      });
    }
    if (!!$current.val()) {
      switch (pattern) {
        case 'postal-code':
          if (!$current.val().postalCode()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'account-number':
          if (!$current.val().replace(/\s+/g, '').isValidAccount()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-lada':
          if (!$current.val().validLada()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error pattern-error');

            $current.closest('.set-field')
              .append('<p class="error-message pattern-error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-phone':
          var _self = $current,
            value = _self.val();
          if (value.validPhoneFormat()) {
            $.ajax({
              type: 'GET',
              url: Enbridge.UrlServices.VALIDATE_PHONE_BLACKLIST,
              data: {
                phoneNumber: value
              },
              async: false,
              success: function(data) {
                _self.closest('.set-field').find('.pattern-error-message').remove();
                _self.removeClass('input-error pattern-error');
                if (data) {
                  $('[data-rel="' + _self.attr('data-rel') + '"]')
                    .addClass('input-error pattern-error');

                  _self.closest('.set-field')
                    .append('<p class="error-message pattern-error-message">Uh-oh! It looks like the phone number you\'ve entered is not valid. Please check the number you entered and try again.</p>');
                  error = true;
                }
              },
              error: function(xhr, error) {
                throw 'Error on request';
              }
            });
          } else {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error pattern-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-year':
          if (!$current.val().validYear()) {
            $('[data-rel="' + $current.attr('data-rel') + '"]')
              .addClass('input-error');

            $current.closest('.set-field')
              .append('<p class="error-message">' + $current.attr('data-pattern-error') + '</p>');
            error = true;
          }
          break;
        case 'valid-email':
          if (!$current.val().validEmail()) {
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
    // Length Validator
    if (!!$current.attr('data-max-length')) {
      if (!!lengthValidator) {
        lengthValidator = null;
      }
      lengthValidator = new Enbridge.Plugins.LengthValidator(
        $current
      );
      maxLength = parseInt($current.attr('data-max-length'), 10);
      if (!lengthValidator.isValid(maxLength)) {
        if (!$current.hasClass('input-error')) {
          $current.addClass('input-error');
        }
        $current.closest('.set-field')
          .append('<p class="error-message">' + ($current.attr('data-max-length-error') || 'Length error!') + '</p>');
        error = true;
      }
    }
  }

  if (error) {
    for (var i = oneFromGroup.length - 1; i >= 0; i -= 1) {
      var $current = $(oneFromGroup[i]);

      if ($current.find('.input-error').length < 1) {
        oneFromGroup.find('.input-error:not(.pattern-error)').removeClass('input-error');
        oneFromGroup.find('.error-message:not(.pattern-error-message)').remove();
        error = ($form.find('.input-error').length > 0);
        break;
      }
    }
  }
  if (!error) {
    // Age Validator
    var $item = '',
      isCheckable = true,
      dateItem = '';
    for (var i = ageValidatorElements.length - 1; i >= 0; i -= 1) {
      $item = $(ageValidatorElements[i]);
      dateItem = $item.find('select, input');
      for (var j = dateItem.length - 1; j >= 0; j -= 1) {
        if ($(dateItem[j]).val() === '') {
          isCheckable = false;
          break;
        }
      }
      if (isCheckable) {
        var $ageValidator = new Enbridge.Plugins.AgeValidator($item);
        if (!$ageValidator.isValid()) {
          error = true;
          break;
        }
      }
    }

  }

  return error;
};
Enbridge.Plugins.Validator = validator;
