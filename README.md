# deka_coordinates
Given a city, generate the areas within this city for which to find venues. I.e. Given a rectangle, fit within it overlapping circles which cover the whole rectangle - output the coordinates of the center of the circle and their radius. Then use this to query a public API for all venues within all the circles.


## How to use
1. Open `make_bounding_rectangle.html` and draw a rectangle around the city. The output is in the console.
1. save the outputted coords to a file (e.g. sofia.js) like
```
let rawAreaCoords = [
    {"lat": 42.634211303261544, "lng": 23.20621490478516},
    {"lat": 42.7520544036665, "lng": 23.20621490478516},
    {"lat": 42.7520544036665, "lng": 23.469886779785156},
    {"lat": 42.634211303261544, "lng": 23.469886779785156}
];
```
1. Include the above file `filledMap.html` before `core.js`
1. Open `filledMap.html` to see the circles