module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    meta : {
      pkg    : grunt.file.readJSON('package.json'),
      banner : '/*! <%= meta.pkg.title || meta.pkg.name %> - v<%= meta.pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= meta.pkg.homepage ? "* " + meta.pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= meta.pkg.author.name %>;' +
        ' Licensed <%= _.pluck(meta.pkg.licenses, "type").join(", ") %> */\n',
      src    : ['src/events.js', 'src/proxy.js', 'src/deps.js', 'src/scope.js', 'src/render.js'],
      vendor : ['lib/underscore/underscore.js', 'lib/jquery/jquery-latest.js', 'src/undermore.js'],
      specs  : ['specs/**/*Spec.js']
    },
    jasmine : {
      src : '<%= meta.src %>',
      options    : {
        specs    : '<%= meta.specs %>',
        vendor   : '<%= meta.vendor %>',
        template : 'specs/grunt-SpecRunner.tmpl',
        helpers  : ['testEnv/testEnv.js', 'testEnv/fixtures.js', 'specs/grunt-SpecHelper.js']
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        '<%= meta.src %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    concat: {
      dist: {
        src  : '<%= meta.src %>',
        dest : 'dist/boundjs.<%= meta.pkg.version %>.js'
      }
    },
    uglify: {
      pack: {
        files : {
          'dist/boundjs.<%= meta.pkg.version %>.min.js': 'dist/boundjs.<%= meta.pkg.version %>.js'
        }
      },
      options: {
        banner : '<%= meta.banner %>',
        mangle : false
      }
    },
    watch: {
      test : {
        files : ['<%= meta.src %>','<%= meta.specs %>'],
        tasks : 'test'
      }
    }
  });

  // Load third-party modules
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define tasks
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('dist', ['concat', 'uglify']);

  // Define default task
  grunt.registerTask('default', ['test']);
};
