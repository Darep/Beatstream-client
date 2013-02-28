define([
    'beatstream/playlistmanager',
    'beatstream/mediator'
], function(PlaylistManager, mediator) {
    describe('PlaylistManager', function () {

        var playlistManager,
            api,
            allMusic,
            allMusic_alt;

        allMusic = [
            {
                id: 0,
                artist: 'Foreigner',
                title: 'Urgent',
                length: 4*60+30 + 0.225,
                path: 'Foreigner/Foreigner - Urgent.mp3',
                nice_title: 'Foreigner - Urgent'
            },
            {
                id: 1,
                artist: 'Foreigner',
                title: 'I\'m gonna win',
                length: 4*60+51,
                path: '/Foreigner/Foreigner - Im gonna win.mp3',
                nice_title: 'Foreigner - Im gonna win'
            }
        ];

        beforeEach(function () {
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
            playlistManager = new PlaylistManager('.main-wrap', api);
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
    });
});
