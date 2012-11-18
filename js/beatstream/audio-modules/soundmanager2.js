/*!
 * Beatstream SoundManager2 module
 */

define(
    ['jquery', 'beatstream/mediator', 'beatstream/api', 'soundmanager2'],
    function ($, mediator, api) {

        function AudioModule() {
            this.song = null;
            this.volume = 0;
            this.isReady = false;
            this.startDefer = null;

            var self = this;
            mediator.Subscribe("songlist:selectSong", function (song) {
                console.log('aaa');
                var url = api.getSongURI(song.path);
                self.play(url);
            });
        }


        AudioModule.prototype.start = function () {
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
                    mediator.Publish("audio:ready");
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
                    mediator.Publish("audio:play");
                },
                onresume: function () {
                    mediator.Publish("audio:play");
                },
                onpause: function () {
                    mediator.Publish("audio:pause");
                },
                onfinish: function () {
                    mediator.Publish("audio:songEnd");
                },
                onload: function (success) {
                    var duration_in_seconds = parseInt(song.duration / 1000, 10);
                    mediator.Publish("audio:parseDuration", duration_in_seconds);
                },
                whileplaying: function () {
                    var elapsed_in_seconds = parseInt(song.position / 1000, 10);
                    mediator.Publish("audio:timeChange", elapsed_in_seconds);
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
