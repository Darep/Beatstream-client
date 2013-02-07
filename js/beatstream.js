require(['beatstream/app'],
function (app) {
    var config = {
        apiUrl: '/api/v1'
    };

    app.init(config);
});
