define([
    'jquery',
    'store',
    'beatstream/mediator',
    'beatstream/audio-modules/sm2audio',
    'jquery-ui'
],
function ($, store, mediator, SM2Audio) {

    var DEFAULT_VOLUME = 20;

    var Player = function (selector, api, audio) {
        this.api = api;
        this.playbackHistory = [];
        this.currentSong = undefined;

        if (!audio) {
            this.audio = new SM2Audio();
        } else {
            this.audio = audio;
        }
    };

    Player.prototype.playSong = function(song) {
        var uri = this.api.getSongURI(song.path);
        this.audio.play(uri);

        this.currentSong = song;
        this.playbackHistory.push(song);

        mediator.publish("player:songStarted", song);
    };

    Player.prototype.playPrevious = function() {
        // remove current song from playback history
        this.playbackHistory.pop();

        var song = this.playbackHistory.pop();
        this.playSong(song);
    };

    return Player;
});
