define([
    'jquery',
    'lib/mediator'
],
function ($, mediator) {
    var CLASS_OPEN = 'open';

    var UserMenu = function (args) {
        this.el = $('#user-menu');

        this.menuToggle = this.el.find('> .dropdown-toggle');
        this.actualMenu = this.el.find('ul');

        // show username
        this.el.find('.username').text(args.name);

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
            this.el.removeClass(CLASS_OPEN);
        } else if (e.target == this.menuToggle[0] || target.parents().index(this.menuToggle) != -1) {
            // Show/hide menu on press of the toggle
            this.el.toggleClass(CLASS_OPEN);
        } else if(this.isOutside(target)) {
            // Close menu if click outside menu
            this.el.removeClass(CLASS_OPEN);
        }
    };

    UserMenu.prototype.isMenuItem = function (target) {
        var menuItems = this.actualMenu.find('a');
        return menuItems.index(target) != -1 || target.parents().index(menuItems) != -1;
    };

    UserMenu.prototype.isOutside = function (target) {
        return target != this.el && target.parents().index(this.el) == -1;
    };

    return UserMenu;
});
