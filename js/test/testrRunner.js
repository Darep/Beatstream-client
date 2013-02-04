console.log('yay');

var reqq = window.require,
    deff = window.define;
testr.restore();

require(['jquery', 'spec/index'], function($, index) {
    console.log('gay');

    var jasmineEnv = jasmine.getEnv(),
        htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    $(function() {
        console.log('omg');
        require(index.specs, function() {
            console.log('go!');
            window.define = deff;
            window.require = reqq;
            jasmineEnv.execute();
        });
    });
});
