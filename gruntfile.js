module.exports = function (grunt) {

  grunt.initConfig({
    jison: {
      markdown: {
        files: { 'grammar/regex.y': 'lib/_parser.js' }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jison');
};