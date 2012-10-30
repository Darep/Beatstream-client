require.config({
    shim: {
        'lib/soundmanager2': [],
        'lib/slickgrid/slick.grid': ['lib/slickgrid/jquery.event.drag-2.0.min', 'lib/slickgrid/slick.core', 'lib/slickgrid/slick.dataview', 'lib/slickgrid/plugins/slick.rowselectionmodel'],
        'beatstream/audio-modules/soundmanager2': ['lib/soundmanager2']
    },

    paths: {
        //'lib/soundmanager2': 'lib/soundmanager2-nodebug-jsmin'
        'lib/store': 'lib/store.min',
        'lib/jquery-ui': 'lib/jquery-ui-1.8.17.custom.min'
    },

    urlArgs: "timestamp=" + new Date().getTime(),

    // We will bail out instantly if there is error loading any script
    // (default is 7 seconds -> causes you to stare empty console)
    waitSeconds: 1
});


// Bootstrap
require(
    ["config", "beatstream/main"],
    function(config, Beatstream) {
        Beatstream.init(config);
    }
);
