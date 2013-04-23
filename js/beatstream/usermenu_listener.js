define([
    'beatstream/mediator',
    'beatstream/dialogs/settings_dialog'
],
function (mediator, SettingsDialog) {
    var UserMenuListener = function(args) {
        mediator.subscribe('usermenu:click', handleUserMenuClick);
    };

    function handleUserMenuClick(element) {
        if (element == 'settings-link') {
            var settingsDialog = new SettingsDialog({
                el: $('#dialog-settings')
            });
            settingsDialog.show();
        }
    }

    return UserMenuListener;
});
