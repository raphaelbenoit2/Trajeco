
//API



var points = ["945 Avenue du Technopôle, 29280 Plouzané"];
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

mapboxgl.accessToken = 'Your Token';// token de l'api mapbox

          
function appelAjax(point)// requête ajax vers l'api
{
  return $.ajax
	({
    	url: "https://nominatim.openstreetmap.org/search",  // URL de Nominatim, service qui transforme une adresss en coordonnée GPS
    	type: 'get', // Requête de type GET
    	data: "q="+point+"&format=json&addressdetails=1&limit=1&polygon_svg=1", // reponse de la requête sous forme json
    	async : false
	})
}

            
for(var i = 0; i < points.length; i++)
{
  	appelAjax(points[i]).done(function (response) 
  	{
    	//console.log("test");
    	if(response != "")
    	{
    	
    	  pointsLat[i] = response[0]['lat'];// recupère latitude de l'objet 0
    	  pointsLng[i] = response[0]['lon'];// recupère longitude de l'objet 0
    	}
    	if(pointsLat[i] == undefined || pointsLng[i] == undefined)
    	{
    	  alert("'" + points[i] + "'" + " non trouvé, veuillez vérifier l’orthographe");
    	}
  	})
	.fail(function (error)  // si la requête de l'api n'aboutie pas envoi erreur
	{
        alert(error);
    });
}

latView = (parseFloat(pointsLat[0]) + parseFloat(pointsLat[pointsLat.length-1])) / 2;// création de l'objet latView avec les latitudes récupérées 
lonView = (parseFloat(pointsLng[0]) + parseFloat(pointsLng[pointsLng.length-1])) / 2; // création de l'objet lonView avec les longitudes récupérées
            
for(var i = 0; i < pointsLat.length; i++)
{
	latLngs[i] = L.latLng([pointsLat[i],pointsLng[i]])// création de l'objet latLngs en format L.LatLng (propertie de la bibliothèque Leaflet) pour le mettre dans la fct initControl
}
          
          

function initControl(wp)
{
	// creation de l'objet routingControl qui assure la création de l'itinéraire
	// Le géodoceur est directement utilisé par la bibliothèque "Leaflet Routing Machine", ce qui permet de simplifier le code.
  	var routingControl = L.Routing.control({
              
              waypoints: wp,
              language: 'fr',
              show : true,
              routeWhileDragging: true,
              geocoder: L.Control.Geocoder.nominatim(),
              router: L.Routing.mapbox(mapboxgl.accessToken),// router de Mapbox après le crash de celui de routing machine
              autoRoute: true
            });

	routingControl.addTo(macarte);
	routingControl.route();
	let route;


	routingControl.addEventListener('routesfound', function(routingResultEvent) // écoute l'évènement routesfound de la librairie Leaflet pour récupèrer le summary comportant la distance et le temps du trajet
	{
	  	$('body').removeClass('waiting');
	    route = routingResultEvent.routes[0].summary;

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
	       
	    start = $("div.leaflet-routing-geocoder").find("Input")[0].value; // récupère l'objet départ, l'adresse rentrée par l'utilisateur qui se trouve sur le formulaire de l'itinéraire
	    end = $("div.leaflet-routing-geocoder").find("Input")[1].value; // récupère l'objet arrivée, l'adresse rentrée par l'utilisateur qui se trouve sur le formulaire de l'itinéraire
	    

    })
	routingControl.addEventListener('routingerror', function(routingErrorEvent)// écoute l'évènement routingerror de la librairie Leaflet pour voir si le routingControl n'a pas de problème
	{
    	$('body').addClass('waiting');
	})
	routingControl.addEventListener('routeselected', function(e) { // écoute l'évènement routeselected de la librairie Leaflet pour récupèrer les latitudes et longitudes des points pour récupèrer la distance a vol d'oiseau
      var route = e.route;
      //alert('latlong:\n' + JSON.stringify(route.waypoints, null,2));
      jsonString=JSON.stringify(route.waypoints, null,2);
      console.log(jsonString);

      jsonObj = JSON.parse(jsonString);
      //alert(jsonObj[0]["latLng"]["lat"]);


      let latdepart = jsonObj[0]["latLng"]["lat"];// récupère la latitude de départ(ville rentrer par l'utilisateur)
      //console.log("La lat de départ est : " + latdepart);
      let lngdepart = jsonObj[0]["latLng"]["lng"];// récupère la longitude de départ(ville rentrer par l'utilisateur)
      console.log("La lng de départ est : " + lngdepart);

      let latfin = jsonObj[1]["latLng"]["lat"]; // récupère la latitude d'arivée(ville rentrer par l'utilisateur)
      //console.log("La lat de fin est : " + latfin);
      let lngfin = jsonObj[1]["latLng"]["lng"]; // récupère la longitude d'arrivée(ville rentrer par l'utilisateur)
      //console.log("La lng de fin est : " + lngfin);
     // console.log(start+end)
      start_oiseau = L.latLng(latdepart, lngdepart);// conversion de la lat et long de depart en L.latLng 
      end_oiseau = L.latLng(latfin, lngfin); // conversion de la lat et long de fin en L.latLng 
      //console.log("apres" +start+end)
      distance_avion=getDistance(start_oiseau, end_oiseau);// fonction de leaflet qui prend en paramètre uniquement les objets L.latLng de départ et d'arrivée

    })
    


function getDistance(from, to){// fonction qui recupère la distance à vol d'oiseau des paramètres que rentre l'utiisateur en km
    
    return (from.distanceTo(to)).toFixed(0)/1000;


    }
	
}
// On s'assure que la page est chargée
window.onload = function()
{
    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "mapid"
    macarte = L.map('mapid').setView([latView, lonView], 8);// affiche la carte au niveau des premiers objets latView et lonView récupérés
	console.log(latView, lonView)
	// récupère les cartes de openstreetmap.fr
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
/*Constructeur de l'objet Donnees
Le constructeur reçoit un tableau des donnees à traiter en entrée
 */
function Donnees(donnees) {				//
	this.moyen_locomotion=donnees[0];
	this.depart=donnees[1];
	this.arrivee = donnees[2] ;
	this.nombre_personnes=Number(donnees[3]);
	this.date=donnees[4];
	this.heure=donnees[5];
}
/*
Méthode calculApiKilométrage de l'objet prototype de Donnees
distance : distance pour l'itinéraire voiture
distance_oiseau : distance pour l'itinéraire avion/train
*/
Donnees.prototype.calculApiKilometrage=function(distance,distance_oiseau){
	
	/*en fonction du véhicule choisi on adapte la distance*/
	if(this.moyen_locomotion=="voiture" | this.moyen_locomotion=="bus"){
		this.distance=Math.round(distance);
	}
	else{
		this.distance=Math.round(distance_oiseau);
	}
};
/*
Méthode calculApiHArrivee de l'objet prototype de Donnees
Cette méthode calcule l'heure d'arrivée à la destination choisie en utilisant le temps de trajet et la vitesse des véhicules
Dans le cas du véhicule correspondant à une voiture le temps de trajet n'est pas modifié
temps_trajet: temps récupéré sur l'itinéraire voiture lors de la requête API(voir Window.onload)
*/
Donnees.prototype.calculApiHArrivee=function(temps_trajet)
{
	let heure_arrivee="";//initialisation des variables pour convertir l'heure de départ et d'arrivée
	let minutes_arrivee="";
	let m=false;
	let nbrheures=0;
	let nbjours=0;
	let vitesse_moyenne_avion = 900;//km/h
	let vitesse_moyenne_train= 240;//moyenne entre le tgv et le ter
	let vitesse_moyenne_bus=80;
	let jour=0

	/*On modifie le temps de trajet selon le véhicule*/
	switch(this.moyen_locomotion)
	{
		case "avion" :
			temps_trajet[0]= Math.trunc(this.distance/vitesse_moyenne_avion) ;//malus de 40min
			temps_trajet[1]=40+((this.distance/vitesse_moyenne_avion)-temps_trajet[0])*60;
			break;
		case "train" :
			temps_trajet[0]= Math.trunc(this.distance/vitesse_moyenne_train+0.16);//malus de 10min
			temps_trajet[1]=10+((this.distance/vitesse_moyenne_train)-temps_trajet[0])*60;
			break;
		case "bus" :
			temps_trajet[0]= Math.trunc(this.distance/vitesse_moyenne_bus);
			temps_trajet[1]=0+((this.distance/vitesse_moyenne_bus)-temps_trajet[0])*60;
			break;
	}
	/*On sépare les minutes des heures car le format de this.heure est : "20:45"*/
	for (var i=0; i<this.heure.length; i++) 
	{
		if(m)
		{
			minutes_arrivee+=this.heure[i]
		}			
		if(this.heure[i]==":")
		{
			m=true
		}
		if(!m)
		{
			heure_arrivee+=this.heure[i];
		}
	}

	/*On convertit de string à integer*/
    heure_arrivee=Number(heure_arrivee);
   	minutes_arrivee=Number(minutes_arrivee);
   	minutes_arrivee+=Number(temps_trajet[1]);
   	heure_arrivee+=Number(nbrheures+temps_trajet[0])

   	/*on vérifie/modifie pour rester dans un format heure<=24 et minutes <=60*/
   	if(minutes_arrivee>60)
   	{
     	nbrheures=Math.trunc(minutes_arrivee/60);
     	minutes_arrivee-=nbrheures*60;
   	}
   	if(heure_arrivee>=24)
   	{
   		nbjours = Math.trunc(heure_arrivee/24);
   		heure_arrivee-=nbjours*24;
   		//finir la réalisation de la date
   	}

   	/*Modification de la date d'arrivée toujours en implémentation*/
   	jour=Number(this.date[8])*10 + Number(this.date[9])
   	jour+=nbjours;
   	this.date[8]=jour/10;//2020-06-04
   	this.date[9]=jour-Number(this.date[0])*10;

   	/*On ajoute les attributs heure d'arrivée, minutes d'arivée et temps de trajet dans l'objet Donnees*/
   	this.heure_arrivee=heure_arrivee;
   	this.minutes_arrivee=minutes_arrivee;
   	this.temps_trajet=temps_trajet[0]+temps_trajet[1]/60
};
/*
Méthode cout de l'objet prototype de Donnees
Cette méthode calcule le cout du trajet en fonction du nombre de personnes, de la distance et du véhicule.
*/
Donnees.prototype.cout=function()
{
	var voiture=0.27//prix en moyenne du kilomètre en voiture 
	var avion=0.11//longue distance
	var train=0.16//myenne et longue distance
	var bus=0.10//moyenne et longue distance
	var cout=0;
	switch(this.moyen_locomotion)
	{
		case "voiture" :
			var nbvoitures=Math.trunc(this.nombre_personnes/5)
			var reste=this.nombre_personnes-nbvoitures*5;
			cout+=this.distance*voiture*nbvoitures;
			if(reste<=5)
			{
				cout+= this.distance*voiture;

			}
			else{
				alert("error reste >5")
			}
			break;
		case "avion" :
			cout= this.distance*avion*this.nombre_personnes;
			break;
		case "train" :
			cout= this.distance*train*this.nombre_personnes;
			break;
		case "bus" :
			cout= this.distance*bus*this.nombre_personnes;
			break;
	}
	//console.log(cout)
	this.cout=cout;
	console.log("Le coût du trajet est de :"+ this.cout);
};
/*
Méthode calculApiCarbon de l'objet prototype de Donnees
Cette méthode calcule l'empreinte carbone du trajet en fonction du nombre de personnes, de la distance et du véhicule.
*/
Donnees.prototype.calculApiCarbon=function(){
	var voiture=285//empreinte carbone en moyenne pour une voiture voiture de 5 places par kilommètre 
	var avion=122//longue distance
	var train=15//myenne et longue distance
	var bus=68//moyenne et longue distance
	var empreinte=0;
	//console.log("empreinte",moyen_loc)
	switch(this.moyen_locomotion)
	{
		case "voiture" :
			var nbvoitures=Math.trunc(this.nombre_personnes/5)
			var reste=this.nombre_personnes-nbvoitures*5;
			if(reste!=0){
				nbvoitures+= 1;
			}
			//console.log("nbvoitures"+nbvoitures+" "+reste)
			empreinte+=nbvoitures*voiture*this.distance
			break;
		case "avion" :
			empreinte= this.distance*avion*this.nombre_personnes;
			break;
		case "train" :
			empreinte= this.distance*train*this.nombre_personnes;
			break;
		case "bus" :
			empreinte= this.distance*bus*this.nombre_personnes;
			break;
	}
	//console.log("empreinte",empreinte)
	this.empreinte=(empreinte/1000).toFixed(2);//conversion en kilogrammes 2chiffres après la virgule
}
//fin implémentation Donnees

/*
fonction envoyer()
but de la fonction : faire afficher une Fiche Bilan carbone sur la page TrajEco.html 
*/
function envoyer()
{
		/*
		donnee_entree_utilisateur : récupération des données entrées par l'utilisateur sur la page html à part le formulaire
		donnee_locomotion : récupération du moyen de locomotion du formulaire
		*/
		let donnee_entree_utilisateur= new Array();
		let donnee_locomotion = new Array();

		donnee_locomotion[0]=document.getElementById("voiture");
		donnee_locomotion[1]=document.getElementById("avion");
		donnee_locomotion[2]=document.getElementById("train");
		donnee_locomotion[3]=document.getElementById("bus");

		/*Alerte pour avertir l'utilisateur qu'il n'a pas renseigné le départ ou l'arrivée*/
		if(!start){
			alert("Veuillez renseigner un itinéraire")
			return 0;
		}
		
		donnee_entree_utilisateur[0]=start; 
		donnee_entree_utilisateur[1]=end;
		donnee_entree_utilisateur[2]=document.getElementById("nb_passagers");
		donnee_entree_utilisateur[3]=document.getElementById("date");
		donnee_entree_utilisateur[4]=document.getElementById("heure");
		
		if(!donnee_locomotion[0].checked && !donnee_locomotion[1].checked && !donnee_locomotion[2].checked && !donnee_locomotion[3].checked){
			alert("Aucun moyen de locomotionomotion n'est sélectionné");
			return 0;
		}
		for (let i=2;i<donnee_entree_utilisateur.length;i++){
			if(!donnee_entree_utilisateur[i].value){
				alert("Vous n'avez pas rentré votre "+donnee_entree_utilisateur[i].name);
				return 0;
			}
		}
		/*On rassemble la variable donnee_locomotion et la variable donnee_entree_utilisateur*/
		let donnee_traitee = new Array();
		for (let i=0;i<donnee_locomotion.length;i++){
			if(donnee_locomotion[i].checked){
				donnee_traitee.push(donnee_locomotion[i].id);
			}
		}
		for(let i=0;i<2;i++)
		{
			donnee_traitee.push(donnee_entree_utilisateur[i]);
		}
		for (let i=2;i<donnee_entree_utilisateur.length;i++){
				donnee_traitee.push(donnee_entree_utilisateur[i].value);
			}
        
        /*On crée l'objet Donnees "donnee_api afin de pouvoir utiliser les méthodes pour calculer l'empreinte carbone/le cout/kilométrage/heure d'arrivée */
        //MOYEN CHOISI
        var donnee_api = new Donnees(donnee_traitee);
		donnee_api.calculApiKilometrage(distance_avion,distance);//distance
		temps_trajet=[time_heures,time_minutes];//temps du trajet récupéré de l'api
		donnee_api.calculApiHArrivee(temps_trajet);//Determiner le jour et l'heure d'arrivée
		donnee_api.cout();
		donnee_api.calculApiCarbon();

		/*Création des objets Donnees pour réaliser le graphique*/
		var moyen_locomotion=["voiture","avion","train","bus"]
		var donnees_diagram=[];
		for(i in moyen_locomotion){
			if(moyen_locomotion[i]!=donnee_api.moyen_locomotion){
				donnee_traitee[0]=moyen_locomotion[i];
				donnees_diagram.push(new Donnees(donnee_traitee));
			}
		}
		for(i in donnees_diagram){
				donnees_diagram[i].calculApiKilometrage(distance_avion,distance);//distance
				donnees_diagram[i].calculApiHArrivee(temps_trajet);//Determiner le jour et l'heure d'arrivée
				donnees_diagram[i].cout();
				donnees_diagram[i].calculApiCarbon();
		}

		var unite=calculUnite(donnee_api,donnees_diagram); // Remise à l'échelle des données (euros,centimes,heures,minutes,kilogrammes,grammes)
		addFiche();//Création de la Fiche sur la page Html
		makeDiagram(donnee_api,donnees_diagram,unite);//Création du graphique constituant la fiche en haut à droite
		makeTemperature(donnee_api,donnees_diagram,unite);//Création de l'onglet "Temperature" dans la fiche en haut à gauche
		drawSummary(donnee_api.distance,Math.trunc(donnee_api.cout),donnee_api.nombre_personnes,unite);//Création de l'onglet résumé en bas à gauche de la fiche
		drawCities(donnee_api.depart,donnee_api.arrivee,donnee_api.heure,donnee_api.heure_arrivee,donnee_api.minutes_arrivee,donnee_api.temps_trajet,unite);//Création de l'onglet trajet en bas à droite de la fiche
}
/*
Ajoute le code Html dans la div ayant l'id #fiche. Permet de cacher la fiche tant que l'utilisateur n'a pas appuyer sur le bouton ENVOYER!
*/
function addFiche()
{
	var button_pdf=document.getElementById("bouton_pdf");
	button_pdf.innerHTML="<input type='button' id='pdf' class='btn' onclick=printDiv('fiche') value='Enregistrer en PDF' />"
	var fiche=document.getElementById("fiche");
	fiche.style.backgroundColor = "white";
	fiche.style.display= "flex";
	fiche.style.marginLeft="10em";
	fiche.style.marginTop= "20px";
	fiche.style.width=" 120em";
	fiche.style.height= "51.2em";
	fiche.style.border= "2px solid grey";
	fiche.style.borderRadius= "20px";
	fiche.innerHTML="<section id='temperature'><div id='title'></div><div id='empreinte'></div><div id='empreinte_max'></div><div id='empreinte_min'></div><img src='images/temperature-vector-icon.jpg' id='img_temp'></section><section id='barchart_material' ></section><section id='resume'>	<ul class='flex-container kilometre'>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	</ul>	<ul class='flex-container cout'>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	</ul>	<ul class='flex-container nb_personne'>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	  <li class='flex-item'></li>	</ul>	 	<div class='kilometres_resume'>kilomètres</div>	<div id='prix'></div>	<div class='passagers'>passagers</div>	<div id='trajet'>		<div id='marqueurbleu' ><img src='images/marqueurbleu.png' class='marqueur' /></div>		<div id='chemin'><img src='images/chemin.png' class='chemin' /></div>		<div id='marqueurnoir'><img src='images/marqueurnoir.png' class='marqueur'/></div>	</div>		<div id='depart'></div>	<div id='arrivee'></div>	<div id='heure_dep'></div>	<div id='heure_arr'></div>	<div id='tps_trajet'></div>		</section>"
}
/*
 Prend en paramètres toutes les données traitées afin de les mettre tous à la même unité.
 Return : tableau avec en rang :
 		0 : unité du cout
 		1 : unité de l'empreinte carbone
 		2 : unité de l'heure en minutes ou en heures
*/
function calculUnite(donnees,donnees_diagram)
{
	var unite=[];
	if(donnees_diagram[0].cout<1 && donnees.cout<1 && donnees_diagram[1].cout<1 && donnees_diagram[2].cout<1)
	{
		donnees.cout=donnees.cout*100;//conversion du cout en centimes si le cout est inferieur à 1 euro
		donnees_diagram[0].cout=donnees_diagram[0].cout*100;
		donnees_diagram[1].cout=donnees_diagram[1].cout*100;
		donnees_diagram[2].cout=donnees_diagram[2].cout*100;
		unite[0]="centimes"
	}        //Le constructeur reçoit un tableau des donneesà traiter en entrée
	else{
		unite[0]="euros";
	}
	if(donnees.empreinte<1 && donnees_diagram[0].empreinte<1 && donnees_diagram[1].empreinte<1 && donnees_diagram[2].empreinte<1)
	{
		donnees.empreinte=donnees.empreinte*1000;//converion en grammes si l'empreinte carbone est inférieure à 1 kilogramme
		donnees_diagram[0].empreinte=donnees_diagram[0].empreinte*1000;
		donnees_diagram[1].empreinte=donnees_diagram[1].empreinte*1000;
		donnees_diagram[2].empreinte=donnees_diagram[2].empreinte*1000;
		unite[1]="grammes"
	}  
	else{
		unite[1]="kilogrammes";
	}
	if(donnees.temps_trajet<1 && donnees_diagram[0].temps_trajet<1 && donnees_diagram[1].temps_trajet<1 && donnees_diagram[2].temps_trajet<1)
	{
		donnees.temps_trajet=donnees.temps_trajet*60;//conversion en minutes si le trajet dure moins d'une heure
		donnees_diagram[0].temps_trajet=donnees_diagram[0].temps_trajet*60;
		donnees_diagram[1].temps_trajet=donnees_diagram[1].temps_trajet*60;
		donnees_diagram[2].temps_trajet=donnees_diagram[2].temps_trajet*60;
		unite[2]="minutes"
	}
	else{
		unite[2]="heures";
	}
	return unite;
}
//Diagramme
/*
makeDiagram : prend en paramètre toutes les données créées et crée le graphique avec en abscisse le cout et l'empreinte carbone du trajet
			  en ordonnée le moen de locomotion et en abscisse en haut du graphique le temps.
			  Fonction qui utilise l'API Google Charts.
*/
google.charts.load('current', {'packages':['bar']});//Package utilisé pour créer notre graphique chargé

function makeDiagram(donnees,donnees_diagram,unite) {
  drawChart(donnees,donnees_diagram,unite	)
}
function drawChart(donnees,donnees_diagram,unite) {
  document.getElementById("barchart_material").style.display = "block";
  var data = google.visualization.arrayToDataTable([
    ['Vehicule', 'Coût en '+unite[0], 'Empreinte Carbone en '+unite[1], 'Temps en '+unite[2]],
    [donnees.moyen_locomotion, donnees.cout, donnees.empreinte, donnees.temps_trajet],
    [donnees_diagram[0].moyen_locomotion, donnees_diagram[0].cout, donnees_diagram[0].empreinte, donnees_diagram[0].temps_trajet],
    [donnees_diagram[1].moyen_locomotion, donnees_diagram[1].cout, donnees_diagram[1].empreinte, donnees_diagram[1].temps_trajet],
    [donnees_diagram[2].moyen_locomotion, donnees_diagram[2].cout, donnees_diagram[2].empreinte, donnees_diagram[2].temps_trajet]
  ]);
  var options = {
    chart: {
      title: 'Bilan du trajet',
      subtitle: 'Coût, Empreinte Carbone, Temps de trajet, Moyen de locomotion',
    },
    bars: 'horizontal', // Required for Material Bar Charts.
    series: {
    	2:{axis : 'Temps'},
    	1:{ axis: 'Coût'}
    },
    axes: {
    	x: {
    		Temps:{side:'top', label:'Temps'},
    		Coût:{label:'Coût/Empreinte Carbone'}
    	}
    }
  };
  var chart = new google.charts.Bar(document.getElementById('barchart_material'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}
//Diagramme
/*makeTemperature prend en paramètre toutes les données calculées*/
//Temperature
function makeTemperature(donnee_choisie,donnees_restantes,unite)
{

	donnee_choisie.empreinte=Number(donnee_choisie.empreinte)
	for(i in donnees_restantes){
		donnees_restantes[i].empreinte=Number(donnees_restantes[i].empreinte)
	}
	//Modification de l'affichage de l'onglet en fonction de l'empreinte carbone de notre véhicule choisi
	var empreinte_maximale=donnee_choisie.empreinte;
	var empreinte_minimale=donnee_choisie.empreinte;
	var empreinte=0;
	for (i in donnees_restantes){
		if(donnees_restantes[i].empreinte>=empreinte_maximale){
			empreinte_maximale=donnees_restantes[i].empreinte;
		}
	}
	for(i in donnees_restantes){
		if(donnees_restantes[i].empreinte<=empreinte_minimale){
			empreinte_minimale=donnees_restantes[i].empreinte;
		}
	}
	
	if(donnee_choisie.empreinte!=empreinte_maximale & donnee_choisie.empreinte!=empreinte_minimale){
	empreinte="Votre empreinte <br><div class='chiffre'>"+donnee_choisie.empreinte+"</div> "+unite[1];
	empreinte_max="Pire empreinte <br><div class='chiffre'>"+empreinte_maximale+"</div> "+unite[1];
	empreinte_min="Plus faible <br><div class='chiffre'>"+empreinte_minimale+"</div> "+unite[1];
	}
	else if(donnee_choisie.empreinte ==empreinte_maximale | donnee_choisie.empreinte==empreinte_minimale ){
	empreinte=null;
	empreinte_max="Plus grosse <br>empreinte <br><div class='chiffre'>"+empreinte_maximale+"</div> "+unite[1];
	empreinte_min="Plus faible <br><div class='chiffre'>"+empreinte_minimale+"</div> "+unite[1];
	}
	//Récupération des id et ajout du code Html
	var section=document.getElementById("temperature");
	var title="Bilan Carbone estimé \nde votre trajet";
	var id_title=document.getElementById("title");
	var id_empreinte=document.getElementById("empreinte");
	var id_empreinte_max=document.getElementById("empreinte_max");
	var id_empreinte_min=document.getElementById("empreinte_min");
	id_title.innerHTML=title;
	id_empreinte.innerHTML=empreinte;
	id_empreinte_max.innerHTML=empreinte_max;
	id_empreinte_min.innerHTML=empreinte_min;
	
}

//Temperature
//Enregistrement en PDF
/*
Fonction en développement, elle a pour but de permettre l'enregistrement de la fiche et rien d'autre en PDF mais nous obtenons un
 mauvais affichage de celle ci. Nous avons donc dû enregister toute la page en PDF
 */
window.printDiv = function(divName) {
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;
     //document.body.innerHTML = printContents;
     window.print();
     document.body.innerHTML = originalContents;
}

//Infos trajet sous forme de case 
function drawSummary(distance,cout,nb_passagers,unite)
{
	//On récupère et modifie les éléments de la page Html avec du JQuery 
	document.getElementById("resume").style.display = "block";
	distance = distance.toString();
	for(let i=0; i<distance.length; i++){
	 	$('ul.kilometre li:eq('+i+')').text(distance[i]);
	 	}
	document.getElementById("prix").innerHTML=unite[0]
	cout = cout.toString();
	for(let i=0; i<cout.length; i++){
		$('ul.cout li:eq('+i+')').text(cout[i]);
	 	}

	nb_passagers = nb_passagers.toString();
	for(let i=0; i<nb_passagers; i++){
		$('ul.nb_personne li:eq('+i+')').text(nb_passagers[i]);
	 	}

}
//Ville et heures du trajet correspondant
function drawCities(depart,arrivee,heure_dep,heure_arr,minutes_arr,tps_trajet,unite)
{
	
	document.getElementById('depart').innerHTML = "Ville de départ <br> <br>"+ depart;
	document.getElementById('arrivee').innerHTML = "Ville d'arrivée <br> <br> "+ arrivee;
	document.getElementById('heure_dep').innerHTML = "Heure de départ <br> <br>"+ heure_dep;
	document.getElementById('heure_arr').innerHTML = "Heure d'arrivée <br> <br>" + heure_arr +":"+minutes_arr; 
	document.getElementById('tps_trajet').innerHTML = "Votre trajet dure <br> <br>"+Math.round(tps_trajet)+" "+unite[2];

}

