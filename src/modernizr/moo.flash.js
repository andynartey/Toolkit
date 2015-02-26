/*globals navigator, require, window, ActiveXObject */
// This code is a proper working modification of https://gist.github.com/675496
"use strict";

Modernizr.addTest('flash', function () {
    var doesModernBrowserHaveFlash,
        doesIeHaveFlash,
        isFlashInstalled;

    // Basic check to see if the browser has Flash installed.
    // The user may have disabled Flash, in which case
    // reliance on this function would be wrong.
    doesModernBrowserHaveFlash = function () {
        return (navigator.plugins !== undefined && typeof navigator.plugins["Shockwave Flash"] === "object");
    };

    doesIeHaveFlash = function () {
        // Needs to be in a TC block as if IE doesn't have Flash, it throws on trying to create the AXObj
        try {
            if (window.ActiveXObject && 'object' === (typeof new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))) {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    isFlashInstalled = (doesModernBrowserHaveFlash() || doesIeHaveFlash());
    return isFlashInstalled;
});
