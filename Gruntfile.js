module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      js: {
        files: ['lib/*.js'],
        tasks: [ 'babel', 'browserify', 'concat', 'uglify' ],
        options: {
          spawn: false,
        },
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2016']
      },
      dist: {
        files: {
          'dist/transpiled.js': 'lib/sntools.js'
        }
      }
    },

    browserify: {
      dist: {
        files: {
          'dist/transpiled.js': 'dist/transpiled.js'
        },
        options: {
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },

      dist: {
        src: [
          'dist/transpiled.js',
          'bower_components/moment/min/moment.min.js'
        ],
        dest: 'dist/sntools.js',
      },
    },


     uglify: {
       compiled: {
         src: ['dist/sntools.js'],
         dest: 'dist/sntools.min.js'
       }
    }
  });

  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['babel', 'browserify', 'concat', 'uglify']);
};
