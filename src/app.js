var Enbridge = window.Enbridge || {
  UrlServices: {
    GET_PROVINCES: '/WebServices/AddressService.svc/GetProvinces',
    VALIDATE_CUSTOMER_AND_GET_DATA: '/WebServices/GasAccountService.svc/ValidateCustomerAndGetData',
    VALIDATE_PHONE_BLACKLIST: '/WebServices/PhoneService.svc/IsPhoneNumberBlacklisted'
  },
  Templates: {
    PROVINCE: '<option value=":provinceCode" :wasPicked>:provinceName</option>'
  },
  CountryCodes: {
    CANADA: 'CA'
  },
  ProvinceCodes: {
    ONTARIO: 'ON'
  },
  TrackingUrls: {
    AUTHENTICATED_FLOW: 'Moves/MoveEntry.aspx',
    AUTHENTICATED_FLOW_SUMMARY: 'Moves/MoveSummary.aspx',
    AUTHENTICATED_FLOW_SUCCESS: 'Moves/MoveThanks.aspx',

    OPEN_NEW_GAS_ACCOUNT_FLOW: '/homes/start-stop-move/moving/newaccountentry.aspx',
    OPEN_NEW_GAS_ACCOUNT_FLOW_SUMMARY: '/homes/start-stop-move/moving/newaccountsummary.aspx',
    OPEN_NEW_GAS_ACCOUNT_FLOW_SUCCESS: '/homes/start-stop-move/moving/newaccountthanks.aspx',

    MOVE_OUT_FORM_FLOW: '/homes/start-stop-move/moving/move-out-entry.aspx',
    MOVE_OUT_FORM_FLOW_SUMMARY: '/homes/start-stop-move/moving/move-out-summary.aspx',
    MOVE_OUT_FORM_FLOW_SUCESSS: '/homes/start-stop-move/moving/move-out-thanks.aspx'
  },
  Plugins: {},
  Events: {
    TRACK_IN_WEBTRENDS: 'Enbridge.Events.trackInWebTrends'
  }
};
