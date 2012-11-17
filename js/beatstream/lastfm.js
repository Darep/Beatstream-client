define(
    ['jquery'],
    function ($) {

        var scrobble_time = 240,
            song_scrobbled = false,
            song = null;

        function updateNowPlaying() {
            var data = 'artist=' + encodeURIComponent(song.artist) +
                       '&title=' + encodeURIComponent(song.title);

            // TODO: use Beatstream.Api instead
            $.ajax({
                type: 'PUT',
                url: '/api/v1/now-playing',
                data: data
            });
        }

        var LastFM = {
            newSong: function (song_in) {
                if (!song_in) return;

                song = song_in;

                scrobble_time = Math.floor(song.length/2, 10);

                if (scrobble_time > 240) {
                    scrobble_time = 240;
                }

                // don't scrobble songs that are under 30 secs (last.fm rule)
                if (scrobble_time <= 15) {
                    song_scrobbled = true;
                }
                else {
                    song_scrobbled = false;
                    updateNowPlaying();
                }
            },

            scrobble: function (elaps) {
                if (song_scrobbled === true || elaps < scrobble_time || !song) {
                    return;
                }

                var data = 'artist=' + encodeURIComponent(song.artist) +
                           '&title=' + encodeURIComponent(song.title);

                // TODO: use Beatstream.Api instead
                $.ajax({
                    type: 'POST',
                    url: '/api/v1/scrobble',
                    data: data
                });

                song_scrobbled = true;
            }
        };

        return LastFM;
    }
);
