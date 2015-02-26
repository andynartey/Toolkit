/*!
 * accordion.js
 *
 * A simpler implementation of the bootstrap collapse
 * plugin.
 *
 * Attaches event listeners to toggle click targets to
 * open and close their content blocks.
 * Also listens for open/close events to add additional
 * class names to elements for styling.
 */

/*global define, window */

define(function (require) {
    'use strict';

    var $ = require('jquery'),
        $accordions = $('ul.accordion'),
        hasAccordions = ($accordions.length > 0),
        url;

    require('transition');
    require('collapse');

    $('.accordion-toggle').on('click', function (evt) {
        var $this = $(this),
            $content = $this.next('.accordion-content'),
            $parent = $this.parents('.accordion');

        evt.preventDefault();

        // Only toggle element if accordion is not locked
        if ($parent.data('accordion-toggle') !== 'locked' || !$content.hasClass('in')) {
            $content.collapse('toggle');
        }

        if ($parent.data('accordion-toggle') === 'collapse' || $parent.data('accordion-toggle') === 'locked') {
            $parent.find('.accordion-content.in').not($content).collapse('hide');
        }
    });

    $('.accordion-content')
        .on('shown.bs.collapse hidden.bs.collapse', function () {
            var $el = $(this),
                $toggle = $el.prev('.accordion-toggle');

            $toggle.toggleClass('accordion-open');
        });

    // Set active accordion panel
    if (hasAccordions) {
        url = window.location.href;

        $accordions.each(function () {
            var $accordion = $(this),
                $openPanel = $accordion.find('.accordion-open'),
                hasOpenPanel = ($openPanel.length > 0),
                $currentAnchor,
                $parentPanel;

            if (hasOpenPanel) {
                return;
            }

            $currentAnchor = $accordion.find('a[href="' + url + '"]');

            if ($currentAnchor.length > 0) {
                $parentPanel = $currentAnchor.parents('.accordion-content');

                $currentAnchor.addClass('link-unstyled');
                $parentPanel.addClass('in');
                $parentPanel.trigger('shown.bs.collapse');
            }
        });
    }
});
