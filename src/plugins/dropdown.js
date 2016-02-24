/* globals Enbridge */
(function($) {
  Enbridge.Plugins.Dropdown = function (element) {
    this.source = element;
    this.init();
    this.addMethods();
  };

  function copyToHiddenInput(source, value) {
    var $hiddenInput = $('input[type="hidden"][data-assoc="' + source.getAttribute('data-id') + '"]');
    if ($hiddenInput.length > 0) {
      $hiddenInput.val(value);
    }
  }

  Enbridge.Plugins.Dropdown.prototype.init = function() {
    var $element = $(this.source),
      id = $element.attr('data-id') + '-dropdown',
      elementNodes = this.source.children || [],
      nodes = [],
      element = '',
      name = '';

    if (elementNodes.length < 1) {
      return;
    }

    this.destroy(id);

    for (var i = 0, size = elementNodes.length; i < size; i+=1) {
      var temp = '<li class="list-item" data-value="' + elementNodes[i].value + '">' + elementNodes[i].text + '</li>';

      if (elementNodes[i].selected) {
        name = elementNodes[i].text;
      }

      nodes.push(temp);
    }

    name = (name) ? name : (elementNodes[0].text || '');

    element = '<div class="enbridge-dropdown" id="' + id + '">' +
      '<div class="header"><span class="selected">' + name + '</span><span class="indicator"></span></div><ul class="list-items">' +
      nodes.join('') +
      '</ul></div>';

    $element.after(element);

    this.element = this.source.nextElementSibling;

    copyToHiddenInput(this.source, this.source.value);
  };

  Enbridge.Plugins.Dropdown.prototype.addMethods = function addMethods() {
    var self = this,
      $element = $(this.element);

    $element.bind('click', function() {
      $(this).toggleClass('active');
    });

    $element.bind('mouseleave', function() {
      this.className = 'enbridge-dropdown';
    });

    $element
      .find('.list-items .list-item')
      .bind('click', function() {
        var $current = $(this),
          $source = $(self.source),
          text = $current.text() || '',
          value = $current.attr('data-value') || '',
          $header = $element.find('.header'),
          totalWidth = $header.width(),
          indicatorWidth = $header.find('.indicator').width(),
          padding = $header.css('padding-left').replace('px', '') * 2;

        $element.find('.header .selected')
          .width((totalWidth - indicatorWidth - padding))
          .text(text);

        $element.find('.result').val(value);

        $source
          .find('option:selected')
          .removeAttr('selected');

        $source
          .find('option[value="' + value + '"]')
          .attr('selected', true);

        copyToHiddenInput(self.source, value);
      });
  };

  Enbridge.Plugins.Dropdown.prototype.destroy = function(id) {
    var $element = $('#' + id);

    if ($element.length < 1) {
      return;
    }

    $element.unbind('click');
    $element.find('.list-items .list-item').unbind('click');
    $element.remove();
  };

  $.fn.enbridgeDropdown = function() {
    return this.each(function() {
      var enbridgeDropdownPlugin = new Enbridge.Plugins.Dropdown(this);
      return enbridgeDropdownPlugin;
    });
  };
}(jQuery));
