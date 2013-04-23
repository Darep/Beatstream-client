require([
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

    var resizer, api, audio, lastfm, usermenu, songlist, sidebar,
        player, playlistManager, login, preloader, options;

    options = {
        apiUrl: '/api/v1/'
    };

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
});
