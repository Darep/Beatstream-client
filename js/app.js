define([
    'lib/resizer',
    'lib/api',
    'lib/lastfm',
    'lib/usermenu_listener',
    'views/usermenu',
    'views/player',
    'views/playlistmanager',
    'views/preloader',
    'views/sidebar',

    'soundmanager2'
], function (Resizer, Api, LastFM, UserMenuListener, UserMenu, Player, PlaylistManager, Preloader, Sidebar) {

    function App(options) {
        options = $.extend({
            apiBase: '/api/v1/'
        }, options);

        Api.setBaseUrl(options.apiBase);
    }

    App.prototype.start = function () {
        var profile             = Api.getProfile(),
            usermenu            = new UserMenu({ el: $('#user-menu'), name: profile.username }),
            usermenu_listener   = new UserMenuListener(),
            player              = new Player({ el: $('.app-now-playing') }),
            playlistManager     = new PlaylistManager({ el: $('.main-wrap') }),
            sidebar             = new Sidebar({ el: $('.app-nav') }),
            resizer             = new Resizer(),
            lastfm              = new LastFM(),
            preloader;

        resizer.resize();

        // Start preloading
        preloader = new Preloader({
            el: $('.preloader'),
            audioPromise: player.start(),
            medialibraryPromise: playlistManager.getAllMusic()
        });

        return this;
    };

    return App;
});
