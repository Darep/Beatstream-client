define([
    'beatstream/playlistmanager',
    'beatstream/mediator'
], function(PlaylistManager, mediator) {
    describe('PlaylistManager', function () {

        var playlistManager,
            api,
            allMusic = HELPERS_ALL_MUSIC,
            allMusic_alt;

        beforeEach(function () {
            loadFixtures('playlistmanager.html');

            mediator.clear();

            allMusic_alt = jQuery.extend(true, [], allMusic);

            api = {
                baseUrl: '/api/v1',
                getAllMusic: function () {
                    var defer = $.Deferred();
                    defer.resolve(allMusic_alt);
                    return defer;
                },
                getSongURI: function (songPath) {
                    if (songPath.charAt(0) == "/") {
                        songPath = songPath.substr(1);
                    }

                    return this.baseUrl + '/songs/play/?file=' + encodeURIComponent(songPath);
                }
            };

            // SUT
            playlistManager = new PlaylistManager({ el: $('.main-wrap'), api: api });
        });

        it('should use API when getting all music', function () {
            spyOn(api, 'getAllMusic').andCallThrough();

            // When
            playlistManager.getAllMusic();

            // Then
            expect(api.getAllMusic).toHaveBeenCalled();
        });

        it('should get all music', function () {
            var mediator_spy = jasmine.createSpy();
            mediator.subscribe("playlist:setPlaylist", mediator_spy);

            // When
            playlistManager.getAllMusic();

            waitsFor(function () {
                return mediator_spy.wasCalled;
            }, "Mediator event for playlist change", 1000);

            // Then
            runs(function () {
                expect(mediator_spy).toHaveBeenCalled();
                expect(mediator_spy.mostRecentCall.args[0]).toEqual(allMusic_alt);
            });
        });

        it('should return request object when getting all music', function () {
            // When
            var req = playlistManager.getAllMusic();

            // Then
            expect(req).toBeDefined();
        });

        it('should add API path to song paths', function () {
            var mediator_spy = jasmine.createSpy();
            mediator.subscribe("playlist:setPlaylist", mediator_spy);

            // When
            playlistManager.getAllMusic();

            waitsFor(function () {
                return mediator_spy.wasCalled;
            }, "Mediator event for playlist change", 1000);

            // Then
            runs(function () {
                var song = mediator_spy.mostRecentCall.args[0][0];
                expect(song.path).toEqual(api.getSongURI(allMusic[0].path));
            });
        });

        it('should update playlist header after getting all music', function () {
            var mediator_spy = jasmine.createSpy();
            mediator.subscribe("playlist:setPlaylist", mediator_spy);

            // When
            playlistManager.getAllMusic();

            waitsFor(function () {
                return mediator_spy.wasCalled;
            }, "Mediator event for playlist change", 1000);

            // Then
            runs(function () {
                expect( $('.playlist-header .title') ).toHaveText('All music');
                expect( $('.playlist-header .count') ).toHaveText(allMusic.length);
                expect( $('.playlist-header .songs-text') ).toHaveText('songs');
            });
        });

        it('should singularize songs text when playlist has only one song', function () {
            playlistManager.setPlaylist([ allMusic[0] ]);

            // Then
            expect( $('.playlist-header .songs-text') ).toHaveText('song')
        });
    });
});
