require.config({
    shim: {
        'jquery': {
            deps: [],
            exports: 'jQuery'
        },
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
        'pathjs': 'lib/path.min'
    },

    urlArgs: "timestamp=" + new Date().getTime(),

    // We will bail out instantly if there is error loading any script
    // (default is 7 seconds -> causes you to stare empty console)
    waitSeconds: 1
});


// Bootstrap
require(
    ["config", "beatstream/app", "jquery"],
    function(config, Beatstream, jQuery) {
        Beatstream.init(config);

        // Expose jQuery to the global object
        window.jQuery = window.$ = jQuery;
    }
);
