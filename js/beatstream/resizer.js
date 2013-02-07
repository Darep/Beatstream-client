define(['jquery'], function ($) {

    var Resizer = function (songlist) {
        this.songlist = songlist;

        // resize components on window resize
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
        height_container = height - $('.page-header').innerHeight();
        $('.grid-container').css('height', height_container);

        // tell songlist to resize canvas
        if (this.songlist) {
            this.songlist.resizeCanvas();
        }

        // TODO: what if, instead, we send a message to the bus: "app:resize"
    };

    return Resizer;
});
