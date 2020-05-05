
		//attendre chargement de la page
window.onload = function(){ 
	console.log("salope")
	// On initialise la carte sur les coordonnées GPS de Paris
	var mymap = L.map('mapid').setView([48.852969, 2.349903], 13);
/*
let t=L.Routing.control({
            // Nous personnalisons le tracé
            lineOptions: {
                styles: [{color: '#ff8f00', opacity: 1, weight: 7}]
            },

            // Nous personnalisons la langue et le moyen de transport
            router: new L.Routing.osrmv1({
                language: 'fr',
                profile: 'driving', // car, bike, foot
            }),
            waypoints: [
		        L.latLng(57.74, 11.94),
		        L.latLng(57.6792, 11.949)
		    ],

            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(mymap)
console.log(t)

 //L.Routing.itinerary({totalDistanceRoundingSensitivity:-1})
 */               
	L.Routing.control({
        /*waypoints: [
            L.latLng(57.74, 11.94),
            L.latLng(57.6792, 11.949)
        ],
        routeWhileDragging: true,*/
        geocoder: L.Control.Geocoder.nominatim()
    })
    .on('routeselected', function(e) {
        var route = e.route;
        //alert('Found ' + route.length + ' route(s).');
        alert('Showing route between waypoints:\n' + JSON.stringify(route.summary, null,2));
        //jsonString=`{"1083062": {"parent_area": null, "generation_high": 9, "all_names": {}, "id": 1083062, "codes": {"osm_rel": "76469"}, "name": "Marseille", "country": "G", "type_name": "OSM Administrative Boundary Level 8", "generation_low": 8, "country_name": "Global", "type": "O08"}}`;
   		
   		jsonString=JSON.stringify(route.summary, null,2);
   		jsonObj = JSON.parse(jsonString);
   		Object.keys(jsonObj); //=jsonObj["1083062"].id
   		let totalDistance=Object.values(jsonObj)[0]
   		console.log("La distance est de " +totalDistance+" m");
   		let carbon=2*totalDistance
		console.log("Le bilan carbon est de "+carbon)  

		let totalTime=Object.values(jsonObj)[1]
		console.log("La durée du trajet est de "+totalDistance+" s")
    })
    .addTo(mymap);


			








			L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',{
					crossOrigin : "anonymous",
					attribution:'données OpenStreetMap France',
					minZoom : 1,
					maxZoom : 20,
					

				}).addTo(mymap)
				

						}



























