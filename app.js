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

  }
})();