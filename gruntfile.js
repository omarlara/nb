module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            dev: {
                files: [
                    '*.{htm,html}',
                    'sass/*.{scss,sass}',
                    'sass/**/*.{scss,sass}',
                    'sass/**/**/*.{scss,sass}'
                    ],
                tasks: ['sass:dist', 'cssmin'],
                options: {
                    livereload: true
                }
            },
            prod: {
                files: [
                    '*.{htm,html}',
                    'sass/*.{scss,sass}',
                    'sass/**/*.{scss,sass}',
                    'sass/**/**/*.{scss,sass}'
                    ],
                tasks: ['sass:dist', 'cssmin', 'compress'],
                options: {
                    livereload: true
                }
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.{scss,sass}'],
                    dest: 'css/',
                    ext: '.css'
                }],
                options: {
                    sourcemap: false,
                    noCache: false
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: false,
                shorthandCompacting: true,
                roundingPrecision: -1,
                report: 'min',
                keepSpecialComments: 0
            },
            target: {
                expand: true,
                cwd: 'css/',
                src: ['*.css', '!*.min.css'],
                dest: 'css',
                ext: '.min.css'
            }
        },
        compress: {
            main: {
                options: {
                  mode: 'gzip'
                },
                files: [
                    {
                        expand: false,
                        src: ['css/<%= pkg.name %>.min.css'],
                        dest: 'css/<%= pkg.name %>.min.css.gz'
                    }
                ]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: {
                tasks: ['watch:dev']
            },
            prod: {
                tasks: ['watch:prod']
            }
        }
    });

    grunt.registerTask('dev', ['concurrent:dev']);
    grunt.registerTask('prod', ['concurrent:prod']);
}

