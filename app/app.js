'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.servo.station',
  'myApp.servo.incident',
  'myApp.version'
])
.constant('BASE_URL', 'http://amberheilman.com')
.factory('Service', ['BASE_URL', '$resource', function(BASE_URL, $resource) {
  return {
    station: $resource(
      BASE_URL + '/stations/:id',
      { id: '@id' }
    ),
    incident: $resource(
      BASE_URL + '/incidents/:id',
      { id: '@id' }
    )
  }
}])
.config(['$routeProvider', '$resourceProvider',
         function($routeProvider, $resourceProvider) {
  $routeProvider.otherwise({ redirectTo: '/stations' });
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
