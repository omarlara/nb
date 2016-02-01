/*Success Zip*/
(function ($)) {
    $('.new-address').keyup(function () {
        var $this = $(this),
            currentVal = $this.val(),
            container = $this.attr('data-content'),
            radioContent = [];

        $this.closest('.code-box')
            .find('.error-message ').remove();

        if (!currentVal.postalCode()) {
            $this
                .addClass('input-error')
                .after('<p class="error-message ">Please enter a valid postal code (example: A1A 1A1)</p>');
            return;
        }

        $this.removeClass('input-error');

        if ($this.next().hasClass('error-message')) {
            $this.next().remove();
        }

        $.ajax({
            url: '/WebServices/AddressService.svc/GetAddresses',
            type: 'GET',
            dataType: 'application/json',
            data: {
                'postalCode': currentVal
            },
            success: function (data) {
                if (!!data) {
                    var containerEl = container.replace('#', ''),
                        streetObj = [],
                        keys = [],
                        getNumbers = function getNumbers(range, init, end) {
                            var returnVal = [];
                            switch (range) {
                                case 0:
                                    for (; init <= end; init++) {
                                        returnVal.push(init)
                                    }
                                    break;
                                case 1:
                                    for (; init <= end; init++) {
                                        if (init % 2 == 0)
                                            returnVal.push(init)
                                    }
                                    break;
                                case 2:
                                    for (; init <= end; init++) {
                                        if (init % 2 != 0)
                                            returnVal.push(init)
                                    }
                                    break;
                                default:
                                    break;
                            }
                            return returnVal;
                        };

                    data = JSON.parse(data);

                    for (var size = data.length - 1; size >= 0; size--) {
                        if (!streetObj[data[size].StreetName]) {
                            streetObj[data[size].StreetName] = {
                                province: data[size].Province,
                                city: data[size].City,
                                street: data[size].StreetName,
                                ranges: getNumbers(data[size].StreetNumberRangeFilter, data[size].StreetNumberStart, data[size].StreetNumberEnd)
                            };

                            keys.push(data[size].StreetName);
                        } else {
                            streetObj[data[size].StreetName].ranges.push(getNumbers(data[size].StreetNumberRangeFilter, data[size].StreetNumberStart, data[size].StreetNumberEnd));
                        }
                    }

                    $this
                        .addClass('success-field')
                        .removeClass('input-error');

                    for (var i = 0, size = keys.length; i < size; i++) {
                        var radioButton = '<input type="radio" id="' + (containerEl + '-' + i) + '" ' +
                                          'name="' + containerEl + '" value="' + streetObj[keys[i]].street + ', ' + streetObj[keys[i]].province + '" ' +
                                          'data-street = "' + streetObj[keys[i]].street + '" ' +
                                          'data-province = "' + streetObj[keys[i]].province + '" ' +
                                          'data-city = "' + streetObj[keys[i]].city + '" ' +
                                          'data-range = "' + streetObj[keys[i]].ranges.join(',') + '" ' + ((i === 0) ? 'checked ' : ' ') +
                            'name="stepsContent" data-required-error="Please select yout street.">' +
                            '<label class="fake-input" for="' + (containerEl + '-' + i) + '">' + streetObj[keys[i]].street + '</label>';
                        radioContent.push(radioButton);
                    }

                    radioContent.push('<input type="radio" id="' + (containerEl + '-No') + '" ' +
                                          'name="' + containerEl + '" value = "" ' +
                                          'data-province = "" ' +
                                          'data-city = " " ' +
                                          'data-range = "0" ' +
                            'name="stepsContent" data-required-error="Please select yout street.">' +
                            '<label class="fake-input" for="' + (containerEl + '-No') + '">No one above</label>');

                    $(container).html(radioContent.join(''));


                    $(container).find('input[type="radio"]').bind('click', function () {
                        var name = $(this).attr('name') || '',
                            containerBox = (this.value) ? $this.attr('data-first-op') : $this.attr('data-second-op');

                        $('#get-address').attr('data-next-step', containerBox);
                        $('#newcustomers-get-address').attr('data-next-step', containerBox);

                        $('input[name="' + name + '"]').removeClass('input-success input-error');
                    });

                } else {
                    $this
                        .removeClass('input-success success-field')
                        .addClass('input-error');
                }
            },
            error: function () {
                $this
                    .removeClass('input-success success-field')
                    .addClass('input-error');
            }
        });
    });
}(jQuery));
