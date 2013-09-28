'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).
  directive('addTypeahead', function () {

    return {
      controller: ['$scope', '$element', '$attrs', '$transclude', function($scope, $element, $attrs, $transclude) { 

        var inputModel = $scope.inputs[$scope.$index];


        if (inputModel.typeahead) {                    
          $attrs.$set('typeahead', inputModel.typeahead);
        }
      }]
    };
  });
