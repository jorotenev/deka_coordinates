/**
 * Orchestrate it all
 */
(function run() {
    // the leaflet layer on which the circles generated circles will be drawn
    var circlesLayer = new L.FeatureGroup().addTo(leaflet.map);
    // set default circle radius
    $("#radius-size").attr("value", core.DEFAULT_CIRCLE_RADIUS);
    // attach a callback to the event when a user has drawn a rectangle on the map.
    // the defining coords of the rectangle are then passed to a callback that we set here
    leaflet.enableDrawing(onCityBoundaryReady.bind(null, circlesLayer), circlesLayer.clearLayers);
})();
/**
 * Given a bounding rectangle and a "canvas", generated the circles and fill the canvas with them
 *
 * @param {Rectangle} boundingRectangle
 * @param circlesLayer - the "canvas"
 */
function regenerate(boundingRectangle, circlesLayer) {
    // wipe out existing circles
    circlesLayer.clearLayers();
    // the radius of the circles that will fill the rectangle
    var circle_radius = getUserSelectedCircleRadius(); // metres
    console.log(circle_radius + " circle radius");
    // generate all the coordinates of the circles within the bounding area
    // *only* the coordinates of the *center* of the circles is returned
    var coords = core.getCoordinates({
        boundingRectangle: boundingRectangle,
        distance: circle_radius * 2,
    });
    // .main & .fillers is used to debug easily. The union of the two sets of circles
    // is in .combined
    leaflet.drawCircles(coords.main, circlesLayer, circle_radius);
    leaflet.drawCircles(coords.fillers, circlesLayer, circle_radius, { color: 'green' });
    var downloadBtn = document.getElementById('download-btn');
    console.log("generated " + coords.combined.length + " circles ");
    downloadBtn.onclick = function () {
        saveFile(JSON.stringify(coords.combined), "coords.json", 'application/json');
    };
}
/**
 * Called when the user has drawn a rectangle
 * @param circlesLayer the layer on which we want to draw the generated circles
 * @param {LatLng[]} drawnRectangle
 */
function onCityBoundaryReady(circlesLayer, drawnRectangle) {
    circlesLayer.clearLayers();
    var redrawBtn = document.getElementById('regenerate-btn');
    redrawBtn.onclick = regenerate.bind(null, drawnRectangle, circlesLayer);
    redrawBtn.click();
}
function getUserSelectedCircleRadius() {
    return Number($("#radius-size").val());
}
/**
 * https://stackoverflow.com/a/33542499
 * Save a file to the local filesystem
 * @param data
 * @param filename
 * @param contentType
 */
function saveFile(data, filename, contentType) {
    var blob = new Blob([data], { type: contentType });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
