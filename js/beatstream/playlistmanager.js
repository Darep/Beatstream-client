define([
    'beatstream/mediator',
    'beatstream/playlistview'
],
function (mediator, PlaylistView) {

    function PlaylistManager(selector, api) {
        this.el = $(selector);
        this.api = api;

        this.playlistView = new PlaylistView();

        // Playlist View Events
        this.playlistView.events.onDblClick = function  () {

        }.bind(this);
    }

    PlaylistManager.prototype.getAllMusic = function() {
        var req = this.api.getAllMusic();

        req.done(function (data) {

            // Fix song paths
            for (var i = data.length - 1; i >= 0; i--) {
                data[i].path = this.api.getSongURI(data[i].path);
            }

            mediator.publish('playlist:setPlaylist', data);
        }.bind(this));

        return req;
    };

    return PlaylistManager;
});
