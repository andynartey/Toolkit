/*global define */

// Tooltip-content

define(function (require) {
    'use strict';

    var $ = require('jquery');

    require('tooltip');
    require('popover');

    $('.popover-markup > .trigger').popover({
        html : true,
        template: '<div class="popover custom-width"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        container: 'body',
        title: function() {
            return $(this).parent().find('.head').html();
        },
        content: function() {
            return $(this).parent().find('.content').html();
        }
    });

});
