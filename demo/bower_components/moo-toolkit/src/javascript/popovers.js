/*global define */

// Popovers

define(function (require) {
    'use strict';

    var $ = require('jquery'),
        hidePopover,
        $tooltipContent = $('.tooltip, .popover-content, .popover-markup > .trigger, .tooltip-anchor');

    require('tooltip');
    require('popover');

    // Tooltips use Popover script
    $('.tooltip-anchor').popover();

    hidePopover = function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    };

    // Hiding popovers
    $tooltipContent.on('shown.bs.popover', function () {
        $('body').on('click', hidePopover);
    });

    $tooltipContent.on('hidden.bs.popover', function () {
        $('body').off('click', hidePopover);
    });

});
