define([
    'lib/mediator'
],
function (mediator) {

    function Api() {
        this.cache = {};
        this.baseUrl = '';
    }

    Api.prototype.setBaseUrl = function(url) {
        if (!url) {
            // url is not a string or is an empty string
            return;
        }

        // Remove trailing slash, if present
        if (url.charAt(url.length - 1) === '/') {
            url = url.slice(0, -1);
        }

        this.baseUrl = url;
    };


    // ---- User ---------------------------------------------------------------

    Api.prototype.getProfile = function (opts) {
        opts = opts || {};

        if (this.cache.hasOwnProperty('getProfile') && !opts.forceRefresh) {
            return this.cache['getProfile'];
        } else {
            var _this = this,
                req = ajax('/profile');

            req.success(function (data) {
                if (opts.cache) {
                    _this.cache['getProfile'] = data;
                }
            });

            return req;
        }
    };


    Api.prototype.logIn = function (username, password) {
        return ajax('/auth', {
            type: 'POST',
            data: { username: username, password: password }
        });
    };


    // ---- Playlists ----------------------------------------------------------

    Api.prototype.getAllMusic = function () {
        return ajax('/songs');
    };

    Api.prototype.getPlaylist = function (name) {
        return ajax('/playlists/' + encodeURIComponent(name));
    };

    Api.prototype.createPlaylist = function (name) {
        return ajax('/playlists', {
            type: 'POST',
            data: { name: name }
        });
    };

    Api.prototype.addToPlaylist = function (playlist, songs) {
        // TODO: finish this
        return ajax('/playlists/' + encodeURIComponent(playlist), {
            type: 'POST',
            data: songs
        });
    };

    Api.prototype.setPlaylistSongs = function (playlist, songs) {
        // TODO: finish this
        return ajax('/playlists/' + encodeURIComponent(playlist), {
            type: 'PUT'
        });
    };


    // ---- Songs --------------------------------------------------------------

    Api.prototype.getSongURI = function (path) {
        var result;

        // Remove leading "/"
        if (path.charAt(0) == "/") {
            path = path.substr(1);
        }

        result = this.baseUrl + '/songs/play/?file=' + encodeURIComponent(path);
        return result;
    };


    // ---- LastFM -------------------------------------------------------------

    Api.prototype.updateNowPlaying = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return ajax('/now-playing', {
            type: 'PUT',
            dataType: 'text',
            data: data
        });
    };


    Api.prototype.scrobble = function (artist, title) {
        var data = 'artist=' + encodeURIComponent(artist) +
                   '&title=' + encodeURIComponent(title);

        return ajax('/scrobble', {
            type: 'POST',
            dataType: text,
            data: data
        });
    };


    // ---- Media library ------------------------------------------------------


    Api.prototype.refreshMediaLibrary = function () {
        return ajax('/songs', {
            type: 'POST'
        });
    };


    // ---- Helpers ------------------------------------------------------------

    Api.prototype.getURL = function(url) {
        // If it's an absolute URL, return it
        if (url.indexOf('http') === 0) {
            return url;
        }

        return this.baseUrl + url;
    };


    // ---- Init ---------------------------------------------------------------

    var TehApi = new Api();

    function errorHandler(req, textStatus, errorThrown) {
        console.log('Api AJAX error:');
        console.log(req);
        var _this = this;
        if (req.status === 401) {
            // TODO: can we do this without using the mediator?
            mediator.publish('error:noAuth');
        }
    }

    function ajax() {
        var url, args;

        // See if we got just an argument object or an url & arguments
        if (arguments.length === 1) {
          if (typeof arguments[0] === 'string') {
                url = arguments[0];
                args = {};
            } else {
                args = arguments[0];
                url = args.url;
                delete args.url;
            }
        } else if (arguments.length === 2) {
            url = arguments[0];
            args = arguments[1];
        }

        // Default to GET
        if (!args.type) {
            args.type = 'GET';
        }

        // Default to JSON with GET
        if (!args.dataType && args.type === 'GET') {
            args.dataType = 'json';
        }

        // Add a global error handler
        if (!args.errorHandler) {
            args.errorHandler = errorHandler;
        }

        return $.ajax(TehApi.getURL(url), args);
    }

    // Add a convenient shortcut to a general use ajax function
    TehApi.ajax = ajax;

    return TehApi;
});
