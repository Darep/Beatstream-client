define([
    'jquery'
],
function ($) {
    var UserMenu = function (args) {
        this.menu = args.el;
        this.menuToggle = this.menu.find('> .toggle');
        this.actualMenu = this.menu.find('ul');

        // show username
        this.menu.find('.username').text(args.name);

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
