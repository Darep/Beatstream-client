define(
    ['jquery'],
    function ($) {
        var PreloaderView = function () {
            var el = $('.preloader');
            var errorStack = [];

            this.showError = function (key) {
                el.find('.' + key).show();
                errorStack.push(key);
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
                    el.remove();
                });
            };

        };

        return new PreloaderView();
    }
);
