define([
    'beatstream/playlistview'
], function(PlaylistView) {
    describe('PlaylistView', function () {

        var playlistView,
            allMusic = HELPERS_ALL_MUSIC;

        beforeEach(function () {
            loadFixtures('playlistview.html');

            // SUT
            playlistView = new PlaylistView();
        });

        it('should callback on double-click', function () {

        });
    });
});
