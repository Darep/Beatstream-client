define(
    ['beatstream/mediator', 'beatstream/api', 'transparency', 'helpers/helpers'],
    function (mediator, api, transparency) {

        var NEW_PLAYLIST_NAME = 'New playlist';

        function Sidebar(selector) {

            var self = this;
            var $sidebar, activePlaylist, playlistList, newPlaylistDialog,
                nameField, nameErrorField, noPlaylistsText, playlistTemplate;

            $sidebar = $(selector);
            activePlaylist = $sidebar.find('.all-music a');
            playlistSection = $sidebar.find('.playlists');
            playlistList = playlistSection.find('ul');
            noPlaylistsText = playlistSection.find('.none');
            loading = playlistSection.find('.loading');
            newPlaylistDialog = playlistSection.find('.playlist-input');
            nameField = newPlaylistDialog.find('input');
            nameErrorField = nameField.next('.error');
            playlistTemplate = template('.playlist');

            mediator.subscribe('playlists:allMusic', function (data) {
                // update "All music" song count on sidebar
                var count = commify( parseInt( data.length, 10 ) );
                $sidebar.find('.all-music .count').text(count);
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

            // New playlist
            nameField.onEnter(function () {
                var $this = $(this);
                var value = $this.val() || '';
                var list_name = $.trim(value);

                // empty list name, abort!
                if (list_name === '') {
                    newPlaylistDialog.hide();
                    return;
                }

                // TODO: check that there is no list with the same name?
                //       -- or -- do this server-side?

                var playlistInSync = playlistTemplate.clone();
                playlistInSync.render({ name: list_name });
                playlistInSync.addClass('syncing');
                newPlaylistDialog.before(playlistInSync);
                newPlaylistDialog.hide();

                // create the playlist
                var req = api.createPlaylist(list_name);
                req.success(function (data) {
                    console.log(playlistInSync);
                    playlistInSync.removeClass('insync');
                    playlistInSync.find('.sync-icon').remove();

                    // hide error feedback
                    nameField.removeClass('error');
                    nameErrorField.hide();
                }).error(function () {
                    playlistInSync.remove();
                    $('#sidebar .btn-new-list').click();

                    // show error feedback
                    nameField.val(list_name).select().addClass('error');
                    nameErrorField.show();
                });

                //  hide "no playlists" text
                noPlaylistsText.hide();
            });

            $sidebar.find('.btn-new-list').click(function (e) {
                e.preventDefault();

                nameField.val(NEW_PLAYLIST_NAME);
                newPlaylistDialog.show();
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
