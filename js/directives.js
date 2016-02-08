'use strict';

var directives = angular.module('directives', []);

directives.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      var values = [];
      el.bind('change', function(event){
        var files = event.target.files;
        // values.push(files); 
        // var file = files[0];
        scope.file = files;
        scope.$parent.file = files;
        scope.$apply();
      });
    }
  };
});