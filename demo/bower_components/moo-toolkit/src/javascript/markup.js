/*
 * Markup.js
 *
 * Show HTML markup examples
 */

/*global require, document, console, define */

//(function () {
define(function () {
    "use strict";

    var Markup;

    Markup = function (element) {
        this.rawHtml = element.innerHTML.replace(/\n/, '');
    };

    Markup.prototype.getHtml = function () {
        return this.rawHtml;
    };

    Markup.prototype.getIndent = function () {
        var html = this.getHtml(),
            lines = html.split("\n");

        // Return the position of the first non whitespace char
        return lines[0].search(/\S/);
    };

    Markup.prototype.outdent = function (html, charCount) {
        var strings = [],
            lines = html.split("\n"),
            i;

        for (i = 0; i <= lines.length - 1; i = i + 1) {
            strings.push(lines[i].slice(charCount));
        }

        return strings.join("\n");
    };

    Markup.prototype.getSource = function () {
        var indent = this.getIndent(),
            html = this.getHtml();

        return this.outdent(html, indent);
    };

    return Markup;
});
