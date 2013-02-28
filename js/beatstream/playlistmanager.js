define([
    'beatstream/mediator',
    'beatstream/playlistview'
],
function (mediator) {

    function PlaylistManager(api) {
        this.playlists = {};
        this.api = api;
    }

    PlaylistManager.prototype.add = function (name, data) {
        this.playlists[name] = data;
    };

    PlaylistManager.prototype.getByName = function (name) {
        var playlist = this.playlists[name];
        return playlist;
    };

    PlaylistManager.prototype.load = function (name, callback) {
        var self = this;
        var req = this.api.getPlaylist(name);
        req.success(function (data) {
            self.add(name, data);

            if (callback) {
                var playlist = self.getByName(name);
                callback(playlist);
            }
        });
    };

    PlaylistManager.prototype.getAllMusic = function() {
        var req = this.api.getAllMusic();

        req.done(function (data) {
            mediator.publish('playlists:allMusic', data);
        });

        return req;
    };

    PlaylistManager.prototype.getPlaylist = function () {
        return req;
    };

    return PlaylistManager;
});
