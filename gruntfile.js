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
            },
            wwwdist: {
                options: {
                    targetDir: "wwwdist/bower_components",
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
            },
            wwwdist: {
                files: { "wwwdist/css/base.css": "styles/base.less" }
            }
        },
        
        //Copies files to specific destination folder
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
            },
            
            wwwdist: {
                files: [{
                    dest: "wwwdist/",
                    expand: true,
                    src: [
                        "*.html",
                        "views/*.html",
                        "scripts/*.js",
                        "scripts/controllers/*.js"
                    ]
                }]
            }
        },
        
        //Adds references to bower components in html file
        wiredep: {            
            dev: {
                src: ["index.html"],
                ignorePath: /\b(\/dist)\b/g
            }
        },
        
        //Compiles TypeScript to JavaScript 
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
            },
            
            wwwdist: {
                src: ["scripts/**/*.ts"],
                dest: "wwwdist/",
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: '',
                    sourcemap: false,
                    declaration: false,
                    ignoreError: false
                }
            }
        },
        
        //Listens on file changes and runs tasks if file is changed.
        watch: {
            less: {
                files: ['styles/*.less'],
                tasks: ['less:dev']
            },
            typescript: {
                files: ['scripts/**/*.ts'],
                tasks: ['typescript:dev']
            },
            js: {
                files: [
                    "*.html",
                    "views/*.html",
                    "scripts/*.js",
                    "scripts/controllers/*.js"
                ],
                tasks: ['copy:dev']
            },
        },
        
        //Sets up simple webserver
        connect: {
            server: {
                options: {
                    port: port,
                    hostname: ip,
                    base: 'wwwroot/'
                }
            }
        },
        
        //Minification JavaScript
        uglify: {
            dist: {
                files: {
                    'dist/scripts/ngquerybuilder.min.js': ['dist/scripts/*.js']
                }
            }
        },
        
        //Minification CSS
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
        
        //Removes everything in folder
        clean: {
            dist: ["dist/"],
            dev: ["wwwroot/"],
            wwwdist: ["wwwdist/"]
        },
        
        //Adds missing browser specific prefixes for CSS3
        autoprefixer: {
            dist: {
                src: 'dist/css/base.css'
            }
        },
        
        useminPrepare: {
            html: 'wwwdist/index.html',
            options: {
                dest: 'wwwdist/',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        
        usemin: {
            html: ['wwwdist/index.html']
        },
        
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install"]);

    grunt.registerTask("clean", [
        "clean"
    ]);
    grunt.registerTask("server", [
        "clean:dev",
        "bower:install",
        "wiredep",
        "copy:dev",
        "less:dev",
        "typescript:dev",
        "connect",
        "watch"
    ]);
    
    grunt.registerTask("build", [
        "bower:install",
        "wiredep",
        "copy:dev",
        "less:dev",
        "typescript:dev"
    ]);
    
    grunt.registerTask("dist", [
        "clean:dist",
        "copy:dist",
        "less:dist",
        "typescript:dist",
        "uglify:dist",
        "autoprefixer",
        "cssmin"
    ]);
    
    grunt.registerTask("watch", [
        "watch"
    ]);
    
    grunt.registerTask("wwwdist", [
        "clean:wwwdist",
        "bower:wwwdist",
        "wiredep",
        "copy:wwwdist",
        "less:wwwdist",
        "typescript:wwwdist",
        "useminPrepare",
        'concat:generated',
        //'cssmin:generated',
        'uglify:generated',
        "usemin"
    ]);

    // Load plugins for Grunt
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
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-filerev');
};