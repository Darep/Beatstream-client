define([
    'beatstream/mediator',
    'beatstream/controls/playlistview',
    'beatstream/controls/searchfield'
],
function (mediator, PlaylistView, SearchField) {

    function PlaylistManager(args) {
        this.el = args.el;
        this.api = args.api;
        this.currentPlaylist = [];

        this.playlistView = new PlaylistView('#slickgrid');
        this.searchField = new SearchField(this.el.find('.search'));

        // Enterprisey Bussy
        mediator.subscribe('app:resize', this.playlistView.resizeCanvas.bind(this.playlistView));
        mediator.subscribe('playlist:showPlaylistAndSong', this.showPlaylistAndSong.bind(this));
        mediator.subscribe('player:songStarted', this.setCurrentSong.bind(this));

        // Playlist View events
        this.playlistView.events.onSongSelect = function (song) {
            // this.setPlaylist( this.playlistView.getCurrentPlaylist() );
            // mediator.publish('playlist:setPlaylist', this.currentPlaylist);
            mediator.publish('playlist:setSong', song);
        }.bind(this);

        // Search field events
        this.searchField.events.onSearch = function (searchString) {
            this.playlistView.updateFilter(searchString);
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
        this.playlistView.setItems(playlist);
        mediator.publish('playlist:setPlaylist', playlist);
    };

    PlaylistManager.prototype.showPlaylistAndSong = function (playlist, song) {
        // TODO: set playlistView's items to show current playlist in player,
        //       update "now playing" on the newly set list to "song",
        //       move playlistView so "song" is visible

        //this.playlistView.searchString = '';
        //this.playlistView.setItems(playlist);
        //this.playlistView.setNowPlayingById(song.id);
        this.playlistView.showRowById(song.id);
    };

    PlaylistManager.prototype.setCurrentSong = function (song, wasUserAction) {
        this.playlistView.setNowPlayingById(song.id);

        if (wasUserAction) {
            this.playlistView.showRowById(song.id);
        }
    };

    return PlaylistManager;
});
