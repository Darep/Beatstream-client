define([
    'beatstream/mediator',
    'beatstream/playlistview'
],
function (mediator, PlaylistView) {

    function PlaylistManager(selector, api) {
        this.el = $(selector);
        this.api = api;
        this.currentPlaylist = [];

        this.playlistView = new PlaylistView();

        // Enterprisey Bussy
        mediator.subscribe('playlist:showPlaylistAndSong', this.showPlaylistAndSong.bind(this));
        mediator.subscribe('player:songStarted', this.setCurrentSong.bind(this));

        mediator.subscribe('app:resize', function () {
            this.playlistView.resizeCanvas();
        }.bind(this));

        // Playlist View Events
        this.playlistView.events.onSongSelect = function (song) {
            // this.setPlaylist(this.playlistView.getPlaylist());
            mediator.publish('player:playSong', song);
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
        this.currentPlaylist = playlist;
        this.playlistView.setPlaylist(playlist);
        mediator.publish('playlist:setPlaylist', playlist);
    };

    PlaylistManager.prototype.showPlaylistAndSong = function (playlist, song) {
        // TODO: set playlistView's playlist to "playlist",
        //       update "now playing" to "song",
        //       move playlistView to show "song"

        this.playlistView.searchString = '';
        this.playlistView.setPlaylist(playlist);
        //this.playlistView.setNowPlaying(song);
        this.playlistView.showRow(row);

        // this.playlistView
    };

    PlaylistManager.prototype.setCurrentSong = function (song) {
        // TODO: update "now playing" on PlaylistView
    };

    return PlaylistManager;
});
