define([
    'beatstream/player',
    'beatstream/mediator',
    'beatstream/audio-modules/sm2audio'
], function(Player, mediator, SM2Audio) {
    describe('Player', function () {

        var api = {
            getSongURI: function (path) {
                return '/api/play?file=' + path;
            }
        };
        var audio = {};
        var song = {
            artist: 'Foreigner',
            title: 'Urgent',
            length: 4*60+30,
            path: '/Foreigner/Foreigner - Urgent.mp3',
            nice_title: 'Foreigner - Urgent'
        };
        var song2 = {
            artist: 'Foreigner',
            title: 'I\'m gonna win',
            length: 4*60+51,
            path: '/Foreigner/Foreigner - Im gonna win.mp3',
            nice_title: 'Foreigner - Im gonna win'
        };

        // SUT
        var player;

        beforeEach(function () {
            mediator.clear();

            audio = {
                play: jasmine.createSpy()
            };

            player = new Player('.app-now-playing', api, audio);
        });

        it('should accept an audio module', function () {
            expect(player.audio).toBe(audio);
        });

        it('should initiate an audio module if one is not given', function () {
            player = new Player('.app-now-playing', api);

            // Then
            expect(player.audio).not.toBe(undefined || null);
        });

        it('should start playing a song', function () {
            var url = api.getSongURI(song.path);
            player.playSong(song);

            expect(audio.play).toHaveBeenCalledWith(url);
        });

        it('should emit a mediator event when starting to play a song', function () {
            var done = false;
            var foo = {
                mediator_spy: function (song) {
                    done = true;
                }
            };
            spyOn(foo, 'mediator_spy').andCallThrough();
            mediator.subscribe("player:songStarted", foo.mediator_spy);

            // When
            player.playSong(song);

            waitsFor(function () {
                return done;
            }, "", 1000);

            // Then
            runs(function () {
                expect(foo.mediator_spy).toHaveBeenCalled();
            });
        });

        it('should add a playing song to playback history', function () {
            player.playSong(song);

            expect(player.playbackHistory.pop()).toBe(song);
        });

        it('should play song from playback history when clicking previous', function () {
            player.playSong(song);
            player.playSong(song2);

            player.playPrevious();

            expect(player.currentSong).toBe(song);
        });

        xit('should play song from playlback history when clicking previous with shuffle on', function () {

        });

        xit('should start playing a song from mediator', function () {

        });

        xit('should display now playing song artist & title', function () {

        });

        xit('should control playback volume', function () {

        });

        xit('should seek song when moving seekbar', function () {

        });

        xit('should start play current on', function () {

        });

        xit('should play next song when clicking "next"', function () {

        });

    });
});
