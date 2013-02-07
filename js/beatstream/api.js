define(['jquery', 'beatstream/mediator'],
function ($, mediator) {
    // static base URL, shared by all the APIs (why?)
    var baseUrl = '';

    var Api = function (apiBaseUrl) {
        if (apiBaseUrl) {
            baseUrl = apiBaseUrl;
        }
    };


    Api.prototype.logIn = function (username, password) {
        return $.ajax({
            type: 'POST',
            url: baseUrl + '/auth',
            data: { username: username, password: password },
            errorHandler: errorHandler
        });
    };


    Api.prototype.getAllMusic = function () {
        return $.ajax({
            url: baseUrl + '/songs',
            dataType: 'json',
            error: errorHandler
        });
    };


    Api.prototype.getPlaylist = function (name) {
        return $.ajax({
            url: baseUrl + '/playlists/' + encodeURIComponent(name),
            dataType: 'json',
            error: errorHandler
        });
    };


    Api.prototype.createPlaylist = function (name) {
        return $.ajax({
            type: 'POST',
            url: baseUrl + '/playlists',
            data: { name: name },
            error: errorHandler
        });
    };


    Api.prototype.addToPlaylist = function (playlist, songs) {
        // TODO: finish this
        return $.ajax({
            type: 'POST',
            url: baseUrl + '/playlists/' + encodeURIComponent(playlist),
            data: songs,
            error: errorHandler
        });
    };


    Api.prototype.setPlaylistSongs = function (playlist, songs) {
        // TODO: finish this
        return $.ajax({
            type: 'PUT',
            url: baseUrl + '/playlists/' + encodeURIComponent(playlist),
            error: errorHandler
        });
    };


    Api.prototype.getSongURI = function (songPath) {
        return baseUrl + '/songs/play/?file=' + encodeURIComponent(songPath);
    };


    Api.prototype.updateNowPlaying = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return $.ajax({
            type: 'PUT',
            url: baseUrl + '/now-playing',
            data: data
        });
    };


    Api.prototype.scrobble = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return $.ajax({
            type: 'POST',
            url: baseUrl + '/scrobble',
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
