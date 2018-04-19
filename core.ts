const EARTH_RADIUS = 6371e3;

function crateCoordinates(input): L.LatLng[] {
    return [input[0]]
}

function drawCircles(coords: L.LatLng[], layer) {
    const circleRadious = 300;  // meters
    coords.forEach((coord: L.LatLng) => {

        new L.Circle(coord, circleRadious, {color: "red"}).addTo(layer)
    })
}


type Direction = "east" | "south"


/**
 * "Destination point given distance and bearing from start point"
 * Credits: http://www.movable-type.co.uk/scripts/latlong.html
 * -> latlon-spherical.js
 * @param coordinate : the start point
 * @param {number} distance, in metres
 * @param {number} bearing - direction, in degrees from north clockwise
 * @return the new point and the new bearing
 * */
function destinationPoint(coordinate: L.LatLng, distance = 500, bearing = 90) {

    // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
    // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
    // see mathforum.org/library/drmath/view/52049.html for derivation

    var δ = Number(distance) / EARTH_RADIUS; // angular distance in radians
    var θ = toRadians(Number(bearing));

    var φ1 = toRadians(coordinate.lat);
    var λ1 = toRadians(coordinate.lng);

    var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
    var sinδ = Math.sin(δ), cosδ = Math.cos(δ);
    var sinθ = Math.sin(θ), cosθ = Math.cos(θ);

    var sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * cosθ;
    var φ2 = Math.asin(sinφ2);
    var y = sinθ * sinδ * cosφ1;
    var x = cosδ - sinφ1 * sinφ2;
    var λ2 = λ1 + Math.atan2(y, x);

    const destinationPoint = L.latLng(toDegrees(φ2), (toDegrees(λ2) + 540) % 360 - 180); // normalise to −180..+180°,

    return {
        point: destinationPoint,
        new_bearing: finalBearingTo(coordinate, destinationPoint)
    }
};

function finalBearingTo(p1, p2) {
    return (bearingTo(p2, p1) + 180) % 360;
}

function bearingTo(p1, p2) {
    // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
    // see mathforum.org/library/drmath/view/55417.html for derivation

    var φ1 = toRadians(p1.lat), φ2 = toRadians(p2.lat);
    var Δλ = toRadians(p2.lng - p1.lng);
    var y = Math.sin(Δλ) * Math.cos(φ2);
    var x = Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    var θ = Math.atan2(y, x);

    return (toDegrees(θ) + 360) % 360;
}

function toRadians(num) {
    return num * Math.PI / 180
}

function toDegrees(num) {
    return num * 180 / Math.PI
}

function main() {
    let targetAreaCoords: L.LatLng[] = rawAreaCoords.map(single => {
        return L.latLng(single)
    });
    const coords = crateCoordinates(targetAreaCoords);
    let circlesLayer = new L.FeatureGroup().addTo(map);
    L.polygon(targetAreaCoords).addTo(map);
    drawCircles(coords, circlesLayer);
}

let current = {lat: 42.688138888888886, lng: 23.292833333333334}
console.log(destinationPoint(L.latLng(current)))