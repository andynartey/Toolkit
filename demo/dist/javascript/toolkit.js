/*global define, window */

define(function (require) {
    'use strict';

    var $ = require('jquery');

    require('modernizr');

    // Styled dropdowns
    require('dropdown');
    require('bootstrap-select');

    require('accordion');

    require('dropdown-nav');
    require('popovers');
    require('tooltip-content');

    $('.form-styled-select').selectpicker();

    (function () {
        $('.popover-content').popover({
            html : true,
            content: function () {
                return $('.popover-html').html();
            }
        });
    }());

    (function () {
        // Extend tabs to work with url # bang
        if ($('.tab-content').length) {
            var $activeTab = $('[href="' + window.location.hash + '"]');

            if ($activeTab) {
                $activeTab.tab('show');
            }
        }
    }());

    (function () {
        var $slideshows = $('.slideshow-container');

        if ($slideshows.length > 0) {
            require('slideshow');

            $slideshows.each(function () {
                var $this = $(this),
                    autoplay = !!($this.data('slideshow-autoplay')),
                    preventNavigation = !!($this.data('slideshow-preventnavigation'));

                $this.slideshow({
                    autoplay: autoplay,
                    preventNavigation: preventNavigation
                });
            });
        }
    }());

    // Setup auto tabs
    (function () {
        require('tab');

        var $tabs = $('.tabs[data-toggle=auto]');

        if ($tabs.length > 0) {
            // For each tab group
            $tabs.each(function () {
                var $tabGroup = $(this),
                    $links = $tabGroup.find('a'),
                    $panes = $tabGroup.next('.tab-content').find('.tab-pane');

                // The first time an element is clicked initialize the correct tab pane
                $links.one('click', function () {
                    var $link = $(this),
                        index = $links.index($link);

                    $link.data('target', $panes[index]);
                });

                // Every time a link is clicked manually call show tab
                $links.on('click', function (evt) {
                    evt.preventDefault();
                    $(this).tab('show');
                });
            });
        }


    }());

    /*
     * Set all columns in a row to be the same height. Use is currently
     * discouraged through lack of testing. Also is may be required to
     * check if the font has loaded before doing height calculations on
     * the content

    (function () {
        var $rows = $('[data-row-height=auto]');

        $rows.each(function () {
            var $row = $(this),
                $images = $row.find('img'),
                deffereds = [];

            // Create promise for each image to be resolved
            // when all images have loaded
            $images.each(function () {
                var dfd = $.Deferred();

                // One time on load handler
                $(this).one("load", function () {
                    //Resolve on load
                    dfd.resolve();
                }).each(function () {
                    // May have already completed resolve
                    if (this.complete) {
                        dfd.resolve();
                    }
                });

                // Push onto stack of promises
                deffereds.push(dfd.promise());
            });

            // When all images have loaded. The col height should
            // no longer change. So start fixing it
            $.when.apply($, deffereds).then(function () {
                var $cols = $row.children("[class*='col-']"),
                    heights = [],
                    maxHeight;

                // Get height for each col
                $cols.each(function () {
                    var $col = $(this);
                    heights.push($col.height());
                });

                // Find the max height
                maxHeight = Math.max.apply(this, heights);

                $row.addClass('row-fixed');
                $cols.height(maxHeight);
            });
        });
    }());

    */

});
