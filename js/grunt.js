module.exports = function(grunt) {

  // Configure Grunt
  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          mainConfigFile: "build.js"
        }
      }
    },
    jasmine: {
      all: ['test/SpecRunner.html']
    },
    // run jasmine tests any time watched files change
    watch: {
      files: ['beatstream/**/*', 'lib/**/*', 'test/spec/**/*'],
      tasks: ['jasmine']
    }
  });

  // Load external tasks
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jasmine-task');

  // Make task shortcuts
  //grunt.registerTask('default', 'jasmine requirejs min');
  grunt.registerTask('test', 'jasmine');
};
