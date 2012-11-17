require.config({
    shim: {
        'jquery': {
            deps: [],
            exports: 'jQuery'
        },
        'slickgrid': [
            'jquery',
            'lib/slickgrid/jquery.event.drag-2.0.min',
            'lib/slickgrid/slick.core',
            'lib/slickgrid/slick.dataview',
            'lib/slickgrid/plugins/slick.rowselectionmodel'
        ],
        'soundmanager2': [],
        'soundmanager2-audiomodule': ['soundmanager2']
    },

    paths: {
        'soundmanager2': 'lib/soundmanager2-nodebug-jsmin',
        'jquery': 'lib/jquery-1.8.3.min',
        'jquery-ui': 'lib/jquery-ui-1.8.17.custom.min',
        'store': 'lib/store.min',
        'slickgrid': 'lib/slickgrid/slick.grid'
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
