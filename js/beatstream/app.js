/**
 * Beatstream App, the God particle
 * Wires all the stuff together and does some stuff too
 */
define([
    'jquery',
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
], function ($, mediator, Resizer, Api, LastFM, UserMenu, Player, PlaylistManager, Preloader) {

    var App = {
        init: function (options_in) {

            var resizer, api, audio, lastfm, usermenu, songlist, sidebar,
                player, playlistManager, login, preloader, options;

            options = $.extend({
                apiUrl: '/api/v1/'
            }, options_in);

            // initiate all the modules!
            api       = new Api(options.apiUrl);
            usermenu  = new UserMenu('#user-menu', 'John');
            player    = new Player('.app-now-playing');
            resizer   = new Resizer(songlist);
            lastfm    = new LastFM(api);
            playlistManager = new PlaylistManager(api);

            resizer.resize();

            // Start preloading
            preloader = new Preloader('.preloader', player.start(), playlistManager.getAllMusic());
        }
    };

    return App;
});
