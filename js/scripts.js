initMap();

var mymap;
var geojson;

function getColor(d) {
    return d > 0.3  ? '#006d2c' :
           d > 0.225  ? '#31a354' :
           d > 0.15   ? '#74c476' :
           d > 0.075   ? '#bae4b3' :
           d > 0.0   ? '#edf8e9' :
                      '#ffffff';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.percentage),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function initMap() {
mymap = L.map('map').setView([35.405110, -79.721860], 7);

addLateralData();
getColor();
style();
}

function addLateralData(){
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: myMapsKey
}).addTo(mymap);

console.log("made it here");
// L.geoJson(lateralData).addTo(mymap);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
  }


function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
  }

  geojson = L.geoJson(lateralData, {
      style: style,
      onEachFeature: onEachFeature
  }).addTo(mymap);

  // Show info on hover
  var info = L.control();

  info.onAdd = function (mymap) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };

  info.update = function (props) {
      this._div.innerHTML = '<h4>Lateral Entry Teachers in North Carolina</h4>' +  (props ?
          '<b>' + props.name + '</b><br />' + props.percentage*100 + '%'
          : 'Hover over a county');
  };

  info.addTo(mymap);


  // Create legend

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (mymap) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0.0, 0.075, 0.15, 0.225, 0.3],
          labels = [];
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < (grades.length - 1); i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(grades[i+1]) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

      return div;
  };

  legend.addTo(mymap);
}

geojson = L.geoJson(lateralData, {style: style}).addTo(mymap);
