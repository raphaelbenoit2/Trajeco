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
	console.log("L'empreinte carbone de votre trajet :");
}

//Donnees

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



function send_t(){
		let donnee_entree= new Array();
		let donnee_loc = new Array();
		donnee_loc[0]=document.getElementById("voiture");
		donnee_loc[1]=document.getElementById("avion");
		donnee_loc[2]=document.getElementById("train");
		donnee_loc[3]=document.getElementById("bus");
		donnee_entree[0]=document.getElementById("depart");
		donnee_entree[1]=document.getElementById("arrivee");
		donnee_entree[2]=document.getElementById("nb_passagers");
		donnee_entree[3]=document.getElementById("date");
		donnee_entree[4]=document.getElementById("heure");
		
		if(!donnee_loc[0].checked && !donnee_loc[1].checked && !donnee_loc[2].checked && !donnee_loc[3].checked){
			alert("Aucun moyen de locomotion n'est sélectionné");
			return 0;
		}
		for (let i=0;i<donnee_entree.length;i++){
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
		let donnee = new Donnees(donnee_traitee)
		donnee.calculApiKilometrage()
		
}

