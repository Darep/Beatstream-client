require.config({
    baseUrl: '../',

    shim: {
        'slickgrid': [
            'jquery',
            'lib/SlickGrid/lib/jquery.event.drag-2.0.min',
            'lib/SlickGrid/slick.core',
            'lib/SlickGrid/slick.dataview',
            'lib/SlickGrid/plugins/slick.rowselectionmodel'
        ],
        'soundmanager2': [],
        'soundmanager2-audiomodule': ['soundmanager2']
    },

    paths: {
        'jquery': 'lib/jquery.min',
        'jquery-ui': 'lib/jquery-ui',
        'mediator': 'lib/mediator.min',
        'slickgrid': 'lib/SlickGrid/slick.grid',
        'soundmanager2': 'lib/SoundManager2/script/soundmanager2', //-nodebug-jsmin',
        'store': 'lib/store.min',
        'pathjs': 'lib/path.min',
        'transparency': 'lib/transparency.min',
        'spec': 'test/spec'
    },

    urlArgs: "timestamp=" + new Date().getTime(),

    // We will bail out instantly if there is error loading any script
    // (default is 7 seconds -> causes you to stare empty console)
    waitSeconds: 1
});

require(['jquery', 'spec/index'], function($, index) {
    var jasmineEnv = jasmine.getEnv(),
        htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    $(function() {
        require(index.specs, function() {
            jasmineEnv.execute();
        });
    });
});
