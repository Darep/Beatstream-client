define(function() {

    jasmine.getFixtures().fixturesPath = 'fixtures';

    return [
        'spec/preloader-test',
        'spec/lastfm-test',
        'spec/usermenu-test',
        'spec/resizer-test',
        'spec/player-test',
        'spec/settingsdialog-test'
    ];
});
