/* globals Enbridge */
Enbridge.Plugins.AccordionWizard = window.Enbridge.Plugins.AccordionWizard || {
    // Know which is the current step (active step) in wizard
    getCurrentStep: function ($accordion) {
      if ($accordion.length < 1) {
        return -1;
      }
      var $accordionItems = $accordion.find('.accordion-item');
      var i, len, accordionItem;
      for (i = 0, len = $accordionItems.length; i < len; i += 1) {
        accordionItem = $accordionItems.get(i);
        if (accordionItem.className.indexOf('active') >= 0) {
          return (i + 1);
        }
      }
      return -1;
    }
};
