function destinationPoint(coordinate, distance = 500, bearing = 90) {
    let radius = 6371e3

    // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
    // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
    // see mathforum.org/library/drmath/view/52049.html for derivation

    var δ = Number(distance) / radius; // angular distance in radians
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

    return [toDegrees(φ2), (toDegrees(λ2) + 540) % 360 - 180]; // normalise to −180..+180°
};


function toRadians(num) {
    return num * Math.PI / 180
}

function toDegrees(num) {
    return num * 180 / Math.PI
}


current = {lat: 42.688138888888886, lng: 23.292833333333334}
console.log(destinationPoint(current))