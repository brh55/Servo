'use strict';

angular.module('myApp.servo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'servo/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['Service', '$scope', function(Service, $scope) {
  var mapOptions = {
    zoom: 9,
    center: new google.maps.LatLng(40.004883, -75.118033)
    //Philadelphia Cooridnates
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
                                mapOptions);
  var stations = Service.station.query(
    // success callback
    function(value, responseHeaders) {
      for (var i = 0; i < stations.length; i++) {
        var Lat = stations[i].x / 67543.4729809435;
        var Lng = stations[i].y / -3315.868693552735;
        var myLatlng = new google.maps.LatLng(Lat, Lng);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: stations[i].station_id
        });
      }
    },
    function(httpResponse) {
      // Assign error to `httpResponse` to access attributes via dot notation.
      $scope.error = httpResponse;
    }
  );
}]);
