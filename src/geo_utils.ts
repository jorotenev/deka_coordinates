/*
 *  Credits: http://www.movable-type.co.uk/scripts/latlong.html
 * -> latlon-spherical.js
 */
declare let L;
const EARTH_RADIUS = 6371e3;

/**
 * "Destination point given distance and bearing from start point"

 * @param coordinate : the start point
 * @param {number} distance, in metres
 * @param {number} bearing - direction, in degrees from north clockwise
 * @return the new point and the new bearing
 * */
export function calculateNextPoint(coordinate: L.LatLng, distance = 500, bearing): { point: L.LatLng, new_bearing: number } {

    // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
    // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
    // see mathforum.org/library/drmath/view/52049.html for derivation

    let delta = Number(distance) / EARTH_RADIUS; // angular distance in radians
    let theta = toRadians(Number(bearing));

    let phi1 = toRadians(coordinate.lat);
    let lambda1 = toRadians(coordinate.lng);

    let sinphi1 = Math.sin(phi1), cosphi1 = Math.cos(phi1);
    let sindelta = Math.sin(delta), cosdelta = Math.cos(delta);
    let sintheta = Math.sin(theta), costheta = Math.cos(theta);

    let sinphi2 = sinphi1 * cosdelta + cosphi1 * sindelta * costheta;
    let phi2 = Math.asin(sinphi2);
    let y = sintheta * sindelta * cosphi1;
    let x = cosdelta - sinphi1 * sinphi2;
    let lambda2 = lambda1 + Math.atan2(y, x);

    const destinationPoint = L.latLng(toDegrees(phi2), (toDegrees(lambda2) + 540) % 360 - 180); // normalise to −180..+180°,

    return {
        point: destinationPoint,
        new_bearing: finalBearingTo(coordinate, destinationPoint)
    }
}

export function isWithinBounds(bounds: [number, number], num: number, ignoreLastXDigits = 5) {
    const adjustPrecision = (n) => removeLastXDigits(n, ignoreLastXDigits);

    let adjustedPrecisionBounds = bounds.map(adjustPrecision);
    let adjustedPrecisionNum = adjustPrecision(num);

    let minLat = Math.min(...adjustedPrecisionBounds), maxLat = Math.max(...adjustedPrecisionBounds);

    return (minLat <= adjustedPrecisionNum) && (adjustedPrecisionNum <= maxLat);
}


function finalBearingTo(p1, p2) {
    return (bearingTo(p2, p1) + 180) % 360;
}

function bearingTo(p1, p2) {
    // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
    // see mathforum.org/library/drmath/view/55417.html for derivation

    let phi1 = toRadians(p1.lat), phi2 = toRadians(p2.lat);
    let deltaOfLambda = toRadians(p2.lng - p1.lng);
    let y = Math.sin(deltaOfLambda) * Math.cos(phi2);
    let x = Math.cos(phi1) * Math.sin(phi2) -
        Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaOfLambda);
    let theta = Math.atan2(y, x);

    return (toDegrees(theta) + 360) % 360;
}

function toRadians(num) {
    return num * Math.PI / 180
}

function toDegrees(num) {
    return num * 180 / Math.PI
}

/**
 * https://stackoverflow.com/questions/5191088/how-to-round-up-a-number-in-javascript
 * @param num The number to round
 * @param precision The number of decimal places to preserve
 */
function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision
}

function removeLastXDigits(num, ignoreLastXSymbols) {
    let precision = num.toString().split('.')[1].length;
    return roundUp(num, precision - ignoreLastXSymbols)
}

