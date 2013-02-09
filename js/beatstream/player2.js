define([
    'jquery',
    'store',
    'beatstream/mediator',
    'jquery-ui'
],
function ($, store, mediator) {

    var DEFAULT_VOLUME = 20;

    var Player = function (selector) {
        var playerTrack, playPause, prevButton, nextButton, elapsed, duration, volumeLabel, seekbar, repeatButton, shuffleButton, volume;

        playerTrack = $('#player-song .track');
        playPause = $('#play-pause');
        prevButton = $('#prev');
        nextButton = $('#next');
        elapsed = $('#player-time .elapsed');
        duration = $('#player-time .duration');
        volumeLabel = $('#player-volume-label');
        seekbar = $('#seekbar-slider');
        repeatButton = $('#repeat');
        shuffleButton = $('#shuffle');
        volume = DEFAULT_VOLUME;


        // Events
        mediator.subscribe("songlist:selectSong", function (song) {
            // show the selected song title instantly
            playerTrack.text(song.nice_title);
        });

        mediator.subscribe("audio:play", function () {
            // only show "playing" state after the audio module says it's playing
            playPause.addClass('playing');
        });

        mediator.subscribe("audio:pause", function () {
            playPause.removeClass('playing');
        });

        mediator.subscribe("audio:timeChange", function (elaps) {
            elapsedTimeChanged(elaps);

            if (!user_is_seeking) {
                seekbar.slider('option', 'value', elaps);
            }
        });

        mediator.subscribe("audio:parseDuration", function (duration_in_seconds) {
            durationChanged(duration_in_seconds);
            seekbar.slider('option', 'disabled', false);
        });

        mediator.subscribe("songlist:stop", function () {
            elapsedTimeChanged(0);
            durationChanged(0);
            seekbar.slider('value', 0);
            seekbar.slider('option', 'disabled', true);
            playerTrack.text('None');
        });


        // volume slider
        volume = getVolume();

        if (volume <= 0 || volume >= 100) {
            volume = DEFAULT_VOLUME;
        }

        // broadcast the current volume level to others
        var updateVolume = function (volume) {
            mediator.publish("buttons:setVolume", volume);
            volumeLabel.attr('title', volume);
        };

        updateVolume(volume);

        $('#player-volume-slider').slider({
            orientation: 'horizontal',
            value: volume,
            max: 100,
            min: 0,
            range: 'min',
            slide: function (event, ui) {
                updateVolume(ui.value);
            },
            stop: function (event, ui) {
                store.set('volume', ui.value);
            }
        });


        // seekbar
        var user_is_seeking = false;
        seekbar.slider({
            orientation: 'horizontal',
            disabled: true,
            value: 0,
            max: 100,
            min: 0,
            range: 'min',
            slide: function (event, ui) {
                // do nothing
            },
            start: function(event, ui) {
                user_is_seeking = true;
            },
            stop: function(event, ui) {
                mediator.publish("buttons:seek", ui.value);
                user_is_seeking = false;
            }
        });


        // playback buttons
        playPause.click(function (e) {
            e.preventDefault();
            mediator.publish("buttons:togglePause");
        });

        nextButton.click(function (e) {
            e.preventDefault();
            mediator.publish("buttons:nextSong", getShuffle(), getRepeat());
        });

        prevButton.click(function (e) {
            e.preventDefault();
            mediator.publish("buttons:prevSong");
        });

        playerTrack.dblclick(function (e) {
            e.preventDefault();
            mediator.publish("buttons:showNowPlaying");
        });


        // enable buttons
        $('#player-buttons button').removeAttr('disabled');

        // repeat & shuffle buttons

        var shuffle = false;
        var repeat = false;

        function newToggleButton(button, key, value) {
            if (store.get(key)) {
                value = store.get(key);
            }

            if (value) {
                button.addClass('enabled');
            }

            button.click(function (e) {
                e.preventDefault();

                value = !value;
                store.set(key, value);

                $(this).toggleClass('enabled');
            });
        }
        newToggleButton(repeatButton, 'repeat', repeat);
        newToggleButton(shuffleButton, 'shuffle', shuffle);


        // HELPERS:

        function storeGet(key) {
            if (key && store.get(key)) {
                return store.get(key);
            }

            return false;
        }

        function getShuffle() {
            return storeGet('shuffle');
        }

        function getRepeat() {
            return storeGet('repeat');
        }

        function getVolume() {
            return parseFloat(storeGet('volume'));
        }

        function durationChanged(dur) {
            var mins = Math.floor(dur/60, 10),
                secs = dur - mins*60;

            duration.text((mins > 9 ? mins : '0' + mins) + ':' + (secs > 9 ? secs : '0' + secs));

            seekbar.slider('option', 'max', dur);
        }

        function elapsedTimeChanged(elaps) {
            var mins = Math.floor(elaps/60, 10),
                secs = elaps - mins*60;

            elapsed.text((mins > 9 ? mins : '0' + mins) + ':' + (secs > 9 ? secs : '0' + secs));
        }

        return {
            getShuffle: getShuffle,
            getRepeat: getRepeat,
            getVolume: getVolume
        };
    };

    return Player;
});
