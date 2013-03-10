/*!
 * Beatstream SoundManager2 module
 */

define([
    'jquery',
    'beatstream/mediator',
    'soundmanager2'
],
function ($, mediator) {

    var AUDIO_STARTUP_TIMEOUT = 1500;

    function AudioModule(api) {
        this.song = null;
        this.isReady = false;
        this.startDefer = null;

        this.events = {
            onPlay: function () {},
            onDurationParsed: function (duration) {},
            onTimeChange: function (elapsed) {},
            onFinish: function () {},
            onReady: function () {},
            onError: function () {}
        };
    }


    AudioModule.prototype.togglePause = function() {
        if (this.song === null) return;

        this.song.togglePause();
    };


    AudioModule.prototype.stop = function() {
        if (this.song === null) return;

        this.song.stop();
    };


    AudioModule.prototype.seekTo = function(seconds) {
        if (this.song === null) return;

        this.song.setPosition(seconds * 1000);
    };


    AudioModule.prototype.start = function() {
        var defer = $.Deferred(),
            self = this;

        this.startDefer = defer;

        soundManager.setup({
            url: '/swf/',
            preferFlash: true,
            useFlashBlock: true,
            useHTML5Audio: true,
            useHighPerformance: true,
            noSWFCache: true,
            onready: function() {
                self.isReady = true;
                self.events.onReady();
                defer.resolve();
            },
            ontimeout: function (status) {
                console.log(status);
                var loaded = soundManager.getMoviePercent();
                defer.reject();
            }
        });

        // send start fail signal after timeout, so the error is displayed
        setTimeout(function () {
            defer.reject();
        }, AUDIO_STARTUP_TIMEOUT);

        return defer;
    };


    AudioModule.prototype.setVolume = function(volume) {
        if (this.song === null) return;

        this.song.setVolume(volume);
    };


    AudioModule.prototype.play = function(uri) {
        if (!this.isReady) {
            console.log('SoundManager 2 is not ready to play music yet!');
            return;
        }

        if (this.song !== null) {
            // stop playback & loading of previous song
            this.song.destruct();
        }

        var self = this,
            song = soundManager.createSound('mySound', uri);

        this.song = song;

        soundManager.play('mySound', {
            volume: self.volume,

            // register events
            onplay: function () {
                self.events.onPlay();
            },
            onresume: function () {
                // TODO: events?
            },
            onpause: function () {
                // TODO: events?
            },
            onfinish: function () {
                self.events.onFinish();
            },
            onload: function (success) {
                var duration_in_seconds = parseInt(song.duration / 1000, 10);
                self.events.onDurationParsed(duration_in_seconds);
            },
            whileplaying: function () {
                var elapsed_in_seconds = parseInt(song.position / 1000, 10);
                self.events.onTimeChange(elapsed_in_seconds);
            }
        });
    };


    // reveal the module
    return AudioModule;
});
