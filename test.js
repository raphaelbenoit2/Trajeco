//API


var points = ["31 rue du rempart Brest"];
var pointsLat = new Array();
var pointsLng = new Array();
var latView;
var lonView;
var macarte = null;
var latLngs = new Array();

var name = new Array();
var time_heures;
var time_minutes;
var start;
var end;
var distance;

          
function appelAjax(point)
{
  return $.ajax
	({
    	url: "https://nominatim.openstreetmap.org/search", // URL de Nominatim
    	type: 'get', // Requête de type GET
    	data: "q="+point+"&format=json&addressdetails=1&limit=1&polygon_svg=1",
    	async : false
	})
}

            
for(var i = 0; i < points.length; i++)
{
  	appelAjax(points[i]).done(function (response) 
  	{
    	console.log("test");
    	if(response != "")
    	{
    	
    	  pointsLat[i] = response[0]['lat'];
    	  pointsLng[i] = response[0]['lon'];
    	}
    	if(pointsLat[i] == undefined || pointsLng[i] == undefined)
    	{
    	  alert("'" + points[i] + "'" + " non trouvé, veuillez vérifier l’orthographe");
    	}
  	})
	.fail(function (error) 
	{
        alert(error);
    });
}

latView = (parseFloat(pointsLat[0]) + parseFloat(pointsLat[pointsLat.length-1])) / 2;
lonView = (parseFloat(pointsLng[0]) + parseFloat(pointsLng[pointsLng.length-1])) / 2;
            
for(var i = 0; i < pointsLat.length; i++)
{
	latLngs[i] = L.latLng([pointsLat[i],pointsLng[i]])
}
          
          

function initControl(wp)
{

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
	let route;


	routingControl.addEventListener('routesfound', function(routingResultEvent)
	{
	  	$('body').removeClass('waiting');
	    route = routingResultEvent.routes[0].summary;
	    /******* VARIABLES UTILES A RAPAHAEL *******/
	    distance = route.totalDistance/1000; //stockage variable distance
	    time_heures = route.totalTime/3600; //stockage variable time en heures
	    time_minutes = (time_heures%1)*60; //stockage variable time en minutes
	    
	    time_heures = time_heures - time_heures%1;
	    if(time_minutes%1 < 0.5)
	    {
	      time_minutes = time_minutes - time_minutes%1;
	    }
	    else
	    {
	      time_minutes = (time_minutes - time_minutes%1) + 1;
	    }
	       
	    start = $("div.leaflet-routing-geocoder").find("Input")[0].value; //stockage variable debut
	    end = $("div.leaflet-routing-geocoder").find("Input")[1].value; //stockage variable end
	    

    })
	routingControl.addEventListener('routingerror', function(routingErrorEvent)
	{
    	$('body').addClass('waiting');
	})
	routingControl.addEventListener('routeselected', function(e) {
      var route = e.route;
      alert('latlong:\n' + JSON.stringify(route.waypoints, null,2));
      jsonString=JSON.stringify(route.waypoints, null,2);
      console.log(jsonString);

      jsonObj = JSON.parse(jsonString);
      alert(jsonObj[0]["latLng"]["lat"]);


      let latdepart = jsonObj[0]["latLng"]["lat"];
      console.log("La lat de départ est : " + latdepart);
      let lngdepart = jsonObj[0]["latLng"]["lng"];
      console.log("La lng de départ est : " + lngdepart);

      let latfin = jsonObj[1]["latLng"]["lat"];
      console.log("La lat de fin est : " + latfin);
      let lngfin = jsonObj[1]["latLng"]["lng"];
      console.log("La lng de fin est : " + lngfin);

      start = L.latLng(latdepart, lngdepart);
      end = L.latLng(latfin, lngfin);
      getDistance(start, end);

    })
    


function getDistance(from, to){
    //var container = document.getElementById('distance');
    alert("vol d'oiseau " + (from.distanceTo(to)).toFixed(0)/1000) + ' km';


    }
	
}

window.onload = function()
{
    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte = L.map('mapid').setView([latView, lonView], 8);
	console.log(latView, lonView)
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', 
    {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
     })
    .addTo(macarte);
    console.log("lat"+latLngs)
    initControl(latLngs);
};

//Fin API

//Donnees
//Constructeur de l'objet Donnees
function Donnees(donnees) {				//Le constructeur reçoit un tableau des donnees à traiter en entrée
	this.moyen_loc=donnees[0];
	this.depart=donnees[1];
	this.arrivee = donnees[2] ;
	this.nombre_personnes=donnees[3];
	this.date=donnees[4];
	this.heure=donnees[5];
}
//Méthodes de l'objet prototype de Donnees
Donnees.prototype.calculApiKilometrage=function(distance){
	console.log("nombre de kilomètres : "+Math.round(distance));
};
Donnees.prototype.calculApiHArrivee=function(heure_depart,temps_trajet)
{
	let heure_arrivee="";//initialisation des variables pour convertir l'heure de départ et d'arrivée
	let minutes_arrivee="";
	let m=false;
	let nbrheures=0;

	for (var i=0; i< heure_depart.length; i++) 
	{
		if(m)
		{
			minutes_arrivee+=heure_depart[i]
		}			
		if(heure_depart[i]==":")
		{
			m=true
		}
		if(!m)
		{
			heure_arrivee+=heure_depart[i];
		}
	}
    heure_arrivee=Number(heure_arrivee);
   	minutes_arrivee=Number(minutes_arrivee);
   	minutes_arrivee+=temps_trajet[1];
   	if(minutes_arrivee>60)
   	{
     		nbrheures=Math.trunc(minutes_arrivee/60);
     		minutes_arrivee-=nbrheures*60;
   	}
   	heure_arrivee+=nbrheures+temps_trajet[0]
	console.log("Votre temps de trajet est de : "+temps_trajet[0]+"h"+temps_trajet[1]+" et l'heure d'arrivee :"+heure_arrivee+"h"+minutes_arrivee);
};
Donnees.prototype.cout=function(){
	console.log("Le coût du trajet est de :");
};
Donnees.prototype.calculApiCarbon=function(){
	console.log("L'empreinte carbone de votre trajet :");
}

//fin implémentation Donnees

//Texte
function Texte(police,couleur,texte,taille_police,typet){
	this.police=police;
	this.couleur=couleur;
	this.texte=texte;
	this.taille_police=taille;
	this.typet=type;
}

//Texte
//Diagramme
function Diagram(donnees,type_diag){
	this.donnees=donnees;
	this.type_diag=type_diag;
}
//Diagramme



function send_t()
{
		let donnee_entree= new Array();
		let donnee_loc = new Array();
		donnee_loc[0]=document.getElementById("voiture");
		donnee_loc[1]=document.getElementById("avion");
		donnee_loc[2]=document.getElementById("train");
		donnee_loc[3]=document.getElementById("bus");
		if(!start){
			alert("Veuillez entrer une ville de départ")
			return 0;
		}
		if(!end){
			alert("Veuillez entrer une ville d'arrivee")
			return 0;
		}
		donnee_entree[0]=start;
		donnee_entree[1]=end;
		donnee_entree[2]=document.getElementById("nb_passagers");
		donnee_entree[3]=document.getElementById("date");
		donnee_entree[4]=document.getElementById("heure");
		
		if(!donnee_loc[0].checked && !donnee_loc[1].checked && !donnee_loc[2].checked && !donnee_loc[3].checked){
			alert("Aucun moyen de locomotion n'est sélectionné");
			return 0;
		}
		for (let i=2;i<donnee_entree.length;i++){
			if(!donnee_entree[i].value){
				alert("Vous n'avez pas rentré votre "+donnee_entree[i].name);
				return 0;
			}
		}
		let donnee_traitee = new Array();
		for (let i=0;i<donnee_loc.length;i++){
			if(donnee_loc[i].checked){
				donnee_traitee.push(donnee_loc[i].name);
			}
		}
		for (let i=0;i<donnee_entree.length;i++){
				donnee_traitee.push(donnee_entree[i].value);
			}
        
        if(!distance)
        {
        	alert("Veuillez entrer une destination");
        }

        var donnee = new Donnees(donnee_traitee);
		donnee.calculApiKilometrage(distance);//distance
		temps_trajet=[time_heures,time_minutes];//temps du trajet récupéré de l'api
		donnee.calculApiHArrivee(donnee.heure,temps_trajet);
}

