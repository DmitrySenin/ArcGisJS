;(function() {
	require(['esri/Map', 'esri/views/MapView', 'esri/tasks/Locator', 'esri/widgets/Search', 'dojo/domReady!'], MapBuilder);

  function MapBuilder(Map, MapView, Locator, Search) {

    var map = new Map({
      basemap: "streets"
    });

    var view = new MapView({
      container: 'mapContainer',
      map: map,
      zoom: 4,
      center: [15, 65]
    });

    var searchWidget = new Search({
      view: view
    });
    searchWidget.startup();

    view.ui.add(searchWidget, {
      position: 'top-left',
      index: 0
    });

    var coordinatesElement = document.getElementById('coordinates');

    var locator = new Locator({
      url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });

    view.on('click', function(event) {
      var lat = event.mapPoint.latitude.toFixed(3);
      var lon = event.mapPoint.longitude.toFixed(3);

      view.popup.open({
        location: event.mapPoint,
        title: 'Coordinates: ' + coordinatesPresentation(lon, lat)
      });

      locator.locationToAddress(event.mapPoint).then(function(response) {
         view.popup.content = response.address.Match_addr;
      }).otherwise(function(err) {
         view.popup.content = "No address was found for this location";
      });
    });
  }

  function coordinatesPresentation(lon, lat) {
    return '[' + lon + ', ' + lat + ']';
  }
})();