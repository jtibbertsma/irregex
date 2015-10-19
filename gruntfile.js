module.exports = function (grunt) {

  grunt.initConfig({
    jison: {
      markdown: {
        files: { 'grammar/regex.y': 'lib/parser.js' }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jison');
};