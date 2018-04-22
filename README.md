# deka_coordinates
When querying the Google Places API, there's a limit of 60 places for a given query. The query is defined by a set of coordinates and a radius - i.e. a circle.
This repo generates the coordinates of many circles within a rectangular geographical area.
Each generated circle can be then used for a single query to the Google Places API.
The smaller radius of the generated circles makes it more likely that all places within the circle are returned by the query.

This repo contains a simple html page with a map + some .js that helps to generate the coordinates of all circles within a given rectangle, drawn by you on the map.

![demo of the app](https://github.com/jorotenev/deka_coordinates/blob/master/.images/deka_map.png)

## Usage
1. Open `index.html`
1. Select the *rectangle* tool and draw a rect on the map - a preview of the circles is immediately shown.
1. Click on the gears icon on the top left to download a .JSON file with the circles
```
{
    "coordinates":[{"lat":51.11, "lng":33},...]
    "circle_radius": 300
}
```
1. You can use each of the circles (a coordinate + radius) to query Google Places API.
1. You can optionally change the radius of the circles and press "Redraw"

## How it works
The idea in essence is to fill the rectangle row by row with circles and then add more "filler" circles between every two
rows so that all of the rectangle is filled. It leads to overlapping circles, but this is fine. It just means that
when querying, the same venue can appear in two circles.



## Contribute
* npm install
* Change the TypeScript files in `src/`
* npm run build