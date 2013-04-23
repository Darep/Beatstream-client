define([
    'lib/mediator',
    'views/controls/playlistview',
    'views/controls/searchfield',
    'helpers/playlistmanager-helpers'
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
        return this.api.getAllMusic().done(function (data) {
            var allMusic;

            var transformPath = this.api.getSongURI.bind(this.api);

            allMusic = data.map(function (song) {
                song.path = transformPath(song.path);
                return song;
            });

            this.setPlaylist(allMusic);
        }.bind(this));
    };

    PlaylistManager.prototype.setPlaylist = function (playlist) {
        this.currentPlaylist = playlist;

        this.playlistView.setItems(playlist);
        this.updateHeader('All music', playlist.length);

        mediator.publish('playlist:setPlaylist', playlist);
    };

    PlaylistManager.prototype.updateHeader = function (name, songCount) {
        // update playlist header data
        if (songCount === undefined) {
            songCount = 0;
        }

        var prettyCount = commify( parseInt(songCount, 10) );
        var header = this.el.find('.playlist-header');
        header.find('.title').html(name);
        header.find('.count').text(prettyCount);
        header.find('.songs-text').html( pluralize(songCount, 'song', 'songs') );
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
