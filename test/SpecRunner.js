require(['jquery', '../test/specs'], function ($, specs) {
    require(specs, function() {
        var env = jasmine.getEnv(),
            htmlReporter = new jasmine.HtmlReporter();

        env.addReporter(htmlReporter);

        env.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };

        $(document).ready(function () {
            env.execute();
        });
    });
});
