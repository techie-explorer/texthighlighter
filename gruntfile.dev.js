module.exports = function(grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  var BUILD_DIR = "build/dev",
    DOC_DIR = "doc",
    BUILD_TARGET = "TextHighlighter.min.js";

  grunt.initConfig({
    _TARGET: BUILD_DIR + BUILD_TARGET,

    browserify: {
      dist: {
        files: {
          // destination for transpiled js : source js
          [`${BUILD_DIR}TextHighlighter.js`]: "src/global-script.js"
        },
        options: {
          transform: [["babelify"]],
          browserifyOptions: {
            debug: true
          }
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          "<%= _TARGET %>": [`${BUILD_DIR}/TextHighlighter.js`]
        }
      }
    },
    watch: {
      scripts: {
        files: ["src/**/*.js"],
        tasks: ["build"],
        options: {
          spawn: false
        }
      }
    },
    clean: [BUILD_DIR, DOC_DIR]
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("build", ["browserify:dist", "uglify"]);
  grunt.registerTask("default", ["build"]);
};
