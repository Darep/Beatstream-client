define([
    'beatstream/mediator',
    'beatstream/api',
    'transparency',
    'helpers/helpers'
],
function (mediator, api) {

    var NEW_PLAYLIST_NAME = 'New playlist';

    var Sidebar = function (args) {
        this.el = args.el || undefined;

        this.hookSidebarEvents();

        // Enterprise Bus events!
        mediator.subscribe('playlists:allMusic', function (data) {
            // update "All music" song count on sidebar
            var count = commify( parseInt( data.length, 10 ) );
            $sidebar.find('.all-music .count').text(count);
        });
    };

    Sidebar.prototype.hookSidebarEvents = function () {
        // show "All music" on click
        this.el.find('.all-music a').click(function (e) {
            // TODO: this
        });

        // show playlist on click
        this.el.find('.playlists a').live('click', function (e) {
            // TODO: this
        });

        // new playlist dialog on click
        this.el.find('.btn-new-list').click(function (e) {
            // TODO: this
        });
    };

    return Sidebar;
});
