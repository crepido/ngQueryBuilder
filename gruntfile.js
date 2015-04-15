/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
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
        }
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install"]);

    grunt.registerTask("build", [
        "bower:install",
        "wiredep",
        "copy",
        "less",
        "typescript"
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

};