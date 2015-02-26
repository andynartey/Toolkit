/*
 * Toolkit demo
 *
 * This file should ONLY contain javascript specific to the demo pages
 * Any scripts that should be exported as part of the toolkit MUST be
 * loaded from toolkit.js
 */

/*global require, document, console */
require(['config'], function () {
    "use strict";
    require(['toolkit']);

    require(['jquery', 'popover']);

    require(['jquery', 'markup', 'prism', 'prism-autolinker', 'prism-wpd'], function ($, Markup, Prism) {

        $('.moo-example:not([data-no-preview])').each(function () {
            var markup = new Markup(this),
                source = markup.getSource(),
                language =  $(this).data('language'),
                $dumyDiv = $("<div></div>"),
                $example;

            $dumyDiv.html(source);
            $dumyDiv.find('[data-automation]').removeAttr('data-automation');

            $example = $('<pre class="highlight panel-footer"><code class="language-' + language + '"></code></pre>');
            $example.find('code').text($dumyDiv.html());

            $example.insertAfter(this);

            Prism.highlightElement($example.find('code')[0]);
        });

        $('.moo-example[data-no-preview]').each(function () {
            var language =  $(this).data('language'),
                $code = $(this).siblings('.highlight').find('code');

            $code.addClass('language-' + language);

            Prism.highlightElement($code[0]);
        });

    });
});



