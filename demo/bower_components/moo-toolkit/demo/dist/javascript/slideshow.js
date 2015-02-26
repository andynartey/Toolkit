/*
 */

/*global Image, define, setInterval, clearInterval */

define(['jquery', 'visibilityjs', 'froogaloop'], function (jQuery, Visibility, Froogaloop) {
    "use strict";


    (function ($) {
        var Slideshow,
            imageCache = {},
            slideDuration = 5000,
            initVideoSlide;

        Slideshow = function (el, options) {
            var self = this,
                activeSlide;

            this.$el = $(el);
            this.$slides = this.$el.find('.slideshow-slides li');
            this.$navContainer = this.$el.find('.slideshow-nav');
            this.$nav = this.$el.find('.slideshow-nav li');
            this.$pager = this.$el.find('[data-slideshow-nav]');
            this.timer = null;

            // Using only the active class from the slides list
            // find out the active index.
            activeSlide = this.$el.find('.slideshow-slides li.active');
            this.activeSlideIndex = this.$slides.index(activeSlide);

            this.$slides.each(function (index, el) {
                initVideoSlide($(el), self);
            });

            this.$nav.each(function (index, el) {
                $(el).on('click', function () {
                    self.stopAutoplay();
                    if (!options.preventNavigation) {
                        self.showSlide(index);
                    }
                });
            });

            this.$pager.on('click', function () {
                var $this = $(this),
                    direction = $this.data('slideshow-nav');

                self.stopAutoplay();

                if (direction === 'prev') {
                    return self.prev();
                }
                if (direction === 'next') {
                    return self.next();
                }
            });

            if (options.autoplay) {
                // Only start playing the slideshow if the browser window
                // is visible. Ensures everyone sees the welcome slide
                if (Visibility.isSupported() && !Visibility.hidden()) {
                    this.startAutoplay();
                }

                Visibility.change(function () {
                    if (Visibility.hidden()) {
                        this.stopAutoplay();
                    } else {
                        this.startAutoplay();
                    }
                }.bind(this));
            }
        };

        Slideshow.prototype.startAutoplay = function () {
            this.timer = setInterval(this.next.bind(this), slideDuration);
        };

        Slideshow.prototype.stopAutoplay = function () {
            clearInterval(this.timer);
        };

        /*
         * For a given slide index update the background image
         */
        Slideshow.prototype.setSlideBackground = function ($slide) {
            var deferred = $.Deferred(),
                imgSrc = $slide.data('slideshow-image');

            $slide.css('background-image', 'url("' + imgSrc + '")');
            deferred.resolve($slide);

            return deferred;
        };

        /*
         * For a given slide index mark the slide and navigation
         * thumbnail as being active
         */
        Slideshow.prototype.setActive = function ($slide) {
            this.$slides.removeClass('active');
            this.$nav.removeClass('active');

            var index = this.$slides.index($slide),
                $nav = $(this.$nav[index]);

            $slide.addClass('active');
            $nav.addClass('active');

            this.activeSlideIndex = index;
        };

        /*
         * Preload an image for a given slide
         */
        Slideshow.prototype.loadImage = function ($slide) {
            var imgSrc = $slide.data('slideshow-image'),
                deferred,
                preloader;

            if (imageCache[imgSrc] === undefined) {
                deferred = $.Deferred();
                preloader = new Image();

                preloader.onload  = function () { deferred.resolve($slide); };
                preloader.onerror = function () { deferred.reject($slide); };

                preloader.src     = imgSrc;
                imageCache[imgSrc] = deferred;
            }

            return imageCache[imgSrc];
        };

        /*
         * Show the slide with the given index
         */
        Slideshow.prototype.showSlide = function (index) {
            if (this.activeSlideIndex === index) {
                return;
            }

            var $slide = $(this.$slides[index]);

            this.loadImage($slide)
                .then(this.setSlideBackground.bind(this))
                .then(this.setActive.bind(this));
        };

        Slideshow.prototype.prev = function () {
            var prev = (this.activeSlideIndex + this.$slides.length - 1) % this.$slides.length;
            this.showSlide(prev);
        };

        Slideshow.prototype.next = function () {
            var next = (this.activeSlideIndex + 1) % this.$slides.length;
            this.showSlide(next);
        };

        $.fn.slideshow = function (options) {

            var settings = $.extend({
                autoplay: true,
                preventNavigation: false
            }, options);

            return this.each(function () {
                var $this = $(this),
                    data = new Slideshow(this, settings);

                $this.data('moo.slideshow', data);
            });
        };

        initVideoSlide = function ($slide, slideshow) {
            var $player = $slide.find('.video-player'),
                $fixedContent = slideshow.$el.find('.slideshow-content-fixed'),
                hiddenClass = 'invisible',
                vimeoVideoApi,
                $playCta,
                $slideshowContent,
                $closeCta;

            function endVideo (e) {
                // Hide the player
                $player.addClass(hiddenClass);

                // Hide the close button
                $closeCta.addClass(hiddenClass);

                // Show the slideshow content
                $playCta.removeClass(hiddenClass);
                $slideshowContent.removeClass(hiddenClass);
                slideshow.$navContainer.removeClass(hiddenClass);

                vimeoVideoApi.api('pause');
            }

            if ($player.length) {
                $playCta = $slide.find('.play-cta');
                $closeCta = $slide.find('.close-cta');

                // If there's a "fixed content" element, use that instead of the slide content
                // Fixed content elements are where there's just one slide without controls (simple explanation)
                if ($fixedContent.length) {
                    $slideshowContent = $fixedContent;
                } else {
                    $slideshowContent = $slide.find('.slideshow-content');
                }

                vimeoVideoApi = new Froogaloop($player[0]);

                // Roll the video on play click
                $playCta.on('click', function () {
                    // Show the player
                    $player.removeClass(hiddenClass);

                    // Show the close button
                    $closeCta.removeClass(hiddenClass);

                    // Hide the slideshow content
                    $playCta.addClass(hiddenClass);
                    $slideshowContent.addClass(hiddenClass);
                    slideshow.$navContainer.addClass(hiddenClass);

                    // Trigger the play
                    vimeoVideoApi.api('play');

                    slideshow.stopAutoplay();
                });

                // When the video ends, go back to original state
                vimeoVideoApi.addEvent('finish', endVideo);

                // When someone gets bored, finish this!
                $closeCta.on('click', endVideo);
            }
        };

    }(jQuery));
});
