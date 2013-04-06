define([
    'beatstream/resizer',
    'beatstream/mediator'
], function(Resizer, mediator) {
    describe('Resizer', function () {
        var resizer,
            windowHeight = $(window).height(),
            topHeight = 40,
            bottomHeight = 60,
            playlistHeaderHeight = 80;

        beforeEach(function () {
            loadFixtures('resizer.html');
            $('.app-top').height(topHeight);
            $('.app-now-playing').height(bottomHeight);
            $('.playlist-header').height(playlistHeaderHeight);

            resizer = new Resizer();
        });

        it('should resize the .main-wrap to fit between black top and bottom panels', function () {
            // When
            resizer.resize();

            // Then
            expect( $('.main-wrap').height() ).toBe(windowHeight - topHeight - bottomHeight);
        });

        it('should resize the .grid-container to fit in the main area under .playlist-header', function () {
            // When
            resizer.resize();

            // Then
            expect( $('.grid-container').height() ).toBe( $('.main-wrap').height() - playlistHeaderHeight );
        });

        it('should emit an "app:resize" event after resize', function () {
            var mediator_spy = jasmine.createSpy();
            mediator.subscribe("app:resize", mediator_spy);

            // When
            resizer.resize();

            waitsFor(function () {
                return mediator_spy.wasCalled;
            }, "Mediator event for resize", 1000);

            // Then
            runs(function () {
                expect(mediator_spy).toHaveBeenCalled();
            });
        });
    });
});
