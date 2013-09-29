'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);

app.controller('AppCtrl', function ($scope, $http) {

});

app.controller('AdminCtrl', function ($scope, $http, $injector) {

  $scope.info = {};

  $scope.connectPrinter = function() {
    var connectCommand = "connect /dev/cu.usbmodemfd121 230400";
    console.log(connectCommand);
    $http.put('/api/printCommand', {command : connectCommand}).then(function(response) {      
    });
  };

  $scope.printCommand = function() {
    var command = $scope.info.command;
    console.log(command);
    $http.put('/api/printCommand', {command : command}).then(function(response) {
    });
  }

});
