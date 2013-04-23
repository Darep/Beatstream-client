define([],
function () {
    var SettingsDialog = function (args) {
        this.el = args.el || undefined;

        this.el.find('.close').on('click', this.hide.bind(this));
    };

    SettingsDialog.prototype.show = function () {
        this.el.addClass('show');

        // TODO: fill dialog form with profile data
    };

    SettingsDialog.prototype.hide = function () {
        this.el.removeClass('show');
    };

    return SettingsDialog;
});
