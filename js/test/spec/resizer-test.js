define(['beatstream/resizer'], function(Resizer) {
    describe('Resizer', function () {
        var fixture;

        beforeEach(function () {
            fixture = $('<div id="app" style="height:100%;"><div class="app-top" style=""></div></div>');
        });

        it('resizes the .main-wrapper, so top and bottom are fully shown', function () {
            var resizer = new Resizer();
            resizer.resize();
        });
    });
});
