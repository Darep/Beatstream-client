define(['beatstream/usermenu'], function(UserMenu) {
    describe('User Menu', function () {

        var usermenu;

        beforeEach(function () {
            loadFixtures('usermenu.html');

            // SUT
            usermenu = new UserMenu('#user-menu', 'John');
        });

        it('should find the assigned element in the DOM', function () {
            expect(usermenu.menu).toBe($('#user-menu'));
        });

        it('should display user\'s username', function () {
            expect($('#user-menu .username')).toHaveText('John');
        });

        it('should open the menu on toggle button click', function () {
            // When
            $('#user-menu .toggle').click();

            // Then
            expect($('#user-menu ul')).toHaveClass('show');
        });

        it('should close the menu on toggle button click, if menu visible', function () {
            $('#user-menu ul').addClass('show');

            // When
            $('#user-menu .toggle').click();

            // Then
            expect($('#user-menu ul')).not.toHaveClass('show');
        });

        it('should hide the menu after choosing an item', function () {
            $('#user-menu ul').addClass('show');

            $('#user-menu ul li:first a').click();

            expect($('#user-menu ul')).not.toHaveClass('show');
        });

        it('should not catch middle/right button clicks on toggle button', function () {
            var e = jQuery.Event('click', { button: 1 });
            $('#user-menu .toggle').trigger( e );

            expect($('#user-menu ul')).not.toHaveClass('show');
        });

        it('should hide the menu when clicked outside', function () {
            $('#user-menu ul').addClass('show');

            $('#sandbox').click();

            expect($('#user-menu ul')).not.toHaveClass('show');
        });
    });
});
