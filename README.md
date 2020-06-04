# Traj'Eco
-------------
The main goal of this project is to offer a carbon footprint summary about the trip of the user chooses. 
Firstly, the user enters the start and the end of his trip and some data about this trip.
Then he can ask for a summary and upload it in a PDF file.
It also have the objective of giving advices about which transport would correspond to the trip. 
## Getting started

To test this project locally you just have to download all the master files and then launch  ***Traj_Eco.html*** file. 
## Prerequisites

If you want to use the map to get all the data and see your itinerary you will have to create an account on [Mapbox](https://www.mapbox.com/)  web site.
You need to create an account to get an API key, it is called a token. 

To test this project there is no need of any software except your navigator like ***firefox***,***Chrome*** or ***Brave***.

## Installing

Now you got the token, you can add it in the ***Script.js*** file. You will see a line with the variable : **mapboxgl.accessToken="Your Token"**. 

## Running problems
During your test you could have a **Routing Error** in your navigator console. This error could be due to the **Leaflet Routing Machine**. Please consult their [website](https://www.liedman.net/leaflet-routing-machine/).

## Built With

    OSRM - The OpenStreetMap API used
    Leaflet - The Routing machine used for the itinerary
    GoogleCharts - Used to generate charts

## Authors

    BAYOL Yann - 3rd Year student at ENIB school in France
    CHEVRIER Rémi - 3rd Year student at ENIB school in France
    BENOIT Raphaël - 3rd Year student at ENIB school in France
