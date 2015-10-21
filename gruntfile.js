module.exports = function (grunt) {

  grunt.initConfig({
    jison: {
      markdown: {
        files: { 'lib/generatedParser.js': 'grammar/regex.y' }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jison');
};