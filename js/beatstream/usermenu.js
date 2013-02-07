define([
    'jquery'
],
function ($) {
    var UserMenu = function (selector, username) {
        // remove # from the start if selector has it
        if (selector.charAt(0) == '#') {
            selector = selector.substr(1);
        }

        this.menu = $(document.getElementById(selector)),
        this.menuToggle = this.menu.find('> .toggle');
        this.actualMenu = this.menu.find('ul');
        console.log(this.actualMenu);

        // show username
        this.menu.find('.username').text(username);

        // events
        this.menuToggle.click(this.toggleMenu.bind(this));
    };

    UserMenu.prototype.toggleMenu = function() {
        this.actualMenu.toggle();
    };

    return UserMenu;
});
