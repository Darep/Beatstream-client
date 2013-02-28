define(['jquery', 'beatstream/mediator'],
function ($, mediator) {

    var Api = function (apiBaseUrl) {
        this.baseUrl = apiBaseUrl || "";

        // Remove trailing "/"
        if (this.baseUrl.charAt(this.baseUrl.length - 1) == "/") {
            this.baseUrl = this.baseUrl.slice(0, -1);
        }
    };


    Api.prototype.logIn = function (username, password) {
        return $.ajax({
            type: 'POST',
            url: this.baseUrl + '/auth',
            data: { username: username, password: password },
            errorHandler: errorHandler
        });
    };


    Api.prototype.getAllMusic = function () {
        return $.ajax({
            url: this.baseUrl + '/songs',
            dataType: 'json',
            error: errorHandler
        });
    };


    Api.prototype.getPlaylist = function (name) {
        return $.ajax({
            url: this.baseUrl + '/playlists/' + encodeURIComponent(name),
            dataType: 'json',
            error: errorHandler
        });
    };


    Api.prototype.createPlaylist = function (name) {
        return $.ajax({
            type: 'POST',
            url: this.baseUrl + '/playlists',
            data: { name: name },
            error: errorHandler
        });
    };


    Api.prototype.addToPlaylist = function (playlist, songs) {
        // TODO: finish this
        return $.ajax({
            type: 'POST',
            url: this.baseUrl + '/playlists/' + encodeURIComponent(playlist),
            data: songs,
            error: errorHandler
        });
    };


    Api.prototype.setPlaylistSongs = function (playlist, songs) {
        // TODO: finish this
        return $.ajax({
            type: 'PUT',
            url: this.baseUrl + '/playlists/' + encodeURIComponent(playlist),
            error: errorHandler
        });
    };


    Api.prototype.getSongURI = function (songPath) {
        // Remove leading "/"
        if (songPath.charAt(0) == "/") {
            songPath = songPath.substr(1);
        }

        return this.baseUrl + '/songs/play/?file=' + encodeURIComponent(songPath);
    };


    Api.prototype.updateNowPlaying = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return $.ajax({
            type: 'PUT',
            url: this.baseUrl + '/now-playing',
            data: data
        });
    };


    Api.prototype.scrobble = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return $.ajax({
            type: 'POST',
            url: this.baseUrl + '/scrobble',
            data: data
        });
    };


    function errorHandler(req, textStatus, errorThrown) {
        console.log('Api AJAX error:');
        console.log(req);
        var self = this;
        if (req.status === 401) {
            // TODO: can we do this without using the mediator?
            mediator.publish('error:noAuth');
        }
    }

    return Api;
});
