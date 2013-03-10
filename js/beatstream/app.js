define([
    'beatstream/mediator',
    'beatstream/resizer',
    'beatstream/api',
    'beatstream/lastfm',
    'beatstream/usermenu',
    'beatstream/player',
    'beatstream/playlistmanager',
    'beatstream/preloader',

    'helpers/helpers',
    'pathjs',
    'soundmanager2'
], function (mediator, Resizer, Api, LastFM, UserMenu, Player, PlaylistManager, Preloader) {

    var App = {
        init: function (options_in) {

            var resizer, api, audio, lastfm, usermenu, songlist, sidebar,
                player, playlistManager, login, preloader, options;

            options = $.extend({
                apiUrl: '/api/v1/'
            }, options_in);

            // initiate all the modules!
            api       = new Api({ url: options.apiUrl });
            usermenu  = new UserMenu({ el: $('#user-menu'), name: 'John' });
            player    = new Player({ el: $('.app-now-playing') });
            playlistManager = new PlaylistManager({ el: $('.main-wrap'), api: api });
            resizer   = new Resizer();
            lastfm    = new LastFM({ api: api });

            resizer.resize();

            // Start preloading
            preloader = new Preloader({
                el: $('.preloader'),
                audioPromise: player.start(),
                medialibraryPromise: playlistManager.getAllMusic()
            });
        }
    };

    return App;
});
