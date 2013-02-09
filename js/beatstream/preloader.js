define(['jquery', 'beatstream/mediator'],
function ($, mediator) {

    var Preloader = function (selector, audioStart, playlistLoad) {
        this.el = $(selector);
        this.errorStack = [];

        $.when(audioStart, playlistLoad).done(function (audioResult, openMusicResult) {
            console.log('preloader: audio started and playlist loaded!');
            this.hide();
        }.bind(this));

        audioStart.fail(function () {
            this.showError('no-flash');

            // Hide the error if the audio is started later on (e.g. flash block disabled)
            mediator.subscribe("audio:ready", function () {
                this.hideError('no-flash');

                // unsubscribe
                mediator.Remove("audio:ready", this);
            }.bind(this));
        }.bind(this));

        playlistLoad.fail(function () {
            this.showError('playlist-error');
        }.bind(this));
    };

    Preloader.prototype.hide = function () {
        this.el.fadeOut('slow', function () {
            // Element needs to be displayed or flash playback won't work
            // Why? SoundManager2's #sm2-container is inside preloader's DOM
            this.el.css({
                display: 'block',
                top: '-100px',
                left: '-100px',
                height: '0',
                width: '0'
            });
        }.bind(this));
    };

    Preloader.prototype.showError = function (key) {
        console.log('gonna display error: ' + key);
        var error = this.el.find('.' + key);

        error.css({
            display: 'none',
            visibility: 'visible'
        });

        this.errorStack.push(key);

        // little pause so the animation plays
        setTimeout(function () {
            error.show();
        }, 1);
    };

    Preloader.prototype.hideError = function (key) {
        this.el.find('.' + key).hide();

        var index = this.errorStack.indexOf(key);
        this.errorStack.splice(index, 1);

        // Hide preloader if no more errors to show
        if (this.errorStack.length === 0) {
            this.hide();
        }
    };

    return Preloader;
});
