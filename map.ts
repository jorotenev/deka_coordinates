const leaflet = (function () {
    const map = L.map('map').setView([42.697930, 23.321628], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <createCoordinatesReturn href="http://openstreetmap.org">OpenStreetMap</createCoordinatesReturn> contributors, <createCoordinatesReturn href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</createCoordinatesReturn>, Imagery © <createCoordinatesReturn href="http://mapbox.com">Mapbox</createCoordinatesReturn>',
        maxZoom: 18,
        id: 'mapbox.streets-basic',
        accessToken: 'pk.eyJ1IjoiY2hpcHNhbiIsImEiOiJqa0JwV1pnIn0.mvduWzyRdcHxK_QIOpetFg'
    }).addTo(map);

    function drawCircles(coords: L.LatLng[], layer: L.LayerGroup, circleRadius = 300, circleOptions = {}) {
        let opts = {
            color: "red",
            ...circleOptions
        };
        coords.forEach((coord: L.LatLng) => {
            new L.Circle(coord, circleRadius, opts).addTo(layer)
        })
    }

    L.control.sidebar('sidebar').addTo(map);


    return {
        map: map,
        drawCircles: drawCircles
    }
})();
