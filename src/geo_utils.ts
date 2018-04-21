/*
 *  Credits: http://www.movable-type.co.uk/scripts/latlong.html
 * -> latlon-spherical.js
 */
declare let L;
const EARTH_RADIUS = 6371e3;

/**
 * "Destination point given distance and bearing from start point"
 * i.e. given a point (lat,lng), direction and distance, calculate the destination coordinates
 * Credits: http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param coordinate : the start point
 * @param {number} distance, in metres
 * @param {number} bearing - direction, in degrees from north clockwise
 * @return the new point and the new bearing
 * */
export function calculateNextPoint(coordinate: L.LatLng, distance = 500, bearing): { point: L.LatLng} {

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
        point: destinationPoint
    }
}

/**
 * `num` is a latitude/longitude coordinate and `bounds` is a line.
 * This method checks if `num` is within this line.
 * E.g. we have a line that goes from north to south - from [lat:40 lng:30] to [lat:40 lng:20] and we want to check if
 * lng:25 is within the bounds of the line.
 * when using this method the bounds would be [30,20] and num=25.
 *
 * @param {[number , number]} bounds
 * @param {number} num
 * @return {boolean}
 */
export function isWithinBounds(bounds: [number, number], num: number) {
    let minLat = Math.min(...bounds), maxLat = Math.max(...bounds);
    return (minLat <= num) && (num <= maxLat);
}

function toRadians(num) {
    return num * Math.PI / 180
}

function toDegrees(num) {
    return num * 180 / Math.PI
}




