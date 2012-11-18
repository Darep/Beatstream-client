define(
    [
        'jquery',
        'store',
        'beatstream/mediator'
    ],
    function ($, store, mediator) {

        var DEFAULT_VOLUME = 20;

        var playerTrack = $('#player-song .track');
        var playPause = $('#play-pause');
        var prevButton = $('#prev');
        var nextButton = $('#next');
        var elapsed = $('#player-time .elapsed');
        var duration = $('#player-time .duration');
        var volume_label = $('#player-volume-label');
        var seekbar = $('#seekbar-slider');
        var repeatButton = $('#repeat');
        var shuffleButton = $('#shuffle');
        var volume = DEFAULT_VOLUME;


        // Events
        mediator.Subscribe("songlist:selectSong", function (song) {
            // show the selected song title instantly
            playerTrack.text(song.nice_title);
        });

        mediator.Subscribe("audio:play", function () {
            // only show "playing" state after the audio module says it's playing
            playPause.addClass('playing');
        });

        mediator.Subscribe("audio:pause", function () {
            playPause.removeClass('playing');
        });

        mediator.Subscribe("audio:timeChange", function (elaps) {
            elapsedTimeChanged(elaps);

            if (!user_is_seeking) {
                seekbar.slider('option', 'value', elaps);
            }
        });

        mediator.Subscribe("audio:parseDuration", function (duration_in_seconds) {
            durationChanged(duration_in_seconds);
            seekbar.slider('option', 'disabled', false);
        });

        mediator.Subscribe("songlist:stop", function () {
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
                mediator.Publish("buttons:seek", ui.value);
                user_is_seeking = false;
            }
        });


        // playback buttons
        playPause.click(function (e) {
            e.preventDefault();
            mediator.Publish("buttons:togglePause");
        });

        nextButton.click(function (e) {
            e.preventDefault();
            mediator.Publish("buttons:nextSong", getShuffle(), getRepeat());
        });

        prevButton.click(function (e) {
            e.preventDefault();
            mediator.Publish("buttons:prevSong");
        });

        playerTrack.dblclick(function (e) {
            e.preventDefault();
            mediator.Publish("buttons:showNowPlaying");
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

        function updateVolume(volume) {
            mediator.Publish("buttons:setVolume", volume);
            volume_label.attr('title', volume);
        }


        // expose the module to the world!
        return {
            getShuffle: getShuffle,
            getRepeat: getRepeat,
            getVolume: getVolume
        };
    }
);
