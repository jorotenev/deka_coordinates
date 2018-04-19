// FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);
map.on('draw:created', function (e) {
    var type = e.layerType, layer = e.layer;
    console.log(type);
    var latlngs = layer.getLatLngs()[0];
    console.log(JSON.stringify(latlngs));
    drawnItems.addLayer(layer);
});
