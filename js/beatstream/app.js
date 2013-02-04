/**
 * Beatstream App, the God particle
 * Wires all the stuff together and does some stuff too
 */
define([
    'jquery',
    'beatstream/mediator',
    'beatstream/resizer',
    'beatstream/api',
    'beatstream/audio-modules/soundmanager2',
    'beatstream/lastfm',
    'beatstream/playlists',
    'beatstream/usermenu',
    'beatstream/songlist',
    'beatstream/sidebar',
    'beatstream/player',
    'beatstream/views/preloader',

    'helpers/helpers',
    'pathjs',
    'soundmanager2'
], function ($, mediator, Resizer, Api, SM2Audio, LastFM, Playlists, TopPanel, Songlist, Sidebar, Player, preloaderView) {

    var songlistEvents = {
        onDragStart: function (e, dd) {
            var song_count = dd.draggedSongs.length;

            DragTooltip.show(dd.startX, dd.startY, song_count + ' song');

            if (song_count != 1) {
                DragTooltip.append('s');
            }

            // make playlists hilight
            $('#sidebar .playlists li').addClass('targeted');
        },
        onDrag: function (e, dd) {
            DragTooltip.update(e.clientX, e.clientY);

            var drop_target = $(document.elementFromPoint(e.clientX, e.clientY));

            if (drop_target === undefined ||
                (drop_target.parent().hasClass('playlists') === false &&
                 drop_target.parent().parent().hasClass('playlists') === false))
            {
                // these are not the drops you are looking for
                $('#sidebar .playlists li').removeClass('hover');
                return;
            }

            $('#sidebar .playlists li').removeClass('hover');
            drop_target.parent().addClass('hover');
        },
        onDragEnd: function (e, dd) {
            DragTooltip.hide();

            $('#sidebar .playlists li').removeClass('targeted').removeClass('hover');

            var drop_target = $(document.elementFromPoint(e.clientX, e.clientY));

            if (drop_target === undefined ||
                (drop_target.parent().hasClass('playlists') === false &&
                 drop_target.parent().parent().hasClass('playlists') === false))
            {
                // these are not the drops you are looking for
                console.log('these are not the drops you are looking for');
                return;
            }

            if ( drop_target.is('a.name') === false ) {
                // still wrong drop target
                return;
            }

            // TODO: add dragged things into playlist (if things can be added)

            var name = drop_target.text();
            var playlist = Playlists.getByName(name);

            // load the playlist if it has not been loaded yet
            if (playlist === undefined) {

                Playlists.load(name, function (playlist) {
                    if (playlist === undefined) {
                        console.log('whattafaaaak, no such playlist: ' + name);
                    }

                    playlist.push.apply(data, dd.draggedSongs);
                });

            }
            else {
                playlist.push.apply(playlist, dd.draggedSongs);
            }
        }
    };

    var sidebarEvents = {
        onOpenAllMusic: function () {
            // TODO: wut
        },
        onOpenPlaylist: function (listName) {
            var playlist = Playlists.getByName(listName);

            if (playlist === undefined) {
                Playlists.load(listName, function (data) {
                    openPlaylist(listName, data);
                });
                return;
            }

            openPlaylist(listName, playlist);
        }
    };

    var App = {
        init: function (options_in) {

            var resizer, api, audio, lastfm, top, songlist, sidebar, player,
                login, options;

            options = $.extend({
                apiUrl: '/api/v1/'
            }, options_in);


            // initiate all the modules!
            songlist  = new Songlist('#slickgrid', songlistEvents);
            top       = new TopPanel('.app-top');
            sidebar   = new Sidebar('.app-nav', sidebarEvents);
            player    = new Player('.app-now-playing');
            api       = new Api(options.apiUrl);
            playlists = new Playlists(api);
            audio     = new SM2Audio(api);
            resizer   = new Resizer(songlist);
            lastfm    = new LastFM(api);

            resizer.resize();

            this.startPreload( audio.start(), playlists.getAllMusic() );
        },
        startPreload: function (audioStart, playlistLoad) {
            $.when(audioStart, playlistLoad).done(function (audioResult, openMusicResult) {
                console.log('start: success!');
                preloaderView.hide();
            });

            audioStart.fail(function () {
                preloaderView.showError('no-flash');

                // Hide the error if the audio can be started later on
                mediator.subscribe("audio:ready", function () {
                    preloaderView.hideError('no-flash');

                    // unsubscribe
                    mediator.Remove("audio:ready", this);
                });
            });

            playlistLoad.fail(function () {
                preloaderView.showError('playlist-error');
            });
        }
    };

    return App;
});
