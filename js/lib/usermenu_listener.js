define([
  'lib/mediator',
  'views/dialogs/settings_dialog',
  'views/refresh_view'
],
function (mediator, SettingsDialog, RefreshView) {
  var UserMenuListener = function() {
    mediator.subscribe('usermenu:click', handleUserMenuClick);
  };

  function handleUserMenuClick(element) {
    if (element == 'settings-link') {
      new SettingsDialog().show();
    } else if (element == 'refresh-link') {
      new RefreshView().show();
    } else {
      console.log('clicked usermenu element: ' + element);
    }
  }

  return UserMenuListener;
});
