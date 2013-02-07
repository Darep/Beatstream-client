define(['beatstream/usermenu'], function(UserMenu) {
    describe('User Menu', function () {
        var fixture;
        var usermenu;

        beforeEach(function () {
            var fixture = $(
                '<div id="user-menu">' +
                    '<a href="#" id="menu-toggle" class="toggle username">You</a>' +
                    '<ul>' +
                        '<li><a id="settings-link">Settings</a></li>' +
                        '<li><a class="logout-link" rel="nofollow">Logout</a></li>' +
                    '</ul>' +
                '</div>'
            );
            $('#sandbox').append(fixture);

            // SUT
            usermenu = new UserMenu('#user-menu', 'John');
        });

        afterEach(function () {
            $('#sandbox').empty();
        });

        it('should find the menu element in DOM', function () {
            expect(usermenu.menu).toBe($('#user-menu'));
        });

        it('should display user\'s username', function () {
            expect($('#user-menu .username')).toHaveText('John');
        });

        it('should open the menu on click', function () {
            $('#user-menu ul').hide();

            // When
            $('#user-menu .toggle').click();

            // Then
            expect($('#user-menu ul')).toBeVisible();
        });

        xit('should close the menu on click elsewhere', function () {
            // $('#user-menu ul').hidden();

            // $('#sandbox').click();

            // expect($('#user-menu ul')).toBeHidden();
        });
    });
});
