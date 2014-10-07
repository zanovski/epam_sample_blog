/**
 * Created by Aliaksandr_Zanouski on 10/7/2014.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        project: grunt.file.readJSON('bower.json'),
        concat: {
            dist: {
                src: ['src/**/*.js'],
                dest: 'prod/<%= project.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= project.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                src: 'prod/<%= project.name %>.js',
                dest: 'prod/<%= project.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat','uglify']);
};