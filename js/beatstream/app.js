/*!
 * Main - The God particle
 * Wires all the stuff together and does some stuff too
 */

define(
    [
        'jquery',
        'store',
        'beatstream/api',
        'beatstream/sidebar',
        'beatstream/audio-modules/soundmanager2',
        'beatstream/songlist',
        'beatstream/lastfm',
        'beatstream/playlists',
        'beatstream/views/preloader',

        'helpers/helpers',
        'soundmanager2',
        'jquery-ui'
    ],
    function ($, store, api, Sidebar, SM2Audio, Songlist, LastFM, Playlists, preloaderView) {

        var App = {
            init: function (options_in) {

                var songlist, audio, error_counter = 0;

                var options = $.extend({
                    apiUrl: '/'
                }, options_in);


                audio = new SM2Audio();
                startPreload(audio.start(), openInitialPlaylist(), audio);

                // TODO: use jQuery bind() and trigger() if we need more than one event handler
                audio.setOnPlay(function () {
                    playPause.addClass('playing');
                });

                audio.setOnPaused(function () {
                    playPause.removeClass('playing');
                });

                audio.setOnSongEnd(function () {
                    songlist.nextSong(getShuffle(), getRepeat());
                });

                audio.setOnTimeChange(function (elaps) {
                    elapsedTimeChanged(elaps);

                    if (!user_is_seeking) {
                        seekbar.slider('option', 'value', elaps);
                    }
                });

                audio.setOnDurationParsed(function (duration_in_seconds) {
                    durationChanged(duration_in_seconds);
                    seekbar.slider('option', 'disabled', false);
                });

                audio.setOnError(function () {
                    if (error_counter > 2) {
                        audio.pause();
                        error_counter = 0;
                        return;
                    }
                    songlist.nextSong(getShuffle(), getRepeat());
                    error_counter = error_counter + 1;
                });

                return false;


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


                // ::: INIT STUFF :::
                songlist = new Songlist({
                    onPlay: function (song) {
                        audio.play(api.getSongURI(song.path));
                        playerTrack.text(song.nice_title);
                        LastFM.newSong(song);
                    },
                    onStop: function () {
                        audio.stop();
                        songlist.resetPlaying();

                        // TODO: hide now playing icon from slickgrid

                        elapsedTimeChanged(0);
                        durationChanged(0);
                        seekbar.slider('value', 0);
                        seekbar.slider('option', 'disabled', true);
                        playerTrack.text('None');
                    },
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

                // player buttons
                var playerTrack = $('#player-song .track');
                var playPause = $('#play-pause');
                var prevButton = $('#prev');
                var nextButton = $('#next');
                var elapsed = $('#player-time .elapsed');
                var duration = $('#player-time .duration');
                var volume_label = $('#player-volume-label');
                var seekbar = $('#seekbar-slider');

                // init sidebar
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


                // volume slider
                var volume = 20;

                if (store.get('volume')) {
                    volume = parseFloat(store.get('volume'));
                }

                if (volume >= 0 && volume <= 100) {
                    audio.setVolume(volume);
                    volume_label.attr('title', volume);
                }

                $('#player-volume-slider').slider({
                    orientation: 'horizontal',
                    value: volume,
                    max: 100,
                    min: 0,
                    range: 'min',
                    slide: function (event, ui) {
                        audio.setVolume(ui.value);
                        volume_label.attr('title', ui.value);
                    },
                    stop: function (event, ui) {
                        store.set('volume', ui.value);
                    }
                });

                // seekbar
                var user_is_seeking = false;
                seekbar.slider({
                    orientation: 'horizontal',
                    disabled: true,
                    value: 0,
                    max: 100,
                    min: 0,
                    range: 'min',
                    slide: function (event, ui) {

                    },
                    start: function(event, ui) {
                        user_is_seeking = true;
                    },
                    stop: function(event, ui) {
                        audio.seekTo(ui.value);
                        user_is_seeking = false;
                    }
                });

                // playback buttons
                playPause.click(function (e) {
                    e.preventDefault();

                    // if not playing anything, start playing the first song on the playlist
                    if (!songlist.isPlaying()) {
                        songlist.nextSong(getShuffle(), getRepeat());
                        return;
                    }

                    audio.togglePause();
                });

                nextButton.click(function (e) {
                    e.preventDefault();
                    songlist.nextSong(getShuffle(), getRepeat(), true);
                });

                prevButton.click(function (e) {
                    e.preventDefault();
                    songlist.prevSong();
                });

                playerTrack.dblclick(function (e) {
                    e.preventDefault();

                    songlist.scrollNowPlayingIntoView();
                });


                // enable buttons
                $('#player-buttons button').removeAttr('disabled');

                // repeat & shuffle buttons

                var repeatButton = $('#repeat');
                var shuffleButton = $('#shuffle');
                var shuffle = false;
                var repeat = false;

                function newToggleButton(button, key, value) {
                    if (store.get(key)) {
                        value = store.get(key);
                    }

                    if (value) {
                        button.addClass('enabled');
                    }

                    button.click(function (e) {
                        e.preventDefault();

                        value = !value;
                        store.set(key, value);

                        $(this).toggleClass('enabled');
                    });
                }
                newToggleButton(repeatButton, 'repeat', repeat);
                newToggleButton(shuffleButton, 'shuffle', shuffle);

                function storeGet(key) {
                    if (key && store.get(key)) {
                        return store.get(key);
                    }

                    return false;
                }

                function getShuffle() {
                    return storeGet('shuffle');
                }

                function getRepeat() {
                    return storeGet('repeat');
                }

                function durationChanged(dur) {
                    var mins = Math.floor(dur/60, 10),
                        secs = dur - mins*60;

                    duration.text((mins > 9 ? mins : '0' + mins) + ':' + (secs > 9 ? secs : '0' + secs));

                    seekbar.slider('option', 'max', dur);
                }

                function elapsedTimeChanged(elaps) {
                    var mins = Math.floor(elaps/60, 10),
                        secs = elaps - mins*60;

                    elapsed.text((mins > 9 ? mins : '0' + mins) + ':' + (secs > 9 ? secs : '0' + secs));

                    LastFM.scrobble(elaps);
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
                audio.ready(function () {
                    preloaderView.hideError('no-flash');
                });
            });

            playlistLoad.fail(function () {
                preloaderView.showError('playlist-error');
            });

        };


        return App;
    }
);
