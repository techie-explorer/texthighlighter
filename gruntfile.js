module.exports = function(grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  var BUILD_DIR = "build/prod/",
    DOC_DIR = "doc",
    BUILD_TARGET = "TextHighlighter.min.js";

  grunt.initConfig({
    _TARGET: BUILD_DIR + BUILD_TARGET,

    browserify: {
      dist: {
        files: {
          // destination for transpiled js : source js
          [`${BUILD_DIR}TextHighlighter.js`]: "src/global-script.js",
        },
        options: {
          transform: [["babelify"]],
          browserifyOptions: {
            debug: false,
          },
        },
      },
    },
    jsdoc: {
      dist: {
        src: ["src/**/*.js", "README.md"],
        options: {
          configure: "jsdoc.conf.json",
          destination: DOC_DIR,
          private: false,
          template: "node_modules/docdash",
        },
      },
    },
    uglify: {
      my_target: {
        files: {
          "<%= _TARGET %>": [`${BUILD_DIR}/TextHighlighter.js`],
        },
      },
    },
    watch: {
      scripts: {
        files: ["src/**/*.js"],
        tasks: ["build"],
        options: {
          spawn: false,
        },
      },
    },
    clean: [BUILD_DIR, DOC_DIR],
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-jsdoc");

  grunt.registerTask("build", ["browserify:dist", "uglify"]);
  grunt.registerTask("default", ["build"]);
};
