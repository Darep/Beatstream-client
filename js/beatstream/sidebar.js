define(
    ['beatstream/mediator', 'helpers/helpers'],
    function (mediator) {

        var NEW_PLAYLIST_NAME = 'New playlist';

        function Sidebar(selector) {

            var $sidebar, activePlaylist, playlistList;

            mediator.subscribe('playlists:allMusic', function (data) {
                // update "All music" song count on sidebar
                var count = commify( parseInt( data.length, 10 ) );
                $('.medialibrary.count').text(count);
            });

            var self = this;
            $sidebar = $(selector);
            activePlaylist = $sidebar.find('.all-music a');
            playlistList = $sidebar.find('.playlists');

            // show current playlists on the sidebar


            // show playlist when playlist name is clicked
            playlistList.find('a').live('click', function (e) {
                e.preventDefault();

                var $this = $(this);

                // don't show syncing or active playlists
                if ($this.hasClass('insync') || $this.hasClass('act')) {
                    return;
                }

                setActivePlaylist($this);

                // load the playlist from URL x
                var name = $this.text();

                // TODO: tell modules that a playlist was selected
                //events.onOpenPlaylist(name);
            });

            // show "All music" on click
            $sidebar.find('.all-music a').click(function (e) {
                e.preventDefault();

                var $this = $(this);
                if ($this.hasClass('act')) {
                    return;
                }

                var name = $this.find('.name').text();

                setActivePlaylist($this);

                // TODO: tell modules that all music was selected
                //events.onOpenAllMusic();
            });


            // New playlist
            var newPlaylistInput = playlistList.find('.playlist-input');
            var nameField = newPlaylistInput.find('input');
            var nameErrorField = nameField.next('.error');

            nameField.onEnter(function () {
                var $this = $(this);
                var value = $this.val() || '';
                var list_name = $.trim(value);

                // empty list name, abort
                if (list_name === '') {
                    list_item.remove();
                    return;
                }

                // TODO: check that there is no list with the same name?
                //       -- or -- do this server-side?

                var playlistInSync = template('.playlist.insync').render({ name: list_name }).clone();
                newPlaylistInput.before(playlistInSync);
                newPlaylistInput.hide();

                // create the playlist
                var req = Beatstream.Api.createPlaylist(list_name);

                req.success(function (data) {
                    console.log(playlistInSync);
                    playlistInSync.removeClass('insync');
                    playlistInSync.find('.sync-icon').remove();

                    // hide error feedback
                    nameField.removeClass('error');
                    nameErrorField.hide();
                });

                req.error(function () {
                    playlistInSync.remove();
                    $('#sidebar .btn-new-list').click();

                    // show error feedback
                    nameField.val(list_name).select().addClass('error');
                    nameErrorField.show();
                });

                //  hide "no playlists" text
                playlistList.prev('.none').hide();
            });

            $sidebar.find('.btn-new-list').click(function (e) {
                e.preventDefault();

                nameField.val(NEW_PLAYLIST_NAME);
                newPlaylistInput.show();
                nameField.focus().select();
            });


            function setActivePlaylist($this) {
                if (activePlaylist !== undefined && activePlaylist.length) {
                    activePlaylist.removeClass('act');
                }
                $this.addClass('act');
                activePlaylist = $this;
            }
        }

        return Sidebar;
    }
);
