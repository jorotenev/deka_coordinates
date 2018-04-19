declare let $;

/**
 * https://stackoverflow.com/a/33542499
 * @param data
 * @param filename
 * @param contentType
 */
function download(data, filename, contentType) {
    let blob = new Blob([data], {type: contentType});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
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
            download(JSON.stringify(coords.combined), `coords.json`, 'application/json');
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


