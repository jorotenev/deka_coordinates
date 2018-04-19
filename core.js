var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Bearing;
(function (Bearing) {
    Bearing[Bearing["east"] = 90] = "east";
    Bearing[Bearing["west"] = -90] = "west";
    Bearing[Bearing["north"] = 0] = "north";
    Bearing[Bearing["south"] = 180] = "south";
})(Bearing || (Bearing = {}));
var RectangleSide;
(function (RectangleSide) {
    // todo add others
    RectangleSide["northWest"] = "NorthWest";
})(RectangleSide || (RectangleSide = {}));
function coordsOfRow(bounds, initialCoord, distance) {
    var result = [];
    var currentPosition = initialCoord;
    while (geoUtils.isWithinBounds([bounds.getWest(), bounds.getEast()], currentPosition.lng)) {
        result.push(currentPosition);
        var next = geoUtils.calculateNextPoint(currentPosition, distance, Bearing.east);
        currentPosition = next.point;
    }
    return result;
}
function crateCoordinates(options) {
    var result = [];
    var fillers = [];
    var rectBounds = options.boundingRectangle.getBounds();
    var dist = options.distance;
    var initialPoint = Object.freeze(rectBounds.getNorthWest());
    var currentCoord = initialPoint;
    for (var row = 1;; row++) {
        var currentRowInitial = Object.freeze(currentCoord);
        result.push(currentRowInitial);
        for (;;) {
            currentCoord = geoUtils.calculateNextPoint(currentCoord, options.distance, Bearing.east).point;
            result.push(L.latLng(currentCoord.lat, currentCoord.lng));
            if (!geoUtils.isWithinBounds([rectBounds.getWest(), rectBounds.getEast()], currentCoord.lng)) {
                var shiftSouth = geoUtils.calculateNextPoint(currentRowInitial, dist / 2, Bearing.south).point;
                var shiftEast = geoUtils.calculateNextPoint(shiftSouth, dist / 2, Bearing.east).point;
                var helperRowCoords = coordsOfRow(rectBounds, shiftEast, dist);
                break; // start a new row
            }
        }
        // get the first coordinate of the next row
        if (!geoUtils.isWithinBounds([rectBounds.getNorth(), rectBounds.getSouth()], currentCoord.lat)) {
            break;
        }
        currentCoord = geoUtils.calculateNextPoint(initialPoint, options.distance * row, Bearing.south).point;
    }
    return { main: result, fillers: fillers };
}
function drawCircles(coords, layer, circleRadius, circleOptions) {
    if (circleRadius === void 0) { circleRadius = 300; }
    if (circleOptions === void 0) { circleOptions = {}; }
    var opts = __assign({ color: "red" }, circleOptions);
    coords.forEach(function (coord) {
        new L.Circle(coord, circleRadius, opts).addTo(layer);
    });
}
function main() {
    var rectangleBounds = L.latLngBounds(rawAreaCoords.map(function (coord) {
        return [coord.lat, coord.lng];
    }));
    var boundingRectangle = L.rectangle(rectangleBounds).addTo(map);
    // the radius of the circles that will fill the rectangle
    var circle_radius = 150; // metres
    // create all the coordinates of the circles within the bounding area
    var coords = crateCoordinates({
        boundingRectangle: boundingRectangle,
        distance: circle_radius * 2,
    });
    // create a layer on which the circles will be drawn
    var circlesLayer = new L.FeatureGroup().addTo(map);
    drawCircles(coords.main, circlesLayer, circle_radius);
    drawCircles(coords.fillers, circlesLayer, circle_radius, { color: 'green' });
    // debug
    var northWest = boundingRectangle.getBounds().getNorthWest();
    var northEast = boundingRectangle.getBounds().getNorthEast();
    var southWest = boundingRectangle.getBounds().getSouthWest();
    var southEast = boundingRectangle.getBounds().getSouthEast();
    drawCircles([
        northWest,
        northEast,
        southWest,
        southEast,
    ], circlesLayer, circle_radius, { color: "blue", fillOpacity: 0.1 });
}
main();
