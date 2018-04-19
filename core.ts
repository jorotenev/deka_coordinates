enum Bearing {
    east = 90,
    west = -90,

    north = 0,
    south = 180
}

enum RectangleSide {
    // todo add others
    northWest = "NorthWest"
}

type createCoordinatesOpts = {
    boundingRectangle: L.Rectangle,
    distance: number,
}

function coordsOfRow(bounds: L.LatLngBounds, initialCoord: L.LatLng, distance) {
    let result: L.LatLng[] = [];
    let currentPosition: L.LatLng = initialCoord;
    while (geoUtils.isWithinBounds([bounds.getWest(), bounds.getEast()], currentPosition.lng)) {
        result.push(currentPosition);
        let next = geoUtils.calculateNextPoint(currentPosition, distance, Bearing.east);
        currentPosition = next.point;
    }
    return result;
}


function crateCoordinates(options: createCoordinatesOpts): { main: L.LatLng[], fillers: L.LatLng[], combined: L.LatLng[] } {
    let result: L.LatLng[] = [];
    let fillers: L.LatLng[] = [];
    const rectBounds = options.boundingRectangle.getBounds();

    const dist = options.distance;

    const initialPoint = Object.freeze(rectBounds.getNorthWest());
    let currentCoord: L.LatLng = initialPoint;

    for (let row = 1; ; row++) { // rows

        const currentRowInitial = Object.freeze(currentCoord);
        result.push(currentRowInitial);
        for (; ;) { // cols
            currentCoord = geoUtils.calculateNextPoint(currentCoord, options.distance, Bearing.east).point;

            result.push(L.latLng(currentCoord.lat, currentCoord.lng));

            if (!geoUtils.isWithinBounds([rectBounds.getWest(), rectBounds.getEast()], currentCoord.lng)) {
                let shiftSouth = geoUtils.calculateNextPoint(currentRowInitial, dist / 2, Bearing.south).point;
                let shiftEast = geoUtils.calculateNextPoint(shiftSouth, dist / 2, Bearing.east).point;

                let helperRowCoords: L.LatLng[] = coordsOfRow(rectBounds, shiftEast, dist);
                fillers.push(...helperRowCoords);
                break // start a new row
            }
        }

        // get the first coordinate of the next row
        if (!geoUtils.isWithinBounds([rectBounds.getNorth(), rectBounds.getSouth()], currentCoord.lat)) {
            break
        }
        currentCoord = geoUtils.calculateNextPoint(initialPoint, options.distance * row, Bearing.south).point;

    }
    return {main: result, fillers: fillers, combined: result.concat(fillers)}

}


function drawCircles(coords: L.LatLng[], layer: L.LayerGroup, circleRadius = 300, circleOptions = {}) {
    let opts = {
        color: "red",
        ...circleOptions
    };
    coords.forEach((coord: L.LatLng) => {
        new L.Circle(coord, circleRadius, opts).addTo(layer)
    })
}


function main() {

    let rectangleBounds: L.LatLngBounds = L.latLngBounds(rawAreaCoords.map(function (coord): [number, number] {
        return [coord.lat, coord.lng]
    }));
    let boundingRectangle: L.Rectangle = L.rectangle(rectangleBounds).addTo(map);


    // the radius of the circles that will fill the rectangle
    const circle_radius = 150; // metres
    // create all the coordinates of the circles within the bounding area
    const coords = crateCoordinates({
        boundingRectangle: boundingRectangle,
        distance: circle_radius * 2,
    });

    // create a layer on which the circles will be drawn
    let circlesLayer = new L.FeatureGroup().addTo(map);
    drawCircles(coords.combined, circlesLayer, circle_radius);
    // drawCircles(coords.fillers, circlesLayer, circle_radius, {color: 'green'});

    // draw circles at the boundaries of the boundingRectangle
    const northWest = boundingRectangle.getBounds().getNorthWest();
    const northEast = boundingRectangle.getBounds().getNorthEast();
    const southWest = boundingRectangle.getBounds().getSouthWest();
    const southEast = boundingRectangle.getBounds().getSouthEast();
    drawCircles([
        northWest,
        northEast,
        southWest,
        southEast,
    ], circlesLayer, circle_radius, {color: "blue", fillOpacity: 0.1});


}

main()