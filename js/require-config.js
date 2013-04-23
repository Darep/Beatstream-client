var require = {
    shim: {
        'helpers/helpers': {
            deps: ['jquery']
        },
        'slickgrid': {
            deps: [
                'jquery',
                'vendor/SlickGrid/lib/jquery.event.drag-2.0.min',
                'vendor/SlickGrid/slick.core',
                'vendor/SlickGrid/slick.dataview',
                'vendor/SlickGrid/plugins/slick.rowselectionmodel'
            ]
        },
        'soundmanager2': {},
        'soundmanager2-audiomodule': {
            deps: 'soundmanager2'
        }
    },

    paths: {
        'jquery': 'vendor/jquery.min',
        'jquery-ui': 'vendor/jquery-ui',
        'mediator': 'vendor/mediator.min',
        'pathjs': 'vendor/path.min',
        'slickgrid': 'vendor/SlickGrid/slick.grid',
        'soundmanager2': 'vendor/SoundManager2/script/soundmanager2-nodebug-jsmin',
        'store': 'vendor/store.min',
        'transparency': 'vendor/transparency.min',
        'underscore': 'vendor/underscore-min'
    },

    urlArgs: "ts=" + new Date().getTime(),

    // We will bail out instantly if there is error loading any script
    // (default is 7 seconds -> causes you to stare empty console)
    waitSeconds: 3
};
