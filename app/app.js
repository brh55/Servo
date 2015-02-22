'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.servo',
  'myApp.version'
])
.constant('BASE_URL', 'http://confident-tornado-80-198004.use1-2.nitrousbox.com')
.factory('Service', ['BASE_URL', '$resource', function(BASE_URL, $resource) {
  return {
    station: $resource(
      BASE_URL + '/stations/:id',
      { id: '@id' }
    )
  }
}])
.config(['$routeProvider', '$resourceProvider',
         function($routeProvider, $resourceProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
