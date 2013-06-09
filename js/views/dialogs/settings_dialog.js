define([
    'lib/api'
],
function (Api) {

    var SettingsDialog = function (args) {
        this.el = args.el || undefined;

        this.el.find('.close').on('click', this.hide.bind(this));
    };

    SettingsDialog.prototype.show = function () {
        var _this = this;

        this.el.addClass('show');

        Api.getProfile({ forceRefresh: true }).done(function (profile) {
            console.log(profile);
            _this.el.find('.settings-username').val(profile.username);
            _this.el.find('.settings-email').val(profile.email);
        });
    };

    SettingsDialog.prototype.hide = function () {
        this.el.removeClass('show');
    };

    return SettingsDialog;
});
