// Assignation de l'eventListener sur CHAQUE bouton radio
var radios = document.sandwich_maker.pain;
for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function() {
        generateRecipe();
    });
}
// Assignation de l'eventListener sur CHAQUE checkbox
var checkboxes = document.getElementsByName('ingredients[]');
for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
        generateRecipe();
    });
}








// Renvoie la valeur du bouton radio "pain" qui a été choisi
function getValuePain() {
    var value = '';
    var radios = document.sandwich_maker.pain;
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            value = radios[i].value;
        }
    }
    return value;
}
// Renvoie la ou les valeurs sélectionnées dans les checkboxes ingrédients
function getValueIngredients() {
    var values = [];
    var checkboxes = document.getElementsByName('ingredients[]');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            values.push(checkboxes[i].value);
        }
    }
    return values;
}
// Renvoie la valeur du select "sauce" qui a été choisi
function getValueSauce() {
    var value = document.getElementById('sauce').value;
    return value;
}
// Renvoie la valeur du select "sauce" qui a été choisi
function getValueInstruction() {
    var value = document.getElementById('instruction').value;
    return value;
}







// Génération de la recette
function generateRecipe() {
    var recette = '';

    // Gestion du pain
    var pain = getValuePain();
    if(pain != '') {
        recette += "Vous avez choisi le pain : " + pain;
    }



    // Gestion des ingredients
    var ingredients = getValueIngredients();
    if(ingredients.length > 0) {
        recette += "<br>avec les ingrédients suivants : <ul>";
        for(i = 0; i < ingredients.length; i++) {
            recette += "<li>" + ingredients[i] + "</li>";
        }
        recette += "</ul>";
    }



    // Gestion de la sauce
    var sauce = getValueSauce();
    if(sauce != '') {
        recette += "<br>Votre sauce est : " + sauce;
    }
    // Gestion de l'instruction spéciale
    var instruction = getValueInstruction();
    if(instruction != '') {
        recette += "<br>Votre instruction est : " + instruction;
    }

    document.getElementById('recette').innerHTML = recette;
}















function shuffle() {

    // Choix aléatoire d'un bouton radio (un seul)
    var radios = document.sandwich_maker.pain;
    var randomRadioIndex = Math.floor(Math.random() * (radios.length - 1));
    for (var i = 0; i < radios.length; i++) {
        if(i == randomRadioIndex) {
            radios[i].checked = true;
        }
    }

    // Choix aléatoire d'une ou de plusieurs cases à cocher
    var checkboxes = document.getElementsByName('ingredients[]');
    // Ici on décoche toutes les cases pour avoir une base de travail saine
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
    // On met les checkboxes dans un tableau
    var arrayCheckboxes = [];
    for(i=0; i < checkboxes.length; i++) {
        arrayCheckboxes.push(checkboxes[i]);
    } 
    // Et on mélange le tableau pour obtenir le coté aléatoire
    melangerTableau(arrayCheckboxes);
    // Puis on prend un nombre au hasard pour trancher le tableau en deux et ne garder qu'une moitié
    var randomCheckboxIndex = Math.floor(Math.random() * (checkboxes.length - 1));
    arrayCheckboxes.splice(0, randomCheckboxIndex);
    // Et enfin on fait une boucle pour passer toutes nos checkboxes restantes à "cochée"
    for(i = 0; i < arrayCheckboxes.length; i++) {
        arrayCheckboxes[i].checked = true;
    }






    // Gestion de l'aléatoire sur le select
    var select = document.getElementById('sauce');
    var items = select.getElementsByTagName('option');
    var index = Math.floor(Math.random() * items.length);
    select.selectedIndex = index;



    generateRecipe();
}



function melangerTableau(array) {
  let currentIndex = array.length;

  // Tant qu'il nous reste des éléments
  while (currentIndex != 0) {

    // On choisit un nombre au hasard entre 0 et la longueur du tableau
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Et on échange la position de l'index en cours avec le chiffre aléatoire 
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}





function showFormulaire() {
    document.getElementById("maRow").classList.remove("d-none");
    document.getElementById("showFormulaire").classList.add("d-none");
}