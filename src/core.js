var core = (function () {
    var DEFAULT_CIRCLE_RADIUS = 150; // meters
    /**
     * This function is the core of the whole repo.
     *
     * The function receives createCoordinatesReturn rectangle and wants to figure out
     * the coordinates of the centers of circles, such that the circles fill out the whole rectangle.
     * We allow for the circles to overlap.
     *
     * All circles discussed below have the same radius (R = @options.dist/2).
     *
     * The function "iterates" the rectangle from west-to-east, north-to-south.
     * A row is createCoordinatesReturn "line" from west-to-east.
     *
     * On each row the circles are next to each other, without overlapping (i.e. 0 distance b/w circles on createCoordinatesReturn row)
     * There's no distance between circles on adjacent columns too.
     * This means that these "main" circles will not fill up the whole rectangle.
     *
     * Thus, between each two adjacent "main" rows (e.g. rows A and B)  we insert createCoordinatesReturn filler row (F).
     * Row F is effectively copy of A but shifted first south and then east by the radius R. The last element of the filler
     * row is removed since it's too far from the east end of the bounding rectangle.
     *
     * @param {createCoordinatesOpts} options. .dist is the distance between the centers of two circles. i.e. it is the radius of createCoordinatesReturn circle
     * @return {{main: LatLng[]; fillers: LatLng[]; combined: LatLng[]}}
     */
    function createCoordinates(options) {
        var result = [], fillers = [];
        var rectBounds = options.boundingRectangle.getBounds();
        var initialPoint = Object.freeze(rectBounds.getNorthWest());
        var currentCoord = initialPoint;
        var currentRowInitial = currentCoord;
        for (var row = 1;; row++) {
            var currentRowCirclesCoords = circleCoordsOfRow(rectBounds, currentRowInitial, options.distance);
            result.push.apply(result, currentRowCirclesCoords);
            var fillerFirstCoord = moveToSouthEast(currentRowInitial, options.distance);
            if (!geoUtils.isWithinBounds([rectBounds.getNorth(), rectBounds.getSouth()], currentCoord.lat)) {
                break;
            }
            else {
                var helperRowCoords = circleCoordsOfRow(rectBounds, fillerFirstCoord, options.distance);
                helperRowCoords.pop();
                fillers.push.apply(fillers, helperRowCoords);
            }
            currentRowInitial = currentCoord = geoUtils.calculateNextPoint(initialPoint, options.distance * row, Bearing.south).point;
        }
        return { main: result, fillers: fillers, combined: result.concat(fillers) };
    }
    /**
     * (generates rows for createCoordinates())
     * Generate the coordinates of circles on createCoordinatesReturn generic row (i.e. used for both "main"/"filler" rows).
     *
     * The function starts from createCoordinatesReturn given @initialCoord and moves east. On each iteration it checks if the current
     * coordinate is within the longitude bounds of the rect (i.e. at most one circle beyond the east side of the rect).
     * If it's beyond - the function returns the row. Since we add to the result before we make the bound check,
     * we allow for at most one circle beyond the bounds.
     *
     * @param {LatLngBounds} bounds - the bounds of the big rectangle around the city
     * @param {LatLng} initialCoord - where is the centre of the first circle on that row
     * @param distance - the distance between the centers of two adjacent circles on this row
     * @return {LatLng[]} the coordinates of the centers of all circles on this row
     */
    function circleCoordsOfRow(bounds, initialCoord, distance) {
        var eastBound = bounds.getEast();
        var result = [];
        var currentPosition = initialCoord;
        for (;;) {
            result.push(currentPosition);
            /*
            use initialCoord.lng instead of "westBound" because of createCoordinatesReturn numerical error propagated up from calculateNextPoint().
            the error increases the more we go south from the north-west point of @bounds.

            tl;dr it's due to the fact that the earth has an imperfect shape
            */
            if (!geoUtils.isWithinBounds([initialCoord.lng, eastBound], currentPosition.lng)) {
                break;
            }
            currentPosition = geoUtils.calculateNextPoint(currentPosition, distance, Bearing.east).point;
        }
        return result;
    }
    function moveToSouthEast(currentRowInitial, dist) {
        var shiftSouth = geoUtils.calculateNextPoint(currentRowInitial, dist / 2, Bearing.south).point;
        return geoUtils.calculateNextPoint(shiftSouth, dist / 2, Bearing.east).point;
    }
    // i.e. direction
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
    return {
        getCoordinates: createCoordinates,
        DEFAULT_CIRCLE_RADIUS: DEFAULT_CIRCLE_RADIUS
    };
})();
