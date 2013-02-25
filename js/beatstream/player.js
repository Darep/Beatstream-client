define([
    'jquery',
    'store',
    'beatstream/mediator',
    'beatstream/audio-modules/sm2audio',
    'jquery-ui'
], function ($, store, mediator, SM2Audio) {

    var DEFAULT_VOLUME = 20;

    var Player = function (selector, audio) {
        this.el = $(selector);
        this.playbackHistory = [];
        this.playlist = undefined;
        this.currentSongId = undefined;
        this.isPaused = false;
        this.shuffle = false;
        this.repeat = false;

        if (audio) {
            this.audio = audio;
        } else {
            this.audio = new SM2Audio();
        }

        // Get states from store.js

        this.shuffle = getFromStore('shuffle');
        this.repeat = getFromStore('repeat');

        // Create Playback Controls

        this.playButton = this.el.find('#play-pause');
        this.playButton.click(function (e) {
            e.preventDefault();

            if (!this.isPlaying()) {
                // if not yet playing anything, start playing
                this.playNext();
            } else {
                this.audio.togglePause();
            }

            this.isPaused = !this.isPaused;

            this.playButton.toggleClass('playing');
        }.bind(this));

        this.prevButton = this.el.find('#prev');
        this.prevButton.click(function (e) {
            e.preventDefault();
            this.playPrevious();
        }.bind(this));

        this.nextButton = this.el.find('#next');
        this.nextButton.click(function (e) {
            e.preventDefault();
            this.playNext();
        }.bind(this));

        this.shuffleButton = this.el.find('#shuffle');
        this.shuffleButton.click(function (e) {
            e.preventDefault();
            this.shuffle = !this.shuffle;
        }.bind(this));

        this.repeatButton = this.el.find('#repeat');
        this.repeatButton.click(function (e) {
            e.preventDefault();
            this.repeat = !this.repeat;
        }.bind(this));

        this.isSeeking = false;
        this.seekbar = this.el.find('#seekbar-slider');
        this.seekbar.slider({
            orientation: 'horizontal',
            disabled: true,
            value: 0,
            max: 100,
            min: 0,
            range: 'min',
            start: function(event, ui) {
                this.isSeeking = true;
            }.bind(this),
            stop: function(event, ui) {
                this.audio.seekTo(ui.value);
                this.isSeeking = false;
            }.bind(this)
        });

        this.volumeLabel = this.el.find('#volume-label');
        this.volumeSlider = this.el.find('#volume-slider');
        this.volumeSlider.slider({
            orientation: 'horizontal',
            max: 100,
            min: 0,
            range: 'min',
            slide: function (event, ui) {
                this.audio.setVolume(ui.value);
                this.volumeLabel.attr('title', ui.value);
            }.bind(this),
            stop: function (event, ui) {
                store.set('volume', ui.value);
            }
        });

        // Playback info controls
        this.trackInfo = this.el.find('#player-song .track');
        this.elapsedTime = this.el.find('#player-time .elapsed');
        this.duration = this.el.find('#player-time .duration');

        // set initial volume
        var volume = getFromStore(volume);
        if (!volume) {
            volume = DEFAULT_VOLUME;
        }
        this.volumeSlider.slider('option', 'value', volume);

        // Audio Events

        this.audio.events.onFinish = function () {
            if (isLastIndex(this.playlist, this.currentSongId) && !this.repeat) {
                return;
            }

            this.playNext();
        }.bind(this);

        this.audio.events.onDurationParsed = function (duration) {
            if (!this.isPlaying()) {
                return;
            }

            this.seekbar.slider('option', 'max', duration);
            this.seekbar.slider('option', 'disabled', false);
            this.duration.text(secondsToNiceTime(duration));
        }.bind(this);

        this.audio.events.onTimeChange = function (elapsed) {
            if (!this.isPlaying()) {
                return;
            }

            if (!this.isSeeking) {
                this.seekbar.slider('option', 'value', elapsed);
            }

            this.elapsedTime.text(secondsToNiceTime(elapsed));

            mediator.publish("player:timeChanged", elapsed);
        }.bind(this);

        var errorResetCountdown = null;
        this.audio.events.onError = function (onError) {
            if (errorResetCountdown !== null) {
                // timer set and we got another error, time to do something
                audio.pause();
                return;
            } else {
                // Set a countdown
                errorResetCountdown = setTimeout(function () {
                    clearTimeout(errorResetCountdown);
                    errorResetCountdown = null;
                }, 2000);

                this.playNext();
            }
        }.bind(this);

        // Enterprise Bus events
        mediator.subscribe("playlist:setPlaylist", this.setPlaylist.bind(this));
    };

    Player.prototype.setPlaylist = function (playlist) {
        this.playlist = playlist;
    };

    Player.prototype.playSongWithId = function(id) {
        var song = this.playlist[id];

        if (!song) {
            console.error('Player: no song with id: "' + id + '" found in playlist');
        }

        this.playSong(song);
    };

    Player.prototype.playSong = function(song) {
        this.audio.play(song.path);
        this.currentSongId = this.playlist.indexOf(song);
        this.isPaused = false;

        if (this.shuffle) {
            this.playbackHistory.push(song);
        } else {
            // clear the array, because we don't need playback history when not shuffling
            this.playbackHistory.length = 0;
        }

        // set widgets to display song info (title, duration, etc.)
        this.trackInfo.text(song.nice_title);
        this.duration.text(secondsToNiceTime(song.length));
        this.elapsedTime.text(secondsToNiceTime(0));
        this.seekbar.slider('option', 'max', song.length);

        mediator.publish("player:songStarted", song);
    };

    Player.prototype.playPrevious = function() {
        var songId;

        if (this.shuffle) {
            if (this.playbackHistory.length > 1) {
                // play from playback history

                // remove current song from playback history
                this.playbackHistory.pop();

                var song = this.playbackHistory.pop();
                songId = this.playlist.indexOf(song);
            } else {
                songId = randomToN(this.playlist.length - 1);
            }
        } else {
            if (!this.isPlaying() || (this.currentSongId - 1) < 0) {
                // play last song on playlist
                songId = this.playlist.length - 1;
            } else {
                // play previous from playlist
                songId = this.currentSongId - 1;
            }
        }

        this.playSongWithId(songId);
    };

    Player.prototype.playNext = function () {
        var songId;

        if (this.shuffle) {
            songId = randomToN(this.playlist.length - 1);
        } else {
            if (!this.isPlaying() || isLastIndex(this.playlist, this.currentSongId)) {
                // play first song on playlist
                songId = 0;
            } else {
                // play next on playlist
                songId = this.currentSongId + 1;
            }
        }

        this.playSongWithId(songId);
    };

    Player.prototype.isPlaying = function () {
        return (this.currentSongId !== undefined);
    };


    // Private:

    // function to get random number from 1 to n
    function randomToN(maxVal,floatVal) {
       var randVal = Math.random()*maxVal;
       return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
    }

    function getFromStore(key) {
        if (key && store.get(key)) {
            return store.get(key);
        } else {
            return false;
        }
    }

    function isLastIndex(array, index) {
        return (index + 1) === array.length;
    }

    function secondsToNiceTime(seconds) {
        var mins = Math.floor(seconds/60, 10),
            secs = seconds - mins*60;

        return ((mins > 9 ? mins : '0' + mins) + ':' + (secs > 9 ? secs : '0' + secs));
    }

    return Player;
});
