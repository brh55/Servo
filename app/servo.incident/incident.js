'use strict';

angular.module('myApp.servo.incident', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/incidents', {
      templateUrl: 'servo.incident/partials/index.html',
      controller: 'IncidentListCtrl'
    })
    .when('/incidents/:id', {
      templateUrl: 'servo.incident/partials/view.html',
      controller: 'IncidentViewCtrl'
    })
  ;
}])
.controller('IncidentListCtrl', ['Service', '$scope',
                                function(Service, $scope) {
  // This code may not be used. Keeping it here just in case, though.
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(37.774546, -122.433523),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
                                mapOptions);
  var incidents = Service.incident.query(
    // success callback
    function(value, responseHeaders) {
      var incidentData = [];
      for (var i = 0; i < incidents.length; i++) {
        var location = incidents[i].location;
        var lat = location.x;
        var lng = location.y;
        incidentData.push(new google.maps.LatLng(lat, lng));
      }
      var pointArray = new google.maps.MVCArray(incidentData);
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray
      });
      heatmap.setMap(map);
    },
    function(httpResponse) {
      // Assign errors to httpResponse to access attributes via dot notation.
      $scope.errors = httpResponse;
    }
  );
}])

.controller('IncidentViewCtrl', ['Service', '$scope', '$routeParams',
                                function(Service, $scope, $routeParams) {
  var incident = Service.incident.get(
    { id: $routeParams.id },
    function(value, responseHeaders) {
      $scope.incident = incident;
    }
  );
}]);
