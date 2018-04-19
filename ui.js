function download(content, fileName, contentType) {
    var a = document.createElement("createCoordinatesReturn");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function regenerate(boundingRectangle) {
    circlesLayer.clearLayers();
    // the radius of the circles that will fill the rectangle
    var circle_radius = getRadius(); // metres
    console.log(circle_radius + " circle radius");
    // create all the coordinates of the circles within the bounding area
    var coords = core.getCoordinates({
        boundingRectangle: boundingRectangle,
        distance: circle_radius * 2,
    });
    // create createCoordinatesReturn layer on which the circles will be drawn
    leaflet.drawCircles(coords.main, circlesLayer, circle_radius);
    leaflet.drawCircles(coords.fillers, circlesLayer, circle_radius, {color: 'green'});
    var downloadBtn = document.getElementById('download-btn');
    console.log("generated " + coords.combined.length + " circles ");
    downloadBtn.onclick = function () {
        download(JSON.stringify(coords.combined), "coords.json", 'text/plain');
    };
}

function getRadius() {
    return Number($("#radius-size").val());
}

function onCityBoundaryReady(drawnRectangle) {
    circlesLayer.clearLayers();
    var default_radius = 150;
    $("#radius-size").attr("value", default_radius);
    var rectangleBounds = L.latLngBounds(drawnRectangle.map(function (coord) {
        return [coord.lat, coord.lng];
    }));
    var boundingRectangle = L.rectangle(rectangleBounds);
    var redrawBtn = document.getElementById('regenerate-btn');
    redrawBtn.onclick = regenerate.bind(null, boundingRectangle);
    redrawBtn.click();
}

var circlesLayer = new L.FeatureGroup().addTo(leaflet.map);
leaflet.map.on('draw:deleted', function () {
    circlesLayer.clearLayers();
});
leafletDrawing.enableDrawing(onCityBoundaryReady);
