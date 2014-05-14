module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['concat', 'html2js']);
    grunt.initConfig({
        src: {
            jsFiles:  ['src/app/**/*.js'],
            templateFiles:  ['src/templates/**/*.tpl.html'],
            vendorFiles: ['src/vendor/**/*.js']
        },
        concat: {
            options: {
                stripBanners: true,
                separator: ''
            },
            app: {
                src: [
                    'src/app/services/*.js',
                    'src/app/*.js',
                    'src/app/dialogs/*.js'
                ],
                dest: 'static/js/app.js'
            },
            vendor: {
                src: [
                    ['<%= src.vendorFiles %>']
                ],
                dest: 'static/js/vendor.js'
            }
        },
        html2js: {
            templates: {
                options: {
                    base: 'src/templates'
                },
                src: ['<%= src.templateFiles %>'],
                dest: 'static/js/templates.js',
                module: 'app.templates'
            }
        },
        watch: {
            files: ['<%= src.jsFiles %>', '<%= src.templateFiles %>', '<%= src.vendorFiles %>'],
            tasks: ['concat', 'html2js'],
            options: {
                spawn: false,
                interrupt: true,
                debounceDelay: 250
            }
        }


    });

}