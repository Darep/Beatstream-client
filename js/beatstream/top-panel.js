define(
    ['jquery'],
    function ($) {

        var TopPanel = function (selector) {
            var top = $(selector),
                menu = top.find('#user-menu');

            top.find('.username').text('you');

            top.find('#menu-toggle').click(function () {
                menu.toggle();
            });

            // TODO: this
        };

        return TopPanel;
    }
);
