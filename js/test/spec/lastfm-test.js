/**
 * Test the very simple LastFM API wrapper.
 *
 * The LastFM wrapper talks to the Beatstream backend, which does the actual
 * talking with LastFM using the user's authentication information.
 */
define(['beatstream/lastfm', 'beatstream/mediator'], function(LastFM, mediator) {
    describe('LastFM', function () {

        // stubs
        var api = {};
        var promise = {};
        var success_spy;
        var error_spy;

        // SUT
        var lastfm = new LastFM(api);

        beforeEach(function () {
            success_spy = jasmine.createSpy().andCallFake(function (callback) { callback(); });
            error_spy = jasmine.createSpy();

            promise = createPromise(success_spy, error_spy);

            api.scrobble = jasmine.createSpy().andReturn(promise);
            api.updateNowPlaying = jasmine.createSpy().andReturn(promise);
        });

        describe('Scrobbling', function () {
            it('should not scrobble songs under 30 seconds', function () {
                // Given
                var song = {
                    length: 29
                };

                // When
                lastfm.newSong(song);

                // Then
                expect(lastfm.dont_scrobble).toBe(true);
                expect(api.scrobble).not.toHaveBeenCalled();
                expect(api.updateNowPlaying).not.toHaveBeenCalled();
            });

            it('should not scrobble prematurely', function () {
                var song = {
                    length: 40
                };

                // Given
                lastfm.newSong(song);

                // When
                lastfm.tryScrobble(19);

                // Then
                expect(api.scrobble).not.toHaveBeenCalled();
            });

            it('should scrobble when it is time', function () {
                var song = {
                    length: 40
                };

                // Given
                lastfm.newSong(song);

                // When
                lastfm.tryScrobble(21);

                // Then
                expect(api.scrobble).toHaveBeenCalled();
            });

            it('should make sure scrobbling was successful', function () {
                var song = {
                    length: 40
                };

                // Given
                lastfm.newSong(song);

                // When
                lastfm.tryScrobble(21);

                // Then
                expect(api.scrobble).toHaveBeenCalled();
                expect(success_spy).toHaveBeenCalled();
                expect(lastfm.song_scrobbled).toBe(true);
            });

            it('should not scrobble song twice', function () {
                var song = {
                    length: 40
                };

                // Given
                lastfm.newSong(song);

                // When
                lastfm.tryScrobble(21);
                lastfm.tryScrobble(21);
                lastfm.tryScrobble(22);
                lastfm.tryScrobble(23);

                // Then
                expect(lastfm.song_scrobbled).toBe(true);
                expect(api.scrobble).toHaveBeenCalled();
                expect(api.scrobble.callCount).toBe(1);
            });

            it('should scrobble based on event from the mediator', function () {
                var song = {
                    length: 40
                };

                // When
                lastfm.newSong(song);
                lastfm.tryScrobble(21);

                // Then
                expect(api.scrobble).toHaveBeenCalled();
            });

            it('should scrobble using the correct data', function () {
                var song = {
                    artist: 'Miami Sound Machine',
                    title: 'Dr. Beat',
                    length: 180
                };

                // Given
                lastfm.newSong(song);

                // When
                lastfm.tryScrobble(91);

                // Then
                expect(api.scrobble).toHaveBeenCalledWith(song.artist, song.title);
            });
        });

        describe('Now Playing', function () {
            it('should update now playing using the API on new song', function () {
                var song = {
                    artist: 'Miami Sound Machine',
                    title: 'Dr. Beat',
                    length: 180
                };

                // When
                lastfm.newSong(song);

                // Then
                expect(api.updateNowPlaying).toHaveBeenCalledWith(song.artist, song.title);
            });
        });

        describe('Slow tests', function () {
            it('should retry in 5 seconds after failure', function () {
                var song = {
                    length: 40
                };

                // Setup a very observant API stub/mock
                var success_spy = jasmine.createSpy().andCallFake(function (callback) {
                    if (api.scrobble.callCount == 2) {
                        callback();  // yay! SUT got a fail/error atleast once, so we can now say you succeed
                    }
                });
                var error_spy = jasmine.createSpy().andCallFake(function (callback) {
                    if (api.scrobble.callCount <= 1) { // API call fails the first time
                        callback();  // tell the client we failed
                    }
                });
                var promise = createPromise(success_spy, error_spy);
                api.scrobble = jasmine.createSpy().andReturn(promise);

                // When
                lastfm.newSong(song);
                lastfm.tryScrobble(21);

                waitsFor(function () {
                    // wait for the SUT to try atleast twice
                    return api.scrobble.callCount == 2;
                }, "LastFM never called again. What a bitch", 5000);

                runs(function () {
                    // Then
                    expect(api.scrobble).toHaveBeenCalled();
                    expect(error_spy).toHaveBeenCalled();
                    expect(success_spy).toHaveBeenCalled();
                    expect(lastfm.song_scrobbled).toBe(true);
                });
            });

            xit('should retry after failed now playing update', function () {
                throw 'test incomplete';
            });
        });
    });
});
