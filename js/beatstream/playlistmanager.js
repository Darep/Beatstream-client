define([
    'beatstream/mediator',
    'beatstream/playlistview'
],
function (mediator) {

    function PlaylistManager(api) {
        this.api = api;
    }

    PlaylistManager.prototype.getAllMusic = function() {
        var req = this.api.getAllMusic();

        req.done(function (data) {
            for (var i = data.length - 1; i >= 0; i--) {
                data[i].path = this.api.getSongURI(data[i].path);
                console.log(data[i].path);
            }
            mediator.publish('playlist:setPlaylist', data);
        }.bind(this));

        return req;
    };

    return PlaylistManager;
});
