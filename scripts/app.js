﻿'use strict';

/**
 * @ngdoc overview
 * @name testAppApp
 * @description
 * # testAppApp
 *
 * Main module of the application.
 */
angular
  .module('testAppApp', [
    //'ngAnimate',
    //'ngCookies',
    //'ngResource',
    'ngRoute',
    //'ngSanitize',
    //'ngTouch',
    'ui.bootstrap',
    'ui.tree',
    'kendo.directives'
  ])
  .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
            templateUrl: 'views/queryBuilder.html',
            controller: 'QueryBuilderController'
        })
        .otherwise({
            redirectTo: '/error'
        });
  }]);
