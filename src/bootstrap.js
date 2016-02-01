/** General Namespace **/
var Enbridge = window.Enbridge || {
    UrlServices: {
        GET_PROVINCES: '/WebServices/AddressService.svc/GetProvinces'
    },
    Templates: {
        PROVINCE: '<option value=":provinceCode">:provinceName</option>'
    },
    CountryCodes: {
        CANADA: 'CA'
    }
};

/*******************************Window Ready loaders ********************************/
;$(window).ready(function () {
    if ($('[data-id="stop"]:checked').length) {
        $('[data-id="stop-select"]')
            .removeClass('hide-flow')
            .attr('data-required', true);
    }

    if ($('[data-id="country"]').val() != 'CA') {
        $('[data-id="postal-code-input"]').removeAttr('data-pattern');
    }

    if ($('[data-id="country-alternative-element"]').val() != 'CA') {
        $('[data-id="postal-code-input-alternative"]').removeAttr('data-pattern');
    }

    if ($('[data-rel="country-alternative-element"]').val() != 'CA') {
        $('[data-id="postal-code-input-alternative"]').removeAttr('data-pattern');
    }
});
