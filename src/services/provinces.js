; (function (window, $) {

    var Enbridge = window.Enbridge;

    function loadProvinces(data, id) {
        $.getJSON(Enbridge.UrlServices.GET_PROVINCES, data, function populateProvinces(provinces) {
            var i = 0,
                len = provinces.length || 0,
                $provinceDropdown = $('[data-id="' + id + '"]'),
                compilation = '';

            for (i = 0; i < len; i += 1) {
                compilation +=
                    Enbridge.Templates.PROVINCE.replace(':provinceCode', provinces[i].Code)
                        .replace(':provinceName', provinces[i].Name);
            }

            $provinceDropdown.html(compilation);
            $provinceDropdown.enbridgeDropdown();
        });
    }

    $(document).ready(function () {
        var countryServiceData = {
            countryCode: Enbridge.CountryCodes.CANADA
        },
            $countryDropdown = $('[data-id="country"], [data-id="moving-out-country"], [data-id="country-alternative-element"]'),
            $countryDropdownItems = $countryDropdown.next('.enbridge-dropdown').find('li');

        for (var i = $countryDropdown.length - 1; i >= 0; i--) {
            var $currentDropdown = $($countryDropdown[i]);

            if ($currentDropdown.attr('data-province-rel')) {
                $currentDropdown
                    .next('.enbridge-dropdown')
                        .attr('data-province-rel', $currentDropdown.attr('data-province-rel'));
            }

            if ($currentDropdown.attr('data-postal-code-rel')) {
                $currentDropdown
                    .next('.enbridge-dropdown')
                        .attr('data-postal-code-rel', $currentDropdown.attr('data-postal-code-rel'));
            }

            countryServiceData.countryCode = $currentDropdown.val();
            loadProvinces(countryServiceData, $currentDropdown.attr('data-province-rel'));
        }

        $countryDropdownItems.bind('click', function (e) {
            var relationId = $(this).closest('.enbridge-dropdown').attr('data-province-rel'),
                postalCode = $(this).closest('.enbridge-dropdown').attr('data-postal-code-rel') || '';

            countryServiceData.countryCode = $(this).attr('data-value');
            loadProvinces(countryServiceData, relationId);

            if (!postalCode) {
                return;
            }

            if ($(this).attr('data-value') === 'CA') {
                $('[data-id="' + postalCode + '"]').attr('data-pattern', 'postal-code');
            } else {
                $('[data-id="' + postalCode + '"]').removeAttr('data-pattern');
            }
        });

    });
} (window, jQuery));
