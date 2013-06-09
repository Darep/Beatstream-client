define([
    'lib/mediator',
    'lib/api',
    'transparency',
    'helpers/helpers'
],
function (mediator, api) {

    var NEW_PLAYLIST_NAME = 'New playlist';

    function Sidebar(args) {
        var _this = this;

        this.el = $('.app-nav');

        // Enterprise Bus events!
        mediator.subscribe('playlist:allMusic', function (data) {
            // update "All music" song count on sidebar
            var count = commify( parseInt( data.length, 10 ) );
            _this.el.find('.all-music .count').text(count);
        });

        this.hookSidebarEvents();
    }

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
