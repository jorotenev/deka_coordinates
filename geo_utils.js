/*
 *  Credits: http://www.movable-type.co.uk/scripts/latlong.html
 * -> latlon-spherical.js
 */
var geoUtils = (function (L) {
    var EARTH_RADIUS = 6371e3;
    /**
     * "Destination point given distance and bearing from start point"

     * @param coordinate : the start point
     * @param {number} distance, in metres
     * @param {number} bearing - direction, in degrees from north clockwise
     * @return the new point and the new bearing
     * */
    function destinationPoint(coordinate, distance, bearing) {
        // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
        // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
        // see mathforum.org/library/drmath/view/52049.html for derivation
        if (distance === void 0) { distance = 500; }
        var delta = Number(distance) / EARTH_RADIUS; // angular distance in radians
        var theta = toRadians(Number(bearing));
        var phi1 = toRadians(coordinate.lat);
        var lambda1 = toRadians(coordinate.lng);
        var sinphi1 = Math.sin(phi1), cosphi1 = Math.cos(phi1);
        var sindelta = Math.sin(delta), cosdelta = Math.cos(delta);
        var sintheta = Math.sin(theta), costheta = Math.cos(theta);
        var sinphi2 = sinphi1 * cosdelta + cosphi1 * sindelta * costheta;
        var phi2 = Math.asin(sinphi2);
        var y = sintheta * sindelta * cosphi1;
        var x = cosdelta - sinphi1 * sinphi2;
        var lambda2 = lambda1 + Math.atan2(y, x);
        var destinationPoint = L.latLng(toDegrees(phi2), (toDegrees(lambda2) + 540) % 360 - 180); // normalise to −180..+180°,
        return {
            point: destinationPoint,
            new_bearing: finalBearingTo(coordinate, destinationPoint)
        };
    }
    function finalBearingTo(p1, p2) {
        return (bearingTo(p2, p1) + 180) % 360;
    }
    function bearingTo(p1, p2) {
        // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
        // see mathforum.org/library/drmath/view/55417.html for derivation
        var phi1 = toRadians(p1.lat), phi2 = toRadians(p2.lat);
        var deltaOfLambda = toRadians(p2.lng - p1.lng);
        var y = Math.sin(deltaOfLambda) * Math.cos(phi2);
        var x = Math.cos(phi1) * Math.sin(phi2) -
            Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaOfLambda);
        var theta = Math.atan2(y, x);
        return (toDegrees(theta) + 360) % 360;
    }
    function toRadians(num) {
        return num * Math.PI / 180;
    }
    function toDegrees(num) {
        return num * 180 / Math.PI;
    }
    /**
     * https://stackoverflow.com/questions/5191088/how-to-round-up-a-number-in-javascript
     * @param num The number to round
     * @param precision The number of decimal places to preserve
     */
    function roundUp(num, precision) {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    }
    function removeLastXDigits(num, ignoreLastXSymbols) {
        var precision = num.toString().split('.')[1].length;
        return roundUp(num, precision - ignoreLastXSymbols);
    }
    function isWithinBounds(bounds, num, ignoreLastXDigits) {
        if (ignoreLastXDigits === void 0) { ignoreLastXDigits = 5; }
        var adjustPrecision = function (n) { return removeLastXDigits(n, ignoreLastXDigits); };
        var adjustedPrecisionBounds = bounds.map(adjustPrecision);
        var adjustedPrecisionNum = adjustPrecision(num);
        var minLat = Math.min.apply(Math, adjustedPrecisionBounds), maxLat = Math.max.apply(Math, adjustedPrecisionBounds);
        return (minLat <= adjustedPrecisionNum) && (adjustedPrecisionNum <= maxLat);
    }
    // the public members
    return {
        calculateNextPoint: destinationPoint,
        isWithinBounds: isWithinBounds,
    };
})(L);
