define(['jquery', 'beatstream/mediator'],
function ($, mediator) {

    var DEFAULT_SCROBBLE_TIME = 4*60;  // default 4 min scrobble time

    var LastFM = function (api) {
        this.api = api;
        this.song = null;
        this.scrobble_time = DEFAULT_SCROBBLE_TIME;
        this.current_song_scrobbled = false;

        // all aboard the enterprise bus!
        mediator.subscribe("player:songStarted", this.newSong.bind(this));
        mediator.subscribe("player:timeChanged", this.tryScrobble.bind(this));
    };

    LastFM.prototype.newSong = function(song) {
        if (!song) return;

        this.song = song;
        this.scrobble_time = Math.floor(song.length/2, 10);

        // don't scrobble songs that are under 30 secs (last.fm rule)
        if (song.length <= 30) {
            // never scrobble and bail!
            this.song_scrobbled = true;
            return;
        }

        // always scrobble at the 4 minute mark
        if (this.scrobble_time > DEFAULT_SCROBBLE_TIME) {
            this.scrobble_time = DEFAULT_SCROBBLE_TIME;
        }

        // get ready to scrobble!
        this.song_scrobbled = false;
        this.updateNowPlaying(song);
    };

    LastFM.prototype.tryScrobble = function (elaps) {
        if (this.song_scrobbled === true || elaps < this.scrobble_time || !this.song) {
            return;
        }

        var req = this.api.scrobble(this.song.artist, this.song.title);

        req.success(function () {
            this.song_scrobbled = true;
        }.bind(this));

        req.error(function () {
            // failed.
            setTimeout(function () {
                this.tryScrobble(elaps);
            }.bind(this), 4000);
        }.bind(this));
    };

    LastFM.prototype.updateNowPlaying = function (song) {
        var req = this.api.updateNowPlaying(song.artist, song.title);

        req.error(function () {
            // TODO: do error recovery
        });
    };

    return LastFM;
});
