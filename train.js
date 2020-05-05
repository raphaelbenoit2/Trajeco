function send(){
		let donnee= new Array();
		donnee["voiture"]=document.getElementById("voiture");
		donnee["avion"]=document.getElementById("avion");
		donnee["train"]=document.getElementById("train");
		donnee["bus"]=document.getElementById("bus");
		donnee["depart"]=document.getElementById("depart");
		donnee["arrivee"]=document.getElementById("arrivee");
		donnee["nb_passagers"]=document.getElementById("nb_passagers");
		donnee["date"]=document.getElementById("date");
		donnee["heure"]=document.getElementById("heure");

		console.log(donnee["voiture"].checked+" "+donnee["avion"].checked+" "+donnee["train"].checked+" "+donnee["bus"].checked+" "+donnee["depart"].value+" "+donnee["arrivee"].value+" "+donnee["nb_passagers"].value+" "+donnee["date"].value+" "+donnee["heure"].value+" ");
}

function Donnees(moyen_loc, depart, arrivee, nombre_personnes, date) {
	this.arrivee = arrivee ;
	this.depart=depart;
	this.moyen_loc=moyen_loc;
	this.nombre_personnes=nombre_personnes;
	this.date=date;
}

Donnees.prototype.calculApiKilometrage=function(){
	console.log("nombre de kilomètres : ");
};
Donnees.prototype.calculApiHArrivee=function(){
	console.log("heure d'arrivee :");
};
Donnees.prototype.cout=function(){
	console.log("Le coût du trajet est de :");
};
Donnees.prototype.calculApiCarbon=function(){
	console.log("L'empreinte carbone de votre trajet :")
}

