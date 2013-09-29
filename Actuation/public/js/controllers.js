'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);

app.controller('AppCtrl', function ($scope, $http) {

});

app.controller('AdminCtrl', function ($scope, $http, $injector, SocketConnection) {

  // Housekeeping: open socket connection for the app
  SocketConnection.on('init', function (data) {
    console.log("socket opened (init received):  " + data.msg);
  });

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

  $scope.setTrackingMode = function(mode) {
    console.log("set tracking mode: " + mode);
    $http.put('/api/setTrackingMode', {mode : mode}).then(function(response) {
    }); 
  }

  $scope.handleKeypress = function(key) {


    if (key == 37) {
      $scope.info.command = "move X -10 8000";
    } else if (key == 39) {
      $scope.info.command = "move X 10 8000";
    } else if (key == 38) {
      $scope.info.command = "move Y 10 8000";
    } else if (key == 40) {
      $scope.info.command = "move Y -10 8000";
    }
    $scope.printCommand();
    console.log(key);
  };

  var mouseIsDown = false;

  function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
  }


  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function drawMouse(x, y) {
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
  }

  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  context.fillCircle = function(x, y, radius, fillColor) {
            this.fillStyle = fillColor;
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
        };

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    // var radius = 10; // or whatever
    // var fillColor = '#ff0000';
    // context.fillCircle(mousePos.x, mousePos.y, radius, fillColor);
    if (mouseIsDown) {
      drawMouse(mousePos.x, mousePos.y);
      sendMousePositionToServer(mousePos.x, mousePos.y);
    }

    //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      //writeMessage(canvas, message);
  }, false);

  canvas.onmousedown = function(e){
    mouseIsDown = true;
    var position = getMousePos(canvas, e);
    drawMouse(position.x, position.y);
  }
  canvas.onmouseup = function(e){
    mouseIsDown = false;
  }

  function sendMousePositionToServer(x, y) {
    SocketConnection.emit('mouseevent', {x : x, y : y}, null);
  }

});
