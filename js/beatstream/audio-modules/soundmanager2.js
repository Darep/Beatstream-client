/*!
 * Beatstream SoundManager2 module
 */

define(
    ['jquery', 'beatstream/mediator', 'soundmanager2'],
    function ($, mediator) {

        function AudioModule(api) {
            var errorCounter = 0;

            this.song = null;
            this.volume = 0;
            this.isReady = false;
            this.startDefer = null;

            var self = this;


            // events from other modules
            mediator.subscribe("songlist:selectSong", function (song) {
                var url = api.getSongURI(song.path);
                self.play(url);
            });

            mediator.subscribe("songlist:listEnd", function () {
                self.stop();
            });

            mediator.subscribe("audio:error", function () {
                if (errorCounter > 2) {
                    pause();
                    errorCounter = 0;
                    return;
                }
                else {
                    errorCounter = errorCounter + 1;
                }
            });

            mediator.subscribe("buttons:togglePause", function () {
                self.togglePause();
            });

            mediator.subscribe("buttons:seek", function (value) {
                self.seekTo(value);
            });

            mediator.subscribe("buttons:setVolume", function (volume) {
                self.setVolume(volume);
            });
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
            var defer = $.Deferred();
            var self = this;

            soundManager.setup({
                url: '/swf/',
                useFlashBlock: true, // optionally, enable when you're ready to dive in
                useHTML5Audio: true,
                useHighPerformance: true,
                noSWFCache: true,
                onready: function() {
                    self.isReady = true;
                    mediator.publish("audio:ready");
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


        AudioModule.prototype.setVolume = function(volume) {
            this.volume = volume;

            if (this.song !== null) {
                this.song.setVolume(volume);
            }
            else {
                // do nothing, no song currently playing
            }
        };


        AudioModule.prototype.play = function(uri) {
            if (!this.isReady) {
                alert('SoundManager 2 is not ready to play music yet!');
                return;
            }

            if (this.song !== null) {
                this.song.destruct();
            }
            console.log(uri);
            var song = soundManager.createSound('mySound', uri);

            var self = this;
            soundManager.play('mySound', {
                volume: self.volume,

                // register events
                onplay: function () {
                    mediator.publish("audio:play");
                },
                onresume: function () {
                    mediator.publish("audio:play");
                },
                onpause: function () {
                    mediator.publish("audio:pause");
                },
                onfinish: function () {
                    mediator.publish("audio:songEnd");
                },
                onload: function (success) {
                    var duration_in_seconds = parseInt(song.duration / 1000, 10);
                    mediator.publish("audio:parseDuration", duration_in_seconds);
                },
                whileplaying: function () {
                    var elapsed_in_seconds = parseInt(song.position / 1000, 10);
                    mediator.publish("audio:timeChange", elapsed_in_seconds);
                }
            });

            this.song = song;
        };


        // reveal the module
        return AudioModule;
    }
);
