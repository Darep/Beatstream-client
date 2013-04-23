define(function() {

    jasmine.getFixtures().fixturesPath = 'fixtures';

    return [
        '../test/spec/lastfm.spec',
        '../test/spec/usermenu.spec',
        '../test/spec/togglebutton.spec',
        '../test/spec/player.spec',
        '../test/spec/playlistmanager.spec',
        '../test/spec/resizer.spec',
        '../test/spec/preloader-test',
        '../test/spec/settingsdialog-test'
    ];
});
