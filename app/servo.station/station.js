'use strict';

angular.module('myApp.servo.station', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/stations', {
      templateUrl: 'servo.station/partials/index.html',
      controller: 'StationListCtrl'
    })
    .when('/stations/:id', {
      templateUrl: 'servo.station/partials/view.html',
      controller: 'StationViewCtrl'
    })
  ;
}])
.controller('StationListCtrl', ['Service', '$scope',
                                function(Service, $scope) {
  var mapOptions = {
    zoom: 9,
    // Philadelphia Cooridnates
    center: new google.maps.LatLng(40.004883, -75.118033)
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
                                mapOptions);
  var infoWindow = new google.maps.InfoWindow();
  var stations = Service.station.query(
    // Success callback
    function(value, responseHeaders) {
      // First create markers for each location.
      for (var i = 0; i < stations.length; i++) {
        // Due to the fact that the ArcGIS API returns geometry results
        // that do not adhere to standard latitude and longitude
        // coordinates, the `x` and `y` values must be divided the
        // values listed below.
        var Lat = stations[i].x / 67543.4729809435;
        var Lng = stations[i].y / -3315.868693552735;
        var myLatlng = new google.maps.LatLng(Lat, Lng);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: stations[i].station_id
        });
        // Register event listener for click event of marker and display
        // information regarding a specific station.
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infoWindow.setContent(
              '<div>' + stations[i].station_id + '</div>' +
              '<div><a href="#/stations/' + stations[i].station_id + '">View</a>'
            );
            infoWindow.open(map, marker);
          }
        })(marker, i));
      }
    },
    // Error callback
    function(httpResponse) {
      // Assign errors to httpResponse to access attributes via dot notation.
      $scope.errors = httpResponse;
    }
  );
  // Query all incidents to plot Heatmaps data. This, however, is
  // repetitive. Ideally, the incidents endpoint would contain
  // information (e.g. lat, lng coordinates) of the stations associated
  // with the incident. This would mean that only one call would need to
  // be made in order to retrieve both incident and station data.
  var incidents = Service.incident.query(
    // success callback
    function(value, responseHeaders) {
      var incidentData = [];
      for (var i = 0; i < incidents.length; i++) {
        var location = incidents[i].location;
        var lat = location.x / 67543.4729809435;
        var lng = location.y / -3315.868693552735;
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
.controller('StationViewCtrl', ['Service', '$scope', '$routeParams',
                                function(Service, $scope, $routeParams) {
  var station = Service.station.get(
    { id: $routeParams.id },
    function(value, responseHeaders) {
      $scope.station = station;
    }
  );
}]);
