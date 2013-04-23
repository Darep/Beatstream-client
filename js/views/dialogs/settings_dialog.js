define([],
function () {
    var SettingsDialog = function (args) {
        this.el = args.el || undefined;

        this.el.find('.close').on('click', this.hide.bind(this));
    };

    SettingsDialog.prototype.show = function () {
        this.el.addClass('show');

        // TODO: fill dialog form with profile data

        this.el.find('.settings-username').val('Dummy username');
        this.el.find('.settings-email').val('user@dummy.com');
    };

    SettingsDialog.prototype.hide = function () {
        this.el.removeClass('show');
    };

    return SettingsDialog;
});
