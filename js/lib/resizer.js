define([
    'lib/mediator'
], function (mediator) {

    var Resizer = function () {
        $(window).resize(function () {
            this.resize();
        }.bind(this));
    };

    Resizer.prototype.resize = function () {
        var height, height_container;

        // set main area height
        height = $(window).height();
        height -= $('.app-top').outerHeight(true);
        height -= $('.app-now-playing').outerHeight(true);
        $('.main-wrap').css('height', height);

        // set songlist container height
        height_container = height - $('.playlist-header').innerHeight();
        $('.grid-container').css('height', height_container);

        mediator.publish('app:resize');
    };

    return Resizer;
});
