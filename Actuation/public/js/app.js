'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.bootstrap'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/admin', {
      templateUrl: 'partials/admin',
      controller: 'AdminCtrl'
    }).
    otherwise({
      redirectTo: '/admin'
    });

  $locationProvider.html5Mode(true);
});
