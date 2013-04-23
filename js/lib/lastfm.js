define([
    'lib/mediator'
],
function (mediator) {

    var DEFAULT_SCROBBLE_TIME = 4*60;  // default 4 min scrobble time
    var RETRY_TIME = 4000;

    var LastFM = function (args) {
        this.api = args.api;
        this.song = null;
        this.scrobble_time = DEFAULT_SCROBBLE_TIME;
        this.song_scrobbled = false;
        this.dont_scrobble = false;

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
            this.dont_scrobble = true;
            return;
        }

        // always scrobble at the 4 minute mark
        if (this.scrobble_time > DEFAULT_SCROBBLE_TIME) {
            this.scrobble_time = DEFAULT_SCROBBLE_TIME;
        }

        // get ready to scrobble!
        this.song_scrobbled = false;
        this.dont_scrobble = false;
        this.updateNowPlaying(song);
    };

    LastFM.prototype.tryScrobble = function (elaps, force) {
        if (force && force === true) {
            // do nothing.
        } else if (this.song_scrobbled || this.dont_scrobble ||
            elaps < this.scrobble_time || !this.song)
        {
            return;
        }

        var req = this.api.scrobble(this.song.artist, this.song.title);
        this.song_scrobbled = true;

        req.done(function () {
            // do nothing.
        });

        req.fail(function () {
            // failed. spring out a new thread, and re-try later
            setTimeout(function () {
                this.tryScrobble(elaps, true);
            }.bind(this), RETRY_TIME);
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
