;(function() {
  var configuration = {};

	require(['esri/Map', 'esri/views/MapView', 'esri/tasks/Locator', 'esri/widgets/Search', 'dojo/domReady!'], MapBuilder);

  function MapBuilder(Map, MapView, Locator, SearchWidget) {
    configureMap(Map);
    configureMapView(MapView, configuration);
    configureSearch(SearchWidget, configuration);
    configurePopup(Locator, configuration);
  }

  function configureMap(Map) {
    configuration.map = new Map({
      basemap: "streets"
    }); 
  }

  function configureMapView(MapView, configuration) {
    configuration.mapView = new MapView({
      container: 'mapContainer',
      map: configuration.map,
      zoom: 4,
      center: [15, 65]
    });
  }

  function configureSearch(SearchWidget, configuration) {
    configuration.searchWidget = new SearchWidget({
      view: configuration.mapView
    });
    configuration.searchWidget.startup();

    configuration.mapView.ui.add(configuration.searchWidget, {
      position: 'top-left',
      index: 0
    });
  }

  function configurePopup(Locator, configuration) {
    var locator = new Locator({
      url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    }); 

    var coordinatesElement = document.getElementById('coordinates');

    configuration.mapView.on('click', function(event) {
      var lat = event.mapPoint.latitude.toFixed(3);
      var lon = event.mapPoint.longitude.toFixed(3);

      configuration.mapView.popup.open({
        location: event.mapPoint,
        title: 'Coordinates: ' + coordinatesPresentation(lon, lat)
      });

      locator.locationToAddress(event.mapPoint).then(function(response) {
         configuration.mapView.popup.content = response.address.Match_addr;
      }).otherwise(function(err) {
         configuration.mapView.popup.content = "No address was found for this location";
      });
    });
  }

  function coordinatesPresentation(lon, lat) {
    return '[' + lon + ', ' + lat + ']';
  }
})();