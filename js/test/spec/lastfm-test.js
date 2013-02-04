define(['beatstream/lastfm', 'beatstream/mediator'], function(LastFM, mediator) {
    describe('LastFM', function () {
        var fixture;

        beforeEach(function () {
            fixture = $('<div id="app" style="height:100%;"><div class="app-top" style=""></div></div>');
        });

        it('does something', function () {
            var lastfm = new LastFM();
            mediator.publish("audio:timeChange", 5);
            console.log(LastFM);
        });
    });
});
