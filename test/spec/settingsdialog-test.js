define([
    'views/dialogs/settings_dialog'
], function(SettingsDialog) {
    describe('Settings dialog', function () {

        beforeEach(function () {
            loadFixtures('settings-dialog.html');
        });

        xit('should find the assigned element in the DOM', function () {
            expect(dialog.dialog).toBe($('#dialog-settings'));
        });

        xit('should accept triggers for displaying itself', function () {
            var trigger = jasmine.createSpy();

            dialog.showOn('click', $('#b'));

            // expect()
        });
    });
});
