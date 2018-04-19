/*
 * Given a map, let a user select a rectangle on it
 */

let leafletDrawing = (function (leaflet) {
    let drawnItems = new L.FeatureGroup();
    leaflet.map.addLayer(drawnItems);

    let drawControl = new L.Control.Draw({
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


    function enableDrawing(callback: (rectangle: L.LatLng[]) => any) {
        // todo handle "edited" and "deleted" too
        leaflet.map.on('draw:created', function (e) {
            let type = e.layerType,
                layer = e.layer;
            if (type !== "rectangle") {
                return true
            }
            drawnItems.clearLayers();
            console.log(type)
            let latlngs = layer.getLatLngs()[0];
            drawnItems.addLayer(layer);
            console.log(JSON.stringify(latlngs));
            callback(latlngs);
        });
    }

    return {
        enableDrawing: enableDrawing
    }
})(leaflet);
