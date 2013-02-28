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

        // show username
        this.menu.find('.username').text(username);

        // events
        $(document).click(this.handleClicks.bind(this));
    };

    UserMenu.prototype.handleClicks = function (e) {
        if (e.button && e.button !== 0) {
            return true;
        }

        var target = $(e.target);

        if (e.target == this.menuToggle[0] || target.parents().index(this.menuToggle) != -1) {
            this.actualMenu.toggleClass('show');
            return false;
        } else if (this.isMenuItem(target) || this.isOutside(target)) {
            this.actualMenu.removeClass('show');
            return false;
        }
    };

    UserMenu.prototype.isMenuItem = function (target) {
        var menuItems = this.actualMenu.find('a');
        return menuItems.index(target) != -1 || target.parents().index(menuItems) != -1;
    };

    UserMenu.prototype.isOutside = function (target) {
        return target != this.menu && target.parents().index(this.menu) == -1;
    };

    return UserMenu;
});
