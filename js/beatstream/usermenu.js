define([
    'jquery'
],
function ($) {
    var UserMenu = function (selector) {
        this.menu = document.getElementById(selector),
        this.menuToggle = document.getElementById('menu-toggle');

        this.menuToggle.addEventListener('click', this.toggleMenu.bind(this));
    };

    UserMenu.prototype.toggleMenu = function() {
        console.log(this);
    };

    return UserMenu;
});
