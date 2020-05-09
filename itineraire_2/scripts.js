/*
		//attendre chargement de la page
window.onload = function(){ 
	
	// On initialise la carte sur les coordonnées GPS de Paris
	var mymap = L.map('mapid').setView([48.852969, 2.349903], 13);
  L.control.scale().addTo(mymap);


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
 

 L.Routing.waypoint({
  waypoints:[
          ]
  
 }).addTo(mymap);

 L.Routing.control({
        waypoints: [
            L.latLng(57.74, 11.94),
            L.latLng(48.866667, 2.333333)
console.log(L.latLng(57.74, 11.94).name)
            //console.log(name)
           
            
        ],

        routeWhileDragging: true,
        
        geocoder: L.Control.Geocoder.nominatim()
    }) 

 
    .on('routeselected', function(e) {
        var route = e.route;
        //alert('Found ' + route.length + ' route(s).');
        //alert('Showing route between waypoints:\n' + JSON.stringify(route.summary, null,2));
        //jsonString=`{"1083062": {"parent_area": null, "generation_high": 9, "all_names": {}, "id": 1083062, "codes": {"osm_rel": "76469"}, "name": "Marseille", "country": "G", "type_name": "OSM Administrative Boundary Level 8", "generation_low": 8, "country_name": "Global", "type": "O08"}}`;
   		
   		jsonString=JSON.stringify(route.summary, null,2);
   		jsonObj = JSON.parse(jsonString);
   		//console.log(jsonObj);
      Object.keys(jsonObj); //=jsonObj["1083062"].id
   		let totalDistance=Object.values(jsonObj)[0]
   		console.log("La distance est de " +totalDistance+" m");
      
   		console.log(Object.values)

      let carbon=2*totalDistance
		console.log("Le bilan carbon est de "+carbon)  

		let totalTime=Object.values(jsonObj)[1]
		console.log("La durée du trajet est de "+totalTime+" s")
    })
   

    

    
    .on('WaypointsSpliced', function(e){
      var index = e.index;
      jsonString=JSON.stringify(index);
      jsonObj = JSON.parse(jsonString);
      //console.log(jsonObj);
      Object.keys(jsonObj); //=jsonObj["1083062"].id
      let r=Object.values(jsonObj)      
      console.log("resultat" + r);
    })
    
    .addTo(mymap);


   

			 function ajaxGet(url){
        return new Promise(function(resolve, reject){
            // Nous allons gérer la promesse qui est en asynchrone
            let xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                // Si le traitement est terminé
                if(xmlhttp.readyState == 4){
                    // Si le traitement est un succès (le transfert est fini, j'ai reçu une réponse)
                    if(xmlhttp.status == 200){
                        // On résoud la promesse et on renvoie la réponse(si ça à marcher)
                        resolve(xmlhttp.responseText);
                    }else{
                        // On résoud la promesse et on envoie l'erreur
                        reject(xmlhttp);
                    }
                }
            }

            // Si une erreur est survenue
            xmlhttp.onerror = function(error){
                // On résoud la promesse et on envoie l'erreur
                reject(error);
            }

            // On ouvre la requête
            xmlhttp.open('GET', url, true);

            // On envoie la requête
            xmlhttp.send(null);
        })
    }








			L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',{
					crossOrigin : "anonymous",
					attribution:'données OpenStreetMap France',
					minZoom : 1,
					maxZoom : 20,
					

				}).addTo(mymap)
				

}

*/

var points = ["31 rue du rempart Brest"];
var pointsLat = new Array();
var pointsLng = new Array();
var latView;
var lonView;
var macarte = null;
var latLngs = new Array();
var time_heures;
var time_minutes;
var name = new Array();

          
function appelAjax(point){
  return $.ajax({
            url: "https://nominatim.openstreetmap.org/search", // URL de Nominatim
            type: 'get', // Requête de type GET
            data: "q="+point+"&format=json&addressdetails=1&limit=1&polygon_svg=1",
            async : false
            })
          }


          //if(points.length >= 0) /*&& points[0] != "" && points[points.length-1] != "")*/{
            
for(var i = 0; i < points.length; i++){
  appelAjax(points[i]).done(function (response) {
                console.log("test");
                if(response != ""){
                  //var ra = response[0]['display_name'];
                  //console.log(ra);
                  pointsLat[i] = response[0]['lat'];
                  pointsLng[i] = response[0]['lon'];
                  
                  //name[i] = response[0]['display_name'];
                  
                  /*
                  for(var i = 0; i < name.length; i++){
                    console.log(name[i])
                  } 
                   */
                }
                
                if(pointsLat[i] == undefined || pointsLng[i] == undefined){
                  alert("'" + points[i] + "'" + " non trouvé, veuillez vérifier l’orthographe");
                }
              }).fail(function (error) {
                alert(error);
              });
            }

latView = (parseFloat(pointsLat[0]) + parseFloat(pointsLat[pointsLat.length-1])) / 2;
lonView = (parseFloat(pointsLng[0]) + parseFloat(pointsLng[pointsLng.length-1])) / 2;
            
for(var i = 0; i < pointsLat.length; i++){
          latLngs[i] = L.latLng([pointsLat[i],pointsLng[i]])
            }
          
          //}
          /*else if(points.length > 0 && points[0] != ""){
            appelAjax(points[i]).done(function (response) {
              if(response != ""){
                pointsLat[0] = response[0]['lat'];
                pointsLng[0] = response[0]['lon'];     
              }
            }).fail(function (error) {
              alert(error);
            });
            latView = pointsLat[0];
            lonView = pointsLng[0];
          
          }
          
          else{
            alert("Vous ètes perdus dans le triangle des bermudes");
            appelAjax("Triangle des bermudes").done(function (response) {
              if(response != ""){
                pointsLat[0] = response[0]['lat'];
                pointsLng[0] = response[0]['lon'];     
              }                
            }).fail(function (error) {
              alert(error);
            });
            latView = pointsLat[0];
            lonView = pointsLng[0];
          }
          
*/

function initControl(wp){
  var routingControl = L.Routing.control({
              
              waypoints: wp,
              language: 'fr',
              show : true,
              routeWhileDragging: true,
              geocoder: L.Control.Geocoder.nominatim(),
              autoRoute: true
            });

routingControl.addTo(macarte);
routingControl.route();
routingControl.addEventListener('routesfound', function(routingResultEvent){
  $('body').removeClass('waiting');
              
              var route = routingResultEvent.routes[0].summary;
              //var r = routingResultEvent.routes[1].name;
              //console.log(wp.name);

              /******* VARIABLES UTILES A RAPAHAEL *******/

              var distance = route.totalDistance/1000; //stockage variable distance
              time_heures = route.totalTime/3600; //stockage variable time en heures
              time_minutes = (time_heures%1)*60; //stockage variable time en minutes
              
              time_heures = time_heures - time_heures%1;
              if(time_minutes%1 < 0.5){
                time_minutes = time_minutes - time_minutes%1;
              }else{
                time_minutes = (time_minutes - time_minutes%1) + 1;
              }
              
              alert("distance : " + distance.toFixed(1) + " km\n" + "durée : " + time_heures + " h " + time_minutes + " min");
              
              var start = $("div.leaflet-routing-geocoder").find("Input")[0].value; //stockage variable debut
              var end = $("div.leaflet-routing-geocoder").find("Input")[1].value; //stockage variable end
              
              console.log(start);
              console.log(end);
              console.log(distance + " km");
              console.log(time_heures + 'h' + time_minutes);
            })
            routingControl.addEventListener('routingerror', function(routingErrorEvent){
              $('body').addClass('waiting');
            })
          }
          
window.onload = function(){
            // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
            // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
          macarte = L.map('mapid').setView([latView, lonView], 8);
            // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
          L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
              // Il est toujours bien de laisser le lien vers la source des données
              attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
              minZoom: 1,
              maxZoom: 20
            }).addTo(macarte);
            initControl(latLngs);
          };



















