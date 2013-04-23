define(['views/preloader'], function(Preloader) {
    describe('Preloader', function () {

        var audioStart = {};
        var playlistLoad = {};

        var preloader;

        beforeEach(function () {
            loadFixtures('preloader.html');

            // SUT
        });

        xit('should display a warning if audio startup failed', function () {
            // When
            var tmpDefObj = $.Deferred();
            audioStart = jasmine.createSpy().andCallFake(function () { return tmpDefObj; });
            playlistLoad = jasmine.createSpy().andCallFake(function () { return tmpDefObj; });
            preloader = new Preloader('.preloader', audioStart, playlistLoad);

            // Then
            expect($('.audio-error')).not.toHaveCss({ visibility: 'hidden' });
        });

        xit('should display a warning if initial playlist load failed', function () {

        });

        xit('should close if preload processes finished successfully', function () {

        });
    });
});
