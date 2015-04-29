ngQueryBuilder
======

Requirements
------
#### node & npm
[Install nodejs](https://nodejs.org/download/), npm is included (i think). Also checkout [npm](https://www.npmjs.com/).

#### Bower
[Install bower](http://bower.io/#install-bower)

```sh
$ npm install -g bower
```

#### Grunt
[Install grunt](https://github.com/gruntjs/grunt-cli/blob/master/README.md)

```sh
$ npm install -g grunt-cli
```

#### TSD (Optional)
This is just a package manager for TypeScript definitions.
[Install TSD](http://definitelytyped.org/tsd/)

```sh
$ npm install tsd -g
```

Setup
------
Run the **build** task in **grunt** to download all bower packages and to build project to **wwwroot**.

```sh
$ grunt build
```

##### Other Tasks

```sh
$ grunt wwwdist
```
> Builds bundled minified version to **wwwdist**.

```sh
$ grunt watch
```
> Listens for file changes and rebuilds appropriate files out to wwwroot directory.

```sh
$ grunt server
```
> Runs small webserver in wwwroot directory and also adds a watch.

Run
======
#### NodeJs
```sh
$ node server
```

#### Grunt
```sh
$ grunt server
```

Used Grunt Tasks
======
* **grunt-bower-task**
  * ...
* **grunt-bower-install**
  * Installs packages that exists in bower.json.
* **grunt-contrib-less**
  * Compiles less into css.
* **grunt-contrib-copy**
  * Copies files from one directory to another.
* **grunt-wiredep**
  * Inserts `script` tags for bower components into html file. 
* **grunt-typescript**
  * Compiles TypeScript files into JavaScript.
* **grunt-contrib-watch**
  * Tracks file changes and runs grunt tasks if files are updated.
* **grunt-contrib-connect**
  * Simple webserver.
* **grunt-contrib-uglify**
  * Uglifies JavaScript.
* **grunt-contrib-cssmin**
  * Minifies Css.
* **grunt-contrib-clean**
  * Cleans/Removes directory.
* **grunt-autoprefixer**
  * Automatically adds vendor specific prefixes like `-moz-` and `-ms-`. 
* **grunt-usemin**
  * Task to compile released version, uses for example **concat**, **uglify** and **cssmin**.
* **grunt-contrib-concat**
  * Bundles files.
* **grunt-filerev**
  * Adds ending file revision in file name. Caching purpose.
