;(function() {
	require(['esri/Map', 'esri/views/MapView', 'dojo/domReady!'], MapBuilder);

  function MapBuilder(Map, MapView) {

    var map = new Map({
      basemap: "streets"
    });

    var view = new MapView({
      container: 'mapContainer',
      map: map,
      zoom: 4,
      center: [15, 65]
    });

    var coordinatesElement = document.getElementById('coordinates');

    view.on('click', function(event) {
      // Get the coordinates of the click on the view
      var lat = event.mapPoint.latitude.toFixed(3);
      var lon = event.mapPoint.longitude.toFixed(3);

      coordinatesElement.innerText = 'You clicked at: ' + coordinatesPresentation(lon, lat);
    });
  }

  function coordinatesPresentation(lon, lat) {
    return '[' + lon + ', ' + lat + ']';
  }
})();