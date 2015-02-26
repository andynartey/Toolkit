/*globals requirejs */
requirejs.config({
    baseUrl: './',
    map: {
        '*': {
            'jquery': 'jquery-loader'
        },
        'jquery-loader': {
            'jquery': 'jquery'
        }
    },
    shim: {
        'bootstrap-select': {
            deps: [
                'jquery'
            ]
        },
        popover: {
            deps: [
                'jquery',
                'tooltip'
            ],
            exports: '$.fn.popover'
        },
        prism: {
            exports: 'Prism'
        },
        'prism-autolinker': {
            deps: [
                'prism'
            ]
        },
        'prism-wpd': {
            deps: [
                'prism'
            ]
        },
        'visibilityjs': {
            exports: 'Visibility'
        },
        'modernizr': {
            exports: 'Modernizr'
        }
    },
    paths: {
        'prism': 'bower_components/prism/prism',
        'prism-autolinker': 'bower_components/prism/plugins/autolinker/prism-autolinker',
        'prism-wpd': 'bower_components/prism/plugins/wpd/prism-wpd',
        'jquery': 'bower_components/jquery/dist/jquery',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
        'underscore': 'bower_components/underscore/underscore',
        'visibilityjs': 'bower_components/visibilityjs/lib/visibility.core',
        'jquery-menu-aim': '../dist/javascript/shims/jQuery-menu-aim/jquery.menu-aim',
        'dropdown': '../dist/javascript/shims/bootstrap/dropdown',
        'tooltip': '../dist/javascript/shims/bootstrap/tooltip',
        'popover': '../dist/javascript/shims/bootstrap/popover',
        'transition': '../dist/javascript/shims/bootstrap/transition',
        'collapse': '../dist/javascript/shims/bootstrap/collapse',
        'tab': '../dist/javascript/shims/bootstrap/tab',
        'bootstrap-select': '../dist/javascript/shims/bootstrap-select/bootstrap-select',
        'toolkit': '../dist/javascript/toolkit',
        'dropdown-nav': '../dist/javascript/dropdown-nav',
        'popovers': '../dist/javascript/popovers',
        'jquery-loader': '../dist/javascript/jquery-loader',
        'modernizr': '../dist/javascript/modernizr-custom',
        'markup': '../dist/javascript/markup',
        'froogaloop': '../dist/javascript/froogaloop',
        'slideshow': '../dist/javascript/slideshow',
        'accordion': '../dist/javascript/accordion',
        'tooltip-content': '../dist/javascript/tooltip-content'
    }
});
