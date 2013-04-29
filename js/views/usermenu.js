define([
    'jquery',
    'lib/mediator'
],
function ($, mediator) {
    var CLASS_OPEN = 'open';

    var UserMenu = function (args) {
        this.menu = args.el;
        this.menuToggle = this.menu.find('> .dropdown-toggle');
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

        e.preventDefault();

        var target = $(e.target);

         if (this.isMenuItem(target)) {
            // Menu item clicked,
            mediator.publish('usermenu:click', e.target.id);

            // Close menu
            this.menu.removeClass(CLASS_OPEN);
        } else if (e.target == this.menuToggle[0] || target.parents().index(this.menuToggle) != -1) {
            // Show/hide menu on press of the toggle
            this.menu.toggleClass(CLASS_OPEN);
        } else if(this.isOutside(target)) {
            // Close menu if click outside menu
            this.menu.removeClass(CLASS_OPEN);
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
