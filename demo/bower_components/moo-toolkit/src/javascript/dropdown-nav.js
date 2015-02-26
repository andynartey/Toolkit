/*global define */

// Page header navigation

define(function (require) {
    'use strict';

    require('jquery-menu-aim');

    var $ = require('jquery'),
        toggleActive;

    $('.dropdown').mouseenter(function () {
        $(this).addClass('open');
    }).mouseleave(function () {
        $(this).removeClass('open');
    });

    toggleActive = function (row) {
        $(row).toggleClass('active');
    };

    $(".dropdown-menu").menuAim({
        activate: toggleActive,
        deactivate: toggleActive
    });
});
