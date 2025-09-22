// Assignation de l'eventListener sur CHAQUE bouton radio
var radios = $("input[name='pain']");
$(radios).each(function() {
    $(this).change(function() {
        generateRecipe();
    });
});
// Assignation de l'eventListener sur CHAQUE checkbox
var checkboxes = $("input[name='ingredients[]']");
$(checkboxes).each(function() {
    $(this).change(function() {
        generateRecipe();
    });
});

// Évènement qui gère l'envoi du formulaire
$('#enregistrer').on('click', function() {
    $('#sandwich_maker').submit();
});


// Renvoie la valeur du bouton radio "pain" qui a été choisi
function getValuePain() {
    var value = '';
    var radios = $("input[name='pain']");
    $(radios).each(function() {
        if($(this).prop('checked') == true) {
            value = $(this).parent("div").find('label').html();
        }
    });
    return value;
}
// Renvoie la ou les valeurs sélectionnées dans les checkboxes ingrédients
function getValueIngredients() {
    var values = [];
    var checkboxes = $('input[name="ingredients[]"]:checked');
    $(checkboxes).each(function() {
        values.push($(this));
    });
    return values;
}
// Renvoie la valeur du select "sauce" qui a été choisi
function getValueSauce() {
    var value = $('#sauce option:selected').html();
    var prix = $('#sauce option:selected').data('prix');
    var arrayReturn = [];
    arrayReturn['texte'] = value;
    arrayReturn['prix'] = prix;
    return arrayReturn;
}
// Renvoie la valeur du select "sauce" qui a été choisi
function getValueInstruction() {
    var value = $('#instruction').val();
    return value;
}
// Génération de la recette
function generateRecipe() {
    var total = 0;
    var recette = '';
    // Gestion du pain
    var pain = getValuePain();
    if(pain != '') {
        total += +$("input[name='pain']:checked").data('prix');
        recette += "Vous avez choisi le pain : " + pain;
    }
    // Gestion des ingredients
    var ingredients = getValueIngredients();
    if(ingredients.length > 0) {
        recette += "<br>avec les ingrédients suivants : <ul>";
        $(ingredients).each(function() {
            total += +$(this).data('prix');
            recette += "<li>" + $(this).parent('div').find('label').html() + "</li>";
        });
        recette += "</ul>";
    }
    // Gestion de la sauce
    var sauce = getValueSauce();
    if(sauce['texte'] != '') {
        total += +sauce['prix'];
        recette += "<br>Votre sauce est : " + sauce['texte'];
    }
    // Gestion de l'instruction spéciale
    var instruction = getValueInstruction();
    if(instruction != '') {
        recette += "<br>Votre instruction est : " + instruction;
    }
    $('#recette').html(recette);
    $('#total').html("<div class='animate__animated animate__bounce'><p class='text-center'>Votre total : </p><div id='prix'>" + (Math.round(total * 100) / 100).toFixed(2) + "€</div></div>");
}
function shuffle() {
    // Choix aléatoire d'un bouton radio (un seul)
    var radios = $("input[name='pain']");
    var randomRadioIndex = Math.floor(Math.random() * (radios.length - 1));
    $(radios).each(function(i) {
        if(i == randomRadioIndex) {
            $(this).prop('checked', true);
        }
    });
    // Choix aléatoire d'une ou de plusieurs cases à cocher
    var checkboxes = $("input[name='ingredients[]']");
    // Ici on décoche toutes les cases pour avoir une base de travail saine
    $(checkboxes).each(function() {
        $(this).prop('checked', false);
    });
    // On met les checkboxes dans un tableau
    var arrayCheckboxes = [];
    $(checkboxes).each(function() {
        arrayCheckboxes.push($(this));
    });
    // Et on mélange le tableau pour obtenir le coté aléatoire
    melangerTableau(arrayCheckboxes);
    // Puis on prend un nombre au hasard pour trancher le tableau en deux et ne garder qu'une moitié
    var randomCheckboxIndex = Math.floor(Math.random() * (checkboxes.length - 1));
    arrayCheckboxes.splice(0, randomCheckboxIndex);
    // Et enfin on fait une boucle pour passer toutes nos checkboxes restantes à "cochée"
    $(arrayCheckboxes).each(function() {
        $(this).prop('checked', true);
    });
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
    $("#maRow").removeClass("d-none");
    $("#showFormulaire").addClass("d-none");
}


$('#chooseRecipe').on('change', function() {
    // Gestion en AJAX de la sélection d'une recette existante
    $.ajax({
        method: 'POST', // Décrit la méthode utilisée pour la requête HTTP, par défaut à GET
        url: 'ajax/listeIngredients.ajax.php', // L'url du fichier que l'on va requêter
        data: {id_recette: $('#chooseRecipe').val() }, // Tableau de données éventuelles en entrée
        // Lorsque l'appel se passe avec succès, on récupère le résultat dans la variable response
        success: function(response) {
            var data = JSON.parse(response);
            // Sélection du pain
            $('input[value="' + data.recette.id_pain + '"][name="pain"]').prop('checked', true);
            // Sélection de la sauce
            $('#sauce').val(data.recette.id_sauce);
            // Sélection des ingrédients
            $('input[name="ingredients[]"]').prop('checked', false);
            $(data.ingredients).each(function(index, value){
                $('input[value="' + value + '"][name="ingredients[]"]').prop('checked', true);
            });
            generateRecipe();
        }, 
        // Lorsque l'appel se passe mal, on peut obtenir dans la variable error des information sur l'erreur en question
        error: function(error) {
            alert("Pardon, j'ai mal écrit le nom du fichier...");
            console.log(error);
        }
    });
});