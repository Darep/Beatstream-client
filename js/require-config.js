var require = {
    shim: {
        'helpers/helpers': {
            deps: ['jquery']
        },
        'slickgrid': {
            deps: [
                'jquery',
                'lib/SlickGrid/lib/jquery.event.drag-2.0.min',
                'lib/SlickGrid/slick.core',
                'lib/SlickGrid/slick.dataview',
                'lib/SlickGrid/plugins/slick.rowselectionmodel'
            ]
        },
        'soundmanager2': {},
        'soundmanager2-audiomodule': {
            deps: 'soundmanager2'
        }
    },

    paths: {
        'jquery': 'lib/jquery.min',
        'jquery-ui': 'lib/jquery-ui',
        'mediator': 'lib/mediator.min',
        'pathjs': 'lib/path.min',
        'slickgrid': 'lib/SlickGrid/slick.grid',
        'soundmanager2': 'lib/SoundManager2/script/soundmanager2', //-nodebug-jsmin',
        'store': 'lib/store.min',
        'transparency': 'lib/transparency.min'
    },

    urlArgs: "ts=" + new Date().getTime(),

    // We will bail out instantly if there is error loading any script
    // (default is 7 seconds -> causes you to stare empty console)
    waitSeconds: 3
};
