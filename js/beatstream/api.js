
define(
    ['jquery'],
    function ($) {

        var baseUrl = '';

        var Api = {
            init: function (apiBaseUrl) {
                if (apiBaseUrl) {
                    baseUrl = apiBaseUrl;
                }
            },

            getSongURI: function (songPath) {
                return baseUrl + '/songs/play/?file=' + encodeURIComponent(songPath);
            },

            getAllMusic: function () {
                return $.ajax({
                    url: baseUrl + '/songs',
                    dataType: 'json'
                });
            },

            getPlaylist: function (name) {
                return $.ajax({
                    url: baseUrl + '/playlists/' + encodeURIComponent(name),
                    dataType: 'json'
                });
            },

            createPlaylist: function (name) {
                return $.ajax({
                    type: 'POST',
                    url: baseUrl + '/playlists',
                    data: { name: name }
                });
            },

            addToPlaylist: function (playlist, songs) {
                // TODO: finish this
                return $.ajax({
                    type: 'POST',
                    url: baseUrl + '/playlists/' + encodeURIComponent(playlist),
                    data: songs
                });
            },

            setPlaylistSongs: function (playlist, songs) {
                // TODO: finish this
                return $.ajax({
                    type: 'PUT',
                    url: baseUrl + '/playlists/' + encodeURIComponent(playlist)
                });
            }
        };

        return Api;
    }
);
