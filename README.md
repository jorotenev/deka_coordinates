# deka_coordinates
I needed to use Google Places API to gather some data for a city. The problem is that for a given set of coordinates and a radius (i.e. a _Circle_),
the Google API returns at most 60 results. So for cities, with likely more than 60 places, just using a circle with a big radius wouldn't work.
 This repo generates the coordinates of many smaller circles, which cover a geographical area.

This repo contains a simple html page with a map + some .js that helps to generate the coordinates of all circles within a given rectangle, drawn by you on the map.

![demo of the app](https://github.com/jorotenev/deka_coordinates/blob/master/.images/deka_map.png)

## Usage
1. Open index.html
1. Select the *rectangle* tool and draw a rect on the map - a preview of the circles is immediately shown.
1. Click on the gears icon on the top left to download a .JSON file with the circles
```
{
    "coordinates":[{"lat":51.11, "lng":33},...]
    "circle_radius": 300
}
```
1. You can use each of the circles (a coordinate + radius) to query Google Places API.


## How it works
The idea in essence to fill the rectangle row by row with circles and then add more "filler" circles between every two
rows so that all of the rectangle is filled. It leads to overlapping circles, but this is fine. It just means that
when querying, the same venue can appear in two circles.


