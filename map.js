var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var leaflet = (function () {
    var map;
    var layerForUserRectangles;
    function init() {
        map = L.map('map').setView([42.697930, 23.321628], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <createCoordinatesReturn href="http://openstreetmap.org">OpenStreetMap</createCoordinatesReturn> contributors, <createCoordinatesReturn href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</createCoordinatesReturn>, Imagery © <createCoordinatesReturn href="http://mapbox.com">Mapbox</createCoordinatesReturn>',
            maxZoom: 18,
            id: 'mapbox.streets-basic',
            accessToken: 'pk.eyJ1IjoiY2hpcHNhbiIsImEiOiJqa0JwV1pnIn0.mvduWzyRdcHxK_QIOpetFg'
        }).addTo(map);
        // the collapsible sidebar with redraw/download etc. custom buttons
        L.control.sidebar('sidebar').addTo(map);
        // where we draw rectangles
        layerForUserRectangles = new L.FeatureGroup();
        map.addLayer(layerForUserRectangles);
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: layerForUserRectangles
            },
            draw: {
                circle: false,
                circlemarker: false,
                marker: false,
                polygon: false,
                polyline: false,
            }
        });
        map.addControl(drawControl);
    }
    function enableDrawing(callbackOnRectDrawn, callbackOnDelete) {
        // todo handle "edited" too
        leaflet.map.on('draw:created', function (e) {
            var type = e.layerType, layer = e.layer;
            if (type !== "rectangle") {
                return true;
            }
            layerForUserRectangles.clearLayers();
            console.log(type);
            var latlngs = layer.getLatLngs()[0];
            layerForUserRectangles.addLayer(layer);
            console.log(JSON.stringify(latlngs));
            // convert the result
            var rectangleBounds = L.latLngBounds(latlngs.map(function (coord) {
                return [coord.lat, coord.lng];
            }));
            var boundingRectangle = L.rectangle(rectangleBounds);
            // pass the drawn rectangle to the callback
            callbackOnRectDrawn(boundingRectangle);
        });
        leaflet.map.on("draw:deleted", callbackOnDelete);
    }
    /**
     * Given a layer, coordinates of the center of circles and the radius of the circle,
     * draw the circles on the layer
     * @param {LatLng[]} coords
     * @param {LayerGroup} layer
     * @param {number} circleRadius
     * @param {{}} circleOptions
     */
    function drawCircles(coords, layer, circleRadius, circleOptions) {
        if (circleRadius === void 0) { circleRadius = 300; }
        if (circleOptions === void 0) { circleOptions = {}; }
        var opts = __assign({ color: "red" }, circleOptions);
        coords.forEach(function (coord) {
            new L.Circle(coord, circleRadius, opts).addTo(layer);
        });
    }
    init();
    return {
        map: map,
        enableDrawing: enableDrawing,
        drawCircles: drawCircles
    };
})();
