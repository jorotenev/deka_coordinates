/*
 * Given a map, let a user select a rectangle on it
 */
var leafletDrawing = (function (leaflet) {
    var drawnItems = new L.FeatureGroup();
    leaflet.map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            circle: false,
            circlemarker: false,
            marker: false,
            polygon: false,
            polyline: false,
        }
    });
    leaflet.map.addControl(drawControl);
    function enableDrawing(callback) {
        // todo handle "edited" and "deleted" too
        leaflet.map.on('draw:created', function (e) {
            var type = e.layerType, layer = e.layer;
            if (type !== "rectangle") {
                return true;
            }
            drawnItems.clearLayers();
            console.log(type);
            var latlngs = layer.getLatLngs()[0];
            drawnItems.addLayer(layer);
            console.log(JSON.stringify(latlngs));
            callback(latlngs);
        });
    }
    return {
        enableDrawing: enableDrawing
    };
})(leaflet);
