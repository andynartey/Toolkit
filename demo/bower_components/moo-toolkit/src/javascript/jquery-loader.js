/*!
 * jquery-loader.js
 *
 * Wrapper to load jQuery in no conflict mode
 */

/*global define */

define(['jquery'], function (jQuery) {
    "use strict";

    return jQuery.noConflict(true);
});
