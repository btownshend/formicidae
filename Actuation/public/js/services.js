'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');


  // socket service (use 'factory' service definition so we can run one-time code before returning service)
app.factory('SocketConnection', function ($rootScope) {

  var socket = io.connect();
  var sessionIdTag = null;


  // register the sessionID callback
  socket.on("sessionID", function(data) {
    sessionIdTag = data;
    console.log("sessionID: " + JSON.stringify(data));
  });

  
  return {

    sessionId : function() {
      return sessionIdTag
    },
    
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },

    emit: function (eventName, data, callback) {
      console.log("emit");
/*
      // TODO only add handler if callback is not null...
      // add a result callback: OriginalEventName + '_Result' 
      socket.on(eventName+"_Result", function() {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);            
          }
        });
      });
*/
      // actually emit
      socket.emit(eventName, data);
    }
  };
});

