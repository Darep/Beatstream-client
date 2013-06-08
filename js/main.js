require([
    'app',
    'lib/api',

    'jquery'
], function (App, Api) {

    $(document).ready(function() {
        var default_options = {
                apiBase: '/api/v1/'
            },
            app = new App(default_options),
            authCheck = Api.getProfile({ cache: true });

        authCheck.success(function () {
            app.start();
        })
        .fail(function () {
            // FIXME: show a login dialog and use API calls to log in
            window.location = '/login';
        });
    });

});
