/**
 * Test the very simple LastFM API wrapper.
 *
 * The LastFM wrapper talks to the Beatstream backend, which does the actual
 * talking with the LastFM server.
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
                expect(lastfm.song_scrobbled).toBe(true);
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

            it('should retry in 5 seconds after failure', function () {
                var song = {
                    length: 40
                };

                var success_spy = jasmine.createSpy().andCallFake(function (callback) {
                    if (error_spy.wasCalled) callback();
                });
                var error_spy = jasmine.createSpy().andCallFake(function (callback) {
                    if (error_spy.callCount < 2) callback();
                });
                var promise = createPromise(success_spy, error_spy);
                api.scrobble = jasmine.createSpy().andReturn(promise);

                // When
                lastfm.newSong(song);
                lastfm.tryScrobble(21);

                waitsFor(function () {
                    return success_spy.callCount >= 2;
                }, "LastFM never called success again", 5000);

                runs(function () {
                    // Then
                    expect(api.scrobble).toHaveBeenCalled();
                    expect(error_spy).toHaveBeenCalled();
                    expect(success_spy).toHaveBeenCalled();
                    expect(lastfm.song_scrobbled).toBe(true);
                });
            });

            xit('should scrobble using the correct data', function () {
                var song = {
                    artist: 'Miami Sound Machine',
                    title: 'Dr. Beat'
                };

                // Given
                lastfm.newSong(song);

                // When

                // Then


                throw 'test incomplete';
            });
        });

        describe('Now Playing', function () {
            xit('should update now playing using the API', function () {
                throw 'test incomplete';
            });

            xit('should retry after failed scrobble', function () {
                throw 'test incomplete';
            });

            xit('should retry after failed now playing update', function () {
                throw 'test incomplete';
            });
        });
    });
});
