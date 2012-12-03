/*!
 * Main - The God particle
 * Wires all the stuff together and does some stuff too
 */

define(
    [
        'jquery',
        'beatstream/mediator',
        'beatstream/api',
        'beatstream/audio-modules/soundmanager2',
        'beatstream/lastfm',
        'beatstream/playlists',
        'beatstream/top-panel',
        'beatstream/songlist',
        'beatstream/sidebar',
        'beatstream/player',
        'beatstream/login',
        'beatstream/views/preloader',

        'helpers/helpers',
        'pathjs',
        'soundmanager2'
    ],
    function ($, mediator, Api, SM2Audio, LastFM, Playlists, TopPanel, Songlist, Sidebar, Player, Login, preloaderView) {

        var App = {
            init: function (options_in) {

                var api, audio, lastfm, top, songlist, sidebar, player, login, options;

                options = $.extend({
                    apiUrl: '/api/v1/'
                }, options_in);


                // resize the main-area to correct height
                var resizeMain = function () {
                    var h = $(window).height() - $('.app-top').outerHeight(true) - $('.app-now-playing').outerHeight(true);
                    var w = $(window).width() - $('.app-nav').outerWidth(true);
                    $('#app > .wrapper').css('height', h);

                    var h2 = h - $('.page-header').innerHeight();
                    $('.grid-container').css('height', h2);

                    if (songlist) {
                        songlist.resizeCanvas();
                    }
                };
                $(window).resize(function () { resizeMain(); });
                resizeMain();

                // initiate the modules
                api       = new Api(options.apiUrl);
                audio     = new SM2Audio(api);
                playlists = new Playlists(api);
                login     = new Login();
                lastfm    = new LastFM(api);
                top       = new TopPanel('.app-top');
                songlist  = new Songlist('#slickgrid', this.songlistEvents);
                sidebar   = new Sidebar('.app-nav', this.sidebarEvents);
                player    = new Player('.app-now-playing');

                startPreload( audio.start(), playlists.getAllMusic() );
            },
            songlistEvents: {
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
            },
            sidebarEvents: {
                onOpenAllMusic: function () {
                    openAllMusic();
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
            }
        };


        var startPreload = function (audioStart, playlistLoad) {
            $.when(audioStart, playlistLoad).done(function (audioResult, openMusicResult) {
                console.log('start: success!');
                preloaderView.hide();
            });

            audioStart.fail(function () {
                preloaderView.showError('no-flash');

                // Hide the error if the audio can be started later on
                mediator.Subscribe("audio:ready", function () {
                    preloaderView.hideError('no-flash');

                    // unsubscribe
                    mediator.Remove("audio:ready", this);
                });
            });

            playlistLoad.fail(function () {
                preloaderView.showError('playlist-error');
            });
        };


        return App;
    }
);
