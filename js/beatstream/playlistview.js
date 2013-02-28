define([
    'slickgrid'
],
function () {

    function PlaylistView() {

    }

    PlaylistView.prototype.resizeCanvas = function() {
        this.grid.resizeCanvas();
    };

    return PlaylistView;
});
