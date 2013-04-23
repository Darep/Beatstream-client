define([
    'beatstream/resizer',
    'beatstream/api',
    'beatstream/lastfm',
    'beatstream/usermenu',
    'beatstream/player',
    'beatstream/playlistmanager',
    'beatstream/preloader',
    'beatstream/sidebar',
    'beatstream/usermenu_listener',

    'helpers/helpers',
    'soundmanager2'
], function (Resizer, Api, LastFM, UserMenu, Player, PlaylistManager, Preloader, Sidebar, UserMenuListener) {

    var App = {
        init: function (options_in) {

            var resizer, api, audio, lastfm, usermenu, songlist, sidebar,
                player, playlistManager, login, preloader, options;

            options = $.extend({
                apiUrl: '/api/v1/'
            }, options_in);

            api = new Api({ url: options.apiUrl });

            // Check if we are authenticated
            var req = api.getProfile({ cache: true });

            req.fail(function () {
                // FIXME: show a login dialog and use API to log in
                window.location = '/login';
            });

            req.success(function (profile) {
                usermenu  = new UserMenu({ el: $('#user-menu'), name: profile.username });
                usermenu_listener = new UserMenuListener();
                player    = new Player({ el: $('.app-now-playing') });
                playlistManager = new PlaylistManager({ el: $('.main-wrap'), api: api });
                sidebar = new Sidebar({ el: $('.app-nav') });

                resizer   = new Resizer();
                lastfm    = new LastFM({ api: api });

                resizer.resize();

                // Start preloading
                preloader = new Preloader({
                    el: $('.preloader'),
                    audioPromise: player.start(),
                    medialibraryPromise: playlistManager.getAllMusic()
                });
            });
        }
    };

    return App;
});
