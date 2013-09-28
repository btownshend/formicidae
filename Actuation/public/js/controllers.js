'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);
  
app.controller('AppCtrl', function ($scope, $http) {

  $http({
    method: 'GET',
    url: '/api/name'
  }).
  success(function (data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function (data, status, headers, config) {
    $scope.name = 'Error!'
  });

});

var InputBlockCtrl = function ($scope) {
  $scope.inputs = [];

  $scope.onTypeaheadSelect = function(index) {
    // call checkValidity function
    $scope.inputs[index].checkValidity();
  };

  $scope.defaultTypeahed = function(inputText) {
    return [];
  };

  $scope.getMatches = function (inputText, index) {

    // call typeahead fetch function on the input obj and return the results
    // !!! typeahead fetch function must return a promise
    var inputObj = $scope.inputs[index];
    return inputObj.typeaheadFetch(inputText, function(results) {
      inputObj.typeaheadResults = results;
      inputObj.checkValidity();
      return inputObj.typeaheadResults;
    });
  };
};

app.controller('MyCtrl1', function ($scope, $http, $injector) {

  // inject the state of InputBlockCtrl
  $injector.invoke(InputBlockCtrl, this, {$scope: $scope});

  // input1
  $scope.inputs.push({
    name : "input1",
    value : 300,
    type : "number",
    helpText : "",
    mappedProperty : "mappedProperty1"

  });

  // input2
  $scope.inputs.push({    
    name : "input2",
    value : "Value",
    type : "text",      
    typeahead : "value.name for value in getMatches($viewValue, $index)",
    helpText : "(optional)",
    mappedProperty : function(item) {
      return item.name;
    },
    typeaheadResults : [],
    selectedObj : null,
    typeaheadFetch : function(searchText, callback) {        
      // example function returning promise, and then results
      return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+searchText).then(function(response){
        var results = [{name : "salmon agah"}, {name : "jose fernandez"}, {name : "elissa steamer"}];
        return callback(results);
      });
    },
    checkValidity : function() {
      var valid = false;
      for (var i = 0; i < this.typeaheadResults.length; i++) {
        if (this.typeaheadResults[i].name === this.value) {
          console.log("exact typeahead match!");
          this.selectedObj = this.typeaheadResults[i];
          valid = true;
          break;
        } 
      }

      // reset selectedObj to null if we don't have a match
      if (!valid) {
        this.selectedObj = null;
      }
    }
  });

});

app.controller('MyCtrl2', function ($scope, $http, $injector) {
  
    // inject the state of InputBlockCtrl
  $injector.invoke(InputBlockCtrl, this, {$scope: $scope});

  $scope.year = {
    name : "input3",
    value : 600,
    type : "number",
    helpText : "the number of photons in the sun",
    mappedProperty : "mappedProperty1"
  };
  $scope.inputs.push($scope.year);

  $scope.lastName = {    
    name : "lastName",
    value : "",
    type : "text",      
    typeahead : "value.lastName for value in getMatches($viewValue, $index)",
    helpText : "",
    mappedProperty : function(item) {
      return item.lastName;
    },
    typeaheadResults : [],
    selectedObj : null,
    typeaheadFetch : function(searchText, callback) {        
      // example function returning promise, and then results
      return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+searchText).then(function(response){
        var results = [{lastName : "agah"}, {lastName : "fernandez"}, {lastName : "steamer"}];
        return callback(results);
      });
    },
    checkValidity : function() {
      var valid = false;
      for (var i = 0; i < this.typeaheadResults.length; i++) {
        if (this.typeaheadResults[i].lastName === this.value) {
          console.log("exact typeahead match!");
          this.selectedObj = this.typeaheadResults[i];
          valid = true;
          break;
        } 
      }

      // reset selectedObj to null if we don't have a match
      if (!valid) {
        this.selectedObj = null;
      }
    }
  };
  $scope.inputs.push($scope.lastName);

  $scope.tags = {
    name : "tags",
    value : "",
    type : "text",
    helpText : "whatever you want to write",
  };
  $scope.inputs.push($scope.tags);

  $scope.submit = function() {
    console.log("tags: " + $scope.tags.value);
  };

}); 
