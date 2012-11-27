define(
    ['jquery'],
    function ($) {
        var PreloaderView = function () {
            var el = $('.preloader');
            var errorStack = [];

            this.showError = function (key) {
                var error = el.find('.' + key);

                error.css({
                    display: 'none',
                    visibility: 'visible'
                });

                errorStack.push(key);

                // little pause so the animation plays
                setTimeout(function () {
                    error.show();
                }, 1);
            };

            this.hideError = function (key) {

                // remove key from the error stack
                var index = errorStack.indexOf(key);
                errorStack.splice(index, 1);

                el.find('.' + key).hide();

                if (errorStack.length === 0) {
                    this.hide();
                }
            };

            this.hide = function () {
                el.fadeOut('slow', function () {
                    el.addClass('hide').show();
                });
            };

        };

        return new PreloaderView();
    }
);
