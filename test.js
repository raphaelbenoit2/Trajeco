
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
    	//console.log("test");
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
      //alert('latlong:\n' + JSON.stringify(route.waypoints, null,2));
      jsonString=JSON.stringify(route.waypoints, null,2);
      console.log(jsonString);

      jsonObj = JSON.parse(jsonString);
      //alert(jsonObj[0]["latLng"]["lat"]);


      let latdepart = jsonObj[0]["latLng"]["lat"];
      //console.log("La lat de départ est : " + latdepart);
      let lngdepart = jsonObj[0]["latLng"]["lng"];
      console.log("La lng de départ est : " + lngdepart);

      let latfin = jsonObj[1]["latLng"]["lat"];
      //console.log("La lat de fin est : " + latfin);
      let lngfin = jsonObj[1]["latLng"]["lng"];
      //console.log("La lng de fin est : " + lngfin);
     // console.log(start+end)
      start_oiseau = L.latLng(latdepart, lngdepart);
      end_oiseau = L.latLng(latfin, lngfin);
      //console.log("apres" +start+end)
      distance_avion=getDistance(start_oiseau, end_oiseau);

    })
    


function getDistance(from, to){
    
    return (from.distanceTo(to)).toFixed(0)/1000;


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
	this.moyen_locomotion=donnees[0];
	this.depart=donnees[1];
	this.arrivee = donnees[2] ;
	this.nombre_personnes=Number(donnees[3]);
	this.date=donnees[4];
	this.heure=donnees[5];
}
//Méthodes de l'objet prototype de Donnees
Donnees.prototype.calculApiKilometrage=function(distance){
	console.log("nombre de kilomètres : "+Math.round(distance));
	this.distance=Math.round(distance);
};
Donnees.prototype.calculApiHArrivee=function(temps_trajet)
{
	let heure_arrivee="";//initialisation des variables pour convertir l'heure de départ et d'arrivée
	let minutes_arrivee="";
	let m=false;
	let nbrheures=0;
	let vitesse_moyenne_avion = 900;//km/h
	let vitesse_moyenne_train= 240;//moyenne entre le tgv et le ter
	let vitesse_moyenne_bus=80;
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
    heure_arrivee=Number(heure_arrivee);
   	minutes_arrivee=Number(minutes_arrivee);
   	//console.log("heure "+heure_arrivee+" minutes_arrivee "+minutes_arrivee)
   	minutes_arrivee+=Number(temps_trajet[1]);
   	//console.log("heure "+minutes_arrivee)
   	if(minutes_arrivee>60)
   	{
     	nbrheures=Math.trunc(minutes_arrivee/60);
     	minutes_arrivee-=nbrheures*60;

   	}
   	if(heure_arrivee>24)
   	{
   		let nbjours = Math.trunc(heure_arrivee/24);
   		//finir la réalisation de la date
   	}
   	heure_arrivee+=Number(nbrheures+temps_trajet[0])
   	//console.log("heure fin "+heure_arrivee+ " "+ nbrheures+" "+temps_trajet[0])
   	this.heure_arrivee=heure_arrivee;
   	this.minutes_arrivee=minutes_arrivee;
   	this.temps_trajet=temps_trajet[0]+temps_trajet[1]/60
	console.log("Votre temps de trajet est de : "+this.temps_trajet+" et l'heure d'arrivee :"+this.heure_arrivee+"h"+this.minutes_arrivee);
};
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
	moyen_locomotion=donnees[0];
	cout=donnees[1];
	empreinte=donnees[2];
	temps=donnes[3];
	type=type_diag;
}
//Diagramme



function send_t()
{
		let donnee_entree_utilisateur= new Array();
		let donnee_locomotion = new Array();
		donnee_locomotion[0]=document.getElementById("voiture");
		donnee_locomotion[1]=document.getElementById("avion");
		donnee_locomotion[2]=document.getElementById("train");
		donnee_locomotion[3]=document.getElementById("bus");
		if(!start){
			alert("Veuillez entrer une ville de départ")
			return 0;
		}
		if(!end){
			alert("Veuillez entrer une ville d'arrivee")
			return 0;
		}
		//console.log("donnee"+start+end)
		donnee_entree_utilisateur[0]=start; //à changer si on fait vol d'oiseau
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
		let donnee_traitee = new Array();
		for (let i=0;i<donnee_locomotion.length;i++){
			if(donnee_locomotion[i].checked){
				donnee_traitee.push(donnee_locomotion[i].name);
			}
		}
		for(let i=0;i<2;i++)
		{
			donnee_traitee.push(donnee_entree_utilisateur[i]);
		}
		for (let i=2;i<donnee_entree_utilisateur.length;i++){
				donnee_traitee.push(donnee_entree_utilisateur[i].value);
			}
        
        if(!distance)
        {
        	alert("Veuillez entrer une destination");
        }
        //console.log(donnee_traitee)
        //MOYEN CHOISI
        var donnee_api = new Donnees(donnee_traitee);
		donnee_api.calculApiKilometrage(distance);//distance
		temps_trajet=[time_heures,time_minutes];//temps du trajet récupéré de l'api
		donnee_api.calculApiHArrivee(temps_trajet);//Determiner le jour et l'heure d'arrivée
		donnee_api.cout();
		donnee_api.calculApiCarbon();

		
		//AVION
		donnee_traitee[0]="avion";
		donnee_avion=new Donnees(donnee_traitee);
		donnee_avion.calculApiKilometrage(distance_avion);//distance
		donnee_avion.calculApiHArrivee(temps_trajet);//Determiner le jour et l'heure d'arrivée
		donnee_avion.cout();
		donnee_avion.calculApiCarbon();
		//train
		donnee_traitee[0]="train";
		donnee_train=new Donnees(donnee_traitee);
		donnee_train.calculApiKilometrage(distance_avion);//distance
		donnee_train.calculApiHArrivee(temps_trajet);//Determiner le jour et l'heure d'arrivée
		donnee_train.cout();
		donnee_train.calculApiCarbon();
		//Bus
		donnee_traitee[0]="bus";
		donnee_bus=new Donnees(donnee_traitee);
		donnee_bus.calculApiKilometrage(distance);//distance
		donnee_bus.calculApiHArrivee(temps_trajet);//Determiner le jour et l'heure d'arrivée
		donnee_bus.cout();
		donnee_bus.calculApiCarbon();
		console.log(donnee_avion)
		console.log(donnee_train)
		console.log(donnee_bus)
		console.log(donnee_api.arrivee)
		makeDiagram(donnee_api,donnee_avion,donnee_train,donnee_bus);
		drawResume(donnee_api.moyen_locomotion, donnee_api.distance);

		//makeTitle("h1","VOTRE BILAN CARBONE");
}
//Diagramme
google.charts.load('current', {'packages':['bar']});
function makeDiagram(donnee_choisie,donnee_2,donnee_3,donnee_4) {
	var unite=[];
if(donnee_choisie.cout<1 && donnee_2.cout<1 && donnee_3.cout<1 && donnee_4.cout<1)
{
	donnee_choisie.cout=donnee_choisie.cout*100;//conversion du cout en centimes si le cout est inferieur à 1 euro
	donnee_2.cout=donnee_2.cout*100;
	donnee_3.cout=donnee_3.cout*100;
	donnee_4.cout=donnee_4.cout*100;
	unite[0]="centimes"
}        //Le constructeur reçoit un tableau des donnees à traiter en entrée
else{
	unite[0]="euros";
}
if(donnee_choisie.empreinte<1 && donnee_2.empreinte<1 && donnee_3.empreinte<1 && donnee_4.empreinte<1)
{	
	donnee_choisie.empreinte=donnee_choisie.empreinte*1000;//converion en grammes si l'empreinte carbone est inférieure à 1 kilogramme
	donnee_2.empreinte=donnee_2.empreinte*1000;
	donnee_3.empreinte=donnee_3.empreinte*1000;
	donnee_4.empreinte=donnee_4.empreinte*1000;
	unite[1]="grammes"
}  
else{
	unite[1]="kilogrammes";
}
if(donnee_choisie.temps_trajet<1 && donnee_2.temps_trajet<1 && donnee_3.temps_trajet<1 && donnee_4.temps_trajet<1)
{
	donnee_choisie.temps_trajet=donnee_choisie.temps_trajet*60;//conversion en minutes si le trajet dure moins d'une heure
	donnee_2.temps_trajet=donnee_2.temps_trajet*60;
	donnee_3.temps_trajet=donnee_3.temps_trajet*60;
	donnee_4.temps_trajet=donnee_4.temps_trajet*60;
	unite[2]="minutes"
}
else{
	unite[2]="heures";
}
  drawChart(donnee_choisie,donnee_2,donnee_3,donnee_4,unite)
}


function drawChart(donnee_choisie,donnee_2,donnee_3,donnee_4,unite) {
  var data = google.visualization.arrayToDataTable([
    ['Vehicule', 'Coût en '+unite[0], 'Empreinte Carbone en '+unite[1], 'Temps en '+unite[2]],
    [donnee_choisie.moyen_locomotion, donnee_choisie.cout, donnee_choisie.empreinte, donnee_choisie.temps_trajet],
    [donnee_2.moyen_locomotion, donnee_2.cout, donnee_2.empreinte, donnee_2.temps_trajet],
    [donnee_3.moyen_locomotion, donnee_3.cout, donnee_3.empreinte, donnee_3.temps_trajet],
    [donnee_4.moyen_locomotion, donnee_4.cout, donnee_4.empreinte, donnee_4.temps_trajet]
  ]);
  var options = {
    chart: {
      title: 'Company Performance',
      subtitle: 'Sales, Expenses, and Profit: 2014-2017',
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
//Enregistrement en PF
window.printDiv = function(divName) {
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}

function drawResume(moy_loc,nb_kilometres){
	 document.getElementById("resume").innerHTML = moy_loc;
	 document.getElementById("resume").innerHTML += nb_kilometres;
	 //document.getElementById("resume").innerHTML = tps_trajet;
	 //document.getElementById("resume").innerHTML = cout;
	 //document.getElementById("resume").innerHTML = bilan_carbon;

	 //,nb_kilometres,tps_trajet,cout,bilan_carbon


}
