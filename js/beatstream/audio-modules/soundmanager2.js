/*!
 * Beatstream SoundManager2 module
 */

define(
    ['jquery', 'soundmanager2'],
    function ($) {

        function AudioModule(events_in) {
            this.song = null;
            this.events = events;
            this.volume = 0;
            this.isReady = false;
            this.startDefer = null;

            events_in = events_in || {};

            var events = $.extend({
                onPlay : function () {},
                onPaused : function () {},
                onSongEnd : function () {},
                onTimeChange : function (elapsed_in_seconds) {},
                onDurationParsed : function (duration_in_seconds) {},
                onError : function () {}
            }, events_in);
        }


        AudioModule.prototype.start = function () {
            var defer = $.Deferred();

            soundManager.setup({
                url: '/swf/',
                useFlashBlock: true, // optionally, enable when you're ready to dive in
                useHTML5Audio: true,
                useHighPerformance: true,
                noSWFCache: true,
                onready: function() {
                    soundManagerIsReady = true;
                    defer.resolve();
                },
                ontimeout: function (status) {
                    console.log(status);
                    var loaded = soundManager.getMoviePercent();
                    defer.reject();
                }
            });

            setTimeout(function () {
                defer.reject();
            }, 1500);

            this.startDefer = defer;

            return defer;
        };


        AudioModule.prototype.setVolume = function (volume) {
            this.volume = volume;

            if (this.song === null) return;
            this.song.setVolume(volume);
        };


        AudioModule.prototype.play = function (uri) {
            if (!soundManagerIsReady) {
                alert('SoundManager 2 is not ready to play music yet!');
                return;
            }

            if (this.song !== null) {
                this.song.destruct();
            }
            var song = soundManager.createSound('mySound', uri);

            var self = this;
            soundManager.play('mySound', {
                volume: self.volume,

                // register events
                onplay: function () {
                    self.events.onPlay();
                },
                onresume: function () {
                    self.events.onPlay();
                },
                onpause: function () {
                    self.events.onPaused();
                },
                onfinish: function () {
                    self.events.onSongEnd();
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

            this.song = song;
        };

        AudioModule.prototype.togglePause = function () {
            if (this.song === null) return;

            this.song.togglePause();
        };

        AudioModule.prototype.stop = function () {
            if (this.song === null) return;

            this.song.stop();
        };

        AudioModule.prototype.seekTo = function (seconds) {
            if (this.song === null) return;

            this.song.setPosition(seconds * 1000);
        };


        // reveal the module
        return AudioModule;
    }
);
