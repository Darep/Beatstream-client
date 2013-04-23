define([
    'beatstream/mediator'
],
function (mediator) {

    var Api = function (args) {
        this.baseUrl = args.url || "";
        this.cache = {};

        // Remove trailing "/"
        if (this.baseUrl.charAt(this.baseUrl.length - 1) == "/") {
            this.baseUrl = this.baseUrl.slice(0, -1);
        }
    };

    Api.prototype.getProfile = function (opts) {
        var self = this;

        if (self.cache.hasOwnProperty('getProfile')) {
            return self.cache['getProfile'];
        } else {
            var req = $.ajax({
                type: 'GET',
                url: this.baseUrl + '/profile',
                dataType: 'json',
                errorHandler: errorHandler
            });

            req.success(function (data) {
                if (opts.cache) {
                    self.cache['getProfile'] = data;
                }
            });

            return req;
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


    Api.prototype.getSongURI = function (path) {
        var result;

        // Remove leading "/"
        if (path.charAt(0) == "/") {
            path = path.substr(1);
        }

        result = this.baseUrl + '/songs/play/?file=' + encodeURIComponent(path);
        return result;
    };


    // LastFM API:

    Api.prototype.updateNowPlaying = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return $.ajax({
            type: 'PUT',
            url: this.baseUrl + '/now-playing',
            dataType: 'text',
            data: data
        });
    };


    Api.prototype.scrobble = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return $.ajax({
            type: 'POST',
            url: this.baseUrl + '/scrobble',
            dataType: 'text',
            data: data
        });
    };


    // Private:

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
