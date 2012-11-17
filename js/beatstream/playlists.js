/*
 * NOTE! This module might seem super dumb and not-needed, but I had plans to
 * add some localStorage optimization to this stuff and so on. Playlists can
 * be really heavy on the memory.
 */

define(
    ['beatstream/api'],
    function (Api) {

        var playlists = {};

        var Playlists = {
            add: function (name, data) {
                playlists[name] = data;
            },

            getByName: function (name) {
                var playlist = playlists[name];
                return playlist;
            },

            load: function (name, callback) {

                var self = this;

                var req = Api.getPlaylist(name);
                req.success(function (data) {
                    self.add(name, data);

                    if (callback) {
                        var playlist = self.getByName(name);
                        callback(playlist);
                    }
                });
            }
        };
        return Playlists;
    }
);
