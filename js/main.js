require.config({
    shim: {
        'jquery': {
            deps: [],
            exports: 'jQuery'
        },
        'slickgrid': [
            'jquery',
            'components/SlickGrid/lib/jquery.event.drag-2.0.min',
            'components/SlickGrid/slick.core',
            'components/SlickGrid/slick.dataview',
            'components/SlickGrid/plugins/slick.rowselectionmodel'
        ],
        'soundmanager2': [],
        'soundmanager2-audiomodule': ['soundmanager2']
    },

    paths: {
        'jquery': 'components/jquery/jquery',
        'jquery-ui': 'components/jquery-ui/ui/jquery-ui',
        'mediator': 'components/Mediator.js/mediator',
        'slickgrid': 'components/SlickGrid/slick.grid',
        'soundmanager2': 'components/SoundManager2/script/soundmanager2',
        'store': 'components/store.js/store.min'
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
