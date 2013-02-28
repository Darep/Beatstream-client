define(function() {

    jasmine.getFixtures().fixturesPath = 'fixtures';

    return [
        'spec/preloader-test',
        'spec/lastfm-test',
        'spec/usermenu-test',
        'spec/resizer-test',
        'spec/togglebutton.spec',
        'spec/player.spec',
        'spec/playlistmanager.spec',
        'spec/settingsdialog-test'
    ];
});
