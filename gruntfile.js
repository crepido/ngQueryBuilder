/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    var port = process.env.PORT;
    var ip = process.env.IP;
    
    grunt.initConfig({
        //Moves all bower components to lib folder in wwwroot
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/bower_components",
                    layout: "byComponent",
                    cleanTargetDir: false,
                    
                }
            }
        },

        bowerInstall: {
            target: {
                src: ["index.html"]
            }
        },
        
        //Compiles less
        less: {
            dev: {
                options: {
                    paths: ["Assets"]
                },
                files: { "wwwroot/css/base.css": "styles/base.less" }
            },
            dist: {
                files: { "dist/css/base.css": "styles/base.less" }
            }
        },
        
        copy: {
            dev: {
                files: [{
                    dest: "wwwroot/",
                    expand: true,
                    src: [
                        "*.html",
                        "views/*.html",
                        "scripts/*.js",
                        "scripts/controllers/*.js"
                    ]
                }]
            },
            
            dist: {
                files: [{
                    dest: "dist/",
                    expand: true,
                    src: [
                        "scripts/test.ts"
                    ]
                }]
            }
        },
        
        wiredep: {            
            dev: {
                src: ["index.html"],
                ignorePath: /\b(\/dist)\b/g
            }
        },
        
        typescript: {
            dev: {
                src: ["scripts/**/*.ts"],
                dest: "wwwroot/",
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: '',
                    sourcemap: false,
                    declaration: false,
                    ignoreError: false
                }
            },
            
            dist: {
                src: ["scripts/**/*.ts"],
                dest: "dist/",
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: '',
                    declaration: true,
                    sourceMap: true,
                    ignoreError: false
                }
            }
        },
        
        watch: {
            less: {
                files: ['styles/*.less'],
                tasks: ['less']
            },
            typescript: {
                files: ['scripts/**/*.ts'],
                tasks: ['typescript']
            },
            js: {
                files: [
                    "*.html",
                    "views/*.html",
                    "scripts/*.js",
                    "scripts/controllers/*.js"
                ],
                tasks: ['copy']
            },
        },
        
        connect: {
            server: {
                options: {
                    port: port,
                    hostname: ip,
                    base: 'wwwroot/'
                }
            }
        },
        
        uglify: {
            dist: {
                files: {
                    'dist/scripts/test.min.js': ['dist/scripts/test.js']
                }
            }
        },
        
        cssmin: {
            options: {
                sourceMap: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },
        
        clean: ["dist/"],
        
        autoprefixer: {
            dist: {
                src: 'dist/css/base.css'
            }
        }
        
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install"]);

    grunt.registerTask("clean", [
        "clean"
    ]);
    grunt.registerTask("server", [
        "bower:install",
        "wiredep",
        "copy",
        "less",
        "typescript",
        "connect",
        "watch"
    ]);
    
    grunt.registerTask("build", [
        "bower:install",
        "wiredep",
        "copy",
        "less",
        "typescript"
    ]);
    
    grunt.registerTask("dist", [
        //"bower:install",
        //"wiredep",
        "copy:dist",
        "less:dist",
        "typescript:dist",
        "uglify:dist",
        "autoprefixer",
        "cssmin"
    ]);

    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-bower-install");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy"); 
    grunt.loadNpmTasks("grunt-wiredep");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
};