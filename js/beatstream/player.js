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

            if (this.currentSongId === undefined) {
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
            // clear the array, because we don't need playback history when not
            // shuffling
            this.playbackHistory.length = 0;
        }

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
            if (this.currentSongId === undefined || (this.currentSongId - 1) < 0) {
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
            if (this.currentSongId === undefined || (this.currentSongId + 1) === this.playlist.length) {
                // play first song on playlist
                songId = 0;
            } else {
                // play next on playlist
                songId = this.currentSongId + 1;
            }
        }

        this.playSongWithId(songId);
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

    return Player;
});
