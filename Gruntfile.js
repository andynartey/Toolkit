/*jslint node: true, nomen: true, stupid: true */
/*global require, module, process */
module.exports = function (grunt) {
    "use strict";

    var fs = require('fs'),
        path = require('path'),
        version = require('version'),
        exec = require('child_process').exec,
        getSvgFilenames;

    getSvgFilenames = function (src) {
        return fs.readdirSync(src)
            .filter(function (file) {
                return path.extname(file) === '.svg';
            }).map(function (file) {
                return path.basename(file, path.extname(file));
            });
    };

    require('time-grunt')(grunt);

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        connect: {
            toolkit: {
                options: {
                    port: 8000,
                    useAvailablePort: true,
                    keepalive: false,
                    livereload: true,
                    middleware: function (connect) {
                        var connectSSI = require('connect-ssi'),
                            rewriteModule = require('http-rewrite-middleware');
                        return [
                            connectSSI({
                                baseDir: __dirname + '/demo'
                            }),
                            rewriteModule.getMiddleware([
                                {from: '^/bower_components/moo-toolkit/(.*)$', to: '/$1'}
                            ]),
                            connect.static(__dirname),
                            connect.static('demo')
                        ];
                    }
                }
            }
        },

        notify: {
            livereload: {
                options: {
                    title: 'Live Reload',
                    message: 'Files updated'
                }
            }
        },

        watch: {
            css: {
                files: 'demo/stylesheets/**/*.css',
                tasks: ['notify:livereload'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: ['src/less/**/*.less', 'demo/less/**/*.less'],
                tasks: ['less:demo', 'autoprefixer:demo']
            },
            javascript: {
                files: ['src/javascript/**/*.js'],
                tasks: ['javascript', 'wrap']
            },
            fonts: {
                files: ['src/templates/font/mooicon.css', 'src/fonts/**/*.svg'],
                tasks: ['font', 'stylesheets']
            },
            readme: {
                files: 'README.md',
                tasks: ['markdown:readme']
            },
            html: {
                files: ['!demo/bower_components', 'demo/**/*.shtml'],
                options: {
                    livereload: true
                }
            }
        },

        less: {
            options: {
                paths: ["bower_components"]
            },
            toolkit: {
                files: {
                    "dist/stylesheets/template.css": "src/less/template.less"
                }
            },
            demo: {
                options: {
                    sourceMap: true,
                    sourceMapRootpath: "../bower_components/moo-toolkit"
                },
                files: [{
                    expand: true,
                    cwd: 'demo/less',
                    src: ['*.less'],
                    dest: 'demo/stylesheets/',
                    ext: '.css'
                }]
            }
        },

        csso: {
            compress: {
                options: {
                    report: 'min'
                },
                files: {
                    'dist/stylesheets/template.css': ['dist/stylesheets/template.css']
                }
            }
        },

        cssjoin: {
            join: {
                files: {
                    'dist/stylesheets/template.css': ['dist/stylesheets/template.css']
                }
            }
        },

        autoprefixer: {
            options: {
                map: true,
                browsers: ["last 1 version", "> 1%", "ie 8", "ie 7"]
            },

            toolkit: {
                src: 'dist/stylesheets/template.css',
                dest: 'dist/stylesheets/template.css'
            },

            demo: {
                src: 'demo/stylesheets/template.css',
                dest: 'demo/stylesheets/template.css'
            }
        },

        modernizr: {
            dist: {
                "devFile" : "src/javascript/modernizr.js",
                "outputFile" : "dist/javascript/modernizr-custom.js",

                "extra" : {
                    "shiv" : false,
                    "printshiv" : false,
                    "load" : true,
                    "mq" : false,
                    "cssclasses" : true
                },
                "extensibility" : {
                    "addtest" : true,
                    "prefixed" : false,
                    "teststyles" : true,
                    "testprops" : false,
                    "testallprops" : false,
                    "hasevents" : false,
                    "prefixes" : false,
                    "domprefixes" : false
                },
                "tests" : [
                    "svg",
                    "flexbox",
                    "borderradius",
                    "csstransforms",
                    "draganddrop",
                    "file-api",
                    "forms-fileinput",
                    "svg-filters",
                    "touch"
                ],
                "customTests" : [
                    "src/modernizr/checked.js",
                    "src/modernizr/moo.flash.js"
                ]
            }

        },

        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/bryant',
                        src: ['**/*'],
                        dest: 'dist/fonts/bryant'
                    }
                ]
            },
            javascript: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/javascript',
                        src: ['**/*.js', '!modernizr.js'],
                        dest: 'dist/javascript'
                    }
                ]
            },
            svg: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/images/svg',
                        src: ['**/*.svg'],
                        dest: 'dist/images/svg'
                    }
                ]
            },
            favicon: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/images/favicon',
                        src: ['**/*'],
                        dest: 'dist/images/favicon'
                    }
                ]
            },
            demo: {
                files: [
                    {
                        expand: true,
                        cwd: './',
                        src: ['demo/**/*', 'dist/**/*', 'src/**/*', '!demo/bower_components/**/*'],
                        dest: 'demo/bower_components/moo-toolkit'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components',
                        src: ['**/*'],
                        dest: 'demo/bower_components'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components',
                        src: ['**/*'],
                        dest: 'demo/bower_components/moo-toolkit/bower_components'
                    },
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['**/*'],
                        dest: 'demo/dist'
                    }
                ]
            }
        },

        clean: {
            toolkit: [
                'dist/javascript',
                'dist/stylesheets',
                'dist/images',
                'dist/fonts/mooicons',
                'demo/stylesheets',
                'demo/includes/generated/',
                'src/less/mooicon.less',
                'src/less/mooimage.less',
                'src/less/sprite-codes.less'
            ],

            demo: [
                'demo/bower_components'
            ],

            javascript: [
                'dist/javascript'
            ],

            svg: [
                'dist/images/svg'
            ]
        },

        jslint: {
            toolkit: {
                src: [
                    'bower.json',
                    'Gruntfile.js',
                    'dist/javascript/**/*.js',
                    '!dist/javascript/modernizr-custom.js'
                ]
            }
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            toolkit: {
                src: ['dist/stylesheets/**/*.css']
            }
        },

        svg2png: {
            toolkit: {
                files: [
                    {
                        expand: false,
                        cwd: 'src/images/svg/',
                        src: ['**/*.svg'],
                        dest: 'dist/images/svg'
                    }
                ]
            }
        },

        svgmin: {
            options: {
                plugins: [
                    { removeViewBox: false }
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/images',
                    src: ['**/*.svg'],
                    dest: 'src/images'
                }]
            }
        },

        webfont: {
            mooicon: {
                src: 'src/fonts/mooicons/*.svg',
                dest: 'dist/fonts/mooicons',
                destCss: 'src/less',
                options: {
                    font: 'mooicon',
                    fontHeight: 990,
                    normalize: true,
                    htmlDemo: false,
                    stylesheet: 'less',
                    hashes: false,
                    relativeFontPath: '@{font-path}mooicons/',
                    template: 'src/templates/font/mooicon.css',
                    engine: 'fontforge',
                    templateOptions: {
                        baseClass: 'mooicon',
                        classPrefix: 'mooicon-',
                        mixinPrefix: 'mooicon-'
                    },
                    codepoints: {
                        "alert": 0xf101,
                        "bin": 0xf102,
                        "bleed": 0xf103,
                        "cart": 0xf104,
                        "chat": 0xf105,
                        "cheveron-right-x-small": 0xf106,
                        "chevron-down-small": 0xf107,
                        "chevron-down-x-small": 0xf108,
                        "chevron-down": 0xf109,
                        "chevron-left-small": 0xf10a,
                        "chevron-left-x-small": 0xf10b,
                        "chevron-left": 0xf10c,
                        "chevron-right-small": 0xf10d,
                        "chevron-right": 0xf10e,
                        "chevron-up-small": 0xf10f,
                        "chevron-up-x-small": 0xf110,
                        "chevron-up": 0xf111,
                        "circle-carousel": 0xf112,
                        "circle-fill-carousel": 0xf113,
                        "cross-small": 0xf114,
                        "cross": 0xf115,
                        "download": 0xf116,
                        "edit": 0xf117,
                        "email": 0xf118,
                        "etsy": 0xf119,
                        "exclamation-large": 0xf11a,
                        "exclamation": 0xf11b,
                        "facebook": 0xf11c,
                        "flickr": 0xf11d,
                        "flip-bigger": 0xf11e,
                        "flip": 0xf11f,
                        "google-plus": 0xf120,
                        "grid-4": 0xf121,
                        "grid-6": 0xf122,
                        "heart-fill": 0xf123,
                        "heart": 0xf124,
                        "help-bold-circle": 0xf125,
                        "help-circle": 0xf126,
                        "help-large": 0xf127,
                        "help": 0xf128,
                        "info-large": 0xf129,
                        "info": 0xf12a,
                        "instagram": 0xf12b,
                        "list-2": 0xf12c,
                        "list-3": 0xf12d,
                        "minus-small": 0xf12e,
                        "minus": 0xf12f,
                        "more": 0xf130,
                        "picasa": 0xf131,
                        "pinterest-circle": 0xf132,
                        "pinterest": 0xf133,
                        "play-fill": 0xf134,
                        "play": 0xf135,
                        "plus-small": 0xf136,
                        "plus": 0xf137,
                        "print": 0xf138,
                        "qr": 0xf139,
                        "receipt": 0xf13a,
                        "rotate": 0xf13b,
                        "rss": 0xf13c,
                        "safe-area": 0xf13d,
                        "save": 0xf13e,
                        "search": 0xf13f,
                        "smugmug": 0xf140,
                        "sort-down": 0xf141,
                        "sort-up": 0xf142,
                        "sort": 0xf143,
                        "tick-small": 0xf144,
                        "tick": 0xf145,
                        "trim": 0xf146,
                        "twitter-t": 0xf147,
                        "twitter": 0xf148,
                        "upload": 0xf149,
                        "view-fill": 0xf14a,
                        "view": 0xf14b,
                        "zoom-in": 0xf14c,
                        "zoom-out": 0xf14d,
                        "error-circle": 0xf14e,
                        "filter": 0xf14f
                    }
                }
            }
        },

        image_info: {
            mooimage: {
                options: {
                    cssTemplate: 'src/templates/mooimage-less.mustache',
                    imageMagick: true
                },
                files: {
                    'src/less/mooimage.less': ['dist/images/svg/**/*.png']
                }
            }
        },

        template: {
            sprite: {
                options: {
                    data: function () {
                        return {
                            files: getSvgFilenames('src/images/sprite')
                        };
                    }
                },
                files: {
                    'demo/includes/generated/moosprite-list.shtml': ['src/templates/moosprite-list.html.tpl']
                }
            },

            image: {
                options: {
                    data: function () {
                        return {
                            files: getSvgFilenames('src/images/svg')
                        };
                    }
                },
                files: {
                    'demo/includes/generated/mooimage-list.shtml': ['src/templates/mooimage-list.html.tpl']
                }
            },

            icon: {
                options: {
                    data: function () {
                        return {
                            files: getSvgFilenames('src/fonts/mooicons')
                        };
                    }
                },
                files: {
                    'demo/includes/generated/mooicon-list.shtml': ['src/templates/mooicon-list.html.tpl']
                }
            }
        },

        svg_sprites: {
            toolkit: {
                options: {
                    padding: 5,
                    generatePreview: false,
                    className: ".moosprite-%f",
                    cssFile: "src/less/sprite-codes.less",
                    svgPath:   "@{image-path}/sprites/svg-sprite.svg",
                    pngPath:   "@{image-path}/sprites/png-sprite.png",
                    svg: {
                        sprite: "dist/images/sprites/svg-sprite.svg"
                    }
                },
                src: 'src/images/sprite/*.svg'
            }
        },

        // NPM bug with shrinkwrap blocking use of imagemin
        // https://github.com/npm/npm/issues/5920
        // imagemin: {
        //     toolkit: {
        //         files: [{
        //             expand: true,
        //             cwd: 'src/images',
        //             src: ['**/*.{png,jpg,gif}'],
        //             dest: 'src/images'
        //         }]
        //     }
        // },

        markdown: {
            readme: {
                src: ['README.md'],
                dest: 'demo/includes/generated/readme.shtml',
                options: {
                    template: 'src/templates/readme.tpl'
                }
            }
        },

        requirejs: {
            toolkit: {
                options: {
                    baseUrl: "./demo",
                    mainConfigFile: "src/javascript/config.js",
                    name: "../bower_components/almond/almond",
                    include: "toolkit",
                    out: "dist/javascript/toolkit-compiled.js",
                    wrap: true,
                    logLevel: 0,
                    insertRequire: ['toolkit', 'jquery-loader'],
                    optimize: "uglify2"
                }
            }
        },

        wrap: {
            bootstrap: {
                cwd: 'bower_components/bootstrap/js/',
                src: ['**/*.js'],
                dest: 'dist/javascript/shims/bootstrap/',
                expand: true,
                options: {
                    wrapper: ['define(["jquery"], function (jQuery) {\n', '\n});']
                }
            },
            "bootstrap-select": {
                src: 'bower_components/bootstrap-select/bootstrap-select.js',
                dest: 'dist/javascript/shims/bootstrap-select/bootstrap-select.js',
                options: {
                    wrapper: ['define(["jquery"], function (jQuery) {\n', '\n});']
                }
            },
            "menu-aim": {
                src: 'bower_components/jQuery-menu-aim/jquery.menu-aim.js',
                dest: 'dist/javascript/shims/jQuery-menu-aim/jquery.menu-aim.js',
                options: {
                    wrapper: ['define(["jquery"], function (jQuery) {\n', '\n});']
                }
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commit: false,
                createTag: false,
                push: false,
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        }
    });

    grunt.registerTask('dist-toolkit', function() {
        var done = this.async();

        version.fetch(function(error, version) {
            if (error) {
                console.error("couldn't find package version. Is your package.json well formed and featuring a semver version?", error);
                return;
            }

            exec('./dist-toolkit.sh ' + version, function(err, stdout, stderr){
                if (err) {
                    console.error(err);
                    grunt.fatal('Failed distributing the toolkit');
                } else {
                    console.log(stdout);
                }

                done();
            });
        });
    });

    // Stylesheets - less, autoprefixer
    grunt.registerTask('stylesheets', ['less', 'autoprefixer']);

    grunt.registerTask('javascript', ['clean:javascript', 'copy:javascript', 'modernizr']);

    grunt.registerTask('image', ['clean:svg', 'svgmin', 'svg2png', 'copy:svg', 'copy:favicon', 'image_info', 'template:image']);

    grunt.registerTask('server', ['connect:toolkit', 'watch']);

    grunt.registerTask('font', ['svgmin', 'webfont', 'template:icon']);

    grunt.registerTask('sprite', ['svg_sprites']);

    grunt.registerTask('default', ['template', 'markdown', 'image', 'sprite', 'font', 'javascript', 'wrap', 'stylesheets', 'copy:fonts', 'copy:demo', 'requirejs']);

    grunt.registerTask('dist', ['clean', 'font', 'copy:fonts', 'default']);

    grunt.registerTask('release', ['dist', 'bump', 'dist-toolkit']);

    grunt.registerTask('lint:javascript', ['jslint']);
    grunt.registerTask('lint:css', ['csslint']);

    grunt.registerTask('lint', ['lint:javascript', 'lint:css']);

    grunt.registerTask('optimize', ['cssjoin', 'csso', 'requirejs']);
};
