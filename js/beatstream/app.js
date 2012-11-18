/*!
 * Main - The God particle
 * Wires all the stuff together and does some stuff too
 */

define(
    [
        'jquery',
        'beatstream/mediator',
        'beatstream/api',
        'beatstream/sidebar',
        'beatstream/audio-modules/soundmanager2',
        'beatstream/songlist',
        'beatstream/lastfm',
        'beatstream/playlists',
        'beatstream/now-playing',
        'beatstream/views/preloader',

        'helpers/helpers',
        'soundmanager2',
        'jquery-ui'
    ],
    function ($, mediator, api, Sidebar, SM2Audio, Songlist, LastFM, Playlists, NowPlaying, preloaderView) {

        var App = {
            init: function (options_in) {

                var songlist, audio, error_counter = 0;

                var options = $.extend({
                    apiUrl: '/'
                }, options_in);


                // initialize the API
                api.init(options.apiUrl);


                // start preload
                audio = new SM2Audio();
                startPreload(audio.start(), openInitialPlaylist(), audio);


                // resize the main-area to correct height
                resizeMain();
                $(window).resize(function () { resizeMain(); });

                function resizeMain() {
                    var h = $(window).height() - $('.app-top').outerHeight(true) - $('.app-now-playing').outerHeight(true);
                    var w = $(window).width() - $('.app-nav').outerWidth(true);
                    $('#app > .wrapper').css('height', h);

                    var h2 = h - $('.page-header').innerHeight();
                    $('.grid-container').css('height', h2);

                    if (songlist) {
                        songlist.resizeCanvas();
                    }
                }


                // Event hooks
                // TODO: move these to modules or move all the :ibes from modules here
                mediator.Subscribe("songlist:selectSong", function (song) {
                    LastFM.newSong(song);
                });

                mediator.Subscribe("songlist:listEnd", function () {
                    audio.stop();
                    songlist.resetPlaying();
                });

                mediator.Subscribe("audio:timeChange", function (elaps) {
                    // try to scrobble
                    // won't scrobble if we should not scrobble
                    LastFM.tryScrobble();

                    // TODO: maybe we should use setTimeout instead?
                    //       create a timer when song starts to play, erase old timer
                });

                mediator.Subscribe("audio:songEnd", function () {
                    songlist.nextSong(NowPlaying.getShuffle(), NowPlaying.getRepeat());
                });

                mediator.Subscribe("audio:error", function () {
                    if (error_counter > 2) {
                        audio.pause();
                        error_counter = 0;
                        return;
                    }
                    songlist.nextSong(getShuffle(), getRepeat());
                    error_counter = error_counter + 1;
                });

                mediator.Subscribe("buttons:seek", function (value) {
                    audio.seekTo(value);
                });

                mediator.Subscribe("buttons:togglePause", function () {
                    // if not playing anything, start playing the first song on the playlist
                    if (!songlist.isPlaying()) {
                        songlist.nextSong(getShuffle(), getRepeat());
                        return;
                    }

                    audio.togglePause();
                });

                mediator.Subscribe("buttons:nextSong", function (shuffle, repeat) {
                    songlist.nextSong(shuffle, repeat, true);
                });

                mediator.Subscribe("buttons:prevSong", function () {
                    songlist.prevSong();
                });

                mediator.Subscribe("buttons:showNowPlaying", function () {
                    songlist.scrollNowPlayingIntoView();
                });

                mediator.Subscribe("buttons:setVolume", function (volume) {
                    console.log(volume);
                    audio.setVolume(volume);
                });

                // initiali volume for audio
                audio.setVolume(NowPlaying.getVolume());


                // initialize songlist
                songlist = new Songlist({
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
                });


                // initialize the sidebar
                var sidebar = new Sidebar({
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
                });


                // functions
                function openPlaylist(name, data) {
                    songlist.loadPlaylist(data);
                    updatePlaylistHeader(name, data.length);
                }


                function openInitialPlaylist() {
                    // TODO: open the current playlist when launching
                    return openAllMusic();
                }

                function openAllMusic() {
                    var req = api.getAllMusic();

                    req.done(function (data) {
                        openPlaylist('All music', data);

                        // update "All music" song count on sidebar
                        var count = commify( parseInt( data.length, 10 ) );
                        $('.medialibrary.count').text(count);
                    });

                    return req;
                }


                function updatePlaylistHeader(name, songCount) {
                    // update playlist header data
                    if (songCount === undefined) {
                        songCount = 0;
                    }

                    var prettyCount = commify( parseInt( songCount, 10 ) );
                    $('.page-header .count').text(prettyCount);
                    $('.page-header.text').html( pluralize(songCount, 'song', 'songs') );
                    $('.page-header .info h2').html(name);
                }
            }
        };


        var showLogin = function () {
            var login = $('.login');
            login.show();
        };


        var startPreload = function (audioStart, playlistLoad, audio) {

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
