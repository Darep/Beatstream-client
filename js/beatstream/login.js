define(
    ['jquery', 'beatstream/mediator'],
    function ($, mediator) {

        var Login = function () {
            mediator.Subscribe('error:noAuth', function () {
                // show the login window
                // TODO: this
            });
        };

        return Login;
    }
);
