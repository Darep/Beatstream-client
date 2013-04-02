function createPromise(success, error) {
    return {
        done: success,
        success: success,
        error: error,
        fail: error
    };
}

var HELPERS_ALL_MUSIC = [
    {
        id: 0,
        artist: 'Foreigner',
        title: 'Urgent',
        length: 4*60+30 + 0.225,
        path: '/Foreigner/Foreigner - Urgent.mp3',
        nice_title: 'Foreigner - Urgent'
    },
    {
        id: 1,
        artist: 'Foreigner',
        title: 'I\'m gonna win',
        length: 4*60+51,
        path: '/Foreigner/Foreigner - Im gonna win.mp3',
        nice_title: 'Foreigner - Im gonna win'
    },
    {
        id: 2,
        artist: 'Foreigner',
        title: 'Woman in Black',
        length: 4*60+42,
        path: '/Foreigner/Foreigner - Woman in Black.mp3',
        nice_title: 'Foreigner - Woman in Black'
    }
];
