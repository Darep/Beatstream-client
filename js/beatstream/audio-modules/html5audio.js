/*!
 * Beatstream HTML5 <audio> module
 */

(function ($, window, document, undefined) {

    function AudioModule() {
        var audio, error_counter;
        var self = this;

        error_counter = 0;
        audio = $('<audio />');

        // <audio> events
        audio.bind('play', function() {
            events.onPlay();
        });

        audio.bind('pause', function() {
            events.onPaused();
        });

        audio.bind('ended', function () {
            events.onSongEnd();
        });

        audio.bind('timeupdate', function () {
            var elaps = parseInt(audio[0].currentTime, 10);
            events.onTimeChange(elaps);
        });

        audio.bind('durationchange', function () {
            var dur = parseInt(audio[0].duration, 10);
            events.onDurationParsed(dur);
        });

        audio.bind('error', function () {
            events.onError();
        });


        // events from other modules
        mediator.subscribe("songlist:listEnd", function () {
            self.stop();
        });

        mediator.subscribe("audio:error", function () {
            if (error_counter > 2) {
                self.pause();
                error_counter = 0;
                return;
            }
            else {
                error_counter = error_counter + 1;
            }
        });

        mediator.subscribe("buttons:togglePause", function () {
            audio.togglePause();
        });

        mediator.subscribe("buttons:seek", function (value) {
            self.seekTo(value);
        });

        mediator.subscribe("buttons:setVolume", function (volume) {
            self.setVolume(volume);
        });

        this.audio = audio;
        this.events = events;
    }

    AudioModule.prototype.setVolume = function (volume) {
        volume = parseFloat(volume/100);
        this.audio[0].volume = volume;
    };

    AudioModule.prototype.play = function (uri) {
        this.audio.attr('src', uri);
        this.audio[0].play();
    };

    AudioModule.prototype.togglePause = function () {
        if (this.audio[0].paused) {
            this.audio[0].play();
        }
        else {
            this.audio[0].pause();
        }
    };

    AudioModule.prototype.stop = function () {
        if (!this.audio[0].paused) {
            this.audio[0].pause();
            this.audio[0].src = '';
        }
    };

    AudioModule.prototype.seekTo = function (seconds) {
        this.audio[0].currentTime = seconds;
    };


    // reveal
    window.HTML5Audio = AudioModule;

})(jQuery, window, document);
