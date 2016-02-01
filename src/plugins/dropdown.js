/***********************Plugins declaration***********************/

/*Dropdown*/
function dropdownEnbridge(element) {
    this.source = element;
    this.init();
    this.addMethods();
}

dropdownEnbridge.prototype.init = function () {
    var $element = $(this.source),
        id = $element.attr('data-id') + '-dropdown',
        elementNodes = this.source.children || [],
        nodes = [],
        element = '',
        name = '';

    if (!elementNodes.length) return;

    this.destroy(id);

    for (var i = 0, size = elementNodes.length; i < size; i++) {
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
};

dropdownEnbridge.prototype.addMethods = function addMethods() {
    var self = this,
        $element = $(this.element);

    $element.bind('click', function () {
        $(this).toggleClass('active');
    });

    $element.bind('mouseleave', function () {
        this.className = 'enbridge-dropdown';
    });

    $element
        .find('.list-items .list-item')
            .bind('click', function () {
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

    var value = this.getAttribute('data-value');
                var $copyToHidden = $('input[type="hidden"][data-assoc="' + self.source.getAttribute('data-id') + '"]');
                if ($copyToHidden.length > 0) {
                  $copyToHidden.val(value);
                }
            });

};

dropdownEnbridge.prototype.destroy = function (id) {
    var $element = $('#' + id);

    if (!$element.length)
        return;

    $element.unbind('click');
    $element.find('.list-items .list-item').unbind('click');
    $element.remove();
}

$.fn.enbridgeDropdown = function (element) {
    return this.each(function () {
        (new dropdownEnbridge(this));
    });
};

; (function ($) {
    $(window).ready(function () {
        $('.enbridge-select').enbridgeDropdown();
        $('.enbridge-dropdown').bind('mouseleave', function () {
            this.className = 'enbridge-dropdown';
        });
    });

})(jQuery);
