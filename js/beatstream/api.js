
define(
    ['jquery', 'beatstream/mediator'],
    function ($, mediator) {

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


        function errorHandler(req, textStatus, errorThrown) {
            console.log('Api AJAX error:');
            console.log(req);
            var self = this;
            if (req.status === 401) {
                mediator.publish('error:noAuth');
            }
        }


        return Api;
    }
);
