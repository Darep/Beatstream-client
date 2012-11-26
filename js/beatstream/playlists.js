define(
    ['beatstream/mediator'],
    function (mediator) {

        function Playlists(api) {
            this.playlists = {};
            this.api = api;
        }

        Playlists.prototype.add = function (name, data) {
            this.playlists[name] = data;
        };

        Playlists.prototype.getByName = function (name) {
            var playlist = this.playlists[name];
            return playlist;
        };

        Playlists.prototype.load = function (name, callback) {
            var self = this;
            var req = this.api.getPlaylist(name);
            req.success(function (data) {
                self.add(name, data);

                if (callback) {
                    var playlist = self.getByName(name);
                    callback(playlist);
                }
            });
        };

        Playlists.prototype.getAllMusic = function() {
            var req = this.api.getAllMusic();

            req.done(function (data) {
                mediator.Publish('playlists:allMusic', data);
            });

            return req;
        };

        Playlists.prototype.getPlaylist = function () {
            return req;
        };

        return Playlists;
    }
);
