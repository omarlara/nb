module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            dev: {
                files: [
                    '*.{htm,html}',
                    'sass/*.{scss,sass}',
                    'sass/**/*.{scss,sass}',
                    'sass/**/**/*.{scss,sass}',
                    'src/**/*.js',
                    'src/**/**/*.js'
                    ],
                tasks: ['sass:dist', 'concat:dev', 'jshint:afterconcat'],
                options: {
                    livereload: true
                }
            },
            qa: {
                files: [
                    '*.{htm,html}',
                    'sass/*.{scss,sass}',
                    'sass/**/*.{scss,sass}',
                    'sass/**/**/*.{scss,sass}',
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
                    sourcemap: 'none',
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
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {'js/<%= pkg.name %>.min.js': 'js/<%= pkg.name %>.js'}
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
                    },
                    {
                        src: ['js/<%= pkg.name %>.min.js'],
                        dest: 'js/<%= pkg.name %>.min.js.gz'
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
            qa: {
                tasks: ['watch:qa']
            },
            prod: {
                tasks: ['watch:prod']
            }
        },
        jshint: {
            beforeconcat: ['src/**/**.js'],
            afterconcat: ['js/<%= pkg.name %>.js']
        },
        concat: {
            options: {
                process: function (src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src;
                },
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>*/\n'
            },
            dev: {
                src: ['src/app.js', 'src/utils/**.js', 'src/plugins/**.js', 'src/prototype/**.js', 'src/bootstrap.js'],
                dest: 'js/<%= pkg.name %>.js'
            }
        }
    });

    grunt.registerTask('dev', ['concurrent:dev']);
    grunt.registerTask('qa', ['concurrent:dev']);
    grunt.registerTask('prod', ['concurrent:prod']);
    grunt.registerTask('buildProd', ['sass:dist', 'cssmin', 'uglify', 'compress']);
}

