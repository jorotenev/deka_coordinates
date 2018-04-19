declare let $;

function download(content, fileName, contentType) {
    let a = document.createElement("createCoordinatesReturn");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function regenerate(boundingRectangle) {
    circlesLayer.clearLayers();

    // the radius of the circles that will fill the rectangle
    const circle_radius = getRadius(); // metres
    console.log(`${circle_radius} circle radius`)
    // create all the coordinates of the circles within the bounding area
    const coords = core.getCoordinates({
        boundingRectangle: boundingRectangle,
        distance: circle_radius * 2,
    });

    // create createCoordinatesReturn layer on which the circles will be drawn
    leaflet.drawCircles(coords.main, circlesLayer, circle_radius);
    leaflet.drawCircles(coords.fillers, circlesLayer, circle_radius, {color: 'green'});
    let downloadBtn = document.getElementById('download-btn');
    console.log(`generated ${coords.combined.length} circles `);
    downloadBtn.onclick = function () {
        console.log("Downloading...")
        try {
            let ts = new Date().toDateString().re(" ", "_")
            download(JSON.stringify(coords.combined), `coords_${ts}.json`, 'application/json');
        } catch (err) {
            console.error(err)
        }
    };
}


function getRadius() {
    return Number($("#radius-size").val());
}


function onCityBoundaryReady(drawnRectangle: L.LatLng[]) {
    circlesLayer.clearLayers();

    const default_radius = 150;
    $("#radius-size").attr("value", default_radius)
    const rectangleBounds: L.LatLngBounds = L.latLngBounds(drawnRectangle.map(function (coord): [number, number] {
        return [coord.lat, coord.lng]
    }));
    const boundingRectangle: L.Rectangle = L.rectangle(rectangleBounds);

    const redrawBtn = document.getElementById('regenerate-btn');
    redrawBtn.onclick = regenerate.bind(null, boundingRectangle);
    redrawBtn.click();
}

const circlesLayer = new L.FeatureGroup().addTo(leaflet.map);
leaflet.map.on('draw:deleted', () => {
    circlesLayer.clearLayers()
});
leafletDrawing.enableDrawing(onCityBoundaryReady);


