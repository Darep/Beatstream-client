define([
    'beatstream/mediator',
    'beatstream/playlistview'
],
function (mediator, PlaylistView) {

    function PlaylistManager(selector, api) {
        this.el = $(selector);
        this.api = api;

        this.playlistView = new PlaylistView();

        // Enterprisey Bussy
        mediator.subscribe('playlist:showPlaylistAndSong', this.showPlaylistAndTrack.bind(this));

        // Playlist View Events
        this.playlistView.events.onSelectSong = function  () {
            // TODO: this
        }.bind(this);
    }

    PlaylistManager.prototype.getAllMusic = function() {
        var req = this.api.getAllMusic();

        req.done(function (data) {

            // Fix song paths
            for (var i = data.length - 1; i >= 0; i--) {
                data[i].path = this.api.getSongURI(data[i].path);
            }

            this.setPlaylist(data);
        }.bind(this));

        return req;
    };

    PlaylistManager.prototype.setPlaylist = function (playlist) {
        this.playlistView.setPlaylist(playlist);
        mediator.publish('playlist:setPlaylist', playlist);
    };

    PlaylistManager.prototype.showPlaylistAndTrack = function (playlist, song) {
        // this.playlistView
    };

    return PlaylistManager;
});
