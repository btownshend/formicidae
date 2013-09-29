'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);

app.controller('AppCtrl', function ($scope, $http) {

});

app.controller('AdminCtrl', function ($scope, $http, $injector) {

  $scope.connectPrinter = function() {
    $http.get('/api/connectPrinter').then(function(response) {
      console.log("response: " + JSON.stringify(response));
    });

    console.log("connect the printer!");
  };

});
