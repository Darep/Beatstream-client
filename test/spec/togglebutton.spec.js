define([
    'store',
    'views/controls/togglebutton'
], function(store, ToggleButton) {
    describe('ToggleButton', function () {

        // SUT
        var shuffle;

        beforeEach(function() {
            store.clear();

            loadFixtures('player.html');

            shuffle = new ToggleButton('#shuffle', 'shuffle');
        });

        it('should be off by default', function () {
            expect(shuffle.getValue()).toBe(false);
        });

        it('should retrieve state from "store"', function () {
            store.set('shuffle', true);
            var tmp_shuffle = new ToggleButton('#shuffle', 'shuffle');
            expect(tmp_shuffle.getValue()).toBe(true);
        });

        it('should set state to "store"', function () {
            shuffle.setValue(true);
            expect(store.get('shuffle')).toBe(true);
        });

        it('should change state from false to true on click', function () {
            shuffle.setValue(false);

            // When
            $('#shuffle').click();

            // Then
            expect(shuffle.getValue()).toBe(true);
        });

        it('should not have "enabled" class by default', function () {
            expect($('#shuffle')).not.toHaveClass('enabled');
        });

        it('should add "enabled" CSS class if enabled in "store" on init', function () {
            store.set('shuffle', true);
            new ToggleButton('#shuffle', 'shuffle');

            // Then
            expect($('#shuffle')).toHaveClass('enabled');
        });

        it('should add "enabled" CSS class when state changes to enabled', function () {
            shuffle.setValue(false);

            // When
            shuffle.setValue(true);

            // Then
            expect($('#shuffle')).toHaveClass('enabled');
        });

        it('should lose "enabled" CSS class on click', function () {
            shuffle.setValue(true);
            $('#shuffle').addClass('enabled');

            // When
            $('#shuffle').click();

            // Then
            expect($('#shuffle')).not.toHaveClass('enabled');
        });

        it('should get "enabled" CSS class when enabled', function () {
            shuffle.setValue(false);
            $('#shuffle').removeClass('enabled');

            // When
            $('#shuffle').click();

            // Then
            expect($('#shuffle')).toHaveClass('enabled');
        });
    });
});
