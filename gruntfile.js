module.exports = function (grunt) {

  grunt.initConfig({
    jison: {
      markdown: {
        files: { 'lib/_parser.js': 'grammar/regex.y' }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jison');
};