;(function() {
  var configuration = {};

	require(['esri/config', 'esri/Map', 'esri/views/SceneView', 'esri/tasks/Locator', 'esri/widgets/Search', 'esri/layers/ElevationLayer', 'esri/layers/OpenStreetMapLayer', 'dojo/domReady!'], MapBuilder);

  function MapBuilder(esriConfig, Map, MapView, Locator, SearchWidget, ElevationLayer, OpenStreetMapLayer) {
    configureMap(Map);
    configureMapView(MapView, configuration);
    configureSearch(SearchWidget, configuration);
    configurePopup(Locator, configuration);
    configureElevationLayer(ElevationLayer, configuration);
    configureOpenStreetMapLayer(OpenStreetMapLayer, configuration, esriConfig);
    configureLayerSwitch(configuration);
  }

  function configureMap(Map) {
    configuration.map = new Map({
      basemap: 'topo',
      ground: 'world-elevation'
    }); 
  }

  function configureMapView(MapView, configuration) {
    configuration.mapView = new MapView({
      container: 'mapContainer',
      map: configuration.map,
      camera: {
        position: [-121.83, 48.279, 1346],
        heading: 300,
        tilt: 60
      }
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

  function configureElevationLayer(ElevationLayer, configuration) {
    configuration.elevationLayer = new ElevationLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/OsoLandslide/OsoLandslide_After_3DTerrain/ImageServer',
      visible: false
    });
    configuration.map.ground.layers.add(configuration.elevationLayer);
  }

  function configureOpenStreetMapLayer(OpenStreetMapLayer, configuration, esriConfig) {
    esriConfig.request.corsEnabledServers.push('a.tile.openstreetmap.org', 'b.tile.openstreetmap.org', 'c.tile.openstreetmap.org');
    configuration.osmLayer = new OpenStreetMapLayer({
      visible: true
    });
    configuration.map.add(configuration.osmLayer);
  }

  function configureLayerSwitch(configuration) {
    var layers = document.getElementsByName("layer");
    
    for(var i = 0; i < layers.length; i++) {
      layers[i].onchange = function (event) {
        switch(event.target.value) {
          case 'Elevation': 
            configuration.elevationLayer.visible = true;
            configuration.osmLayer.visible = false;
            break;

          default:
            configuration.elevationLayer.visible = false; 
            configuration.osmLayer.visible = true;
        }
      }
    }
  }

  function coordinatesPresentation(lon, lat) {
    return '[' + lon + ', ' + lat + ']';
  }
})();