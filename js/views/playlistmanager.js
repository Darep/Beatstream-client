define([
    'lib/mediator',
    'lib/api',
    'views/controls/playlistview',
    'views/controls/searchfield',
    'helpers/playlistmanager-helpers'
],
function (mediator, Api, PlaylistView, SearchField) {

    function PlaylistManager() {
        this.el = $('.main-wrap');
        this.currentPlaylist = [];
        this.allMusic = [];

        this.playlistView = new PlaylistView('#slickgrid');
        this.searchField = new SearchField(this.el.find('.search'));

        // Enterprisey Bussy
        mediator.subscribe('app:resize', this.playlistView.resizeCanvas.bind(this.playlistView));
        mediator.subscribe('playlist:showPlaylistAndSong', this.showPlaylistAndSong.bind(this));
        mediator.subscribe('player:songStarted', this.setCurrentSong.bind(this));
        mediator.subscribe('medialibrary:refresh', this.setAllMusic.bind(this));

        // Playlist View events
        this.playlistView.events.onSongSelect = function (song) {
            // this.setCurrentPlaylist( this.playlistView.getCurrentPlaylist() );
            // mediator.publish('playlist:setPlaylist', this.currentPlaylist);
            mediator.publish('playlist:setSong', song);
        }.bind(this);

        // Search field events
        this.searchField.events.onSearch = function (searchString) {
            this.playlistView.updateFilter(searchString);
        }.bind(this);
    }

    PlaylistManager.prototype.setAllMusic = function(data) {
        var transformPath = Api.getSongURI.bind(Api);

        this.allMusic = data.songs.map(function (song) {
            song.path = transformPath(song);
            return song;
        });

        mediator.publish('playlist:allMusic', this.allMusic);

        this.setCurrentPlaylist(this.allMusic);
        this.updateHeader('All music', this.allMusic.length);
    };

    PlaylistManager.prototype.getAllMusic = function() {
        var _this = this;

        return Api.getAllMusic().done(function (data) {
            _this.setAllMusic(data);
        });
    };

    PlaylistManager.prototype.setCurrentPlaylist = function (playlist) {
        this.currentPlaylist = playlist;

        this.playlistView.setItems(playlist);

        // TODO: update playlist header here!

        mediator.publish('playlist:setPlaylist', playlist);
    };

    PlaylistManager.prototype.updateHeader = function (name, songCount) {
        // update playlist header data
        if (songCount === undefined) {
            songCount = 0;
        }

        var prettyCount = commify( parseInt(songCount, 10) ),
            header = this.el.find('.playlist-header');

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
