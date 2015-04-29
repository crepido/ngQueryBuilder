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

