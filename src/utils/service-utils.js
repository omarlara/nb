window.Enbridge.ServiceUtils = window.Enbridge.ServiceUtils || {};

function loadProvinces(data, id, pickProvince) {
  $.getJSON(Enbridge.UrlServices.GET_PROVINCES, data, function populateProvinces(provinces) {
    var i = 0,
      len = provinces.length || 0,
      $provinceDropdown = $('[data-id="' + id + '"]'),
      compilation = '';

    for (i = 0; i < len; i += 1) {
      compilation +=
        Enbridge.Templates.PROVINCE.replace(':provinceCode', provinces[i].Code)
        .replace(':provinceName', provinces[i].Name)
        .replace(':wasPicked', (!!pickProvince && pickProvince === provinces[i].Code ? 'selected' : ''))
    }

    $provinceDropdown.html(compilation);
    $provinceDropdown.enbridgeDropdown();
  });
}
Enbridge.ServiceUtils.loadProvices = loadProvinces;

function trackAccordionWizardStepsInWebTrends (e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    var step = Enbridge.Plugins.AccordionWizard.getCurrentStep($('.accordion')),
    url = document.URL;

    // Do not repeat step
    if (step > Enbridge.currentStep) Enbridge.currentStep = step;
    else return;

    // Move form
    if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW) >= 0) {
      switch (step) {
        case 2:
            dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/address.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_New_Address_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20New%20Address','WT.si_x', '2');
            break;
        case 3:
            // Auth Dates Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/dates.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_Dates_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20Dates','WT.si_x', '3');
            break;
        case 4:
            // Auth Your Info Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/your-info.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_Your_Info_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20Your%20Info','WT.si_x', '4');
            break;
      }
    }

    // Moveout form
    if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW) >= 0) {
      switch (step) {
        case 2:
            // UnAuth Move Out New Address Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/address.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Address_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Address','WT.si_x', '2');
            break;
        case 3:
            // UnAuth Move Out Dates Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/dates.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Dates_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Dates','WT.si_x', '3');
            break;
        case 4:
            // UnAuth Move Out Your Info Step
            dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/your-info.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Your_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Your%20Info','WT.si_x', '4');
            break;
      }
    }

    // Newaccount entry
    if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW) >= 0) {
      switch (step) {
        case 2:
            // New Customer Address Step"
            dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/address.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Address_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Address%20Info','WT.si_x', '2');
            break;
        case 3:
            // New Customer Dates Step"
            dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/dates.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Dates_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Dates','WT.si_x', '3');
            break;
        case 4:
            // New Customer Your Info Step"
            dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/billing-services.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Billing_Services_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Billing%20Services','WT.si_x', '4');
            break;
      }
    }
}
Enbridge.ServiceUtils.trackAccordionWizardStepsInWebTrends = trackAccordionWizardStepsInWebTrends;

function trackWebTrendsHandler () {
  var step = Enbridge.Plugins.AccordionWizard.getCurrentStep($('.accordion')),
      url = document.URL;

  // Auth Summary Step
  if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW_SUMMARY) >= 0) {
      dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/summary.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Summary_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Summary','WT.si_x', '5');
  }
  // Auth Move Successs Step
  if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW_SUCCESS) >= 0) {
      dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/success.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Move_Success_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Success','WT.si_x', '6','WT.si_c', '1');
  }

  // UnAuth Move Out Summary Step
  if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW_SUMMARY) >= 0) {
    dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/summary.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Summary_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Summary','WT.si_x', '5');
  }
  // UnAuth Move Out Successs Step
  if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW_SUCESSS) >= 0) {
    dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/success.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Success_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Success','WT.si_x', '6','WT.si_cs', '1');
  }

  // Open new gas account - Summary Step
  if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW_SUMMARY) >= 0) {
    dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/summary.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Summary_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Summary','WT.si_x', '5');
  }
  // Open new gas account - Successs Step
  if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW_SUCCESS) >= 0) {
      dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/success.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Move_Success_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Success','WT.si_x', '6','WT.si_c', '1');
  }

  // Do not repeat step
  if (step > Enbridge.currentStep) Enbridge.currentStep = step;
  else return;

  // Move form
  if (url.indexOf(Enbridge.TrackingUrls.AUTHENTICATED_FLOW) >= 0) {
    switch (step) {
      case 1:
          // Auth Move Details Step
          dcsMultiTrack('DCS.dcsuri','/moves-form/authenticated/details.html','WT.si_n', 'Authenticated_Flow','WT.si_p', 'Auth_Move_Details_Step','WT.z_UserStatus','Auth','WT.ti','Moves%20-%20Authenticated%20-%20Details','WT.si_x', '1');
          break;
    }
  }

  // Moveout form
  if (url.indexOf(Enbridge.TrackingUrls.MOVE_OUT_FORM_FLOW) >= 0) {
    switch (step) {
      case 1:
          // UnAuth Move Out Account Info Step
          dcsMultiTrack('DCS.dcsuri','/moves-form/close-account/account-info.html','WT.si_n', 'Move_Out_Form_Flow','WT.si_p', 'UnAuth_Move_Out_Account_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Close%20Account%20-%20Account%20Info','WT.si_x', '1');
          break;
    }
  }

  // Newaccount entry
  if (url.indexOf(Enbridge.TrackingUrls.OPEN_NEW_GAS_ACCOUNT_FLOW) >= 0) {
    switch (step) {
      case 1:
          // New Customer Info Step"
          dcsMultiTrack('DCS.dcsuri','/moves-form/open-account/customer-info.html','WT.si_n', 'Open_New_Gas_Account_Flow','WT.si_p', 'New_Cust_Info_Step','WT.z_UserStatus','UnAuth','WT.ti','Moves%20-%20Open%20Account%20-%20Customer%20Info','WT.si_x', '1');
          break;
    }
  }
}
Enbridge.ServiceUtils.trackWebTrendsHandler = trackWebTrendsHandler;
