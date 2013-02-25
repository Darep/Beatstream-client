define([
    'store',
    'beatstream/player',
    'beatstream/mediator',
    'beatstream/audio-modules/sm2audio'
], function(store, Player, mediator, SM2Audio) {
    describe('Player', function () {

        var audio = {};

        var song = {
            id: 0,
            artist: 'Foreigner',
            title: 'Urgent',
            length: 4*60+30,
            path: '/Foreigner/Foreigner - Urgent.mp3',
            nice_title: 'Foreigner - Urgent'
        };

        var song2 = {
            id: 1,
            artist: 'Foreigner',
            title: 'I\'m gonna win',
            length: 4*60+51,
            path: '/Foreigner/Foreigner - Im gonna win.mp3',
            nice_title: 'Foreigner - Im gonna win'
        };

        var song3 = {
            id: 2,
            artist: 'Foreigner',
            title: 'Woman in Black',
            length: 4*60+42,
            path: '/Foreigner/Foreigner - Woman in Black.mp3',
            nice_title: 'Foreigner - Woman in Black'
        };

        var playlist = [song, song2, song3];

        // SUT
        var player;

        beforeEach(function () {
            mediator.clear();
            store.clear();

            loadFixtures('player.html');

            audio = {
                play: jasmine.createSpy(),
                togglePause: jasmine.createSpy(),
                seekTo: jasmine.createSpy(),
                pause: jasmine.createSpy(),
                events: {
                    onFinish: function () {},
                    onDurationParsed: function (duration) {},
                    onTimeChange: function (elapsed) {},
                    onError: function () {}
                }
            };

            player = new Player('.app-now-playing', audio);
            player.setPlaylist(playlist);
        });

        it('should accept an audio module', function () {
            expect(player.audio).toBe(audio);
        });

        it('should initiate an audio module if one is not given', function () {
            player = new Player('.app-now-playing');

            // Then
            expect(player.audio).not.toBe(undefined || null);
        });

        it('should return null/undefined if no song is playing', function () {
            expect(player.currentSongId).toBeFalsy();
            expect(player.currentSongId).not.toBe(0);
        });

        it('should accept a playlist', function () {
            // When
            player.setPlaylist(playlist);

            // Then
            expect(player.playlist).toBe(playlist);
        });

        it('should emit a mediator event when starting to play a song', function () {
            var done = false;
            var mediator_spy = jasmine.createSpy().andCallFake(function () {
                done = true;
            });
            mediator.subscribe("player:songStarted", mediator_spy);

            // When
            player.playSong(song);

            waitsFor(function () {
                return done;
            }, "Mediator event for song start", 1000);

            // Then
            runs(function () {
                expect(mediator_spy).toHaveBeenCalled();
                expect(mediator_spy.mostRecentCall.args[0]).toBe(song);
            });
        });

        it('should emit a mediator event when song\'s time changes', function () {
            player.playSongWithId(0);

            var done = false;
            var mediator_spy = jasmine.createSpy().andCallFake(function () {
                done = true;
            });
            mediator.subscribe("player:timeChanged", mediator_spy);

            // When
            audio.events.onTimeChange(20);

            waitsFor(function () {
                return done;
            }, "Mediator event about song time change", 1000);

            // Then
            runs(function () {
                expect(mediator_spy).toHaveBeenCalled();
                expect(mediator_spy.mostRecentCall.args[0]).toBe(20);
            });
        });

        it('should move to next song on audio playback error', function () {
            player.playSongWithId(0);

            // When
            audio.events.onError();

            // Then
            expect(audio.play).toHaveBeenCalledWith(playlist[1].path);
        });

        it('should stop audio playback after two errors under 2 secs', function () {
            audio.events.onError();

            var timer = setTimeout(function () {
                audio.events.onError();
                clearTimeout(timer);
                timer = null;
            }, 500);

            waitsFor(function () {
                return timer == null;
            }, "Second error test callback never fired", 700);

            // Then
            runs(function () {
                expect(audio.pause).toHaveBeenCalled();
            });
        });

        it('should not stop audio playback if errors are over 2 secs apart', function () {
            audio.events.onError();

            var timer = setTimeout(function () {
                audio.events.onError();
                clearTimeout(timer);
                timer = null;
            }, 2050);

            waitsFor(function () {
                return timer == null;
            }, "Second error test callback never fired", 2200);

            runs(function () {
                expect(audio.pause).not.toHaveBeenCalled();
            });
        });

        describe("Now playing info", function() {
            it('should display track info on playback start', function () {
                // When
                player.playSongWithId(0);

                // Then
                expect($('#player-song .track')).toHaveText(song.nice_title);
            });

            it('should display new track info on next', function() {
                player.playSongWithId(0);

                // When
                player.playNext();

                // Then
                expect($('#player-song .track')).toHaveText(song2.nice_title);
            });

            it('should display new track info on previous', function() {
                player.playSongWithId(1);

                // When
                player.playPrevious();

                // Then
                expect($('#player-song .track')).toHaveText(song.nice_title);
            });

            it('should emit mediator event on current song double-click', function () {
                var done = false;
                var mediator_spy = jasmine.createSpy().andCallFake(function () {
                    done = true;
                });

                mediator.subscribe("playlist:showPlaylistAndSong", mediator_spy);
                player.playSongWithId(0);

                // When
                $('#player-song').dblclick();

                waitsFor(function () {
                    return done;
                }, "Mediator event to show playlist and song", 1000);

                // Then
                runs(function () {
                    expect(mediator_spy).toHaveBeenCalled();
                    expect(mediator_spy.mostRecentCall.args[0][0]).toBe(playlist);
                    expect(mediator_spy.mostRecentCall.args[0][1]).toBe(song);
                });
            });

            it('should display song duration info when song starts playing', function() {
                player.playSongWithId(0);

                // Then
                expect($('#player-time .duration')).toHaveText('04:30');
            });

            it('should not update song duration info if no song is playing', function () {
                audio.events.onDurationParsed(4*60+31);

                // Then
                expect($('#player-time .duration')).toHaveText('00:00');
            });

            it('should update song duration info when song\'s duration has been parsed', function() {
                player.playSongWithId(0);
                audio.events.onDurationParsed(4*60+31);

                // Then
                expect($('#player-time .duration')).toHaveText('04:31');
            });

            it('should reset elapsed time when song starts playing', function () {
                $('#player-time .elapsed').text('00:10');

                // When
                player.playSongWithId(0);

                // Then
                expect($('#player-time .elapsed')).toHaveText('00:00');
            });

            it('should update elapsed time when song\'s time changes', function () {
                player.playSongWithId(0);
                audio.events.onTimeChange(10);

                // Then
                expect($('#player-time .elapsed')).toHaveText('00:10');
            });

            it('should not update elapsed time when no song is playing', function () {
                $('#player-time .elapsed').text('00:00');
                audio.events.onTimeChange(10);

                // Then
                expect($('#player-time .elapsed')).toHaveText('00:00');
            });
        });

        describe('Playback history', function () {
            it('should add a playing song to playback history when shuffle is on', function () {
                player.setShuffle(true);
                player.playSongWithId(0);

                expect(player.playbackHistory.pop()).toBe(song);
            });

            it('should empty playback history when playing a new song and shuffle is off', function () {
                player.setShuffle(false);
                player.playbackHistory.length = 4;
                expect(player.playbackHistory.length).toBe(4);

                // When
                player.shuffle = false;
                player.playSongWithId(0);

                // Then
                expect(player.playbackHistory.length).toBe(0);
            });

            xit('should change state to isPlaying when audio module starts playing', function () {
                throw('not done');
            });
        });

        describe('Play', function () {
            it('should play a song', function () {
                // When
                player.playSong(song);

                // Then
                expect(audio.play).toHaveBeenCalledWith(song.path);
            });

            it('should play a song from the playlist', function () {
                player.playSongWithId(0);

                expect(audio.play).toHaveBeenCalledWith(song.path);
            });

            it('should start playing first song on playlist on click', function () {
                // When
                $('#play-pause').click();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[0].path);
                expect($('#play-pause')).toHaveClass('playing');
            });

            it('should pause song on click when playing song', function () {
                player.isPaused = false;
                player.currentSongId = 0;
                $('#play-pause').addClass('playing');

                // When
                $('#play-pause').click();

                // Then
                expect(audio.togglePause).toHaveBeenCalled();
                expect(player.isPaused).toBe(true);
                expect($('#play-pause')).not.toHaveClass('playing');
            });

            it('should resume song on click when song is paused', function () {
                player.isPaused = true;
                player.currentSongId = 0;

                // When
                $('#play-pause').click();

                // Then
                expect(audio.togglePause).toHaveBeenCalled();
                expect(player.isPaused).toBe(false);
                expect($('#play-pause')).toHaveClass('playing');
            });
        });

        describe('Previous', function () {
            it('should play last song on playlist on "previous" when no song is playing', function () {
                // Given
                player.currentSongId = undefined;

                // When
                player.playPrevious();

                // Then
                expect(audio.play).toHaveBeenCalledWith(song3.path);
            });

            it('should play last song on playlist on "previous" if current song is first on playlist', function () {
                // Given
                player.currentSongId = 0;

                // When
                player.playPrevious();

                // Then
                expect(audio.play).toHaveBeenCalledWith(song3.path);
            });

            it('should play previously played song from history on "previous" when shuffle is on', function () {
                // When
                player.shuffle = true;
                player.playSongWithId(0);
                player.playSongWithId(2);
                player.playPrevious();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[0].path);
            });

            it('should play previous song on playlist on "previous" when no playback history', function () {
                // When
                player.playSongWithId(2);
                player.playPrevious();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[1].path);
            });

            it('should play previous song on click', function () {
                // When
                player.playSongWithId(2);
                $('#prev').click();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[1].path);
            });
        });

        describe('Next', function () {
            it('should play first song on playlist on "next" if current song is last on playlist', function () {
                // Given
                player.currentSongId = playlist.length - 1;

                // When
                player.playNext();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[0].path);
            });

            it('should play first song on playlist on "next" when no song is playing', function () {
                // Given
                player.currentSongId = undefined;

                // When
                player.playNext();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[0].path);
            });

            it('should play random song on playlist on "next" when shuffle is on', function () {
                // Given
                player.shuffle = true;

                // When
                player.playNext();

                // Then
                expect(audio.play).toHaveBeenCalled();
            });

            it('should play next song on playlist on "next" when shuffle is off', function () {
                player.shuffle = false;
                player.currentSongId = 0;

                // When
                player.playNext();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[1].path);
            });

            it('should play next song on click', function () {
                player.shuffle = false;
                player.currentSongId = 0;

                // When
                $('#next').click();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[1].path);
            });
        });

        describe("Seekbar", function() {
            xit('should seek song on click on seekbar (jquery ui slider)', function () {
                // When
                $('#seekbar-slider').trigger('slidestart', [{ value: 25 }]);
                $('#seekbar-slider').trigger('slidestop', [{ value: 30 }]);

                // Then
                expect(audio.seekTo).toHaveBeenCalledWith(30);
            });

            it('should set max to song\'s length when song starts playing', function () {
                player.playSongWithId(0);

                // Then
                expect( $('#seekbar-slider').slider('option', 'max') ).toBe(playlist[0].length);
            });

            it('should update max when song\'s duration has been parsed', function () {
                player.playSongWithId(0);
                spyOn(audio.events, 'onDurationParsed').andCallThrough();

                // When
                audio.events.onDurationParsed(playlist[0].length + 1);

                // Then
                expect( $('#seekbar-slider').slider('option', 'max') ).toBe(playlist[0].length + 1);
            });

            it('should move when playing song time changes', function () {
                var value = $('#seekbar-slider').slider('value');
                spyOn(audio.events, 'onTimeChange').andCallThrough();
                player.playSongWithId(0);

                // When
                audio.events.onTimeChange(10);

                // Then
                expect( $('#seekbar-slider').slider('value') ).toBe(10);
            });
        });

        describe('Auto-advance', function () {
            it('should advance to next song automatically', function () {
                player.currentSongId = 0;
                spyOn(audio.events, 'onFinish').andCallThrough();

                // When
                audio.events.onFinish();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[1].path);
            });

            it('should go to first song on playlist after last song when repeat is on', function () {
                player.setRepeat(true);
                player.currentSongId = 2;
                spyOn(audio.events, 'onFinish').andCallThrough();

                // When
                audio.events.onFinish();

                // Then
                expect(audio.play).toHaveBeenCalledWith(playlist[0].path);
            });

            it('should not go to first song on playlist after last song when repeat is off', function () {
                player.setRepeat(false);
                player.currentSongId = 2;
                spyOn(audio.events, 'onFinish').andCallThrough();

                // When
                audio.events.onFinish();

                // Then
                expect(audio.play).not.toHaveBeenCalled();
            });

            it('should pause audio after last song when repeat is off', function () {
                player.repeat = false;
                player.currentSongId = 2;
                spyOn(audio.events, 'onFinish').andCallThrough();

                // When
                audio.events.onFinish();

                // Then
                expect(audio.pause).toHaveBeenCalled();
            });
        });
    });
});
