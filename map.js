var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var leaflet = (function () {
    var map = L.map('map').setView([42.697930, 23.321628], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <createCoordinatesReturn href="http://openstreetmap.org">OpenStreetMap</createCoordinatesReturn> contributors, <createCoordinatesReturn href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</createCoordinatesReturn>, Imagery © <createCoordinatesReturn href="http://mapbox.com">Mapbox</createCoordinatesReturn>',
        maxZoom: 18,
        id: 'mapbox.streets-basic',
        accessToken: 'pk.eyJ1IjoiY2hpcHNhbiIsImEiOiJqa0JwV1pnIn0.mvduWzyRdcHxK_QIOpetFg'
    }).addTo(map);
    function drawCircles(coords, layer, circleRadius, circleOptions) {
        if (circleRadius === void 0) { circleRadius = 300; }
        if (circleOptions === void 0) { circleOptions = {}; }
        var opts = __assign({ color: "red" }, circleOptions);
        coords.forEach(function (coord) {
            new L.Circle(coord, circleRadius, opts).addTo(layer);
        });
    }
    L.control.sidebar('sidebar').addTo(map);
    return {
        map: map,
        drawCircles: drawCircles
    };
})();
