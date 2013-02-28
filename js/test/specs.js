define(function() {

    jasmine.getFixtures().fixturesPath = 'fixtures';

    return [
        'spec/lastfm.spec',
        'spec/usermenu.spec',
        'spec/togglebutton.spec',
        'spec/player.spec',
        'spec/playlistmanager.spec',

        'spec/preloader-test',
        'spec/resizer-test',
        'spec/settingsdialog-test'
    ];
});
