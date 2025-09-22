<?php
$database = new mysqli("192.168.56.56", "homestead", "secret", "subway");
mysqli_set_charset($database, "utf8mb4");

$listeRecettes = $database->query("SELECT * FROM recette");

$listePains = $database->query("SELECT * FROM pain");
$listeSauces = $database->query("SELECT * FROM sauce");
$listeIngredients1 = $database->query("SELECT * FROM ingredient LIMIT 0, 5");
$listeIngredients2 = $database->query("SELECT * FROM ingredient LIMIT 5, 5");

if(!empty($_POST)) {
    // On n'exécute ce code que si $_POST
    // n'est pas vide
    if($_POST['sauce'] == "" || $_POST['sauce'] == 0) {
        $_POST['sauce'] = NULL;
    }

    $stmt = $database->prepare("INSERT INTO recette (nom, id_pain, id_sauce, id_utilisateur) 
        VALUES (?, ?, ?, 1);");
    $stmt->bind_param(
        "sii", 
        $_POST['nomRecette'], 
        $_POST['pain'], 
        $_POST['sauce']
    );
    $stmt->execute();
    $idRecette = $stmt->insert_id;
    if(array_key_exists('ingredients', $_POST)) {
        foreach($_POST['ingredients'] as $thisIngredient) {
            $stmt = $database->prepare(
                "INSERT INTO recette_ingredient
                VALUES (?, ?);"
            );
            $stmt->bind_param(
                "ii", 
                $idRecette, 
                $thisIngredient
            );
            $stmt->execute();
        }
    }
}


?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subway Sandwich Maker</title>
    <link rel="stylesheet" href="style.css"/>
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
</head>
<body>
    <!-- Notre projet commence ici  -->
    <header>
        <nav class="navbar shadow d-flex justify-content-center" id="entete">
            <img src="images/logo_subway.png" id="logo" class="img-fluid"/>
        </nav>
    </header>
    <div class="container my-5">
        <h1 class="text-center mt-3 mb-5" id="monTitre">Fabriquez votre Sandwich chez <i>Subway</i></h1>
        
        <div class="text-center my-5">
            <button id="showFormulaire" class="btn btn-primary" onclick="showFormulaire()">Faites votre choix</button>
        </div>

        <div class="row d-none" id="maRow">
            <div class="col-12 col-md-6">
                <!-- Le formulaire avec la liste des ingrédients     -->
                <div class="card shadow p-3">
                    <form id="sandwich_maker" name="sandwich_maker" method="POST" action="/">
                        <h2 class="mb-4">Ingrédients</h2>

                        <label for="nomRecette"></label>
                        <input name="nomRecette" placeholder="Nommez votre oeuvre !" type="text" id="nomRecette" class="form-control"/>
                        
                        <h5 class="my-3 pointer" data-bs-toggle="collapse" data-bs-target="#collapsePain" 
                        aria-expanded="true" aria-controls="collapsePain">
                            Choisissez votre pain <i class="fa-solid fa-angle-down"></i>
                        </h5>

                        <div class="collapse show" id="collapsePain">

                            <?php 
                            foreach($listePains as $pain) {
                                ?>
                                <label for="<?= strtolower($pain['nom']) ?>"><?= $pain['nom'] ?></label>

                                <input data-prix="<?= $pain['prix'] ?>" id="<?= strtolower($pain['nom']) ?>" type="radio" class="m-3 monRadio" value="<?= $pain['id'] ?>" name="pain"/>
                                <?php
                            }
                            ?>
                        </div>
                        <h5 class="my-3">Choisissez vos ingrédients</h5>
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <?php
                                foreach($listeIngredients1 as $ingredient) {
                                ?>
                                <div>
                                    <input data-prix="<?= $ingredient['prix'] ?>" 
                                    id="<?= strtolower($ingredient['nom']) ?>" 
                                    type="checkbox" 
                                    class="m-3 maCheckbox" 
                                    value="<?= $ingredient['id'] ?>" 
                                    name="ingredients[]"/>
                                    <label for="<?= strtolower($ingredient['nom']) ?>"><?= $ingredient['nom'] ?></label>
                                </div>
                                <?php
                                }
                                ?>
                            </div>
                            
                            <div class="col-12 col-md-6">
                                <?php
                                foreach($listeIngredients2 as $ingredient) {
                                ?>
                                <div>
                                    <input data-prix="<?= $ingredient['prix'] ?>" 
                                    id="<?= strtolower($ingredient['nom']) ?>" 
                                    type="checkbox" 
                                    class="m-3 maCheckbox" 
                                    value="<?= $ingredient['id'] ?>" 
                                    name="ingredients[]"/>
                                    <label for="<?= strtolower($ingredient['nom']) ?>"><?= $ingredient['nom'] ?></label>
                                </div>
                                <?php
                                }
                                ?>
                            </div>
                        </div>
                        <h5 class="my-3">Choisissez une sauce</h5>
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <select class="form-select" name="sauce" id="sauce" onchange="generateRecipe()">
                                    <option data-prix="0" value="">Choisissez votre sauce</option>
                                    <?php
                                    foreach($listeSauces as $sauce) {
                                        ?>
                                        <option 
                                        data-prix="<?= $sauce['prix'] ?>" 
                                        value="<?= $sauce['id'] ?>">
                                            <?= $sauce['nom'] ?>
                                        </option>
                                        <?php
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>
                        <h5 class="my-3">Une instruction spéciale ?</h5>
                        <input type="text" class="form-control" name="instruction" id="instruction" placeholder="Allergies, cuisson..." onblur="generateRecipe()"/>
                    </form>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <!-- L'affichage de la recette complète    -->
                <div class="card d-block shadow p-3">
                    <h2 class="mb-4">Votre recette</h2>

                    <select id="chooseRecipe" class="my-3 form-select">
                        <option value="">Choisir une recette existante</option>
                        <?php  
                        foreach($listeRecettes as $recette) {
                            ?>
                            <option value="<?= $recette['id'] ?>">
                                <?= $recette['nom'] ?>
                            </option>
                            <?php
                        }
                        ?>
                    </select>

                    <div class="d-flex justify-content-between">
                        <button id="surpriseMe" class="btn btn-primary" onclick="shuffle()">Surprenez-moi</button>
                        <button id="enregistrer" class="btn btn-primary">Enregistrer ma recette</button>
                    </div>
                    <div class="row my-4">
                        <div class="col-12 col-md-6">
                            <div id="recette"></div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div id="total"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Et il se termine ici -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="main.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossorigin="anonymous"></script>
    <script src="https://kit.fontawesome.com/b9049baba7.js" crossorigin="anonymous"></script>
</body>
</html>